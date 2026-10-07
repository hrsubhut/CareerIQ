from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.analytics.skills import get_top_market_skills, compute_skill_gap

router = APIRouter(prefix="/api/v1/market", tags=["Market Skills"])

class SkillGapPayload(BaseModel):
    target_role: str
    skills: List[str]

@router.get("/skills")
def get_skills():
    return {"skills": get_top_market_skills(top_n=30)}

@router.post("/skill-gap")
def analyze_skill_gap(payload: SkillGapPayload):
    return compute_skill_gap(target_role=payload.target_role, candidate_skills=payload.skills)
