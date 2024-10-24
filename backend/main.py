from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
import fastapi as _fastapi
import fastapi.security as _security
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from typing import Annotated, List
#email
from fastapi import BackgroundTasks, FastAPI
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr
from starlette.responses import JSONResponse
# import openpyxl

import sqlalchemy.orm as _orm

import services as _services
import schemas as _schemas

app = _fastapi.FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Allow all headers (Content-Type, Authorization, etc.)
)

class WorkflowBase(BaseModel):
    email: str
    title: str
    body: str

class WorkflowModel(WorkflowBase):
    id: int

    # class Config:
    #     orm_mode = True
    
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

@app.post("/api/users")
async def create_user(user: _schemas.UserCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    db_user = await _services.get_user_by_email(user.email, db)
    if db_user:
        raise _fastapi.HTTPException(status_code=400, detail="Email already in use")

    user = await _services.create_user(user, db)
    token_response = await _services.create_token(user)
    print("Token Response:", token_response)

    return token_response


@app.post("/api/token")
async def generate_token(form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(), db: _orm.Session = _fastapi.Depends(_services.get_db)):
    try:
        user = await _services.authenticate_user(form_data.username, form_data.password, db)
        if not user:
            raise _fastapi.HTTPException(status_code=401, detail="Invalid Credentials")

        return await _services.create_token(user)
    except Exception as e:
        raise _fastapi.HTTPException(status_code=500, detail=str(e))


@app.get("/api/users/me", response_model=_schemas.User)
async def get_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user



@app.get("/api")
async def root():
    return {"message": "Awesome Leads Manager"}

@app.post("/api/login")
async def login(username: str, password: str):
    # Placeholder for actual authentication logic
    return {"username": username, "status": "logged in"}

@app.get("/workflow/", response_model=List[WorkflowModel])
async def read_workflows(db: db_dependency, skip: int=0, limit: int=100):
    workflows = db.query(models.Workflow).offset(skip).limit(limit).all()
    return workflows

@app.post("/workflow/", response_model=WorkflowModel)
async def create_workflow(workflow: WorkflowBase, db: db_dependency):
    db_workflow = models.Workflow(**workflow.model_dump())
    db.add(db_workflow)
    db.commit()
    db.refresh(db_workflow)
    return db_workflow


@app.post("/workflow/import")
async def import_workflow( db: db_dependency, file: UploadFile = File()):
    '''Using pandas to read excel file and return dict of data.'''

    df = pd.read_excel(file.file)
    spreadsheet_workflow = models.spreadSheetWorkflow(
        emails=df['email'].to_list(),
        first_name=df['first'].to_list(),
        last_name=df['last'].to_list(),
        tel_number=df['tel'].to_list()
    )
    db.add(spreadsheet_workflow)
    db.commit()
    db.refresh(spreadsheet_workflow)
    return spreadsheet_workflow

# class EmailSchema(BaseModel):
#     email: List[EmailStr]


# conf = ConnectionConfig(
#     MAIL_USERNAME ="username",
#     MAIL_PASSWORD = "**********",
#     MAIL_FROM = "test@email.com",
#     MAIL_PORT = 465,
#     MAIL_SERVER = "mail server",
#     MAIL_STARTTLS = False,
#     MAIL_SSL_TLS = True,
#     USE_CREDENTIALS = True,
#     VALIDATE_CERTS = True
# )

# app = FastAPI()


# html = """
# <p>Thanks for using Fastapi-mail</p>
# """


# @app.post("/email")
# async def simple_send(email: EmailSchema) -> JSONResponse:

#     message = MessageSchema(
#         subject="Fastapi-Mail module",
#         recipients=email.dict().get("email"),
#         body=html,
#         subtype=MessageType.html)

#     fm = FastMail(conf)
#     await fm.send_message(message)
#     return JSONResponse(status_code=200, content={"message": "email has been sent"})

