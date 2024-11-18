import datetime as _dt
from pydantic import BaseModel, EmailStr, field_validator
import pydantic as _pydantic
from typing import Optional, List
from typing import Dict, List, Any
from datetime import datetime
from zoneinfo import ZoneInfo

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
        
class UpdateflowBase(BaseModel):
    trigger_time: datetime  # Adjust based on your requirements
    trigger_frequency: Optional[str] = None  # Adjust based on your requirements
    trigger_day: Optional[str] = None  # Adjust based on your requirements
    status: bool # E.g., "started", "stopped"
    
    @field_validator('trigger_time')
    def convert_to_timezone(cls, v):
        if isinstance(v, datetime):
            # Convert to New York time zone (or any other time zone)
            return v.astimezone(ZoneInfo("Asia/Bangkok"))
        return v

    class Config:
        orm_mode = True
        
class UpdateflowModel(UpdateflowBase):
    id : int

class WorkflowBase(BaseModel):
    name: str
    type: str
    owner_id: int
    sender_email: EmailStr
    sender_hashed_password: str
    trigger_time: Optional[datetime] = None # Adjust based on your requirements
    trigger_frequency: Optional[str] = None  # Adjust based on your requirements
    trigger_day: Optional[str] = None  # Adjust based on your requirements
    status: bool # E.g., "started", "stopped"
    
    @field_validator('trigger_time')
    def convert_to_timezone(cls, v):
        if isinstance(v, datetime):
            # Convert to Bangkok time zone (or any other time zone)
            return v.astimezone(ZoneInfo("Asia/Bangkok"))
        return v

    class Config:
        orm_mode = True

class WorkflowModel(WorkflowBase):
    id: int
    class Config:
        orm_mode = True
        from_attributes = True

class GmailflowBase(BaseModel):
    recipient_email: EmailStr
    title: str
    body: str
    name: str
    workflow_id: int

class GmailflowModel(GmailflowBase):
    id: int

    # class Config:
    #     orm_mode = True

class WorkflowImportsDataBase(BaseModel):
    data: List[Dict[str, Any]]
    workflow_id: int
    filename: str

class WorkflowImportsDataModel(WorkflowImportsDataBase):
    id: int
