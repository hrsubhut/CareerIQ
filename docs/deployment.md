# CareerIQ Deployment Guide

Instructions for deploying CareerIQ across Docker container clusters or standalone bare-metal environments.

---

## 1. Prerequisites

- **Docker & Docker Compose**: v20.10+
- **Python**: 3.10, 3.11, or 3.12 (host or containerized)
- **Node.js**: v18+ & npm v9+

---

## 2. Docker Compose Deployment (Recommended)

To spin up all 6 microservices and the Vite React frontend in an isolated bridge network:

```bash
# 1. Clone repository
git clone https://github.com/hrsubhut/CareerIQ.git
cd CareerIQ

# 2. Configure environment
cp .env.example .env

# 3. Build & start containers
docker compose up -d --build

# 4. Verify running health checks
curl http://localhost:8000/health/services
```

### Port Map
- **Frontend UI**: `http://localhost:5173`
- **API Gateway**: `http://localhost:8000`
- **Resume Service**: `http://localhost:8001`
- **Salary Service**: `http://localhost:8002`
- **Location Service**: `http://localhost:8003`
- **Market Service**: `http://localhost:8004`
- **Profile Service**: `http://localhost:8005`

---

## 3. Local Bare-Metal Execution

### Option A: Using Startup Scripts
- **Windows (PowerShell)**:
  ```powershell
  .\infra\scripts\start-all.ps1
  ```
- **Linux / macOS**:
  ```bash
  chmod +x ./infra\scripts\start-all.sh
  ./infra/scripts/start-all.sh
  ```

### Option B: Running Master Test Verification
Run the comprehensive end-to-end test suite verifying live inference on all models:
```bash
python tests/test_all_services.py
```
