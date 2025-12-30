from app.domain.models import LiveMatch, LiveScore, Team
from datetime import datetime

def normalize_live_match(raw: dict) -> dict:
    return {
        "match_id": raw["id"],
        "status": raw["status"],
        "current_inning": raw.get("current_inning", 1),
        "score": {
            "runs": raw["runs"],
            "wickets": raw["wickets"],
            "overs": raw["overs"]
        },
        "batting_team": {
            "id": raw["batting_team"]["id"],
            "name": raw["batting_team"]["name"]
        },
        "bowling_team": {
            "id": raw["bowling_team"]["id"],
            "name": raw["bowling_team"]["name"]
        },
        "last_updated": raw["updated_at"]
    }
