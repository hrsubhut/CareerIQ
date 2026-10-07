from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.clients.profile_client import profile_client

router = APIRouter(prefix="/api/v1/profile", tags=["Profile Management"])

@router.post("/save")
async def save_profile(payload: Dict[str, Any]):
    try:
        return await profile_client.save(payload)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

@router.get("/{profile_id}")
async def get_profile(profile_id: str):
    try:
        return await profile_client.get(profile_id)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
