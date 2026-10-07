import os
import joblib
import logging
from typing import Optional, Dict, Any
from app.config.settings import settings

logger = logging.getLogger(__name__)

class LocationModelLoader:
    _instance: Optional['LocationModelLoader'] = None
    _artifact: Optional[Dict[str, Any]] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LocationModelLoader, cls).__new__(cls)
        return cls._instance

    def load(self) -> bool:
        if self._artifact is not None:
            return True

        model_path = settings.MODEL_PATH
        if not os.path.exists(model_path):
            logger.warning(f"Location model artifact not found at {model_path}")
            return False

        try:
            loaded_obj = joblib.load(model_path)
            if not isinstance(loaded_obj, dict):
                logger.error("Loaded location artifact is not a dictionary.")
                return False

            required_keys = ['model', 'tfidf', 'location_encoder', 'scaler', 'locations']
            for k in required_keys:
                if k not in loaded_obj:
                    logger.error(f"Missing required key '{k}' in location model artifact.")
                    return False

            self._artifact = loaded_obj
            logger.info(f"Successfully loaded location model artifact from {model_path}")
            return True
        except Exception as e:
            logger.error(f"Failed loading location model: {e}")
            self._artifact = None
            return False

    def is_loaded(self) -> bool:
        return self._artifact is not None

    def get_artifact(self) -> Optional[Dict[str, Any]]:
        if self._artifact is None:
            self.load()
        return self._artifact

location_loader = LocationModelLoader()
