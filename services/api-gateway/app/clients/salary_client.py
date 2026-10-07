import httpx
import logging
from typing import Dict, Any, List, Optional
from app.config.settings import settings

logger = logging.getLogger(__name__)

class SalaryClient:
    def __init__(self, base_url: str = settings.SALARY_SERVICE_URL, timeout: float = settings.HTTP_TIMEOUT):
        self.base_url = base_url
        self.timeout = timeout

    async def predict(
        self,
        job_title: str,
        experience_years: float,
        location: str = "Bengaluru",
        skills: List[str] = None
    ) -> Dict[str, Any]:
        url = f"{self.base_url}/internal/v1/salary/predict"
        payload = {
            "job_title": job_title,
            "experience_years": experience_years,
            "location": location,
            "skills": skills or []
        }
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code != 200:
                logger.error(f"Salary service error: {resp.text}")
                raise RuntimeError(f"Salary service error ({resp.status_code}): {resp.text}")
            return resp.json()

    async def health(self) -> Dict[str, Any]:
        url = f"{self.base_url}/health"
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(url)
            return resp.json()

salary_client = SalaryClient()
