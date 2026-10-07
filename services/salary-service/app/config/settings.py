import os
from pydantic import BaseModel

class Settings(BaseModel):
    SERVICE_NAME: str = "salary-service"
    PORT: int = 8002
    HOST: str = "0.0.0.0"
    MODEL_PATH: str = os.getenv(
        "SALARY_MODEL_PATH",
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "models", "careeriq_salary_model.joblib")
    )
    MODEL_NAME: str = "CareerIQ Salary RandomForest Estimator"
    MODEL_VERSION: str = "1.0.0"

settings = Settings()
