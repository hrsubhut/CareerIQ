import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.repositories.profile_repository import profile_repo

def test_profile_crud():
    sample = {
        "id": "test_user_1",
        "name": "Alex Mercer",
        "email": "alex@example.com",
        "current_role": "Data Analyst",
        "target_role": "Data Scientist",
        "experience_years": 2.5,
        "location": "Bengaluru",
        "skills": ["Python", "SQL"]
    }
    pid = profile_repo.save(sample)
    assert pid == "test_user_1"
    fetched = profile_repo.get(pid)
    assert fetched is not None
    assert fetched["name"] == "Alex Mercer"
    assert "Python" in fetched["skills"]
    print("[PASS] Profile service CRUD test PASSED.")

if __name__ == "__main__":
    test_profile_crud()
