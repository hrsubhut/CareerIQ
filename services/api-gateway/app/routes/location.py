from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.clients.location_client import location_client

router = APIRouter(prefix="/api/v1/location", tags=["Location Recommendation"])

class LocationInput(BaseModel):
    job_title: str
    skills: Optional[List[str]] = []
    experience_years: float = 0.0
    preferred_locations: Optional[List[str]] = []
    top_k: int = 5

@router.post("/recommend")
async def recommend_location(payload: LocationInput):
    try:
        return await location_client.recommend(
            job_title=payload.job_title,
            skills=payload.skills or [],
            experience_years=payload.experience_years,
            preferred_locations=payload.preferred_locations or [],
            top_k=payload.top_k
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
