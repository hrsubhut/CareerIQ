import os
from pydantic import BaseModel

class Settings(BaseModel):
    SERVICE_NAME: str = "api-gateway"
    PORT: int = int(os.getenv("GATEWAY_PORT", "8000"))
    HOST: str = "0.0.0.0"
    
    # Downstream service URLs
    RESUME_SERVICE_URL: str = os.getenv("RESUME_SERVICE_URL", "http://127.0.0.1:8001").rstrip("/")
    SALARY_SERVICE_URL: str = os.getenv("SALARY_SERVICE_URL", "http://127.0.0.1:8002").rstrip("/")
    LOCATION_SERVICE_URL: str = os.getenv("LOCATION_SERVICE_URL", "http://127.0.0.1:8003").rstrip("/")
    MARKET_SERVICE_URL: str = os.getenv("MARKET_SERVICE_URL", "http://127.0.0.1:8004").rstrip("/")
    PROFILE_SERVICE_URL: str = os.getenv("PROFILE_SERVICE_URL", "http://127.0.0.1:8005").rstrip("/")

    HTTP_TIMEOUT: float = 15.0

settings = Settings()
