import os
from pydantic import BaseModel

class Settings(BaseModel):
    SERVICE_NAME: str = "location-service"
    PORT: int = 8003
    HOST: str = "0.0.0.0"
    MODEL_PATH: str = os.getenv(
        "LOCATION_MODEL_PATH",
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "models", "careeriq_location_model.joblib")
    )
    MODEL_NAME: str = "CareerIQ Location XGBoost Classifier"
    MODEL_VERSION: str = "1.0.0"

settings = Settings()
