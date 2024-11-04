import unittest
from sqlalchemy import inspect
from database import create_database, drop_database, engine, Base

class TestDatabase(unittest.TestCase):

    def setUp(self):
        """Set up the test environment by creating tables."""
        create_database()

    def tearDown(self):
        """Clean up the test environment by dropping tables."""
        drop_database()

    def test_create_database(self):
        """Test if tables are created successfully."""
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        self.assertTrue(len(tables) > 0, "Tables should be created in the database")

    def test_drop_database(self):
        """Test if tables are dropped successfully."""
        drop_database()
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        self.assertEqual(len(tables), 0, "All tables should be dropped from the database")

if __name__ == '__main__':
    unittest.main()