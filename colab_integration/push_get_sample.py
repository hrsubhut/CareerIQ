"""
Push data to your Colab Model 1 and get results back.
"""
from colab_client import ColabModelClient
from config import COLAB_API_URL

def main():
    print("Connecting to Colab Model at:", COLAB_API_URL)
    client = ColabModelClient()

    # 1. Prepare your input data to push (can be text, skills, resume dict, numbers, etc.)
    my_input_data = {
        "text": "Software engineer with 4 years of Python and React experience",
        "skills": ["Python", "React", "Docker", "FastAPI"],
        "experience_years": 4
    }

    print("\n[>>] Pushing data to Colab Model 1...")
    
    # 2. Push data to Colab and get response back
    response = client.push_and_get_data(my_input_data)
    
    print("\n[<<] Received data from Colab Model 1:")
    print(response)

if __name__ == "__main__":
    main()
