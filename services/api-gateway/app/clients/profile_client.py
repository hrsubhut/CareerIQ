import httpx
from typing import Dict, Any
from app.config.settings import settings

class ProfileClient:
    def __init__(self, base_url: str = settings.PROFILE_SERVICE_URL, timeout: float = settings.HTTP_TIMEOUT):
        self.base_url = base_url
        self.timeout = timeout

    async def save(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        url = f"{self.base_url}/api/v1/profile/save"
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(url, json=profile)
            return resp.json()

    async def get(self, profile_id: str) -> Dict[str, Any]:
        url = f"{self.base_url}/api/v1/profile/{profile_id}"
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.get(url)
            return resp.json()

    async def health(self) -> Dict[str, Any]:
        url = f"{self.base_url}/health"
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(url)
            return resp.json()

profile_client = ProfileClient()
