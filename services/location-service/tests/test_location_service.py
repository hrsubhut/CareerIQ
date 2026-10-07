import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.model.loader import location_loader
from app.model.predictor import LocationPredictor

def test_location_model_loading():
    loaded = location_loader.load()
    assert loaded is True, "Location model artifact failed to load!"
    assert location_loader.is_loaded() is True
    print("[PASS] Location model loading test PASSED.")

def test_location_recommendation_real_inference():
    res = LocationPredictor.recommend(
        job_title="Data Scientist",
        skills=["Python", "SQL", "Machine Learning"],
        experience_years=3.0,
        top_k=3
    )
    assert res is not None
    assert "recommendations" in res
    assert len(res["recommendations"]) == 3
    for r in res["recommendations"]:
        assert "location" in r
        assert "score" in r
        assert 0.0 <= r["score"] <= 1.0
    top_loc = res["recommendations"][0]
    print(f"[PASS] Location recommendation test PASSED. Top: {top_loc['location']} (score: {top_loc['score']})")

if __name__ == "__main__":
    test_location_model_loading()
    test_location_recommendation_real_inference()
