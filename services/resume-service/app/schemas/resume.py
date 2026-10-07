from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ResumeProfileData(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    skills: List[str] = []
    experience_years: float = 0.0
    education: List[str] = []
    current_role: Optional[str] = None
    location: Optional[str] = None

class ResumeParseResponse(BaseModel):
    profile: ResumeProfileData
    filename: Optional[str] = None
