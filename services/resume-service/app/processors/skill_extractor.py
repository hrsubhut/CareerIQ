import re
from typing import List, Dict, Any

CANONICAL_SKILLS = {
    "python": "Python",
    "python3": "Python",
    "py": "Python",
    "sql": "SQL",
    "postgresql": "SQL",
    "mysql": "SQL",
    "sqlite": "SQL",
    "snowflake": "SQL",
    "machine learning": "Machine Learning",
    "ml": "Machine Learning",
    "scikit-learn": "Machine Learning",
    "sklearn": "Machine Learning",
    "deep learning": "Deep Learning",
    "pytorch": "Deep Learning",
    "tensorflow": "Deep Learning",
    "keras": "Deep Learning",
    "statistics": "Statistics",
    "excel": "Excel",
    "advanced excel": "Excel",
    "power bi": "Power BI",
    "powerbi": "Power BI",
    "tableau": "Tableau",
    "data visualization": "Data Visualization",
    "pandas": "Pandas",
    "numpy": "NumPy",
    "big data": "Big Data",
    "spark": "Big Data",
    "pyspark": "Big Data",
    "git": "Git",
    "github": "Git",
    "fastapi": "FastAPI",
    "docker": "Docker",
    "aws": "AWS",
    "azure": "Azure",
    "gcp": "GCP",
    "r": "R",
    "nlp": "Natural Language Processing",
    "natural language processing": "Natural Language Processing",
    "data mining": "Data Mining",
    "business analysis": "Business Analysis",
    "communicaton": "Communication",
    "problem solving": "Problem Solving"
}

def extract_skills(text: str) -> List[str]:
    lower_text = text.lower()
    found = set()
    for token, canonical in CANONICAL_SKILLS.items():
        pattern = rf'\b{re.escape(token)}\b'
        if re.search(pattern, lower_text):
            found.add(canonical)
    return sorted(list(found))
