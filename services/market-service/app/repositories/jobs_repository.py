import os
import joblib
import logging
import pandas as pd
from typing import Optional, Dict, Any, List
from app.config.settings import settings

logger = logging.getLogger(__name__)

class JobsRepository:
    _instance: Optional['JobsRepository'] = None
    _artifact: Optional[Dict[str, Any]] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(JobsRepository, cls).__new__(cls)
        return cls._instance

    def load(self) -> bool:
        if self._artifact is not None:
            return True

        model_path = settings.MODEL_PATH
        if not os.path.exists(model_path):
            logger.warning(f"Market model artifact not found at {model_path}")
            return False

        try:
            self._artifact = joblib.load(model_path)
            logger.info("Successfully loaded market intelligence artifact.")
            return True
        except Exception as e:
            logger.error(f"Error loading market artifact: {e}")
            self._artifact = None
            return False

    def is_loaded(self) -> bool:
        return self._artifact is not None

    def get_roles_df(self) -> pd.DataFrame:
        if self._artifact and 'roles' in self._artifact:
            return self._artifact['roles']
        return pd.DataFrame()

    def get_role_skill_df(self) -> pd.DataFrame:
        if self._artifact and 'role_skill' in self._artifact:
            return self._artifact['role_skill']
        return pd.DataFrame()

    def get_locations_df(self) -> pd.DataFrame:
        if self._artifact and 'location_intelligence' in self._artifact:
            return self._artifact['location_intelligence']
        return pd.DataFrame()

    def get_metadata(self) -> Dict[str, Any]:
        return self._artifact.get('metadata', {}) if self._artifact else {}

    def get_skill_aliases(self) -> Dict[str, str]:
        return self._artifact.get('skill_aliases', {}) if self._artifact else {}

jobs_repo = JobsRepository()
