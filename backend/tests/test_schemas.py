import unittest
from datetime import datetime
from pydantic import ValidationError
from schemas import (
    UserCreate, User,
    WorkflowBase, WorkflowModel,
    GmailflowBase, GmailflowModel,
    WorkflowImportsDataBase, WorkflowImportsDataModel
)


class TestSchemas(unittest.TestCase):

    def test_user_create_schema(self):
        """Test that UserCreate schema accepts valid data and rejects invalid data."""
        valid_data = {
            "email": "testuser@example.com",
            "hashed_password": "hashedpassword123"
        }
        user = UserCreate(**valid_data)
        self.assertEqual(user.email, "testuser@example.com")
        self.assertEqual(user.hashed_password, "hashedpassword123")

        invalid_data = {"email": "invalid-email", "hashed_password": "hashedpassword123"}
        with self.assertRaises(ValidationError):
            UserCreate(**invalid_data)

    def test_user_schema(self):
        """Test that User schema works with valid data."""
        valid_data = {"id": 1, "email": "user@example.com"}
        user = User(**valid_data)
        self.assertEqual(user.id, 1)
        self.assertEqual(user.email, "user@example.com")

    def test_workflow_base_schema(self):
        """Test that WorkflowBase schema accepts valid data and rejects invalid data."""
        valid_data = {
            "name": "Test Workflow",
            "type": "gmail",
            "owner_id": 1,
            "sender_email": "sender@example.com",
            "sender_hashed_password": "hashedpassword123",
            "trigger_time": datetime.now(),
            "trigger_frequency": "daily",
            "trigger_day": "Monday",
            "status": True
        }
        workflow = WorkflowBase(**valid_data)
        self.assertEqual(workflow.name, "Test Workflow")
        self.assertEqual(workflow.type, "gmail")
        self.assertTrue(workflow.status)

        invalid_data = {
            "name": "Test Workflow",
            "type": "gmail",
            "owner_id": 1,
            "sender_email": "invalid-email",
            "sender_hashed_password": "hashedpassword123",
            "status": True
        }
        with self.assertRaises(ValidationError):
            WorkflowBase(**invalid_data)

    def test_workflow_model_schema(self):
        """Test that WorkflowModel schema accepts valid data."""
        valid_data = {
            "id": 1,
            "name": "Test Workflow",
            "type": "gmail",
            "owner_id": 1,
            "sender_email": "sender@example.com",
            "sender_hashed_password": "hashedpassword123",
            "trigger_time": datetime.now(),
            "trigger_frequency": "daily",
            "trigger_day": "Monday",
            "status": True
        }
        workflow_model = WorkflowModel(**valid_data)
        self.assertEqual(workflow_model.id, 1)
        self.assertEqual(workflow_model.name, "Test Workflow")

    def test_gmailflow_base_schema(self):
        """Test that GmailflowBase schema accepts valid data and rejects invalid data."""
        valid_data = {
            "email": "recipient@example.com",
            "title": "Test Email",
            "body": "This is a test email body",
            "name": "Test Gmail Flow",
            "workflow_id": 1
        }
        gmailflow = GmailflowBase(**valid_data)
        self.assertEqual(gmailflow.email, "recipient@example.com")
        self.assertEqual(gmailflow.title, "Test Email")

        invalid_data = {
            "email": "invalid-email",
            "title": "Test Email",
            "body": "This is a test email body",
            "name": "Test Gmail Flow",
            "workflow_id": 1
        }
        with self.assertRaises(ValidationError):
            GmailflowBase(**invalid_data)

    def test_gmailflow_model_schema(self):
        """Test that GmailflowModel schema accepts valid data."""
        valid_data = {
            "id": 1,
            "email": "recipient@example.com",
            "title": "Test Email",
            "body": "This is a test email body",
            "name": "Test Gmail Flow",
            "workflow_id": 1
        }
        gmailflow_model = GmailflowModel(**valid_data)
        self.assertEqual(gmailflow_model.id, 1)
        self.assertEqual(gmailflow_model.name, "Test Gmail Flow")

    def test_workflow_imports_data_base_schema(self):
        """Test that WorkflowImportsDataBase schema accepts valid data and rejects invalid data."""
        valid_data = {
            "data": [{"key": "value"}],
            "workflow_id": 1,
            "filename": "data_file.json"
        }
        imports_data = WorkflowImportsDataBase(**valid_data)
        self.assertEqual(imports_data.data, [{"key": "value"}])
        self.assertEqual(imports_data.workflow_id, 1)
        self.assertEqual(imports_data.filename, "data_file.json")

        invalid_data = {
            "data": "invalid_data_type",  # Invalid data format, should be a list of dictionaries
            "workflow_id": 1,
            "filename": "data_file.json"
        }
        with self.assertRaises(ValidationError):
            WorkflowImportsDataBase(**invalid_data)

    def test_workflow_imports_data_model_schema(self):
        """Test that WorkflowImportsDataModel schema accepts valid data."""
        valid_data = {
            "id": 1,
            "data": [{"key": "value"}],
            "workflow_id": 1,
            "filename": "data_file.json"
        }
        imports_data_model = WorkflowImportsDataModel(**valid_data)
        self.assertEqual(imports_data_model.id, 1)
        self.assertEqual(imports_data_model.workflow_id, 1)
        self.assertEqual(imports_data_model.filename, "data_file.json")


if __name__ == '__main__':
    unittest.main()
