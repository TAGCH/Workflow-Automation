import unittest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.hash import bcrypt
from jose import jwt, JWTError
from models import Base, User, Workflow, Gmailflow, WorkflowsImportsData, EmailLog
import schemas as _schemas  # Update to match your actual imports
from services import create_user, create_token  # Update to match your actual imports
from dotenv import load_dotenv
import os

load_dotenv()

# Update these to match your MySQL database configuration
DATABASE_URL = os.getenv('DATABASE_URL', 'mysql+pymysql://root:@127.0.0.1:3306/workflows')
JWT_SECRET = os.getenv("JWT_SECRET", "myjwtsecret")  # Should match the secret key in your actual JWT configuration

# Set up a test database
engine = create_engine(DATABASE_URL, echo=True)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class TestModels(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Create the database tables."""
        Base.metadata.create_all(bind=engine)

    @classmethod
    def tearDownClass(cls):
        """Drop the database tables."""
        Base.metadata.drop_all(bind=engine)

    def setUp(self):
        """Set up a new database session for each test."""
        self.db = TestingSessionLocal()

    def tearDown(self):
        """Close the database session after each test."""
        self.db.close()

    def test_user_creation(self):
        """Test creating a User and verify password functionality."""
        # Hash the password with bcrypt before saving
        hashed_password = bcrypt.hash("hashedpassword")
        user = User(email="test@example.com", hashed_password=hashed_password)
        self.db.add(user)
        self.db.commit()

        saved_user = self.db.query(User).filter_by(email="test@example.com").first()
        self.assertIsNotNone(saved_user)
        self.assertEqual(saved_user.email, "test@example.com")
        self.assertTrue(bcrypt.verify("hashedpassword", saved_user.hashed_password))

    def test_workflow_creation(self):
        """Test creating a Workflow."""
        user = User(email="workflowuser@example.com", hashed_password=bcrypt.hash("password123"))
        self.db.add(user)
        self.db.commit()

        workflow = Workflow(name="Test Workflow", type="email", owner_id=user.id)
        self.db.add(workflow)
        self.db.commit()

        saved_workflow = self.db.query(Workflow).filter_by(name="Test Workflow").first()
        self.assertIsNotNone(saved_workflow)
        self.assertEqual(saved_workflow.owner_id, user.id)

    def test_workflow_import_data(self):
        """Test creating WorkflowsImportsData and verifying its linkage to Workflow."""
        user = User(email="importuser@example.com", hashed_password=bcrypt.hash("password123"))
        self.db.add(user)
        self.db.commit()

        workflow = Workflow(name="Import Workflow", type="google_sheet", owner_id=user.id)
        self.db.add(workflow)
        self.db.commit()

        import_data = WorkflowsImportsData(data={"key": "value"}, workflow_id=workflow.id, filename="data.xlsx")
        self.db.add(import_data)
        self.db.commit()

        saved_import_data = self.db.query(WorkflowsImportsData).filter_by(workflow_id=workflow.id).first()
        self.assertIsNotNone(saved_import_data)
        self.assertEqual(saved_import_data.data, {"key": "value"})
        self.assertEqual(saved_import_data.filename, "data.xlsx")

    def test_gmailflow_creation(self):
        """Test creating a Gmailflow associated with a Workflow."""
        user = User(email="gmailuser@example.com", hashed_password=bcrypt.hash("password123"))
        self.db.add(user)
        self.db.commit()

        workflow = Workflow(name="Gmail Workflow", type="gmail", owner_id=user.id)
        self.db.add(workflow)
        self.db.commit()

        gmailflow = Gmailflow(recipient_email="recipient@example.com", title="Test Email", body="This is a test email", name="Test Name", workflow_id=workflow.id)
        self.db.add(gmailflow)
        self.db.commit()

        saved_gmailflow = self.db.query(Gmailflow).filter_by(workflow_id=workflow.id).first()
        self.assertIsNotNone(saved_gmailflow)
        self.assertEqual(saved_gmailflow.email, "recipient@example.com")
        self.assertEqual(saved_gmailflow.title, "Test Email")

    def test_email_log_creation(self):
        """Test creating an EmailLog entry for a Workflow."""
        user = User(email="loguser@example.com", hashed_password=bcrypt.hash("password123"))
        self.db.add(user)
        self.db.commit()

        workflow = Workflow(name="Log Workflow", type="email", owner_id=user.id)
        self.db.add(workflow)
        self.db.commit()

        email_log = EmailLog(workflow_id=workflow.id, recipient_email="recipient@example.com", status="sent", error_message=None)
        self.db.add(email_log)
        self.db.commit()

        saved_email_log = self.db.query(EmailLog).filter_by(workflow_id=workflow.id).first()
        self.assertIsNotNone(saved_email_log)
        self.assertEqual(saved_email_log.recipient_email, "recipient@example.com")
        self.assertEqual(saved_email_log.status, "sent")

    async def test_create_token(self):
        """Test creating a JWT token for a user."""
        # Create a user
        user_data = _schemas.UserCreate(email="tokenuser@example.com", hashed_password="password123")
        user = await create_user(user=user_data, db=self.db)

        # Generate token
        token_data = await create_token(user=user)
        self.assertIn("access_token", token_data)
        token = token_data["access_token"]

        # Decode and validate the token payload
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            self.assertEqual(payload["email"], "tokenuser@example.com")
            self.assertEqual(payload["id"], user.id)
        except JWTError:
            self.fail("Token verification failed")


if __name__ == "__main__":
    unittest.main()
