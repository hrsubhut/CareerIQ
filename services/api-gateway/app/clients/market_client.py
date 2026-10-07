import httpx
import logging
from typing import Dict, Any, List
from app.config.settings import settings

logger = logging.getLogger(__name__)

class MarketClient:
    def __init__(self, base_url: str = settings.MARKET_SERVICE_URL, timeout: float = settings.HTTP_TIMEOUT):
        self.base_url = base_url
        self.timeout = timeout

    async def get_overview(self) -> Dict[str, Any]:
        url = f"{self.base_url}/api/v1/market/overview"
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.get(url)
            if resp.status_code != 200:
                raise RuntimeError(f"Market overview failed ({resp.status_code})")
            return resp.json()

    async def get_skill_gap(self, target_role: str, skills: List[str]) -> Dict[str, Any]:
        url = f"{self.base_url}/api/v1/market/skill-gap"
        payload = {"target_role": target_role, "skills": skills}
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code != 200:
                raise RuntimeError(f"Market skill-gap failed ({resp.status_code})")
            return resp.json()

    async def get_roles(self) -> Dict[str, Any]:
        url = f"{self.base_url}/api/v1/market/roles"
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.get(url)
            return resp.json()

    async def get_skills(self) -> Dict[str, Any]:
        url = f"{self.base_url}/api/v1/market/skills"
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.get(url)
            return resp.json()

    async def get_locations(self) -> Dict[str, Any]:
        url = f"{self.base_url}/api/v1/market/locations"
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.get(url)
            return resp.json()

    async def health(self) -> Dict[str, Any]:
        url = f"{self.base_url}/health"
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(url)
            return resp.json()

market_client = MarketClient()
