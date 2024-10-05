from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
