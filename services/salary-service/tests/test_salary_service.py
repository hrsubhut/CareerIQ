import os
import sys

# Ensure salary service root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.model.loader import salary_loader
from app.model.predictor import SalaryPredictor

def test_salary_model_loading():
    loaded = salary_loader.load()
    assert loaded is True, "Salary model artifact failed to load!"
    assert salary_loader.is_loaded() is True
    print("[PASS] Salary model loading test PASSED.")

def test_salary_prediction_real_inference():
    res = SalaryPredictor.predict(
        job_title="Data Scientist",
        experience_years=3.0,
        location="Bengaluru"
    )
    assert res is not None
    assert "predicted_salary" in res
    assert res["predicted_salary_lakhs"] > 0
    assert res["currency"] == "INR"
    print(f"[PASS] Salary prediction test PASSED: INR {res['predicted_salary_lakhs']} Lakhs/yr (raw: {res['predicted_salary']})")

if __name__ == "__main__":
    test_salary_model_loading()
    test_salary_prediction_real_inference()
