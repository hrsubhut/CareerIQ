from typing import List, Dict, Any
from app.repositories.jobs_repository import jobs_repo

def get_role_demand_analytics() -> List[Dict[str, Any]]:
    roles_df = jobs_repo.get_roles_df()
    if roles_df.empty:
        return []

    results = []
    for _, row in roles_df.iterrows():
        results.append({
            "role": str(row.get('role', '')),
            "display_role": str(row.get('display_role', row.get('role', ''))),
            "postings": int(row.get('postings', 0)),
            "market_share": round(float(row.get('market_share', 0.0)), 2),
            "median_experience": round(float(row.get('median_experience', 0.0)), 1),
            "avg_experience": round(float(row.get('avg_experience', 0.0)), 1),
            "median_salary": round(float(row.get('median_salary', 0.0)), 1),
            "avg_salary": round(float(row.get('avg_salary', 0.0)), 1),
            "demand_score": round(float(row.get('demand_score', 0.0)), 2)
        })
    results.sort(key=lambda x: x["postings"], reverse=True)
    return results

def get_location_demand_analytics() -> List[Dict[str, Any]]:
    loc_df = jobs_repo.get_locations_df()
    if loc_df.empty:
        return []

    # Aggregate total postings per location
    grouped = loc_df.groupby('location').agg({
        'postings': 'sum',
        'location_demand_score': 'mean',
        'salary_proxy': 'mean'
    }).reset_index()

    results = []
    for _, row in grouped.iterrows():
        results.append({
            "location": str(row['location']).title(),
            "total_postings": int(row['postings']),
            "avg_demand_score": round(float(row['location_demand_score']), 2),
            "avg_salary_proxy": round(float(row['salary_proxy']), 2)
        })
    results.sort(key=lambda x: x["total_postings"], reverse=True)
    return results
