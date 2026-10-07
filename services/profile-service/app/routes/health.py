from fastapi import APIRouter
from app.config.settings import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
def health():
    return {
        "status": "healthy",
        "service": settings.SERVICE_NAME
    }
