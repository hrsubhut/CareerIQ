from fastapi import APIRouter, HTTPException
from app.schemas.salary import SalaryPredictionInput, SalaryPredictionOutput
from app.model.predictor import SalaryPredictor

router = APIRouter(prefix="/internal/v1/salary", tags=["Salary Prediction"])

@router.post("/predict", response_model=SalaryPredictionOutput)
def predict_salary(payload: SalaryPredictionInput):
    try:
        result = SalaryPredictor.predict(
            job_title=payload.job_title,
            experience_years=payload.experience_years,
            location=payload.location or "Bengaluru",
            job_type=payload.job_type or "Full Time",
            role_family=payload.role_family
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail={"code": "INVALID_INPUT", "message": str(ve)})
    except RuntimeError as re:
        raise HTTPException(status_code=503, detail={"code": "MODEL_UNAVAILABLE", "message": str(re)})
    except Exception as e:
        raise HTTPException(status_code=500, detail={"code": "INTERNAL_ERROR", "message": str(e)})
