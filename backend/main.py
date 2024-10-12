from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/data")
async def get_data():
    return {"message": "Hello from the backend!"}


@app.post("/api/login")
async def login(username: str, password: str):
    # Placeholder for actual authentication logic
    return {"username": username, "status": "logged in"}

@app.post("/import-workflow")
async def import_workflow(file: UploadFile = File()):
    # Read content of the file with pandas
    df = pd.read_excel(file.file)

    print(df.to_csv)

    return {"workflow_data": df.to_csv()}
