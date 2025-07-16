import os

if __name__ == "__main__":
    os.system("uvicorn mainswipe:app --host 0.0.0.0 --port 8002 --reload")
