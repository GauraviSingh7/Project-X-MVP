from datetime import datetime
from pydantic import BaseModel

from app.domain.models.match import Team

class LiveScore(BaseModel):
    runs: int
    wickets: int
    overs: float


class LiveMatch(BaseModel):
    match_id: int
    status: str
    current_inning: int
    score: LiveScore
    batting_team: Team
    bowling_team: Team
    last_updated: datetime
