import os
import sqlite3
import json
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../..", "data", "live_market_jobs.sqlite"))

class LiveJobStore:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS live_jobs (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    company TEXT NOT NULL,
                    location TEXT NOT NULL,
                    role_category TEXT,
                    skills_json TEXT,
                    salary_text TEXT,
                    url TEXT,
                    source TEXT,
                    remote_friendly BOOLEAN DEFAULT 0,
                    posted_at TEXT,
                    ingested_at TEXT
                )
            """)
            conn.commit()

    def insert_jobs(self, jobs: List[Dict[str, Any]]) -> int:
        if not jobs:
            return 0
        new_count = 0
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            for j in jobs:
                skills_str = json.dumps(j.get("skills", []))
                ingested_at = datetime.utcnow().isoformat()
                cursor.execute("""
                    INSERT OR IGNORE INTO live_jobs (
                        id, title, company, location, role_category,
                        skills_json, salary_text, url, source,
                        remote_friendly, posted_at, ingested_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    j.get("id"),
                    j.get("title", ""),
                    j.get("company", ""),
                    j.get("location", "Remote"),
                    j.get("role_category", "Tech / Engineering"),
                    skills_str,
                    j.get("salary_text", "Market Standard"),
                    j.get("url", "#"),
                    j.get("source", "Web Live"),
                    1 if j.get("remote_friendly", True) else 0,
                    j.get("posted_at", ingested_at),
                    ingested_at
                ))
                if cursor.rowcount > 0:
                    new_count += 1
            conn.commit()
        logger.info(f"Inserted {new_count} new live jobs into LiveJobStore.")
        return new_count

    def get_recent_jobs(self, limit: int = 50) -> List[Dict[str, Any]]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM live_jobs
                ORDER BY ingested_at DESC, rowid DESC
                LIMIT ?
            """, (limit,))
            rows = cursor.fetchall()
            results = []
            for r in rows:
                skills = []
                try:
                    skills = json.loads(r["skills_json"]) if r["skills_json"] else []
                except:
                    pass
                results.append({
                    "id": r["id"],
                    "title": r["title"],
                    "company": r["company"],
                    "location": r["location"],
                    "role_category": r["role_category"],
                    "skills": skills,
                    "salary_text": r["salary_text"],
                    "url": r["url"],
                    "source": r["source"],
                    "remote_friendly": bool(r["remote_friendly"]),
                    "posted_at": r["posted_at"],
                    "ingested_at": r["ingested_at"]
                })
            return results

    def get_stats(self) -> Dict[str, Any]:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM live_jobs")
            total = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(DISTINCT company) FROM live_jobs")
            companies = cursor.fetchone()[0]
            return {
                "total_live_jobs": total,
                "unique_companies": companies
            }

live_job_store = LiveJobStore()
