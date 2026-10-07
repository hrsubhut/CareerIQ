from fastapi import APIRouter
from app.analytics.demand import get_location_demand_analytics

router = APIRouter(prefix="/api/v1/market", tags=["Market Locations"])

@router.get("/locations")
def get_locations():
    return {"locations": get_location_demand_analytics()}
