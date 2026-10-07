from pydantic import BaseModel, Field
from typing import List, Optional

class ProfileCreateInput(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    current_role: Optional[str] = None
    target_role: Optional[str] = None
    experience_years: float = 0.0
    location: Optional[str] = None
    skills: List[str] = []
    education: List[str] = []
