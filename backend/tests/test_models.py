import unittest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.hash import bcrypt
from jose import jwt, JWTError
from models import Base, User, Workflow  # Update to match your actual imports
import schemas as _schemas  # Update to match your actual imports
from services import create_user, create_token  # Update to match your actual imports

# Update these to match your MySQL database configuration
DATABASE_URL = "mysql+pymysql://root:@127.0.0.1:3307/workflows"
JWT_SECRET = "testjwtsecret"  # Should match the secret key in your actual JWT configuration

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

        # Use bcrypt to verify the password
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
