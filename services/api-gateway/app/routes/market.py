from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.clients.market_client import market_client

router = APIRouter(prefix="/api/v1/market", tags=["Market Analytics"])

class SkillGapInput(BaseModel):
    target_role: str
    skills: List[str]

@router.get("/overview")
async def get_overview():
    try:
        return await market_client.get_overview()
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

@router.get("/roles")
async def get_roles():
    try:
        return await market_client.get_roles()
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

@router.get("/skills")
async def get_skills():
    try:
        return await market_client.get_skills()
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

@router.get("/locations")
async def get_locations():
    try:
        return await market_client.get_locations()
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

@router.post("/skill-gap")
async def compute_skill_gap(payload: SkillGapInput):
    try:
        return await market_client.get_skill_gap(payload.target_role, payload.skills)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
