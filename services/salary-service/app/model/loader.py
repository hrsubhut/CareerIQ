import os
import joblib
import logging
from typing import Optional, Any
import sklearn.compose._column_transformer
from sklearn.impute import SimpleImputer
from app.config.settings import settings

logger = logging.getLogger(__name__)

# --- Compatibility Shims for unpickling sklearn 1.6.1 in 1.9+ ---
if not hasattr(sklearn.compose._column_transformer, '_RemainderColsList'):
    class _RemainderColsList(list):
        pass
    sklearn.compose._column_transformer._RemainderColsList = _RemainderColsList

orig_imputer_transform = SimpleImputer.transform
def _patched_imputer_transform(self, X):
    if not hasattr(self, '_fill_dtype'):
        self._fill_dtype = getattr(self, '_fit_dtype', None)
    return orig_imputer_transform(self, X)
SimpleImputer.transform = _patched_imputer_transform
# -----------------------------------------------------------------

class SalaryModelLoader:
    _instance: Optional['SalaryModelLoader'] = None
    _model: Optional[Any] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SalaryModelLoader, cls).__new__(cls)
        return cls._instance

    def load(self) -> bool:
        if self._model is not None:
            return True

        model_path = settings.MODEL_PATH
        if not os.path.exists(model_path):
            logger.warning(f"Salary model artifact not found at {model_path}")
            return False

        try:
            loaded_obj = joblib.load(model_path)
            
            # Ensure nested SimpleImputer instances have _fill_dtype
            if hasattr(loaded_obj, 'named_steps') and 'preprocessor' in loaded_obj.named_steps:
                preproc = loaded_obj.named_steps['preprocessor']
                if hasattr(preproc, 'transformers'):
                    for item in preproc.transformers:
                        if len(item) == 3:
                            name, trans, cols = item
                            if hasattr(trans, 'named_steps'):
                                for s_name, s_obj in trans.named_steps.items():
                                    if isinstance(s_obj, SimpleImputer) and not hasattr(s_obj, '_fill_dtype'):
                                        s_obj._fill_dtype = getattr(s_obj, '_fit_dtype', None)

            self._model = loaded_obj
            logger.info(f"Successfully loaded salary model from {model_path}")
            return True
        except Exception as e:
            logger.error(f"Failed to load salary model artifact: {e}")
            self._model = None
            return False

    def is_loaded(self) -> bool:
        return self._model is not None

    def get_model(self) -> Optional[Any]:
        if self._model is None:
            self.load()
        return self._model

salary_loader = SalaryModelLoader()
