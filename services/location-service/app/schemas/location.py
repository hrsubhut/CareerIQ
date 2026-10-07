from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class LocationRecommendInput(BaseModel):
    job_title: str = Field(..., example="Data Scientist")
    skills: Optional[List[str]] = Field(default_factory=list, example=["Python", "SQL", "Machine Learning"])
    experience_years: float = Field(0.0, ge=0.0, example=3.0)
    preferred_locations: Optional[List[str]] = Field(default_factory=list)
    top_k: int = Field(5, ge=1, le=55)

class LocationRecommendationOutput(BaseModel):
    recommendations: List[Dict[str, Any]]
    model: Dict[str, Any]
