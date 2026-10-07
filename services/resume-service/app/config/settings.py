import os
from pydantic import BaseModel

class Settings(BaseModel):
    SERVICE_NAME: str = "resume-service"
    PORT: int = 8001
    HOST: str = "0.0.0.0"

settings = Settings()
