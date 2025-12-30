from fastapi import APIRouter
from app.services.polling_service import get_raw_live_matches,get_raw_live_match
from app.services.normalizers.match_normalizer import normalize_live_match
from app.domain.models import LiveMatch

router = APIRouter(prefix="/api/v1/matches", tags=["matches"])

@router.get("/live/raw")
async def raw_live_matches():
    return await get_raw_live_matches()

@router.get("/{match_id}/live", response_model=LiveMatch)
async def get_live_match(match_id: int):
    raw = await get_raw_live_match(match_id)
    return normalize_live_match(raw)

