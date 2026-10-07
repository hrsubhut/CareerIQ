from fastapi import APIRouter
from app.repositories.jobs_repository import jobs_repo
from app.config.settings import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
def health():
    return {
        "status": "healthy",
        "service": settings.SERVICE_NAME,
        "dataset_loaded": jobs_repo.is_loaded()
    }
