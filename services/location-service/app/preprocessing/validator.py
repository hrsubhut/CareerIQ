from typing import Tuple

def validate_location_input(job_title: str, experience_years: float) -> Tuple[bool, str]:
    if not job_title or not job_title.strip():
        return False, "Job title cannot be empty."
    if experience_years < 0:
        return False, "Experience years cannot be negative."
    return True, ""
