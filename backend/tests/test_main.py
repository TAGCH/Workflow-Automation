import os
import pytest
from fastapi.testclient import TestClient
from main import app  # Correct import statement to reflect the path
from database import Base
from services import get_db  # Import get_db function
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Set environment variables for the test
os.environ["EMAIL"] = "test@example.com"
os.environ["PASS"] = "testpassword"
os.environ["JWT_SECRET"] = "mysecretkey"
os.environ["DATABASE_URL"] = "sqlite:///./test_database.db"

# Set up a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_database.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the test database
def setup_module(module):
    Base.metadata.create_all(bind=engine)

def teardown_module(module):
    Base.metadata.drop_all(bind=engine)

# Dependency override for test
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Override the app's dependency for the test
app.dependency_overrides[get_db] = override_get_db

# Create a test client
client = TestClient(app)

def test_read_root():
    response = client.get("/api")
    assert response.status_code == 200
    assert response.json() == {"message": "Awesome Leads Manager"}

def test_create_user():
    response = client.post("/api/users", json={
        "email": "test@example.com",
        "hashed_password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_create_user_duplicate_email():
    # Try to create a user with the same email again
    response = client.post("/api/users", json={
        "email": "test@example.com",
        "hashed_password": "password123"
    })
    assert response.status_code == 400
    assert response.json() == {"detail": "Email already in use"}

def test_generate_token():
    # Generate a token for the created user
    response = client.post("/api/token", data={
        "username": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_get_current_user():
    # First create a user and get the token
    response = client.post("/api/users", json={
        "email": "user@example.com",
        "hashed_password": "password123"
    })
    assert response.status_code == 200
    token = response.json()["access_token"]

    # Now get the current user
    response = client.get("/api/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "user@example.com"

# Clean up the database after all tests
@pytest.fixture(scope='module', autouse=True)
def clean_db():
    yield  # Run tests
    teardown_module(None)  # Clean up
