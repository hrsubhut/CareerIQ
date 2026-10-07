import logging
from typing import List, Dict, Any
import scipy.sparse as sp
import numpy as np

logger = logging.getLogger(__name__)

class LocationRanker:
    @staticmethod
    def rank(
        model: Any,
        tfidf: Any,
        loc_enc: Any,
        scaler: Any,
        locations: List[str],
        location_priors: Dict[str, float],
        query_text: str,
        exp_min: float,
        exp_max: float,
        preferred_locations: List[str] = None,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        # Vectorize text query
        text_vec = tfidf.transform([query_text])
        # Scale numeric experience bounds
        num_vec = scaler.transform([[exp_min, exp_max]])

        pref_set = set(p.strip().lower() for p in (preferred_locations or []))

        results = []
        for loc in locations:
            loc_str = str(loc).strip().lower()
            try:
                loc_vec = loc_enc.transform([[loc_str]])
            except Exception:
                continue

            # Concatenate exactly as model was trained: [tfidf, location_ohe, numeric_scaled]
            feats = sp.hstack([text_vec, loc_vec, num_vec])

            # Predict probability of class 1 (match)
            probs = model.predict_proba(feats)[0]
            prob_match = float(probs[1]) if len(probs) > 1 else float(probs[0])

            prior = float(location_priors.get(loc_str, 0.0))

            # Bonus if candidate preferred this location
            boost = 0.05 if loc_str in pref_set else 0.0
            final_score = min(1.0, round(prob_match + boost, 4))

            demand_desc = "High Demand" if final_score >= 0.8 else "Moderate Demand" if final_score >= 0.6 else "Emerging"

            results.append({
                "location": loc_str.title(),
                "score": final_score,
                "relative_demand": demand_desc,
                "market_share_prior": round(prior, 4)
            })

        # Sort by score descending
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]
