from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config.settings import settings
from app.model.loader import salary_loader
from app.routes.prediction import router as prediction_router
from app.routes.health import router as health_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("salary-service")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Salary Service...")
    loaded = salary_loader.load()
    if loaded:
        logger.info("Salary model successfully loaded and ready for inference.")
    else:
        logger.warning("Salary model could not be loaded on startup. Health check will report model_loaded=False.")
    yield
    logger.info("Shutting down Salary Service.")

app = FastAPI(
    title="CareerIQ Salary Inference Service",
    description="Microservice responsible for salary estimation using trained RandomForest pipeline",
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
app.include_router(prediction_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
