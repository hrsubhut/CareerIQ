import hashlib
import json
import logging
import urllib.request
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

TECH_SKILLS_KEYWORDS = [
    "python", "sql", "machine learning", "deep learning", "aws", "docker",
    "kubernetes", "react", "typescript", "javascript", "node.js", "pytorch",
    "tensorflow", "pandas", "spark", "hadoop", "tableau", "power bi", "azure",
    "gcp", "fastapi", "django", "flask", "java", "c++", "golang", "devops",
    "git", "linux", "ci/cd", "rest api", "graphql", "scikit-learn", "nlp"
]

def generate_job_id(title: str, company: str, source: str) -> str:
    raw = f"{title.lower()}_{company.lower()}_{source.lower()}"
    return hashlib.md5(raw.encode('utf-8')).hexdigest()

def extract_skills_from_text(text: str, tags: List[str] = None) -> List[str]:
    found = set()
    text_lower = text.lower()
    for skill in TECH_SKILLS_KEYWORDS:
        if skill in text_lower:
            found.add(skill.title())
    if tags:
        for t in tags:
            t_clean = t.strip().lower()
            if any(k in t_clean for k in TECH_SKILLS_KEYWORDS):
                found.add(t.strip().title())
            elif len(t) < 20:
                found.add(t.strip().title())
    return sorted(list(found))[:8]

def categorize_role(title: str) -> str:
    t = title.lower()
    if any(k in t for k in ["data science", "data scientist", "scientist", "ai ", "machine learning"]):
        return "Data Scientist"
    elif any(k in t for k in ["data analyst", "bi analyst", "analytics", "business analyst"]):
        return "Data & Business Analyst"
    elif any(k in t for k in ["frontend", "ui", "react", "web"]):
        return "Frontend Developer"
    elif any(k in t for k in ["backend", "python", "node", "java", "api"]):
        return "Backend Developer"
    elif any(k in t for k in ["devops", "cloud", "sre", "infrastructure", "kubernetes"]):
        return "DevOps & Cloud Engineer"
    return "Software Engineer"

def fetch_arbeitnow_jobs() -> List[Dict[str, Any]]:
    jobs = []
    url = "https://www.arbeitnow.com/api/job-board-api"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "CareerIQ-LiveCollector/1.0"}
    )
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode())
            for item in data.get("data", [])[:50]:
                title = item.get("title", "")
                company = item.get("company_name", "Global Tech")
                tags = item.get("tags", [])
                location = item.get("location", "Remote")
                job_url = item.get("url", "#")
                
                skills = extract_skills_from_text(title, tags)
                role_cat = categorize_role(title)
                job_id = generate_job_id(title, company, "Arbeitnow")

                jobs.append({
                    "id": job_id,
                    "title": title,
                    "company": company,
                    "location": location or "Remote",
                    "role_category": role_cat,
                    "skills": skills,
                    "salary_text": "Competitive Market Standard",
                    "url": job_url,
                    "source": "Arbeitnow Live API",
                    "remote_friendly": item.get("remote", True),
                    "posted_at": item.get("created_at")
                })
        logger.info(f"Fetched {len(jobs)} jobs from Arbeitnow.")
    except Exception as e:
        logger.warning(f"Arbeitnow fetch failed: {e}")
    return jobs

def fetch_remoteok_jobs() -> List[Dict[str, Any]]:
    jobs = []
    url = "https://remoteok.com/api"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "CareerIQ-LiveCollector/1.0"}
    )
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode())
            raw_items = [j for j in data if isinstance(j, dict) and "position" in j]
            for item in raw_items[:40]:
                title = item.get("position", "")
                company = item.get("company", "Tech Co")
                tags = item.get("tags", [])
                location = item.get("location", "Remote")
                job_url = item.get("url", "#")
                salary_min = item.get("salary_min")
                salary_max = item.get("salary_max")
                
                salary_text = "Competitive Market Standard"
                if salary_min and salary_max:
                    salary_text = f"${salary_min:,} - ${salary_max:,}"

                skills = extract_skills_from_text(title, tags)
                role_cat = categorize_role(title)
                job_id = generate_job_id(title, company, "RemoteOK")

                jobs.append({
                    "id": job_id,
                    "title": title,
                    "company": company,
                    "location": location or "Remote",
                    "role_category": role_cat,
                    "skills": skills,
                    "salary_text": salary_text,
                    "url": job_url,
                    "source": "RemoteOK Live API",
                    "remote_friendly": True,
                    "posted_at": item.get("date")
                })
        logger.info(f"Fetched {len(jobs)} jobs from RemoteOK.")
    except Exception as e:
        logger.warning(f"RemoteOK fetch failed: {e}")
    return jobs

def collect_all_live_jobs() -> List[Dict[str, Any]]:
    all_jobs = []
    all_jobs.extend(fetch_arbeitnow_jobs())
    all_jobs.extend(fetch_remoteok_jobs())
    logger.info(f"Total live jobs collected: {len(all_jobs)}")
    return all_jobs
