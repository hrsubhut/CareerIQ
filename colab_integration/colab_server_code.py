# ==============================================================================
# COPY AND PASTE THIS ENTIRE SCRIPT INTO A SINGLE GOOGLE COLAB CELL AND RUN IT
# ==============================================================================
# 
# What this script does:
# 1. Installs FastAPI, Uvicorn, Nest-Asyncio, and PyNgrok in Colab.
# 2. Creates a REST API server around your trained model.
# 3. Creates an ngrok secure tunnel giving you a public HTTPS URL.
# 4. Lets your local app push data to your Colab model and receive predictions back!
# ==============================================================================

# Step 1: Install required dependencies in Colab
!pip install -q fastapi uvicorn pyngrok nest_asyncio pydantic

import nest_asyncio
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, List, Optional
import threading
from pyngrok import ngrok

# Apply nest_asyncio so Uvicorn can run inside Colab's Jupyter event loop
nest_asyncio.apply()

# Initialize FastAPI application
app = FastAPI(title="Colab Model Inference API")

# Allow requests from your local machine / frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------------------
# STEP 2: LOAD OR DEFINE YOUR MODEL HERE
# ------------------------------------------------------------------------------
# Example for PyTorch, TensorFlow, HuggingFace, or Scikit-Learn:
#
# # PyTorch Example:
# # import torch
# # model = torch.load("your_model.pt", map_location="cuda" if torch.cuda.is_available() else "cpu")
# # model.eval()
#
# # Hugging Face Example:
# # from transformers import pipeline
# # pipe = pipeline("text-classification", model="your-model-name", device=0)
#
# # Scikit-Learn Example:
# # import joblib
# # model = joblib.load("your_model.pkl")
# ------------------------------------------------------------------------------

class PredictRequest(BaseModel):
    data: Any
    params: Optional[Dict[str, Any]] = None

class BatchPredictRequest(BaseModel):
    items: List[Any]
    params: Optional[Dict[str, Any]] = None

@app.get("/")
def home():
    return {
        "status": "online",
        "message": "Colab Model API is live and ready to receive requests!"
    }

@app.get("/health")
def health():
    return {"status": "ok", "gpu_available": True}

@app.post("/predict")
def predict(request: PredictRequest):
    """
    Push input data to the model and return prediction results.
    Customize the inference logic inside this function for your specific model.
    """
    try:
        input_data = request.data
        
        # ----------------------------------------------------------------------
        # TODO: Replace this placeholder with your actual model inference logic:
        #
        # Example:
        # prediction = model.predict(input_data)
        # return {"status": "success", "prediction": prediction.tolist()}
        # ----------------------------------------------------------------------
        
        # Dummy response demonstrating data round-trip:
        result = {
            "status": "success",
            "received_input": input_data,
            "prediction": f"Model processed input: {str(input_data)[:100]}",
            "confidence": 0.96
        }
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/batch_predict")
def batch_predict(request: BatchPredictRequest):
    """Process a batch of inputs and return predictions for each."""
    try:
        results = []
        for item in request.items:
            # Replace with model batch prediction
            results.append({
                "input": item,
                "prediction": f"Processed: {str(item)[:50]}"
            })
        return {"status": "success", "count": len(results), "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ------------------------------------------------------------------------------
# STEP 3: CONFIGURE NGROK & RUN SERVER
# ------------------------------------------------------------------------------
# 1. Sign up for free at https://dashboard.ngrok.com/signup (takes 30 seconds)
# 2. Get your Auth Token from https://dashboard.ngrok.com/get-started/your-authtoken
# 3. Paste it below:
NGROK_AUTH_TOKEN = "PASTE_YOUR_NGROK_AUTH_TOKEN_HERE"

if NGROK_AUTH_TOKEN != "PASTE_YOUR_NGROK_AUTH_TOKEN_HERE":
    ngrok.set_auth_token(NGROK_AUTH_TOKEN)
else:
    print("WARNING: Please set your NGROK_AUTH_TOKEN above to keep the tunnel open.")

# Terminate any existing tunnels
ngrok.kill()

# Open an HTTP tunnel on port 8000
public_url = ngrok.connect(8000).public_url
print("\n" + "="*70)
print(f"🚀 YOUR COLAB MODEL IS NOW LIVE AT:")
print(f"👉 {public_url}")
print("="*70)
print(f"Copy this URL into 'colab_integration/config.py' on your local project!")
print("="*70 + "\n")

# Run FastAPI server
uvicorn.run(app, host="0.0.0.0", port=8000)
