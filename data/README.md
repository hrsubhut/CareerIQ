# CareerIQ Data Management

This directory manages the training datasets, schemas, and analytical data sources used across CareerIQ microservices.

## Directory Structure

```text
data/
├── raw/            # Unprocessed source datasets (Kaggle, LinkedIn Job Scrapes, Glassdoor reports)
├── processed/      # Cleaned, normalized, and pre-vectorized feature datasets
└── README.md       # Data documentation and lineage
```

## Datasets Overview

1. **Analytics Jobs Corpus**
   - **Records**: 15,841 curated job postings
   - **Features**: Job Title, Required Skills, Standardized Roles, Location/Region, Salary Brackets
   - **Primary consumer**: `market-service` (pre-computed empirical TF-IDF matrix & skill demand frequencies)

2. **Salary Regression Training Set**
   - **Features**: Experience level (years), Normalized Title, Top 10 Skill presence (one-hot/count), City tier
   - **Target**: Annual compensation in INR
   - **Model**: `RandomForestRegressor` (`careeriq_salary_model.joblib`)

3. **Location Recommendation Classification Set**
   - **Features**: 15,057 sparse TF-IDF text features (Resume text, skills, role tokens)
   - **Target**: 55 candidate metropolitan job hubs across India & international tech hubs
   - **Model**: Multi-class `XGBClassifier` (`careeriq_location_model.joblib`)
