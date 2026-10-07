import logging
from typing import Dict, Any
from app.model.loader import salary_loader
from app.preprocessing.transformer import build_salary_features
from app.preprocessing.validator import validate_salary_input
from app.config.settings import settings

logger = logging.getLogger(__name__)

class SalaryPredictor:
    @staticmethod
    def predict(
        job_title: str,
        experience_years: float,
        location: str = "Bengaluru",
        job_type: str = "Full Time",
        role_family: str = None
    ) -> Dict[str, Any]:
        valid, msg = validate_salary_input(job_title, experience_years)
        if not valid:
            raise ValueError(msg)

        model = salary_loader.get_model()
        if model is None:
            raise RuntimeError("Salary prediction model artifact is not loaded.")

        # Transform to model feature representation
        features_df = build_salary_features(
            job_title=job_title,
            experience_years=experience_years,
            location=location,
            job_type=job_type,
            role_family=role_family
        )

        try:
            raw_prediction = model.predict(features_df)
            pred_lakhs = float(raw_prediction[0])
            pred_lakhs = max(2.5, round(pred_lakhs, 2))  # Realistic lower baseline
            pred_rupees = round(pred_lakhs * 100000, 2)

            return {
                "predicted_salary": pred_rupees,
                "predicted_salary_lakhs": pred_lakhs,
                "currency": "INR",
                "formatted_salary": f"₹{pred_lakhs:.1f} Lakhs / year",
                "model": {
                    "name": settings.MODEL_NAME,
                    "version": settings.MODEL_VERSION,
                    "algorithm": "RandomForestRegressor with ColumnTransformer"
                },
                "explainability": {
                    "features_used": features_df.to_dict(orient="records")[0],
                    "method": "Real trained RandomForest Pipeline with OneHot and StandardScaling"
                }
            }
        except Exception as e:
            logger.error(f"Inference execution failed: {e}")
            raise RuntimeError(f"Prediction failed: {str(e)}")
