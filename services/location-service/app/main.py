from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config.settings import settings
from app.model.loader import location_loader
from app.routes.recommendation import router as recommendation_router
from app.routes.health import router as health_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("location-service")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Location Service...")
    loaded = location_loader.load()
    if loaded:
        logger.info("Location model successfully loaded and ready for inference.")
    else:
        logger.warning("Location model could not be loaded on startup.")
    yield
    logger.info("Shutting down Location Service.")

app = FastAPI(
    title="CareerIQ Location Recommendation Service",
    description="Microservice responsible for ranking locations using trained XGBoost Classifier",
    version=settings.MODEL_VERSION,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(recommendation_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
