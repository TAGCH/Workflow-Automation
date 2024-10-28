import datetime as _dt
from database import Base
from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from passlib.hash import bcrypt

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    workflows = relationship("Workflow", back_populates="owner")

    def verify_password(self, password: str):
        return bcrypt.verify(password, self.hashed_password)

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"

#gmailWorkflow 
class Workflow(Base):
    __tablename__ = 'workflows'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)
    owner_id = Column(String, ForeignKey('users.id'))
    sender_email = Column(String)
    hashed_password = Column(String)
    owner = relationship("User", back_populates="workflows")

# Spreadsheet workflow
class WorkflowImportedData(Base):
    '''Model for spreadsheet workflows.'''
    __tablename__ = 'spreadSheetWorkflows'

    id = Column(Integer, primary_key=True, index=True)
    data = Column(JSON)
    workflow_id = Column(String, ForeignKey('workflows.id'))
    workflow = relationship("Workflow", back_populates="imported_data")
