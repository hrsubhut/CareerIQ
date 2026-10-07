from fastapi import APIRouter, BackgroundTasks
from app.analytics.charts import get_market_overview_stats, get_market_chart_analytics
from app.ingestion.live_store import live_job_store
from app.ingestion.live_collector import collect_all_live_jobs

router = APIRouter(prefix="/api/v1/market", tags=["Market Overview"])

@router.get("/overview")
def get_market_overview():
    return get_market_overview_stats()

@router.get("/charts")
def get_market_charts():
    return get_market_chart_analytics()

@router.get("/live-feed")
def get_live_feed(limit: int = 40):
    """
    Returns real-time stream of live job postings ingested from the web.
    """
    jobs = live_job_store.get_recent_jobs(limit=limit)
    stats = live_job_store.get_stats()
    return {
        "status": "LIVE_STREAM_ACTIVE",
        "live_count": len(jobs),
        "total_recorded": stats.get("total_live_jobs", 0),
        "unique_companies": stats.get("unique_companies", 0),
        "jobs": jobs
    }

@router.post("/sync-live")
def trigger_live_sync():
    """
    Triggers live on-demand synchronization with public internet job feeds (Arbeitnow, RemoteOK).
    """
    new_jobs = collect_all_live_jobs()
    inserted = live_job_store.insert_jobs(new_jobs)
    stats = live_job_store.get_stats()
    return {
        "message": f"Successfully synced live web jobs.",
        "fetched": len(new_jobs),
        "newly_added": inserted,
        "total_live_records": stats.get("total_live_jobs", 0)
    }
