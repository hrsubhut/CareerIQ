from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class CandidateProfile(BaseModel):
    name: Optional[str] = Field(None, description="Candidate name")
    email: Optional[str] = Field(None, description="Candidate email")
    phone: Optional[str] = Field(None, description="Contact phone")
    current_role: Optional[str] = Field(None, description="Detected or self-reported current role")
    target_role: Optional[str] = Field(None, description="Desired future role")
    experience_years: float = Field(0.0, ge=0.0, description="Total years of professional experience")
    skills: List[str] = Field(default_factory=list, description="Extracted & normalized skills")
    education: List[str] = Field(default_factory=list, description="Academic qualifications")
    location: Optional[str] = Field(None, description="Current or preferred location")
    raw_text_snippet: Optional[str] = Field(None, description="Truncated text summary")
