import logging
from typing import List, Dict, Any, Optional
from app.model.loader import location_loader
from app.preprocessing.validator import validate_location_input
from app.preprocessing.transformer import prepare_location_query, prepare_experience_bounds
from app.ranking.ranker import LocationRanker
from app.config.settings import settings

logger = logging.getLogger(__name__)

class LocationPredictor:
    @staticmethod
    def recommend(
        job_title: str,
        skills: List[str] = None,
        experience_years: float = 0.0,
        preferred_locations: List[str] = None,
        top_k: int = 5
    ) -> Dict[str, Any]:
        valid, msg = validate_location_input(job_title, experience_years)
        if not valid:
            raise ValueError(msg)

        artifact = location_loader.get_artifact()
        if artifact is None:
            raise RuntimeError("Location recommendation model artifact is not loaded.")

        model = artifact['model']
        tfidf = artifact['tfidf']
        loc_enc = artifact['location_encoder']
        scaler = artifact['scaler']
        locations = artifact['locations']
        location_priors = artifact.get('location_prior', {})

        query_text = prepare_location_query(job_title, skills or [])
        exp_min, exp_max = prepare_experience_bounds(experience_years)

        recommendations = LocationRanker.rank(
            model=model,
            tfidf=tfidf,
            loc_enc=loc_enc,
            scaler=scaler,
            locations=locations,
            location_priors=location_priors,
            query_text=query_text,
            exp_min=exp_min,
            exp_max=exp_max,
            preferred_locations=preferred_locations,
            top_k=top_k
        )

        return {
            "recommendations": recommendations,
            "model": {
                "name": settings.MODEL_NAME,
                "version": settings.MODEL_VERSION,
                "algorithm": "XGBoost Classifier + TFIDF + OneHotEncoder"
            }
        }
