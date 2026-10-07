"""
================================================================================
ALTERNATIVE METHOD: SAVE MODEL FROM COLAB & RUN OFFLINE LOCALLY
================================================================================
If you do NOT want to keep Google Colab running all the time, you can save your
trained model in Colab, download it to this folder, and run inference locally.
================================================================================
"""

# ------------------------------------------------------------------------------
# SECTION 1: RUN THIS IN GOOGLE COLAB TO EXPORT YOUR MODEL
# ------------------------------------------------------------------------------
COLAB_EXPORT_SNIPPET = """
# === Option 1: For Scikit-Learn / XGBoost / LightGBM ===
import joblib
joblib.dump(model, 'model.joblib')

from google.colab import files
files.download('model.joblib')


# === Option 2: For PyTorch ===
import torch
torch.save(model.state_dict(), 'model_weights.pt')
# Or entire model:
torch.save(model, 'model_full.pt')

from google.colab import files
files.download('model_weights.pt')


# === Option 3: For Hugging Face Transformers ===
from huggingface_hub import login
login(token="YOUR_HUGGINGFACE_TOKEN")
model.push_to_hub("your-username/your-career-model")
tokenizer.push_to_hub("your-username/your-career-model")


# === Option 4: Save to Google Drive ===
from google.colab import drive
drive.mount('/content/drive')
!cp model.joblib /content/drive/MyDrive/my_models/
"""

# ------------------------------------------------------------------------------
# SECTION 2: RUN THIS LOCALLY IN PYTHON TO LOAD THE DOWNLOADED MODEL
# ------------------------------------------------------------------------------
def load_and_predict_local(model_path: str, input_features):
    """
    Load a downloaded model file locally and run inference.
    """
    import os

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at: {model_path}")

    # For Joblib / Scikit-Learn
    if model_path.endswith(".joblib") or model_path.endswith(".pkl"):
        import joblib
        loaded_model = joblib.load(model_path)
        predictions = loaded_model.predict(input_features)
        return predictions

    # For PyTorch
    elif model_path.endswith(".pt") or model_path.endswith(".pth"):
        import torch
        # Example loading full model or weights:
        loaded_model = torch.load(model_path, map_location="cpu")
        loaded_model.eval()
        with torch.no_grad():
            tensor_input = torch.tensor(input_features).float()
            output = loaded_model(tensor_input)
            return output.numpy()

    else:
        raise ValueError(f"Unsupported model format: {model_path}")


if __name__ == "__main__":
    print("=" * 60)
    print("COLAB MODEL EXPORT & LOCAL IMPORT HELPER")
    print("=" * 60)
    print("\nCopy the snippets above in Google Colab to export your model.")
    print("Place the exported model file into this directory:")
    print("c:\\Users\\subhc\\Downloads\\BFB\\colab_integration\\")
    print("=" * 60)
