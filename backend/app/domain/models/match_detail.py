from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# --- Basic Player Info ---
class PlayerInfo(BaseModel):
    id: int
    name: str
    image: Optional[str]
    position: Optional[str]
    is_captain: bool = False
    is_keeper: bool = False

# --- Stats Rows ---
class BatsmanStats(BaseModel):
    player: PlayerInfo
    runs: int
    balls: int
    fours: int
    sixes: int
    strike_rate: float
    status: str # e.g., "active" (batting), "out", "did_not_bat"

class BowlerStats(BaseModel):
    player: PlayerInfo
    overs: float
    runs_conceded: int
    wickets: int
    economy: float

# --- Inning Container ---
class InningScorecard(BaseModel):
    inning_number: int
    team_id: int
    score: str # e.g. "150/3"
    overs: str
    batting: List[BatsmanStats]
    bowling: List[BowlerStats]

# --- Main Match Detail Wrapper ---
class MatchDetail(BaseModel):
    match_id: str
    status: str
    venue: Dict[str, Any]
    toss: Dict[str, Any]
    scorecard: List[InningScorecard] # List of innings [1st, 2nd]
    lineups: Dict[str, List[PlayerInfo]] # {"home": [], "away": []}