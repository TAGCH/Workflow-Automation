import unittest
from sqlalchemy import inspect
from database import create_database, drop_database, engine, Base
from models import User, Workflow, EmailLog  # Import all models to register them

class TestDatabase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Ensure tables are dropped before starting tests."""
        print("Dropping existing tables...")
        drop_database()
        print("Existing tables dropped.")

    def setUp(self):
        """Set up the test environment by creating tables."""
        print("Creating tables...")
        create_database()
        print("Tables created.")

    def tearDown(self):
        """Clean up the test environment by dropping tables."""
        print("Dropping tables...")
        drop_database()
        print("Tables dropped.")

    def test_create_database(self):
        """Test if tables are created successfully."""
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Tables found after creation: {tables}")
        self.assertTrue(len(tables) > 0, "Tables should be created in the database")

    def test_drop_database(self):
        """Test if tables are dropped successfully."""
        print("Testing drop_database...")
        drop_database()
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Tables found after drop: {tables}")
        self.assertEqual(len(tables), 0, "All tables should be dropped from the database")


if __name__ == '__main__':
    unittest.main()
