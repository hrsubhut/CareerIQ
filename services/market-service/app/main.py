from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config.settings import settings
from app.repositories.jobs_repository import jobs_repo
from app.routes.overview import router as overview_router
from app.routes.roles import router as roles_router
from app.routes.skills import router as skills_router
from app.routes.locations import router as locations_router
from app.routes.salary import router as salary_router
from app.routes.health import router as health_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("market-service")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Market Analytics Service...")
    loaded = jobs_repo.load()
    if loaded:
        logger.info("Market dataset successfully loaded into repository.")
    else:
        logger.warning("Market dataset not found or failed to load.")
    yield
    logger.info("Shutting down Market Analytics Service.")

app = FastAPI(
    title="CareerIQ Market Analytics Service",
    description="Microservice providing real job-market analytics, demand, and skill requirements",
    version="1.0.0",
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
app.include_router(overview_router)
app.include_router(roles_router)
app.include_router(skills_router)
app.include_router(locations_router)
app.include_router(salary_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
