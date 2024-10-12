from database import Base
from sqlalchemy import Column, Integer, String, Boolean, Float
from passlib.hash import bcrypt

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
def verify_password(self, password: str):
        return bcrypt.verify(password, self.hashed_password)
    
class Workflow(Base):
    __tablename__ = 'workflows'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    title = Column(String)
    body = Column(String)