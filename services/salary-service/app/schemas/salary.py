from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SalaryPredictionInput(BaseModel):
    job_title: str = Field(..., example="Data Scientist")
    experience_years: float = Field(..., ge=0.0, example=3.5)
    location: Optional[str] = Field("Bengaluru", example="Bengaluru")
    skills: Optional[List[str]] = Field(default_factory=list)
    job_type: Optional[str] = Field("Full Time", example="Full Time")
    role_family: Optional[str] = Field(None, example="Data Science")

class SalaryPredictionOutput(BaseModel):
    predicted_salary: float
    predicted_salary_lakhs: float
    salary_range_min_lakhs: Optional[float] = None
    salary_range_max_lakhs: Optional[float] = None
    currency: str = "INR"
    formatted_salary: str
    model: Dict[str, Any]
    explainability: Optional[Dict[str, Any]] = None
