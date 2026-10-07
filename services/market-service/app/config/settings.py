import os
from pydantic import BaseModel

class Settings(BaseModel):
    SERVICE_NAME: str = "market-service"
    PORT: int = 8004
    HOST: str = "0.0.0.0"
    MODEL_PATH: str = os.getenv(
        "MARKET_MODEL_PATH",
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "models", "career_market_model_enhanced.joblib")
    )
    DATA_PATH: str = os.getenv(
        "MARKET_DATA_PATH",
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "analytics_jobs_cleaned.csv")
    )

settings = Settings()
