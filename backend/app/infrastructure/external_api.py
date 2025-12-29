import httpx
from app.core.config import settings

class ExternalCricketAPI:
    def __init__(self):
        self.base_url = settings.EXTERNAL_API_BASE_URL
        self.headers = {
            "Authorization": f"Bearer {settings.EXTERNAL_API_KEY}"
        }

    async def fetch_live_matches(self) -> dict:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(
                f"{self.base_url}/matches/live",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()

    async def fetch_match_detail(self, match_id: str) -> dict:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(
                f"{self.base_url}/matches/{match_id}",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()
