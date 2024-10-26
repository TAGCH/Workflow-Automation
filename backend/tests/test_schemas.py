import pytest
from schemas import UserCreate

def test_user_create_schema_valid():
    data = {"email": "test@example.com", "hashed_password": "password123"}
    user = UserCreate(**data)
    assert user.email == "test@example.com"
    assert user.hashed_password == "password123"

def test_user_create_schema_invalid_email():
    with pytest.raises(ValueError):
        UserCreate(email="invalid-email", hashed_password="password123")
