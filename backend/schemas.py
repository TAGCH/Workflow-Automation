# schemas.py

from pydantic import BaseModel, EmailStr
import pydantic as _pydantic

class _UserBase(_pydantic.BaseModel):
    email: EmailStr

class UserCreate(_UserBase):
    email: EmailStr
    hashed_password: str

    class Config:
        orm_mode = True

class User(_UserBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True

class WorkflowBase(BaseModel):
    name: str
    type: str

class WorkflowCreate(BaseModel):
    name: str
    type: str
    details: dict

class Workflow(WorkflowBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True
