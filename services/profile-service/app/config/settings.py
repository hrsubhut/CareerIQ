import os
from pydantic import BaseModel

class Settings(BaseModel):
    SERVICE_NAME: str = "profile-service"
    PORT: int = 8005
    HOST: str = "0.0.0.0"
    DB_PATH: str = os.getenv("PROFILE_DB_PATH", "careeriq_profiles.sqlite")

settings = Settings()
