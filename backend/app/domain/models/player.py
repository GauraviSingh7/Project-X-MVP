from datetime import datetime
from pydantic import BaseModel

from app.domain.models.match import Team

class BattingStats(BaseModel):
    matches: int
    runs: int
    average: float
    strike_rate: float


class BowlingStats(BaseModel):
    wickets: int
    economy: float


class PlayerStats(BaseModel):
    player_id: int
    name: str
    team_id: int
    batting: BattingStats
    bowling: BowlingStats
