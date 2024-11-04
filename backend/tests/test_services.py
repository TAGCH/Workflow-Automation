import pytest
import sqlalchemy as sa
from sqlalchemy.orm import sessionmaker
from passlib.hash import bcrypt
from jose import jwt as _jwt

from services import (
    get_user_by_email, create_user, authenticate_user,
    create_token, get_current_user
)
import models as _models
import schemas as _schemas
from database import Base, engine
from dotenv import load_dotenv
import os

load_dotenv()

# Setup a test database
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = sa.create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Set up test environment variables
JWT_SECRET = os.getenv("JWT_SECRET", "myjwtsecret")

# Create a test database session fixture
@pytest.fixture(scope="module")
def db():
    Base.metadata.create_all(bind=engine)  # create the tables
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)  # drop the tables after tests


@pytest.mark.asyncio
async def test_create_user(db):
    """Test creating a new user and checking its properties."""
    user_data = _schemas.UserCreate(email="test@example.com", hashed_password="password123")
    user = await create_user(user=user_data, db=db)  # Keep await here

    assert user.email == "test@example.com"
    assert bcrypt.verify("password123", user.hashed_password)
    assert db.query(_models.User).filter_by(email="test@example.com").first() is not None


@pytest.mark.asyncio
async def test_get_user_by_email(db):
    """Test retrieving a user by email."""
    # Create a user
    user_data = _schemas.UserCreate(email="findme@example.com", hashed_password="password123")
    await create_user(user=user_data, db=db)  # Keep await here

    # Fetch the user by email
    user = await get_user_by_email(email="findme@example.com", db=db)  # Keep await here
    assert user is not None
    assert user.email == "findme@example.com"


@pytest.mark.asyncio
async def test_authenticate_user(db):
    """Test authenticating a user with correct and incorrect passwords."""
    # Create a user
    user_data = _schemas.UserCreate(email="authuser@example.com", hashed_password="password123")
    await create_user(user=user_data, db=db)  # Keep await here

    # Test successful authentication
    authenticated_user = await authenticate_user(email="authuser@example.com", password="password123", db=db)  # Keep await here
    assert authenticated_user is not False

    # Test failed authentication with wrong password
    wrong_password_user = await authenticate_user(email="authuser@example.com", password="wrongpassword", db=db)  # Keep await here
    assert wrong_password_user is False


@pytest.mark.asyncio
async def test_create_token(db):
    """Test creating a JWT token for a user."""
    # Create a user
    user_data = _schemas.UserCreate(email="tokenuser@example.com", hashed_password="password123")
    user = await create_user(user=user_data, db=db)  # Keep await here

    # Generate token
    token_data = await create_token(user=user)  # Keep await here
    assert "access_token" in token_data
    token = token_data["access_token"]

    # Decode and validate the token payload
    payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    assert payload["email"] == "tokenuser@example.com"


@pytest.mark.asyncio
async def test_get_current_user(db):
    """Test retrieving the current user from a JWT token."""
    # Create a user
    user_data = _schemas.UserCreate(email="currentuser@example.com", hashed_password="password123")
    user = await create_user(user=user_data, db=db)  # Keep await here

    # Generate token
    token_data = await create_token(user=user)  # Keep await here
    token = token_data["access_token"]

    # Retrieve the current user using the token
    current_user = await get_current_user(db=db, token=token)  # Keep await here
    assert current_user.email == "currentuser@example.com"
