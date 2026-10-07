"""
CareerIQ Master End-to-End Microservice & Model Integration Test Suite
"""
import sys
import os

root_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

def run_tests():
    print("=" * 70)
    print("  RUNNING CAREERIQ MASTER MODEL & SERVICE INTEGRATION TESTS")
    print("=" * 70)

    # 1. Salary Service Test
    print("\n[1/5] Testing Salary Service & Real Model...")
    sal_dir = os.path.join(root_dir, "services", "salary-service")
    sys.path.insert(0, sal_dir)
    from app.model.loader import salary_loader
    from app.model.predictor import SalaryPredictor
    
    assert salary_loader.load() is True, "Salary model failed to load"
    sal_res = SalaryPredictor.predict("Data Scientist", 3.0, "Bengaluru")
    assert sal_res["predicted_salary_lakhs"] > 0
    print(f"  [PASS] Salary Model: Predicted INR {sal_res['predicted_salary_lakhs']} Lakhs/year")
    sys.path.remove(sal_dir)
    for m in list(sys.modules.keys()):
        if m == 'app' or m.startswith('app.'):
            del sys.modules[m]

    # 2. Location Service Test
    print("\n[2/5] Testing Location Service & Real XGBoost Model...")
    loc_dir = os.path.join(root_dir, "services", "location-service")
    sys.path.insert(0, loc_dir)
    from app.model.loader import location_loader
    from app.model.predictor import LocationPredictor
    
    assert location_loader.load() is True, "Location model failed to load"
    loc_res = LocationPredictor.recommend("Data Scientist", ["Python", "SQL", "Machine Learning"], 3.0, top_k=3)
    assert len(loc_res["recommendations"]) == 3
    top_city = loc_res["recommendations"][0]["location"]
    top_score = loc_res["recommendations"][0]["score"]
    print(f"  [PASS] Location Model: Top Recommended City = {top_city} (Score: {top_score})")
    sys.path.remove(loc_dir)
    for m in list(sys.modules.keys()):
        if m == 'app' or m.startswith('app.'):
            del sys.modules[m]

    # 3. Market Service Test
    print("\n[3/5] Testing Market Service & Analytics Engine...")
    market_dir = os.path.join(root_dir, "services", "market-service")
    sys.path.insert(0, market_dir)
    from app.repositories.jobs_repository import jobs_repo
    from app.analytics.demand import get_role_demand_analytics
    from app.analytics.skills import compute_skill_gap
    
    assert jobs_repo.load() is True, "Market artifact failed to load"
    roles = get_role_demand_analytics()
    assert len(roles) > 0
    gap = compute_skill_gap("Data Scientist", ["Python", "SQL"])
    assert "matched_skills" in gap and "missing_critical_skills" in gap
    print(f"  [PASS] Market Engine: Analyzed {len(roles)} roles. Matched: {gap['matched_skills']}, Gaps: {gap['missing_critical_skills'][:3]}")
    sys.path.remove(market_dir)
    for m in list(sys.modules.keys()):
        if m == 'app' or m.startswith('app.'):
            del sys.modules[m]

    # 4. Resume Service Test
    print("\n[4/5] Testing Resume Parsing Engine...")
    resume_dir = os.path.join(root_dir, "services", "resume-service")
    sys.path.insert(0, resume_dir)
    from app.processors.skill_extractor import extract_skills
    from app.processors.experience_extractor import extract_experience
    
    skills = extract_skills("Python, SQL, PyTorch, Docker, Machine Learning")
    exp = extract_experience("4 years of experience as ML Engineer")
    assert "Python" in skills and "Machine Learning" in skills
    assert exp == 4.0
    print(f"  [PASS] Resume Service: Extracted {len(skills)} skills, {exp} years exp.")
    sys.path.remove(resume_dir)
    for m in list(sys.modules.keys()):
        if m == 'app' or m.startswith('app.'):
            del sys.modules[m]

    # 5. Profile Service Test
    print("\n[5/5] Testing Profile Persistence Service...")
    profile_dir = os.path.join(root_dir, "services", "profile-service")
    sys.path.insert(0, profile_dir)
    from app.repositories.profile_repository import profile_repo
    pid = profile_repo.save({"id": "master_test_user", "name": "Test User", "skills": ["Python"]})
    fetched = profile_repo.get(pid)
    assert fetched["name"] == "Test User"
    print(f"  [PASS] Profile Service: Successfully persisted and retrieved candidate profile.")
    sys.path.remove(profile_dir)
    for m in list(sys.modules.keys()):
        if m == 'app' or m.startswith('app.'):
            del sys.modules[m]

    print("\n" + "=" * 70)
    print("  ALL 5 MICROSERVICES & REAL TRAINED ML MODELS ARE VERIFIED & PASSING!")
    print("=" * 70 + "\n")

if __name__ == "__main__":
    run_tests()
