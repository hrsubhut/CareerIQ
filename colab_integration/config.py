import os

# ==============================================================================
# CONFIGURATION FOR CONNECTING TO GOOGLE COLAB MODEL
# ==============================================================================

# When you run 'colab_server_code.py' in Google Colab, pyngrok will print an HTTPS URL
# e.g.: "https://a1b2-34-56-78-90.ngrok-free.app"
# Paste that public URL here:
COLAB_API_URL = os.getenv("COLAB_API_URL", "https://your-ngrok-subdomain.ngrok-free.app").rstrip("/")

# Timeout in seconds for model requests (large models may take a few seconds)
TIMEOUT_SECONDS = int(os.getenv("COLAB_TIMEOUT_SECONDS", "60"))

# Number of retries on network failures
MAX_RETRIES = int(os.getenv("COLAB_MAX_RETRIES", "3"))
