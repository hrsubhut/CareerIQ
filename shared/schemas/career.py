from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from .profile import CandidateProfile
from .salary import SalaryPredictionResponse
from .location import LocationItem

class CareerAnalysisRequest(BaseModel):
    target_role: str = Field(..., description="Target role")
    skills: List[str] = Field(default_factory=list, description="Skills")
    experience_years: float = Field(0.0, ge=0.0, description="Years of experience")
    location: Optional[str] = Field("Bengaluru", description="Location preference")
    education: Optional[List[str]] = Field(default_factory=list, description="Education")

class CareerAnalysisResponse(BaseModel):
    career: Dict[str, Any]
    profile: Dict[str, Any]
    salary: SalaryPredictionResponse
    locations: List[LocationItem]
    market: Dict[str, Any]
    skills: Dict[str, Any]
    recommendations: List[str]
