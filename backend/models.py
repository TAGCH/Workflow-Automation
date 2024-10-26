import datetime as _dt
from database import Base
from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from passlib.hash import bcrypt
from sqlalchemy.orm import relationship

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

class Workflow(Base):
    __tablename__ = 'workflows'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)  # For example, "email" or "google_sheet"
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="workflows")

    def __repr__(self):
        return f"<Workflow(id={self.id}, name={self.name}, type={self.type})>"

# MainWorkflow
class Workflow2(Base):
    __tablename__ = 'workflows2'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    select_mode = Column(String)

# Spreadsheet workflow
class spreadSheetWorkflow(Base):
    '''Model for spreadsheet workflows.'''
    __tablename__ = 'spreadSheetWorkflows'

    id = Column(Integer, primary_key=True, index=True)
    emails = Column(JSON)
    first_name = Column(JSON)
    last_name = Column(JSON)
    tel_number = Column(JSON)
