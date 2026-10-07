from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class RoleDemandItem(BaseModel):
    role: str
    display_role: str
    postings: int
    market_share: float
    median_experience: float
    median_salary_lakhs: float
    demand_score: float

class SkillDemandItem(BaseModel):
    skill: str
    skill_postings: int
    importance: float
    lift: float

class MarketOverviewResponse(BaseModel):
    total_postings: int
    categorized_roles: int
    top_role: str
    top_skill: str
    top_location: str
    methodology: str
    roles: List[RoleDemandItem]

class SkillGapRequest(BaseModel):
    candidate_skills: List[str]
    target_role: str

class SkillGapResponse(BaseModel):
    target_role: str
    matched_skills: List[str]
    missing_critical_skills: List[str]
    match_percentage: float
    skill_details: List[Dict[str, Any]]
