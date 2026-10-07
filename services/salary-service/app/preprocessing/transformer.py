import pandas as pd
from typing import Dict, Any

def experience_to_band(exp_years: float) -> str:
    if exp_years < 1:
        return "0-1"
    elif exp_years <= 3:
        return "1-3"
    elif exp_years <= 5:
        return "3-5"
    elif exp_years <= 8:
        return "5-8"
    else:
        return "8+"

def map_role_family(job_title: str) -> str:
    title_lower = job_title.lower()
    if any(k in title_lower for k in ["data science", "data scientist", "scientist", "ml", "machine learning", "ai", "deep learning"]):
        return "Data Science"
    elif any(k in title_lower for k in ["analyst", "analytics", "bi", "business intelligence"]):
        return "Analytics"
    elif any(k in title_lower for k in ["engineer", "developer", "software", "architect", "devops"]):
        return "Engineering"
    return "Analytics"

def build_salary_features(
    job_title: str,
    experience_years: float,
    location: str = "Bengaluru",
    job_type: str = "Full Time",
    role_family: str = None
) -> pd.DataFrame:
    """
    Transforms public candidate request into the exact 10-column input required
    by the trained careeriq_salary_model Pipeline.
    """
    norm_title = job_title.strip().lower()
    family = role_family or map_role_family(norm_title)
    band = experience_to_band(experience_years)
    
    # Estimate min, max, avg experience around the candidate experience
    min_exp = max(0.0, round(experience_years - 1.0, 1))
    max_exp = round(experience_years + 2.0, 1)
    avg_exp = round((min_exp + max_exp) / 2.0, 1)
    exp_str = f"{int(min_exp)}-{int(max_exp)} Yrs" if min_exp >= 1 else f"0-{int(max_exp)} Yrs"

    row = {
        'job_title_normalized': norm_title,
        'job_desig': job_title.strip(),
        'role_family': family,
        'job_type': job_type or 'Full Time',
        'location': location or 'Bengaluru',
        'experience': exp_str,
        'experience_min_years': float(min_exp),
        'experience_max_years': float(max_exp),
        'experience_avg_years': float(avg_exp),
        'experience_band': band
    }

    return pd.DataFrame([row])
