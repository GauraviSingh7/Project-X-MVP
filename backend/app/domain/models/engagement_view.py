from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- Leaf Nodes ---
class MediaItem(BaseModel):
    type: str
    url: str

class AuthorInfo(BaseModel):
    name: str
    handle: Optional[str]
    avatar: Optional[str]

class MetricsInfo(BaseModel):
    likes: int
    shares: int
    views: Optional[int]

# --- Main Item ---
class EngagementPostResponse(BaseModel):
    id: str
    source: str
    source_id: str
    title: Optional[str]
    text: Optional[str]
    url: str
    media: List[MediaItem]
    author: AuthorInfo
    metrics: MetricsInfo
    published_at: datetime

# --- Feed Wrapper ---
class PaginationInfo(BaseModel):
    next_cursor: Optional[str] = None

class EngagementFeedResponse(BaseModel):
    data: List[EngagementPostResponse]
    pagination: PaginationInfo