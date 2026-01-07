from sqlalchemy import Column, String, Integer, DateTime, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy.sql import func
from app.infrastructure.db import Base

class EngagementPost(Base):
    __tablename__ = "engagement_posts"

    #UUID for internal referencing
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    #"twitter" or "youtube"
    source = Column(String, index=True, nullable=False)
    
    #External ID (Tweet ID or Video ID) - Unique per source
    source_id = Column(String, index=True, nullable=False)
    
    #Content
    title = Column(String, nullable=True) # Used for YouTube title
    text = Column(Text, nullable=True)    # Tweet text or Video description
    url = Column(String, nullable=False)
    
    #Rich Data (NoSQL style for flexibility)
    #Media: List of objects {type: 'image'|'video', url: '...'}
    media = Column(JSON, default=list)
    
    #Author: {name: '...', handle: '...', avatar: '...'}
    author = Column(JSON, default=dict)
    
    #Metrics: {likes: 10, views: 100, shares: 5}
    metrics = Column(JSON, default=dict)
    
    #Timestamps
    published_at = Column(DateTime(timezone=True), index=True) # When it was tweeted/uploaded
    fetched_at = Column(DateTime(timezone=True), default=func.now()) # When we saved it

    #Composite unique constraint to prevent duplicate tweets/videos
    #We will handle this logic in the Upsert service, but good to know the intent.