# CareerIQ API Contracts & Specification

This document details the public and internal API contracts across the CareerIQ microservices ecosystem.

---

## 1. Gateway Public API (`http://localhost:8000`)

### `POST /api/v1/career/analyze`
Executes end-to-end holistic career analysis combining salary estimation, location recommendations, market demand analytics, and skill gap profiling.

#### Request Body
```json
{
  "job_title": "Data Scientist",
  "experience_years": 3.0,
  "location": "Bengaluru",
  "skills": ["Python", "SQL", "Machine Learning", "Scikit-Learn"]
}
```

#### Response Body (`200 OK`)
```json
{
  "salary": {
    "predicted_salary": 967818,
    "currency": "INR",
    "range_min": 774254,
    "range_max": 1161381,
    "model": {
      "name": "CareerIQ Salary Estimator",
      "version": "1.0",
      "type": "RandomForestRegressor"
    }
  },
  "location": {
    "recommended_locations": [
      {
        "location": "Bengaluru",
        "score": 0.825,
        "demand_level": "High"
      },
      {
        "location": "Hyderabad",
        "score": 0.743,
        "demand_level": "High"
      }
    ],
    "model": {
      "name": "CareerIQ Location Classifier",
      "version": "1.0",
      "type": "XGBClassifier"
    }
  },
  "market": {
    "role": "Data Scientist",
    "market_overview": {
      "total_openings": 15841,
      "growth_trend": "+18.4% YoY",
      "top_hiring_locations": ["Bengaluru", "Hyderabad", "Pune"]
    },
    "skill_gap": {
      "present_skills": ["Python", "SQL", "Machine Learning", "Scikit-Learn"],
      "missing_high_value_skills": ["Deep Learning", "TensorFlow", "AWS", "Docker"],
      "match_percentage": 68.5
    }
  }
}
```

---

### `POST /api/v1/resume/parse`
Parses an uploaded PDF, DOCX, or plain text resume and extracts candidate profile details.

#### Request
- **Content-Type**: `multipart/form-data`
- **Field**: `file` (Binary file)

#### Response (`200 OK`)
```json
{
  "name": "Rahul Sharma",
  "email": "rahul.sharma@example.com",
  "phone": "+91 98765 43210",
  "skills": ["Python", "Machine Learning", "SQL", "FastAPI"],
  "experience_years": 2.5,
  "current_role": "Junior Data Scientist",
  "education": ["B.Tech Computer Science"]
}
```

---

## 2. Internal Microservice APIs

### Salary Service (`http://salary-service:8002`)
- `POST /internal/v1/salary/predict`
  - Input: `{"job_title": string, "experience_years": float, "location": string, "skills": list[string]}`
  - Output: `{"predicted_salary": float, "currency": "INR", "range_min": float, "range_max": float, "model": {...}}`
- `GET /health`

### Location Service (`http://location-service:8003`)
- `POST /internal/v1/location/recommend`
  - Input: `{"job_title": string, "skills": list[string], "current_location": string | null, "top_k": int}`
  - Output: `{"recommended_locations": [{"location": string, "score": float, "demand_level": string}], "model": {...}}`
- `GET /health`

### Market Service (`http://market-service:8004`)
- `GET /internal/v1/market/overview?role=Data+Scientist`
- `POST /internal/v1/market/skill-gap`
  - Input: `{"role": string, "candidate_skills": list[string]}`
  - Output: `{"role": string, "present_skills": list[string], "missing_high_value_skills": list[string], "match_percentage": float}`
- `GET /health`

### Resume Service (`http://resume-service:8001`)
- `POST /internal/v1/resume/parse`
- `GET /health`

### Profile Service (`http://profile-service:8005`)
- `POST /internal/v1/profiles`
- `GET /internal/v1/profiles/{profile_id}`
- `PUT /internal/v1/profiles/{profile_id}`
- `GET /health`
