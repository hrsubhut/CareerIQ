from typing import List, Tuple
import scipy.sparse as sp

def prepare_location_query(job_title: str, skills: List[str]) -> str:
    cleaned_title = job_title.strip().lower()
    cleaned_skills = [s.strip().lower() for s in skills if s.strip()]
    return f"{cleaned_title} {' '.join(cleaned_skills)}".strip()

def prepare_experience_bounds(experience_years: float) -> Tuple[float, float]:
    min_exp = max(0.0, round(experience_years - 1.0, 1))
    max_exp = round(experience_years + 2.0, 1)
    return min_exp, max_exp
