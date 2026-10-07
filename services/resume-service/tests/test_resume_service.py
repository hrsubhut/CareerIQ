import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.processors.skill_extractor import extract_skills
from app.processors.experience_extractor import extract_experience, extract_role

def test_extractors():
    sample_text = """
    Jane Doe
    Senior Data Scientist with 4.5 years of experience in Bengaluru.
    Email: jane.doe@example.com
    Skills: Proficient in Python, SQL, Machine Learning, Deep Learning, Docker and FastAPI.
    Education: B.Tech Computer Science Engineering
    """
    skills = extract_skills(sample_text)
    assert "Python" in skills
    assert "SQL" in skills
    assert "Machine Learning" in skills

    exp = extract_experience(sample_text)
    assert exp == 4.5

    role = extract_role(sample_text)
    assert role == "Data Scientist" or "Scientist" in role

    print(f"[PASS] Resume processors test PASSED: skills={skills}, exp={exp}, role={role}")

if __name__ == "__main__":
    test_extractors()
