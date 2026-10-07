from typing import Tuple

def validate_salary_input(job_title: str, experience_years: float) -> Tuple[bool, str]:
    if not job_title or not job_title.strip():
        return False, "Job title cannot be empty."
    if experience_years < 0:
        return False, "Experience years must be greater than or equal to 0."
    if experience_years > 50:
        return False, "Experience years exceeds realistic range (maximum 50)."
    return True, ""
