from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.clients.salary_client import salary_client

router = APIRouter(prefix="/api/v1/salary", tags=["Salary Prediction"])

class SalaryInput(BaseModel):
    job_title: str
    experience_years: float
    location: Optional[str] = "Bengaluru"
    skills: Optional[List[str]] = []

@router.post("/predict")
async def predict_salary(payload: SalaryInput):
    try:
        return await salary_client.predict(
            job_title=payload.job_title,
            experience_years=payload.experience_years,
            location=payload.location or "Bengaluru",
            skills=payload.skills or []
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
