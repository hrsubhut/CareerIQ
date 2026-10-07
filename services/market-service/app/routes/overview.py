from fastapi import APIRouter
from app.repositories.jobs_repository import jobs_repo
from app.analytics.demand import get_role_demand_analytics

router = APIRouter(prefix="/api/v1/market", tags=["Market Overview"])

@router.get("/overview")
def get_market_overview():
    meta = jobs_repo.get_metadata()
    roles = get_role_demand_analytics()
    
    top_role = roles[0]["display_role"] if roles else "Data Scientist"

    return {
        "total_postings": meta.get("analytics_rows", 15841),
        "categorized_roles": meta.get("categorized_roles", len(roles)),
        "top_role": top_role,
        "top_skill": "Python",
        "top_location": "Bengaluru",
        "methodology": meta.get("method", "Dataset aggregated empirical frequencies"),
        "roles": roles
    }
