from datetime import datetime
from typing import List, Dict, Any, Optional
import logging
import re

from app.domain.models.engagement import (
    EngagementPostDomain, 
    EngagementAuthor, 
    EngagementMedia, 
    EngagementMetrics
)

logger = logging.getLogger(__name__)

# --- FILTERING CONSTANTS ---
BLACKLIST_KEYWORDS = {
    "surgery", "plastic", "body", "butt", "lipo", "cosmetic", # BBL Surgery noise
    "whatsapp", "betting id", "casino", "jackpot", "teen patti", # Betting spam
    "prize", "giveaway", "follow me", "dm for", "promoted" # Low signal
}

CRICKET_CONTEXT_WORDS = {
    # 1. Generic Cricket Terms
    "cricket", "match", "run", "wicket", "ball", "six", "four", "century", 
    "inning", "over", "highlight", "score", "team", "vs", "league", 
    "batting", "bowling", "fielding", "stumps", "win", "loss", "play", "game",
    "sport", "tournament", "cup", "trophy", "final", "champion", "highlights",
    
    # 2. Specific League/Team Tags (Self-validating)
    # These match the tokens generated from hashtags like #MajorLeagueCricket
    "majorleaguecricket", "usacricket", "bigbashleague", "t20cricket", 
    "teamusa", "americancricket", "mlc2025", "ipl", "bbl15", "bbl2025"
    
    # NOTE: We intentionally DO NOT include "bbl" here. 
    # Tweets with ONLY "bbl" must match a generic term (like "match") to pass.
}

def is_valid_content(text: str) -> bool:
    """
    Returns True only if content is:
    1. Clean (No blacklist words)
    2. Relevant (Has cricket context)
    """
    if not text:
        return False
        
    text_lower = text.lower()
    
    # 1. Check Blacklist
    if any(word in text_lower for word in BLACKLIST_KEYWORDS):
        return False
        
    # 2. Check Context (At least one cricket keyword must be present)
    # We tokenize by non-alphanumeric to match whole words
    tokens = set(re.split(r'\W+', text_lower))
    if not tokens.intersection(CRICKET_CONTEXT_WORDS):
        # Edge case: If the text is VERY short, it might just be a hashtag like "#BigBash".
        # We reject these as "Low Signal" anyway. We want analysis/commentary.
        return False

    return True

def normalize_twitter_response(raw_data: Dict[str, Any]) -> List[EngagementPostDomain]:
    """
    Parses Twitter241 (RapidAPI) JSON into domain models.
    Traverses the deep GraphQL 'timeline' structure.
    """
    posts = []
    
    # 1. Safely navigate to the instructions list
    try:
        timeline = raw_data.get("result", {}).get("timeline_response", {}).get("timeline", {})
        instructions = timeline.get("instructions", [])
    except AttributeError:
        return []

    entries = []
    for instr in instructions:
        if instr.get("__typename") == "TimelineAddEntries":
            entries.extend(instr.get("entries", []))

    for entry in entries:
        try:
            # 2. Extract Tweet Data
            content = entry.get("content", {})
            item_content = content.get("content", {}) # Yes, it's nested content.content
            tweet_results = item_content.get("tweet_results", {}).get("result", {})

            text = details.get("full_text") or legacy.get("full_text") or ""
            if not is_valid_content(text):
                continue
            
            if not tweet_results or tweet_results.get("__typename") == "TweetUnavailable":
                continue

            # Core Data
            # Note: Sometimes legacy is populated, sometimes 'details' (TBirdData) is used
            legacy = tweet_results.get("legacy", {})
            details = tweet_results.get("details", {})
            core_user = tweet_results.get("core", {}).get("user_results", {}).get("result", {})
            
            tweet_id = tweet_results.get("rest_id")
            text = details.get("full_text") or legacy.get("full_text") or ""
            
            # Timestamp (Twitter sends ms)
            created_at_ms = details.get("created_at_ms") or legacy.get("created_at") # legacy might need parsing
            published_at = datetime.fromtimestamp(int(created_at_ms)/1000) if created_at_ms else datetime.now()

            # Media
            media_list = []
            medias = legacy.get("extended_entities", {}).get("media", []) or \
                     tweet_results.get("media_entities", [])
            
            for m in medias:
                m_url = m.get("media_url_https") or m.get("media_info", {}).get("original_img_url")
                if m_url:
                    m_type = m.get("type", "image")
                    media_list.append(EngagementMedia(type=m_type, url=m_url))

            # Metrics
            counts = tweet_results.get("counts") or legacy
            metrics = EngagementMetrics(
                likes=counts.get("favorite_count", 0),
                shares=counts.get("retweet_count", 0),
                views=int(tweet_results.get("views", {}).get("count", 0) or 0)
            )

            # Author
            user_legacy = core_user.get("legacy", {})
            user_core_details = core_user.get("core", {})
            avatar_url = core_user.get("avatar", {}).get("image_url") or user_legacy.get("profile_image_url_https")
            
            author = EngagementAuthor(
                name=user_core_details.get("name") or user_legacy.get("name", "Unknown"),
                handle=user_core_details.get("screen_name") or user_legacy.get("screen_name", ""),
                avatar=avatar_url,
                profile_url=f"https://twitter.com/{user_core_details.get('screen_name')}"
            )

            post = EngagementPostDomain(
                source="twitter",
                source_id=tweet_id,
                text=text,
                url=f"https://twitter.com/x/status/{tweet_id}",
                media=media_list,
                author=author,
                metrics=metrics,
                published_at=published_at,
                fetched_at=datetime.now()
            )
            posts.append(post)

        except Exception as e:
            # Skip individual malformed tweets, don't crash batch
            continue

    return posts

def normalize_youtube_response(raw_data: Dict[str, Any]) -> List[EngagementPostDomain]:
    """
    Parses YouTube Data API v3 JSON.
    """
    posts = []
    items = raw_data.get("items", [])

    for item in items:
        try:
            id_obj = item.get("id", {})
            if id_obj.get("kind") != "youtube#video":
                continue
                
            video_id = id_obj.get("videoId")
            snippet = item.get("snippet", {})
            
            published_str = snippet.get("publishedAt")
            published_at = datetime.fromisoformat(published_str.replace("Z", "+00:00")) if published_str else datetime.now()

            title = snippet.get("title", "")
            description = snippet.get("description", "")
            full_text = f"{title} {description}"

            if not is_valid_content(full_text):
                continue

            # Media (Thumbnails)
            thumbnails = snippet.get("thumbnails", {})
            high_res = thumbnails.get("high", {}).get("url") or thumbnails.get("medium", {}).get("url")
            
            media_list = []
            if high_res:
                media_list.append(EngagementMedia(type="thumbnail", url=high_res))
            # Add embed link virtually
            media_list.append(EngagementMedia(type="embed", url=f"https://www.youtube.com/embed/{video_id}"))

            author = EngagementAuthor(
                name=snippet.get("channelTitle", "Unknown Channel"),
                handle=snippet.get("channelId"), # YouTube handles aren't always in search snippet
                profile_url=f"https://youtube.com/channel/{snippet.get('channelId')}"
            )

            # Note: 'search' endpoint doesn't return view counts (metrics). 
            # We would need a second call to 'videos' endpoint to get stats.
            # For Phase 1 MVP, we accept 0 metrics to save quota.
            metrics = EngagementMetrics(likes=0, views=0)

            post = EngagementPostDomain(
                source="youtube",
                source_id=video_id,
                title=snippet.get("title"),
                text=snippet.get("description"),
                url=f"https://www.youtube.com/watch?v={video_id}",
                media=media_list,
                author=author,
                metrics=metrics,
                published_at=published_at,
                fetched_at=datetime.now()
            )
            posts.append(post)

        except Exception:
            continue

    return posts