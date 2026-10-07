from fastapi import APIRouter
from app.model.loader import location_loader
from app.config.settings import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
def health():
    return {
        "status": "healthy",
        "service": settings.SERVICE_NAME,
        "model_loaded": location_loader.is_loaded(),
        "model_name": settings.MODEL_NAME,
        "model_version": settings.MODEL_VERSION
    }
