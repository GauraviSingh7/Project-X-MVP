from fastapi import APIRouter
from app.services.polling_service import get_raw_live_matches

router = APIRouter()

@router.get("/matches/live/raw")
async def raw_live_matches():
    return await get_raw_live_matches()
