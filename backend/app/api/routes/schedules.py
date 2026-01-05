import os
from typing import Optional
from datetime import date
from sqlalchemy import cast, String
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, Query
from app.infrastructure.db import get_db
from app.models.sql_match import Match

router = APIRouter(prefix="/api/v1/schedules", tags=["schedules"])

@router.get("")
def get_schedules(
    db: Session = Depends(get_db),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    league_id: Optional[str] = None,
    team_id: Optional[str] = None,
    status: Optional[str] = None
):
    query = db.query(Match)

    if date_from:
        query = query.filter(Match.start_time >= date_from)
    if date_to:
        query = query.filter(Match.start_time <= date_to)

    if status:
        query = query.filter(Match.status == status)

    if league_id:
        query = query.filter(
            cast(Match.league['id'], String) == str(league_id)
        )

    if team_id:
        t_id = str(team_id)
        query = query.filter(
            (cast(Match.home_team['id'], String) == t_id) | 
            (cast(Match.away_team['id'], String) == t_id)
        )

    return {"data": query.order_by(Match.start_time.asc()).limit(100).all()}

from fastapi import Header, HTTPException
from app.services.schedule_service import sync_schedules_to_db
from app.core.config import settings

@router.get("/sync")
async def trigger_schedule_sync(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """
    Protected endpoint to trigger fixture sync.
    Only Vercel Cron (or you) can call this.
    """
    cron_secret = os.getenv("CRON_SECRET")
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing auth header")
    
    token = authorization.replace("Bearer ", "")
    if not cron_secret or token != cron_secret:
        raise HTTPException(status_code=403, detail="Invalid cron token")

    await sync_schedules_to_db(db)
    
    return {"status": "success", "message": "Schedule sync triggered"}