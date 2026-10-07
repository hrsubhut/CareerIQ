# CareerIQ Data Dictionary

Comprehensive feature specification and data dictionaries for the machine learning models and data pipelines.

---

## 1. Salary Service Model (`careeriq_salary_model.joblib`)

- **Architecture**: `RandomForestRegressor` wrapped in an unpickled `ColumnTransformer` pipeline.
- **Input Features (10 Total)**:
  | Feature Name | Type | Description | Values / Encoding |
  |---|---|---|---|
  | `experience_years` | Numeric (Float) | Total professional tech experience | e.g. `0.0` - `35.0` |
  | `job_title` | Categorical (String) | Normalized job title | One-hot encoded across target roles |
  | `location` | Categorical (String) | Geographic metro center | One-hot encoded across Indian metro tiers |
  | `python` | Binary (0 / 1) | Candidate proficient in Python | Flag |
  | `sql` | Binary (0 / 1) | Candidate proficient in SQL | Flag |
  | `machine_learning`| Binary (0 / 1) | Candidate proficient in Machine Learning | Flag |
  | `deep_learning` | Binary (0 / 1) | Candidate proficient in Deep Learning | Flag |
  | `aws` | Binary (0 / 1) | Candidate proficient in AWS Cloud | Flag |
  | `docker` | Binary (0 / 1) | Candidate proficient in Docker/DevOps | Flag |
  | `data_analysis` | Binary (0 / 1) | Candidate proficient in Data Analysis | Flag |

- **Target Variable**:
  - `annual_salary_inr`: Continuous numeric target representing estimated annual compensation in Indian Rupees (INR).

---

## 2. Location Recommendation Model (`careeriq_location_model.joblib`)

- **Architecture**: Multi-class `XGBClassifier` with sparse CSR matrix feature input.
- **Feature Space (15,057 Sparse TF-IDF Tokens)**:
  - Formed from sublinear term frequencies across job descriptions, required skill matrices, and candidate profile summaries.
  - Sublinear TF scaling with English stop-words removed.
- **Target Classes (55 Metropolitan Hubs)**:
  - Covers tier-1 Indian tech centers (`Bengaluru`, `Hyderabad`, `Pune`, `Gurgaon`, `Noida`, `Mumbai`, `Chennai`) and tier-2 emerging clusters (`Ahmedabad`, `Kochi`, `Chandigarh`, `Jaipur`, `Indore`, `Bhubaneswar`, etc.).

---

## 3. Market Service Matrix (`career_market_model_enhanced.joblib`)

- **Corpus Summary**:
  - **15,841** verified real job records
  - **17** distinct tech job roles
  - **720** unique recognized technical skills
- **Dictionary Structure**:
  ```python
  {
      "roles": list[str],                # 17 normalized job roles
      "skills": list[str],               # 720 cataloged skills
      "skill_cooccurrence": ndarray,     # Co-occurrence frequencies
      "role_skill_importance": dict,     # TF-IDF weights of skills per role
      "location_demand_index": dict      # Hiring distribution per city
  }
  ```
