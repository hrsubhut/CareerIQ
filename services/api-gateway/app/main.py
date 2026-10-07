from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.config.settings import settings
from app.routes.health import router as health_router
from app.routes.career import router as career_router
from app.routes.resume import router as resume_router
from app.routes.market import router as market_router
from app.routes.salary import router as salary_router
from app.routes.location import router as location_router
from app.routes.profile import router as profile_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

app = FastAPI(
    title="CareerIQ API Gateway",
    description="Unified Public API Gateway and Orchestration Engine for CareerIQ Microservices",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(career_router)
app.include_router(resume_router)
app.include_router(market_router)
app.include_router(salary_router)
app.include_router(location_router)
app.include_router(profile_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
