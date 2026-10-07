import json
import urllib.request
import urllib.error
from typing import Any, Dict, List, Optional
try:
    from config import COLAB_API_URL, TIMEOUT_SECONDS
except ImportError:
    from colab_integration.config import COLAB_API_URL, TIMEOUT_SECONDS

class ColabModelClient:
    """
    Client for pushing data to and receiving predictions from
    a model running inside a Google Colab notebook via Ngrok.
    """

    def __init__(self, base_url: Optional[str] = None, timeout: int = TIMEOUT_SECONDS):
        self.base_url = (base_url or COLAB_API_URL).rstrip("/")
        self.timeout = timeout

    def _post(self, endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        payload = json.dumps(data).encode("utf-8")
        
        req = urllib.request.Request(
            url,
            data=payload,
            headers={
                "Content-Type": "application/json",
                # ngrok-free skip browser warning header:
                "ngrok-skip-browser-warning": "69420",
                "User-Agent": "CareerIQ-Colab-Client/1.0"
            },
            method="POST"
        )

        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as response:
                resp_body = response.read().decode("utf-8")
                return json.loads(resp_body)
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode("utf-8", errors="ignore")
            raise RuntimeError(f"Colab HTTP Error {e.code}: {err_msg}")
        except urllib.error.URLError as e:
            raise ConnectionError(
                f"Failed to reach Colab at '{self.base_url}'. "
                f"Make sure your Colab notebook is running and the Ngrok URL is updated! Error: {e}"
            )

    def _get(self, endpoint: str) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        req = urllib.request.Request(
            url,
            headers={
                "ngrok-skip-browser-warning": "69420",
                "User-Agent": "CareerIQ-Colab-Client/1.0"
            },
            method="GET"
        )
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as response:
                resp_body = response.read().decode("utf-8")
                return json.loads(resp_body)
        except Exception as e:
            raise ConnectionError(f"Colab GET check failed at '{url}': {e}")

    def check_health(self) -> Dict[str, Any]:
        """Check if the Colab model API is online."""
        return self._get("/health")

    def push_and_get_data(self, input_data: Any, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Push input data to the Colab model and receive predictions back.
        
        Args:
            input_data: The data to send (text, dict, list, numerical array, etc.)
            params: Optional hyperparameters or flags
            
        Returns:
            Dict containing the prediction response from Colab
        """
        payload = {"data": input_data, "params": params or {}}
        return self._post("/predict", payload)

    def batch_predict(self, items: List[Any], params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Push a batch of items to Colab and get batch predictions."""
        payload = {"items": items, "params": params or {}}
        return self._post("/batch_predict", payload)


# Quick interactive CLI test
if __name__ == "__main__":
    import sys

    print("=" * 60)
    print("Colab Model Bridge - Push & Fetch Client")
    print(f"Target URL: {COLAB_API_URL}")
    print("=" * 60)

    client = ColabModelClient()

    if "your-ngrok-subdomain" in COLAB_API_URL:
        print("\n[!] Please update 'COLAB_API_URL' in colab_integration/config.py with your real ngrok URL first!")
        sys.exit(1)

    print("\n1. Checking Colab server health...")
    try:
        health = client.check_health()
        print(f"   [SUCCESS] Server responded: {health}")
    except Exception as ex:
        print(f"   [ERROR] Could not connect: {ex}")
        sys.exit(1)

    print("\n2. Pushing test data to Colab model...")
    test_sample = {
        "text": "Machine Learning Engineer with 3 years Python and PyTorch experience",
        "skills": ["Python", "PyTorch", "FastAPI"]
    }
    
    try:
        result = client.push_and_get_data(test_sample)
        print(f"   [SUCCESS] Received output from Colab model:")
        print(json.dumps(result, indent=2))
    except Exception as ex:
        print(f"   [ERROR] Failed to push data: {ex}")
