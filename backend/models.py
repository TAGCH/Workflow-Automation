import datetime as _dt
from database import Base
from sqlalchemy import Column, Integer, String, JSON
from passlib.hash import bcrypt

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    def verify_password(self, password: str):
        return bcrypt.verify(password, self.hashed_password)

#gmailWorkflow 
class Workflow(Base):
    __tablename__ = 'workflows'

    id = Column(Integer, primary_key=True, index=True)
    # name = Column(String, unique=True)
    email = Column(String, unique=True, index=True)
    title = Column(String)
    body = Column(String)

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

# class Workflow(Base):
#     __tablename__ = 'workflows'

#     id = Column(Integer, primary_key=True, index=True)
#     emails = Column(ARRAY(String))
#     title = Column(String)
#     body = Column(String)
