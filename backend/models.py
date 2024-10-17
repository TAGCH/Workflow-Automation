import datetime as _dt

import sqlalchemy as _sql
import sqlalchemy.orm as _orm
import passlib.hash as _hash

import database as _database

from database import Base
from sqlalchemy import Column, Integer, String, ARRAY
from passlib.hash import bcrypt


class User(_database.Base):
    __tablename__ = "users"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    email = _sql.Column(_sql.String, unique=True, index=True)
    hashed_password = _sql.Column(_sql.String)

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.hashed_password)

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

#MainWorkflow
class emailWorkflow(Base):
    __tablename__ = 'emailworkflows'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    select_mode = Column(String)
    

# class Workflow(Base):
#     __tablename__ = 'workflows'

#     id = Column(Integer, primary_key=True, index=True)
#     emails = Column(ARRAY(String))
#     title = Column(String)
#     body = Column(String)
