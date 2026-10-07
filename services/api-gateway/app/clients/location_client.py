import httpx
import logging
from typing import Dict, Any, List, Optional
from app.config.settings import settings

logger = logging.getLogger(__name__)

class LocationClient:
    def __init__(self, base_url: str = settings.LOCATION_SERVICE_URL, timeout: float = settings.HTTP_TIMEOUT):
        self.base_url = base_url
        self.timeout = timeout

    async def recommend(
        self,
        job_title: str,
        skills: List[str] = None,
        experience_years: float = 0.0,
        preferred_locations: List[str] = None,
        top_k: int = 5
    ) -> Dict[str, Any]:
        url = f"{self.base_url}/internal/v1/location/recommend"
        payload = {
            "job_title": job_title,
            "skills": skills or [],
            "experience_years": experience_years,
            "preferred_locations": preferred_locations or [],
            "top_k": top_k
        }
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code != 200:
                logger.error(f"Location service error: {resp.text}")
                raise RuntimeError(f"Location service error ({resp.status_code}): {resp.text}")
            return resp.json()

    async def health(self) -> Dict[str, Any]:
        url = f"{self.base_url}/health"
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(url)
            return resp.json()

location_client = LocationClient()
