import logging
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert
from app.models.sql_engagement import EngagementPost
from app.infrastructure.social_api import social_api
from app.services.normalizers.engagement_normalizer import normalize_twitter_response, normalize_youtube_response

logger = logging.getLogger(__name__)

async def fetch_and_store_engagement(db: Session, platform: str):
    """
    Main entry point for the scheduler.
    platform: 'twitter' or 'youtube'
    """
    logger.info(f"Starting engagement fetch for {platform}...")
    
    new_posts = []
    
    # 1. Fetch & Normalize
    if platform == "twitter":
        # Unified query to save quota (1 request covers 4 topics)
        # Prioritizing US Cricket keywords + Global BBL
        query = "#MajorLeagueCricket OR #USACricket OR #BBL OR #T20Cricket -filter:retweets"
        raw_data = await social_api.fetch_twitter_search(query, count=20)
        new_posts = normalize_twitter_response(raw_data)
        
    elif platform == "youtube":
        # Search for US-relevant cricket content
        query = "Major League Cricket highlights USA cricket"
        raw_data = await social_api.fetch_youtube_search(query, max_results=10)
        new_posts = normalize_youtube_response(raw_data)

    if not new_posts:
        logger.info(f"No new {platform} posts found.")
        return

    # 2. Store in DB (Upsert)
    saved_count = 0
    for post in new_posts:
        post_data = post.model_dump(exclude={'id'}) # Let DB generate UUID
        
        # Convert Pydantic sub-models to dicts for JSON columns
        post_data['media'] = [m.model_dump() for m in post.media]
        post_data['author'] = post.author.model_dump()
        post_data['metrics'] = post.metrics.model_dump()

        # Build Query: Insert, or Update if (source + source_id) exists
        stmt = insert(EngagementPost).values(post_data)
        
        # We need a unique constraint on (source, source_id) for this to work perfectly.
        # Since we defined separate indexes in the model but maybe not a composite UniqueConstraint,
        # we will check existence first for safety in this MVP phase (slower but safer), 
        # OR rely on manual ID checks.
        
        # Better approach: Check if exists to avoid 'duplicate key' errors if constraint is missing
        exists = db.query(EngagementPost).filter(
            EngagementPost.source == post.source,
            EngagementPost.source_id == post.source_id
        ).first()

        if not exists:
            db_obj = EngagementPost(**post_data)
            db.add(db_obj)
            saved_count += 1
        else:
            # Optional: Update metrics for existing posts
            exists.metrics = post_data['metrics']
            exists.fetched_at = post_data['fetched_at']

    try:
        db.commit()
        logger.info(f"Saved {saved_count} new {platform} posts.")
    except Exception as e:
        logger.error(f"Database commit failed: {e}")
        db.rollback()