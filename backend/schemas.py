import datetime as _dt
from pydantic import BaseModel, EmailStr
import pydantic as _pydantic
from typing import Optional, List
from typing import Dict, List, Any

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
    owner_id: int
    sender_email: EmailStr
    sender_hashed_password: str
    trigger_time: Optional[str] = None  # Adjust based on your requirements
    trigger_frequency: Optional[str] = None  # Adjust based on your requirements
    trigger_day: Optional[str] = None  # Adjust based on your requirements
    status: bool # E.g., "started", "stopped"

    class Config:
        orm_mode = True

class WorkflowModel(WorkflowBase):
    id: int
    class Config:
        orm_mode = True
        from_attributes = True

class GmailflowBase(BaseModel):
    email: str
    title: str
    body: str
    name: str
    workflow_id : int

class GmailflowModel(GmailflowBase):
    id: int

    # class Config:
    #     orm_mode = True

class WorkflowImportsDataBase(BaseModel):
    data: List[Dict[str, Any]]
    workflow_id: int

class WorkflowImportsDataModel(WorkflowImportsDataBase):
    id: int
