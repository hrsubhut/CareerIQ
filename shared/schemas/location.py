from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class LocationRecommendationRequest(BaseModel):
    job_title: str = Field(..., description="Role title")
    skills: List[str] = Field(default_factory=list, description="Candidate skills")
    experience_years: float = Field(0.0, ge=0.0, description="Years of experience")
    preferred_locations: Optional[List[str]] = Field(default_factory=list, description="Candidate location preferences")
    top_k: int = Field(5, ge=1, le=55, description="Number of locations to return")

class LocationItem(BaseModel):
    location: str = Field(..., description="City or region name")
    score: float = Field(..., description="Suitability score / probability (0.0 to 1.0)")
    relative_demand: Optional[str] = Field(None, description="Demand descriptor")
    market_share_prior: Optional[float] = Field(None, description="Baseline posting distribution ratio")

class LocationRecommendationResponse(BaseModel):
    recommendations: List[LocationItem]
    model: Dict[str, Any]
