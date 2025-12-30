from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class Team(BaseModel):
    id: int
    name: str


class League(BaseModel):
    id: int
    name: str


class Venue(BaseModel):
    id: int
    name: str
    city: Optional[str]


class MatchTeams(BaseModel):
    home: Team
    away: Team


class MatchSchedule(BaseModel):
    match_id: int
    season_id: int
    league: League
    start_time: datetime
    venue: Venue
    teams: MatchTeams
    status: str


class ScheduleResponse(BaseModel):
    matches: List[MatchSchedule]
