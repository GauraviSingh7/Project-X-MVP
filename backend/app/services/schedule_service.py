import logging
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert
from datetime import datetime

from app.infrastructure.external_api import sportmonks_api
from app.models.sql_match import Match

logger = logging.getLogger(__name__)

async def sync_schedules_to_db(db: Session):
    """
    Fetches fixtures from API and syncs them to Postgres.
    Uses 'upsert' to handle updates efficiently.
    """
    logger.info("Starting schedule sync...")
    
    try:
        raw_data = await sportmonks_api.fetch_fixtures_raw()
        fixtures = raw_data.get("data", [])
        
        if not fixtures:
            logger.warning("No fixtures found in API response.")
            return

        count = 0
        for f in fixtures:
            start_time_str = f.get("starting_at")
            start_time = None
            if start_time_str:
                start_time = datetime.fromisoformat(start_time_str.replace("Z", "+00:00"))

            local_name = f.get('localteam', {}).get('name', 'Unknown')
            visitor_name = f.get('visitorteam', {}).get('name', 'Unknown')
            match_title = f"{local_name} vs {visitor_name}"

            match_data = {
                "match_id": str(f["id"]),
                "title": match_title,
                "status": f.get("status"),
                "match_type": f.get("type"),
                "start_time": start_time,
                "league": f.get("league"),        
                "venue": f.get("venue"),          
                "home_team": f.get("localteam"),  
                "away_team": f.get("visitorteam"),
                "updated_at": datetime.now()
            }

            stmt = insert(Match).values(match_data)
            stmt = stmt.on_conflict_do_update(
                index_elements=[Match.match_id],
                set_=match_data
            )
            
            db.execute(stmt)
            count += 1

        db.commit()
        logger.info(f"Successfully synced {count} fixtures to Database.")

    except Exception:
        logger.exception("Failed to sync schedules")
        db.rollback()
        raise