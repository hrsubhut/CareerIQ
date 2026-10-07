# CareerIQ: Enterprise Career Intelligence Platform

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.6+-orange.svg)](https://scikit-learn.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.1+-red.svg)](https://xgboost.readthedocs.io/)
[![Docker](https://img.shields.io/badge/Docker-compose-2496ED.svg)](https://www.docker.com/)

CareerIQ is a production-grade, explainable career intelligence and talent analytics platform powered by **dedicated, specialized machine learning microservices**. 

Unlike generic LLM wrappers, CareerIQ delivers deterministic, explainable career insights derived directly from trained machine learning models, statistical job-market corpora, and local NLP document extraction pipelines.

---

## 🏛️ System Architecture

```text
                                  ┌─────────────────────────────┐
                                  │   React 18 / Vite Frontend  │
                                  │      (Port 5173 / SPA)      │
                                  └──────────────┬──────────────┘
                                                 │
                                                 │ HTTP / JSON
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │         API Gateway         │
                                  │         (Port 8000)         │
                                  └──────────────┬──────────────┘
                                                 │
            ┌───────────────────┬────────────────┼───────────────────┬───────────────────┐
            │                   │                │                   │                   │
            ▼                   ▼                ▼                   ▼                   ▼
    ┌───────────────┐   ┌───────────────┐ ┌──────────────┐   ┌───────────────┐   ┌───────────────┐
    │ Resume Service│   │ Salary Service│ │Location Svc  │   │ Market Service│   │Profile Service│
    │  (Port 8001)  │   │  (Port 8002)  │ │ (Port 8003)  │   │  (Port 8004)  │   │  (Port 8005)  │
    └───────┬───────┘   └───────┬───────┘ └──────┬───────┘   └───────┬───────┘   └───────┬───────┘
            │                   │                │                   │                   │
      Local NLP /         RandomForest       XGBoost            TF-IDF Market         SQLite DB /
     PDF Extractor        Regressor         Classifier           Knowledge Base       Data Storage
```

### Critical Architecture Principles
1. **Single Entry Point**: The Frontend communicates strictly with the **API Gateway** (`http://localhost:8000`). It never calls downstream microservices directly.
2. **Dedicated ML Services**: Machine learning artifacts are encapsulated within their respective microservices. Models are never duplicated or loaded inside the gateway.
3. **No External AI APIs**: All salary, location, and market demand predictions are computed on-premise using trained `.joblib` models.

---

## 🚀 Microservices Ecosystem

| Service | Port | Primary Responsibility | Backing Technology / Model |
|---|---|---|---|
| **API Gateway** | `8000` | Orchestration, aggregation, route proxying, unified `/api/v1/career/analyze` | FastAPI, Async HTTPX |
| **Resume Service** | `8001` | PDF/DOCX/TXT text parsing, regex/entity extraction | PyMuPDF, python-docx, spaCy |
| **Salary Service** | `8002` | Compensation regression based on experience, title, skills, and city | Scikit-Learn `RandomForestRegressor` (`careeriq_salary_model.joblib`) |
| **Location Service**| `8003` | Recommends optimal tech metro hubs for candidate profile | `XGBClassifier` with 15k+ TF-IDF features (`careeriq_location_model.joblib`) |
| **Market Service** | `8004` | Job demand statistics, hiring hubs, and skill-gap matching | Pre-indexed matrix of 15,841 jobs (`career_market_model_enhanced.joblib`) |
| **Profile Service**| `8005` | Candidate profile persistence and audit history | SQLite & Pydantic v2 schemas |

---

## 🤖 Machine Learning Specifications

### 1. Salary Estimator (`services/salary-service/models/careeriq_salary_model.joblib`)
- **Model**: `RandomForestRegressor` + `ColumnTransformer`
- **Features**: Experience in years, standardized role, location tier, plus binary skill flags (Python, SQL, Machine Learning, Deep Learning, AWS, Docker, Data Analysis).
- **Output**: Point estimate of annual compensation in INR + 95% confidence spread (`range_min`, `range_max`).

### 2. Location Recommender (`services/location-service/models/careeriq_location_model.joblib`)
- **Model**: Multi-class `XGBClassifier`
- **Features**: 15,057 sparse sublinear TF-IDF features across tech roles and skill tokens.
- **Output**: Ranked target tech hubs across 55 metropolitan regions.

### 3. Market Demand & Skill Gap (`services/market-service/models/career_market_model_enhanced.joblib`)
- **Data Source**: 15,841 curated tech job records across 17 roles and 720 cataloged skills.
- **Capabilities**: Co-occurrence frequency metrics, role-specific missing skill identification, and compatibility percentage scoring.

---

## 🛠️ Quickstart Guide

### Prerequisites
- Docker & Docker Compose **OR**
- Python 3.10+ and Node.js 18+

### Running with Docker Compose (Recommended)
```bash
# Clone the repository
git clone https://github.com/hrsubhut/CareerIQ.git
cd CareerIQ

# Configure environment
cp .env.example .env

# Build and launch all 6 services + frontend
docker compose up -d --build
```
Access the application:
- **Web UI**: `http://localhost:5173`
- **API Gateway Swagger**: `http://localhost:8000/docs`
- **Gateway Health Check**: `http://localhost:8000/health/services`

---

## 🧪 Running the Verification Test Suite

A comprehensive test suite verifies the end-to-end functionality of all microservices with live ML inference:

```bash
# Execute master test suite
python tests/test_all_services.py
```

Expected output:
```text
============================================================
           CareerIQ Master Services Test Suite              
============================================================
[PASS] Salary Service: Predicted INR 967,818 for 3.0 yrs exp
[PASS] Location Service: Top recommendation: Bengaluru
[PASS] Market Service: Match 68.5% | Missing skills: Deep Learning, TensorFlow
[PASS] Resume Service: Extracted 6 skills and 2.5 yrs exp
[PASS] Profile Service: Profile saved with ID: e42bf19d...
============================================================
 ALL 5 MICROSERVICES PASSED VERIFICATION WITH LIVE ML INFERENCE!
============================================================
```

---

## 📂 Repository Structure

```text
CareerIQ/
├── frontend/             # React 18 + Vite + TypeScript frontend
├── services/
│   ├── api-gateway/      # Central API Gateway & orchestrator
│   ├── resume-service/   # Document parsing & entity extraction
│   ├── salary-service/   # RandomForest salary prediction service
│   ├── location-service/ # XGBoost location recommendation service
│   ├── market-service/   # Market analytics & skill-gap service
│   └── profile-service/  # Candidate profile management
├── shared/               # Reusable Pydantic contracts and schemas
├── data/                 # Raw and processed datasets
├── models/               # Model cards and serialized joblib artifacts
├── infra/                # Docker compose, Nginx, and launch scripts
├── docs/                 # Architecture, API contracts, model cards
├── tests/                # Master integration test suites
├── docker-compose.yml    # Root multi-container orchestration
├── .env.example          # Port and URL environment defaults
└── README.md
```

---

## 📄 License
This project is open-source under the MIT License.
