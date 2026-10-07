from typing import List, Dict, Any
from app.repositories.jobs_repository import jobs_repo

def get_market_salary_benchmarks() -> List[Dict[str, Any]]:
    roles_df = jobs_repo.get_roles_df()
    if roles_df.empty:
        return []

    benchmarks = []
    for _, row in roles_df.iterrows():
        med_sal = float(row.get('median_salary', 0.0))
        benchmarks.append({
            "role": str(row.get('display_role', row.get('role', ''))),
            "median_salary_lakhs": round(med_sal, 2),
            "avg_salary_lakhs": round(float(row.get('avg_salary', 0.0)), 2),
            "formatted_salary": f"INR {med_sal:.1f} Lakhs" if med_sal > 0 else "Market Standard"
        })
    return benchmarks
