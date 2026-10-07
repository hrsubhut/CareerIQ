from fastapi import APIRouter, HTTPException
from app.repositories.profile_repository import profile_repo
from app.schemas.profile import ProfileCreateInput

router = APIRouter(prefix="/api/v1/profile", tags=["Candidate Profiles"])

@router.post("/save")
def save_profile(payload: ProfileCreateInput):
    pid = profile_repo.save(payload.model_dump())
    return {"status": "saved", "id": pid}

@router.get("/{profile_id}")
def get_profile(profile_id: str):
    profile = profile_repo.get(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
