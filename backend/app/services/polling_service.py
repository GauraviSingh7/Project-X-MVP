import logging
from app.infrastructure.external_api import ExternalCricketAPI

logger = logging.getLogger(__name__)

api = ExternalCricketAPI()

async def get_raw_live_matches():
    try:
        return await api.fetch_live_matches()
    except Exception as e:
        logger.exception("Failed to fetch live matches")
        raise
