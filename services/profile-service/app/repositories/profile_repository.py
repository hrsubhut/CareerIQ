import sqlite3
import json
from typing import Optional, Dict, Any, List
from app.config.settings import settings

class ProfileRepository:
    def __init__(self, db_path: str = settings.DB_PATH):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS profiles (
                    id TEXT PRIMARY KEY,
                    name TEXT,
                    email TEXT,
                    current_role TEXT,
                    target_role TEXT,
                    experience_years REAL,
                    location TEXT,
                    skills_json TEXT,
                    education_json TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()

    def save(self, profile_data: Dict[str, Any]) -> str:
        pid = profile_data.get("id") or f"usr_{int(__import__('time').time() * 1000)}"
        skills_str = json.dumps(profile_data.get("skills", []))
        edu_str = json.dumps(profile_data.get("education", []))

        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                INSERT OR REPLACE INTO profiles 
                (id, name, email, current_role, target_role, experience_years, location, skills_json, education_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                pid,
                profile_data.get("name"),
                profile_data.get("email"),
                profile_data.get("current_role"),
                profile_data.get("target_role"),
                float(profile_data.get("experience_years", 0.0)),
                profile_data.get("location"),
                skills_str,
                edu_str
            ))
            conn.commit()
        return pid

    def get(self, profile_id: str) -> Optional[Dict[str, Any]]:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, email, current_role, target_role, experience_years, location, skills_json, education_json FROM profiles WHERE id = ?", (profile_id,))
            row = cursor.fetchone()
            if not row:
                return None
            return {
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "current_role": row[3],
                "target_role": row[4],
                "experience_years": row[5],
                "location": row[6],
                "skills": json.loads(row[7]) if row[7] else [],
                "education": json.loads(row[8]) if row[8] else []
            }

profile_repo = ProfileRepository()
