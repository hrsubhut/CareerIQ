from fastapi import APIRouter
from app.analytics.demand import get_role_demand_analytics

router = APIRouter(prefix="/api/v1/market", tags=["Market Roles"])

@router.get("/roles")
def get_roles():
    return {"roles": get_role_demand_analytics()}
