from fastapi import APIRouter
from app.analytics.charts import get_market_overview_stats, get_market_chart_analytics

router = APIRouter(prefix="/api/v1/market", tags=["Market Overview"])

@router.get("/overview")
def get_market_overview():
    return get_market_overview_stats()

@router.get("/charts")
def get_market_charts():
    return get_market_chart_analytics()
