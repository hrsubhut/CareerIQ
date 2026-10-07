import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.repositories.jobs_repository import jobs_repo
from app.analytics.demand import get_role_demand_analytics
from app.analytics.skills import compute_skill_gap

def test_market_repo_loading():
    loaded = jobs_repo.load()
    assert loaded is True, "Market repository failed to load artifact!"
    assert jobs_repo.is_loaded() is True
    print("[PASS] Market repository loading test PASSED.")

def test_market_analytics():
    roles = get_role_demand_analytics()
    assert len(roles) > 0, "No roles loaded from dataset!"
    top_role = roles[0]
    assert top_role["postings"] > 0
    print(f"[PASS] Market analytics test PASSED. Top role: {top_role['display_role']} ({top_role['postings']} postings)")

def test_skill_gap():
    gap = compute_skill_gap("Data Scientist", ["Python", "SQL"])
    assert "matched_skills" in gap
    assert "missing_critical_skills" in gap
    assert "match_percentage" in gap
    print(f"[PASS] Skill gap test PASSED: matched {gap['matched_skills']}, missing {gap['missing_critical_skills'][:3]}")

if __name__ == "__main__":
    test_market_repo_loading()
    test_market_analytics()
    test_skill_gap()
