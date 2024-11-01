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

# Workflow 
class Workflow(Base):
    __tablename__ = 'workflows'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)
    owner_id = Column(String, ForeignKey('users.id'))
    workflow_data_id = Column(Integer, ForeignKey('workflowData.id'))
    sender_email = Column(String)
    hashed_password = Column(String)

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

# Imported data
class WorkflowImportedData(Base):
    '''Model for workflow datas.'''
    __tablename__ = 'workflowData'

    id = Column(Integer, primary_key=True, index=True)
    data = Column(JSON)
    workflow_id = Column(Integer, ForeignKey('workflows.id'))

    # Relationship
    workflow = relationship(
        "Workflow",
        back_populates="imported_data",
        foreign_keys=[workflow_id]
    )
