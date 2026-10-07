#!/usr/bin/env bash
set -e

echo "Starting CareerIQ Microservices..."

uvicorn app.main:app --port 8001 --reload --app-dir services/resume-service &
uvicorn app.main:app --port 8002 --reload --app-dir services/salary-service &
uvicorn app.main:app --port 8003 --reload --app-dir services/location-service &
uvicorn app.main:app --port 8004 --reload --app-dir services/market-service &
uvicorn app.main:app --port 8005 --reload --app-dir services/profile-service &
uvicorn app.main:app --port 8000 --reload --app-dir services/api-gateway &

cd frontend && npm run dev &

echo "All services launched. Gateway available at http://localhost:8000"
wait
