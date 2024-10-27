import pytest
from sqlalchemy.orm import Session
from fastapi.testclient import TestClient
from database import SessionLocal, create_database, drop_database
import models as _models
import schemas as _schemas
import services as _services
import main  # Make sure this is the name of your FastAPI app module
import uuid  # Import uuid for generating unique emails

# Set up a test database session for testing
@pytest.fixture(scope='function')  # Change from 'module' to 'function'
def test_db():
    create_database()  # Create the database tables
    db = SessionLocal()
    yield db
    db.close()
    drop_database()  # Drop the database after tests

# Test for user creation and authentication
@pytest.mark.asyncio
async def test_create_and_authenticate_user(test_db: Session):
    unique_email = f"test-{uuid.uuid4()}@example.com"  # Generate a unique email
    user_data = _schemas.UserCreate(email=unique_email, hashed_password="password123")
    created_user = await _services.create_user(user_data, test_db)

    assert created_user.id is not None
    assert created_user.email == user_data.email

    # Authenticate the user
    authenticated_user = await _services.authenticate_user(unique_email, "password123", test_db)
    assert authenticated_user is not False
    assert authenticated_user.email == user_data.email

    # Attempt to authenticate with incorrect password
    authenticated_user_invalid = await _services.authenticate_user(unique_email, "wrongpassword", test_db)
    assert authenticated_user_invalid is False

# Test for JWT token creation
@pytest.mark.asyncio
async def test_create_token(test_db: Session):
    unique_email = f"token_test-{uuid.uuid4()}@example.com"  # Generate a unique email
    user_data = _schemas.UserCreate(email=unique_email, hashed_password="password123")
    created_user = await _services.create_user(user_data, test_db)

    token_response = await _services.create_token(created_user)
    assert "access_token" in token_response
    assert token_response["token_type"] == "bearer"

# Test for retrieving the current user from the token
@pytest.mark.asyncio
async def test_get_current_user(test_db: Session):
    unique_email = f"current_user-{uuid.uuid4()}@example.com"  # Generate a unique email
    user_data = _schemas.UserCreate(email=unique_email, hashed_password="password123")
    created_user = await _services.create_user(user_data, test_db)

    token_response = await _services.create_token(created_user)
    token = token_response["access_token"]

    # Simulate getting the current user
    current_user = await _services.get_current_user(db=test_db, token=token)
    assert current_user.email == created_user.email
    assert current_user.id == created_user.id

# Test for user password verification
@pytest.mark.asyncio
async def test_verify_password(test_db: Session):
    unique_email = f"verify_password-{uuid.uuid4()}@example.com"  # Generate a unique email
    user_data = _schemas.UserCreate(email=unique_email, hashed_password="password123")
    created_user = await _services.create_user(user_data, test_db)

    assert created_user.verify_password("password123") is True
    assert created_user.verify_password("wrongpassword") is False

# Test for creating workflows
@pytest.mark.asyncio
async def test_create_workflow(test_db: Session):
    workflow_data = _models.Workflow(email="workflow_test@example.com", title="Test Workflow", body="Workflow body")
    test_db.add(workflow_data)
    test_db.commit()
    test_db.refresh(workflow_data)

    assert workflow_data.id is not None
    assert workflow_data.title == "Test Workflow"

# Test for creating spreadsheet workflows
@pytest.mark.asyncio
async def test_create_spreadsheet_workflow(test_db: Session):
    spreadsheet_workflow_data = _models.spreadSheetWorkflow(
        emails=["spreadsheet_test@example.com"],
        first_name=["Test"],
        last_name=["User"],
        tel_number=["123456789"]
    )
    test_db.add(spreadsheet_workflow_data)
    test_db.commit()
    test_db.refresh(spreadsheet_workflow_data)

    assert spreadsheet_workflow_data.id is not None
    assert spreadsheet_workflow_data.emails == ["spreadsheet_test@example.com"]
