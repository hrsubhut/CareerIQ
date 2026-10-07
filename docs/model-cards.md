# CareerIQ — Machine Learning Model Cards

---

## 1. Salary Prediction Model

### Summary
* **Model Name:** `CareerIQ Salary RandomForest Estimator`
* **Artifact File:** `services/salary-service/models/careeriq_salary_model.joblib`
* **Version:** `1.0.0`
* **Algorithm:** `sklearn.pipeline.Pipeline` containing `ColumnTransformer` (OneHotEncoder + SimpleImputer, StandardScaler + SimpleImputer) and `RandomForestRegressor`.
* **Primary Target:** Annual salary in Lakhs INR (`predicted_salary_lakhs`).

### Feature Schema & Preprocessing
The model takes 10 input columns:
1. `job_title_normalized` (Categorical) — Standardized role name (e.g., `'data scientist'`)
2. `job_desig` (Categorical) — Raw job designation
3. `role_family` (Categorical) — Broad domain (`'Data Science'`, `'Analytics'`, `'Engineering'`)
4. `job_type` (Categorical) — Employment type (`'Full Time'`)
5. `location` (Categorical) — Metropolitan or regional city (`'Bengaluru'`, `'Mumbai'`, etc.)
6. `experience` (Categorical) — Experience string representation (`'3-5 Yrs'`)
7. `experience_min_years` (Numerical) — Lower experience bound
8. `experience_max_years` (Numerical) — Upper experience bound
9. `experience_avg_years` (Numerical) — Midpoint of experience range
10. `experience_band` (Categorical) — Experience tier (`'0-1'`, `'1-3'`, `'3-5'`, `'5-8'`, `'8+'`)

### Inference Endpoints
* **Internal API:** `POST http://127.0.0.1:8002/internal/v1/salary/predict`
* **Gateway API:** `POST http://127.0.0.1:8000/api/v1/salary/predict`

---

## 2. Location Recommendation Model

### Summary
* **Model Name:** `CareerIQ Location XGBoost Classifier`
* **Artifact File:** `services/location-service/models/careeriq_location_model.joblib`
* **Version:** `1.0.0`
* **Algorithm:** `xgboost.sklearn.XGBClassifier`
* **Preprocessing Pipeline:**
  * `tfidf`: `TfidfVectorizer` (Vocabulary: 15,000 text n-grams from job profiles & skills)
  * `location_encoder`: `OneHotEncoder` fitted across 55 canonical Indian tech employment hubs
  * `scaler`: `StandardScaler` fitted on `['experience_min_years', 'experience_max_years']`
* **Feature Matrix Construction:** `scipy.sparse.hstack([X_tfidf, X_loc, X_num])` (Total 15,057 features).
* **Primary Output:** Suitability probability score `P(match=1)` for each candidate location.

### Supported Locations (55 Cities)
Includes Bengaluru, Mumbai, Gurugram, Pune, Hyderabad, Chennai, Noida, Delhi NCR, Kolkata, Ahmedabad, etc.

### Inference Endpoints
* **Internal API:** `POST http://127.0.0.1:8003/internal/v1/location/recommend`
* **Gateway API:** `POST http://127.0.0.1:8000/api/v1/location/recommend`

---

## 3. Career Market & Skill Engine

### Summary
* **Artifact File:** `services/market-service/models/career_market_model_enhanced.joblib`
* **Version:** `2.0.0` (Pipeline v2.2.0)
* **Dataset Scope:** 15,841 analyzed postings across 17 categorized roles and 720 skill traits.
* **Responsibilities:**
  * Role demand and market share analytics
  * Exact weighted skill evidence (`0.7`) + TF-IDF semantic similarity (`0.3`)
  * Skill gap identification (matched vs. missing high-lift requirements)
  * Location demand distributions

### Endpoints
* `GET /api/v1/market/overview`
* `GET /api/v1/market/roles`
* `GET /api/v1/market/skills`
* `GET /api/v1/market/locations`
* `POST /api/v1/market/skill-gap`
