import datetime as _dt
from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Time, Boolean, JSON
from sqlalchemy.orm import relationship, DateTime
from passlib.hash import bcrypt

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)  # Set a max length for the email
    hashed_password = Column(String(128))  # Set a max length for the hashed password
    workflows = relationship("Workflow", back_populates="owner")

    def verify_password(self, password: str):
        return bcrypt.verify(password, self.hashed_password)

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"

# Workflow 
class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)  # Set a max length for the name
    type = Column(String(50))  # e.g., 'gmail' or 'google_sheet'
    owner_id = Column(Integer, ForeignKey('users.id'))
    workflow_data_id = Column(Integer, ForeignKey('workflowData.id'))
    sender_email = Column(String(255))  # Set a max length for the sender email
    sender_hashed_password = Column(String(128))  # Set a max length for the sender hashed password
    trigger_time = Column(Time)  # Time to trigger the workflow
    trigger_frequency = Column(String(50))  # e.g., 'daily', 'weekly', 'monthly'
    trigger_day = Column(String(20))  # e.g., 'Monday' or '15' for day of the month
    status = Column(Boolean, default=False)  # False means stopped, True means started

    # Relationship
    owner = relationship(
        "User",
        back_populates="workflows"
        )
    imported_data = relationship(
        "WorkflowImportedData",
        back_populates="workflow",
        foreign_keys="WorkflowImportedData.workflow_id"
        )

    def __repr__(self):
        return f"<Workflow(id={self.id}, name={self.name}, type={self.type}, owner_id={self.owner_id})>"
    
class Gmailflow(Base):
    __tablename__ = 'gmailflow'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), index=True)
    title = Column(String(255))
    body = Column(String(255))
    name =  Column(String(255))

class EmailLog(Base):
    __tablename__ = 'email_logs_table'

    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(Integer, ForeignKey('workflows.id'), nullable=False)
    sent_at = Column(DateTime, default=_dt.datetime.utcnow)  # Change here
    recipient_email = Column(String(255), nullable=False)  # Set a max length for recipient email
    status = Column(String(50), nullable=False)  # e.g., 'sent', 'failed', etc.
    error_message = Column(String(255), nullable=True)  # Optional error message if failed

    workflow = relationship("Workflow", back_populates="email_logs")

    def __repr__(self):
        return f"<EmailLog(id={self.id}, workflow_id={self.workflow_id}, recipient_email={self.recipient_email}, status={self.status})>"

class WorkflowsImportsData(Base):
    __tablename__ = 'workflows_imports_data'

    id = Column(Integer, primary_key=True, index=True)
    data = Column(JSON)
    workflow_id = Column(Integer, ForeignKey('workflows.id'))

    # Relationship
    workflow = relationship(
        "Workflow",
        back_populates="imported_data",
        foreign_keys=[workflow_id]
    )

    def __repr__(self):
        return f"<WorkflowsImportsData(id={self.id}, workflow_id={self.workflow_id})>"
