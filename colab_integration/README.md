# 🚀 Google Colab Model Integration (Push & Get Data)

This folder contains everything you need to connect your model running in **Google Colab** with your local project **without modifying any existing codebase files**.

---

## 📌 Architecture Overview

You have **two main methods** to push data to and get data from your Colab model:

```
[Method 1: Live Cloud API (Recommended for GPU Models)]
Local App / Script ──(HTTP POST data)──► Ngrok Tunnel ──► Google Colab (FastAPI + Model)
Local App / Script ◄──(JSON Predictions)── Ngrok Tunnel ◄── Output from Model

[Method 2: Export Model Weights (Offline)]
Google Colab ──(model.save)──► Download weights (.pt / .joblib) ──► Run offline locally
```

---

## ⚡ Method 1: Live Cloud API (Push & Get Data in Real-Time)

Use this method when your model is trained in Colab and you want to keep Colab's GPU running for inference.

### Step 1: Open Google Colab and Run the Server Script
1. Open your Google Colab notebook where your model is loaded.
2. Add a new code cell at the bottom.
3. Copy and paste the entire code from:
   👉 **[`colab_server_code.py`](colab_server_code.py)**
4. In Step 3 of that script, paste your free [Ngrok Auth Token](https://dashboard.ngrok.com/get-started/your-authtoken) (Sign up free at [ngrok.com](https://ngrok.com) if you haven't already).
5. Click **Run Cell** (▶️).

### Step 2: Copy the Public Ngrok URL
Once the cell runs, it will print:
```text
======================================================================
🚀 YOUR COLAB MODEL IS NOW LIVE AT:
👉 https://a1b2-34-56-78-90.ngrok-free.app
======================================================================
```
Copy that HTTPS URL.

### Step 3: Configure Your Local Endpoint
Open **[`config.py`](config.py)** in this folder and update `COLAB_API_URL`:
```python
COLAB_API_URL = "https://a1b2-34-56-78-90.ngrok-free.app"
```

### Step 4: Test the Connection & Push Data
Run the test script from your terminal:
```bash
python colab_integration/test_connection.py
```
If successful, you will see:
```text
✅ Success! Colab server is online.
✅ Success! Model returned prediction.
🎉 ALL TESTS PASSED! Your local app is fully connected to Colab.
```

---

## 💻 How to Push and Get Data in Your Python Code

Import `ColabModelClient` from `colab_client.py`:

```python
from colab_integration.colab_client import ColabModelClient

# Initialize client (uses URL from config.py)
client = ColabModelClient()

# 1. Push a single record / input data
payload = {
    "text": "Senior Data Scientist with 5 years experience in NLP and PyTorch",
    "skills": ["Python", "PyTorch", "NLP", "SQL"]
}
response = client.push_and_get_data(payload)
print("Model Prediction:", response["prediction"])

# 2. Push a batch of inputs
batch_data = [
    {"role": "Data Analyst", "skills": ["SQL", "Tableau"]},
    {"role": "ML Engineer", "skills": ["Python", "TensorFlow"]}
]
batch_response = client.batch_predict(batch_data)
print("Batch Predictions:", batch_response["results"])
```

---

## 💾 Method 2: Export Model Weights and Run Offline

If you prefer to download the model from Colab and run it on your local machine:

1. In your Colab notebook, save and download the model:
   ```python
   # For Scikit-learn:
   import joblib
   joblib.dump(model, 'model.joblib')
   from google.colab import files
   files.download('model.joblib')

   # For PyTorch:
   import torch
   torch.save(model, 'model_full.pt')
   from google.colab import files
   files.download('model_full.pt')
   ```
2. Place the downloaded `.joblib` or `.pt` file inside the `colab_integration/` directory.
3. Use **[`model_export_import.py`](model_export_import.py)** to load and run predictions locally.

---

## 📁 Files in this Folder

| File | Purpose |
|---|---|
| [`colab_server_code.py`](colab_server_code.py) | Ready-to-run script for Google Colab (FastAPI + Ngrok + your model) |
| [`config.py`](config.py) | Configuration settings (Ngrok URL, timeouts) |
| [`colab_client.py`](colab_client.py) | Python client for pushing data and receiving predictions |
| [`test_connection.py`](test_connection.py) | Quick 3-step verification test script |
| [`model_export_import.py`](model_export_import.py) | Helper script for downloading and loading weights offline |
