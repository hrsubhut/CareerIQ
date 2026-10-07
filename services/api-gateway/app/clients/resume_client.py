import httpx
import logging
from typing import Dict, Any
from app.config.settings import settings

logger = logging.getLogger(__name__)

class ResumeClient:
    def __init__(self, base_url: str = settings.RESUME_SERVICE_URL, timeout: float = settings.HTTP_TIMEOUT):
        self.base_url = base_url
        self.timeout = timeout

    async def parse_resume(self, file_bytes: bytes, filename: str) -> Dict[str, Any]:
        url = f"{self.base_url}/api/v1/resume/parse"
        files = {"file": (filename, file_bytes)}
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(url, files=files)
            if resp.status_code != 200:
                raise RuntimeError(f"Resume parsing failed ({resp.status_code}): {resp.text}")
            return resp.json()

    async def health(self) -> Dict[str, Any]:
        url = f"{self.base_url}/health"
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(url)
            return resp.json()

resume_client = ResumeClient()
