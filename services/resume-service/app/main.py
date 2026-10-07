from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.config.settings import settings
from app.routes.resume import router as resume_router
from app.routes.health import router as health_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

app = FastAPI(
    title="CareerIQ Resume Processing Service",
    description="Microservice responsible for parsing resume files into structured candidate profiles",
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
app.include_router(resume_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
