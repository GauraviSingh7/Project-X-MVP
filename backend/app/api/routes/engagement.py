from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import json

from app.infrastructure.db import get_db
from app.infrastructure.redis_client import get_json, set_json
from app.models.sql_engagement import EngagementPost
from app.domain.models.engagement_view import (
    EngagementFeedResponse, 
    EngagementPostResponse, 
    PaginationInfo,
    MediaItem, AuthorInfo, MetricsInfo
)

router = APIRouter(prefix="/api/v1/engagement", tags=["Engagement"])

@router.get("/feed", response_model=EngagementFeedResponse)
def get_engagement_feed(
    source: Optional[str] = Query(None, description="Filter by 'twitter' or 'youtube'"),
    limit: int = Query(20, le=50, description="Items per page"),
    cursor: Optional[str] = Query(None, description="Timestamp cursor for pagination"),
    db: Session = Depends(get_db)
):
    """
    Returns a unified feed of Tweets and YouTube videos.
    - Cached: 1st page is cached for 5 minutes.
    - Pagination: Uses 'published_at' cursor for infinite scroll.
    """
    
    #Redis Cache Check (Only for fresh feed i.e., no cursor)
    cache_key = f"engagement:feed:{source or 'all'}:{limit}"
    if not cursor:
        cached_data = get_json(cache_key)
        if cached_data:
            return cached_data

    #Build Database Query
    query = db.query(EngagementPost)
    
    #Filter by source if requested
    if source:
        query = query.filter(EngagementPost.source == source)
    
    #Cursor Pagination logic (fetch items older than cursor)
    if cursor:
        try:
            #Parse ISO string back to datetime
            cursor_dt = datetime.fromisoformat(cursor)
            query = query.filter(EngagementPost.published_at < cursor_dt)
        except ValueError:
            pass #Ignore invalid cursor

    #Sort & Limit
    #Fetch 1 extra item to check if next page exists
    posts = query.order_by(EngagementPost.published_at.desc())\
                 .limit(limit + 1)\
                 .all()

    # Process Pagination
    has_next = len(posts) > limit
    results = posts[:limit] # Trim the extra item
    
    next_cursor = None
    if has_next and results:
        # The cursor for the next page is the timestamp of the last item
        last_item = results[-1]
        if last_item.published_at:
            next_cursor = last_item.published_at.isoformat()

    #Map to Pydantic Response
    response_items = []
    for p in results:
        # Convert DB JSON to Pydantic Models
        media_items = [MediaItem(**m) for m in (p.media or [])]
        author_obj = AuthorInfo(**(p.author or {}))
        metrics_obj = MetricsInfo(**(p.metrics or {}))
        
        item = EngagementPostResponse(
            id=p.id,
            source=p.source,
            source_id=p.source_id,
            title=p.title,
            text=p.text,
            url=p.url,
            media=media_items,
            author=author_obj,
            metrics=metrics_obj,
            published_at=p.published_at
        )
        response_items.append(item)

    response_data = EngagementFeedResponse(
        data=response_items,
        pagination=PaginationInfo(next_cursor=next_cursor)
    )

    #Save Fresh Feed to Redis (TTL 5 mins)
    if not cursor and response_items:
        set_json(cache_key, response_data.model_dump(mode='json'), ttl=300)

    return response_data