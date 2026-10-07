from fastapi import APIRouter
from app.config.settings import settings
from app.clients.salary_client import salary_client
from app.clients.location_client import location_client
from app.clients.market_client import market_client
from app.clients.resume_client import resume_client
from app.clients.profile_client import profile_client

router = APIRouter(tags=["Health"])

@router.get("/health")
def health():
    return {
        "status": "healthy",
        "service": settings.SERVICE_NAME,
        "port": settings.PORT
    }

@router.get("/health/services")
async def health_services():
    results = {}
    for name, client in [
        ("salary-service", salary_client),
        ("location-service", location_client),
        ("market-service", market_client),
        ("resume-service", resume_client),
        ("profile-service", profile_client)
    ]:
        try:
            results[name] = await client.health()
        except Exception as e:
            results[name] = {"status": "unreachable", "error": str(e)}

    all_healthy = all(r.get("status") in ["healthy", "ok"] for r in results.values())
    return {
        "gateway": "healthy",
        "all_downstream_healthy": all_healthy,
        "services": results
    }
