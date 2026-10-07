import re

def extract_experience(text: str) -> float:
    match = re.search(r'(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp)?', text, re.IGNORECASE)
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            return 1.0
    return 0.0

def extract_education(text: str) -> list:
    edu_keywords = ["b.tech", "b.s.", "bachelor", "m.tech", "m.s.", "master", "ph.d", "computer science", "engineering", "degree", "diploma"]
    found = []
    for line in text.split("\n"):
        clean = line.strip()
        if clean and any(k in clean.lower() for k in edu_keywords) and len(clean) < 100:
            if clean not in found:
                found.append(clean)
    return found[:5]

def extract_role(text: str) -> str:
    roles_whitelist = [
        "Data Scientist", "Senior Data Scientist", "Data Analyst", "Senior Data Analyst",
        "Business Intelligence Analyst", "BI Analyst", "Machine Learning Engineer", "ML Engineer",
        "Data Engineer", "Software Engineer", "Business Analyst", "Analytics Engineer"
    ]
    for role in roles_whitelist:
        if re.search(rf'\b{re.escape(role)}\b', text, re.IGNORECASE):
            return role
    return "Data Analyst"
