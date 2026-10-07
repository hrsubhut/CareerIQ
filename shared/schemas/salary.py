from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SalaryPredictionRequest(BaseModel):
    job_title: str = Field(..., description="Target or current job title")
    experience_years: float = Field(..., ge=0.0, description="Total years of experience")
    location: Optional[str] = Field("Bengaluru", description="Job location")
    skills: List[str] = Field(default_factory=list, description="Relevant candidate skills")
    job_type: Optional[str] = Field("Full Time", description="Employment type")
    role_family: Optional[str] = Field(None, description="Broad domain/family")

class ModelMetadata(BaseModel):
    name: str = Field(..., description="Model identifier")
    version: str = Field(..., description="Model version string")
    algorithm: Optional[str] = Field(None, description="Underlying algorithm")

class SalaryPredictionResponse(BaseModel):
    predicted_salary: float = Field(..., description="Predicted salary value")
    predicted_salary_lakhs: float = Field(..., description="Predicted annual salary in Lakhs INR")
    currency: str = Field("INR", description="Currency code")
    formatted_salary: str = Field(..., description="Formatted human readable salary string")
    model: ModelMetadata
    confidence_interval: Optional[Dict[str, float]] = Field(None, description="Estimated range if supported")
    explainability: Optional[Dict[str, Any]] = Field(None, description="Model explanation / feature inputs")
