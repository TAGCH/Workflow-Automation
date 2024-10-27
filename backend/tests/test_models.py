import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User, Workflow, Workflow2, spreadSheetWorkflow, Base
from passlib.hash import bcrypt

# Database setup for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_database.db"  # Use a separate test database
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope='function')
def test_db():
    # Create the database tables for testing
    Base.metadata.create_all(bind=engine)  # Create tables

    db = SessionLocal()
    yield db

    db.close()
    Base.metadata.drop_all(bind=engine)  # Drop tables after tests to clean up

def test_user_verify_password(test_db):
    # Create a user with a hashed password
    hashed_password = bcrypt.hash("testpassword")
    user = User(email="test@example.com", hashed_password=hashed_password)
    test_db.add(user)
    test_db.commit()

    # Verify the password
    assert user.verify_password("testpassword") is True
    assert user.verify_password("wrongpassword") is False

def test_user_repr(test_db):
    user = User(email="test_repr@example.com", hashed_password=bcrypt.hash("testpassword"))
    test_db.add(user)
    test_db.commit()

    # Check the repr method (you may need to implement this in your User model)
    assert repr(user) == f"<User(id={user.id}, email={user.email})>"

def test_workflow_creation(test_db):
    # Test creation of a new workflow
    workflow = Workflow(email="workflow@example.com", title="My Workflow", body="This is a test workflow.")
    test_db.add(workflow)
    test_db.commit()

    # Ensure the workflow is created successfully
    assert workflow.id is not None
    assert workflow.email == "workflow@example.com"
    assert workflow.title == "My Workflow"

def test_workflow2_creation(test_db):
    # Test creation of a new Workflow2
    workflow2 = Workflow2(name="Workflow 2 Name", select_mode="Mode A")
    test_db.add(workflow2)
    test_db.commit()

    # Ensure the workflow2 is created successfully
    assert workflow2.id is not None
    assert workflow2.name == "Workflow 2 Name"

def test_spreadsheet_workflow_creation(test_db):
    # Test creation of a new spreadsheet workflow
    spreadsheet_workflow = spreadSheetWorkflow(
        emails=["test1@example.com", "test2@example.com"],
        first_name=["John", "Jane"],
        last_name=["Doe", "Smith"],
        tel_number=["1234567890", "0987654321"]
    )
    test_db.add(spreadsheet_workflow)
    test_db.commit()

    # Ensure the spreadsheet workflow is created successfully
    assert spreadsheet_workflow.id is not None
    assert len(spreadsheet_workflow.emails) == 2
    assert spreadsheet_workflow.first_name[0] == "John"
