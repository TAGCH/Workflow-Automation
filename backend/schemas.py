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
        
class UpdateflowStatusBase(BaseModel):
    status: bool # E.g., "started", "stopped"
    class Config:
        orm_mode = True
        
# class UpdateflowModel(UpdateflowStatusBase):
#     pass

class WorkflowBase(BaseModel):
    name: str
    type: str
    owner_id: int
    sender_email: EmailStr
    sender_hashed_password: str
    status: bool # E.g., "started", "stopped"

    class Config:
        orm_mode = True

class WorkflowModel(WorkflowBase):
    id: int
    class Config:
        orm_mode = True
        from_attributes = True

class GmailflowBase(BaseModel):
    recipient_email: str
    title: str
    body: str
    name: str
    workflow_id: int

class GmailflowModel(GmailflowBase):
    id: int

    # class Config:
    #     orm_mode = True

class TimestampBase(BaseModel):
    workflow_id: int
    trigger_time: datetime

    @field_validator('trigger_time')
    def convert_to_timezone(cls, v):
        if isinstance(v, datetime):
            # Convert to Bangkok time zone (or any other time zone)
            return v.astimezone(ZoneInfo("Asia/Bangkok"))
        return v

class TimestampModel(BaseModel):
    id: int
    trigger_time: datetime

class UpdateTimestampBase(BaseModel):
    trigger_time: datetime
    class Config:
        orm_mode = True

class WorkflowImportsDataBase(BaseModel):
    data: List[Dict[str, Any]]
    workflow_id: int
    filename: str

class WorkflowImportsDataModel(WorkflowImportsDataBase):
    id: int
