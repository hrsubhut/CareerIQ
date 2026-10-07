from fastapi import APIRouter, HTTPException
from app.schemas.location import LocationRecommendInput, LocationRecommendationOutput
from app.model.predictor import LocationPredictor

router = APIRouter(prefix="/internal/v1/location", tags=["Location Recommendation"])

@router.post("/recommend", response_model=LocationRecommendationOutput)
def recommend_locations(payload: LocationRecommendInput):
    try:
        result = LocationPredictor.recommend(
            job_title=payload.job_title,
            skills=payload.skills or [],
            experience_years=payload.experience_years,
            preferred_locations=payload.preferred_locations,
            top_k=payload.top_k
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail={"code": "INVALID_INPUT", "message": str(ve)})
    except RuntimeError as re:
        raise HTTPException(status_code=503, detail={"code": "MODEL_UNAVAILABLE", "message": str(re)})
    except Exception as e:
        raise HTTPException(status_code=500, detail={"code": "INTERNAL_ERROR", "message": str(e)})
