import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

def test_gateway_app_exists():
    assert app is not None
    assert app.title == "CareerIQ API Gateway"
    print("[PASS] API Gateway initialization test PASSED.")

if __name__ == "__main__":
    test_gateway_app_exists()
