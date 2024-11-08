from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, BackgroundTasks
import fastapi as _fastapi
import fastapi.security as _security
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from typing import Annotated, List
import io, json

#email
from fastapi import BackgroundTasks
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr
from starlette.responses import JSONResponse

# import openpyxl

import sqlalchemy.orm as _orm

import services as _services
import schemas as _schemas
from schemas import *
import os

MAIL_USERNAME = os.getenv("EMAIL")
MAIL_PASSWORD = os.getenv("PASS")
DATABASE_URL = os.getenv("DATABASE_URL")

#dotenv
from dotenv import dotenv_values

#credentials
credentials = dotenv_values("../.env")

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Allow all headers (Content-Type, Authorization, etc.)
)

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


@app.get("/workflow/{flow_id}/", response_model=List[WorkflowModel])
async def read_workflows(flow_id: int, db: db_dependency, skip: int=0, limit: int=100):
    workflows = db.query(models.Workflow).filter(models.Workflow.id == flow_id).offset(skip).limit(limit).all()
    print(f'get flow with id {flow_id}')
    return workflows

@app.get("/workflows/", response_model=List[WorkflowModel])
async def read_workflows(db: db_dependency, skip: int=0, limit: int=100):
    workflows = db.query(models.Workflow).offset(skip).limit(limit).all()
    return workflows

@app.post("/workflows/", response_model=WorkflowModel)
async def read_workflows(workflow: WorkflowBase, db: db_dependency, skip: int=0, limit: int=100):
    workflow = models.Workflow(**workflow.model_dump())
    db.add(workflow)
    db.commit()
    db.refresh(workflow)
    return workflow

@app.post("/workflow/{flow_id}/create")
async def create_workflow(flow_id: int, workflow: WorkflowModel, db: db_dependency):
    # Fetch flow by id
    db_workflow = models.Workflow(name=workflow.name, type=workflow.type, owner_id=flow_id,  sender_email=MAIL_USERNAME, sender_hashed_password=MAIL_PASSWORD)
    print(db_workflow)
    db.add(db_workflow)
    db.commit()
    db.refresh(db_workflow)
    print('workflow created and save to database')
    return db_workflow


@app.post("/gmailflow/{flow_id}/", response_model=GmailflowModel)
async def send_email(flow_id: int, workflow: GmailflowBase, db: db_dependency):
    print('arrive at email entry')
    print(type(workflow))
    print(workflow)

    try:
        # Create the message to send
        message = MessageSchema(
            subject=workflow.title,
            recipients=[workflow.email],
            body=workflow.body,
            subtype=MessageType.html
        )

        fm = FastMail(conf)
        await fm.send_message(message)
        print('Mail sent.')

        # Create a new Gmailflow entry to save in the database
        new_gmailflow = models.Gmailflow(
            email=workflow.email,
            title=workflow.title,
            body=workflow.body,
            name=workflow.name,
            workflow_id=flow_id
        )

        # Save the new entry to the database
        db.add(new_gmailflow)
        db.commit()
        db.refresh(new_gmailflow)

        # Return the newly created GmailflowModel
        return GmailflowModel(
            id=new_gmailflow.id,
            email=new_gmailflow.email,
            title=new_gmailflow.title,
            body=new_gmailflow.body,
            name=new_gmailflow.name,
            workflow_id=new_gmailflow.workflow_id
        )
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/workflow/{flow_id}/import/", response_model=List[WorkflowImportsDataModel])
async def read_flow_sheets( db: db_dependency, skip: int=0, limit: int=100):
    sheets = db.query(models.WorkflowsImportsData).offset(skip).limit(limit).all()
    return sheets


@app.post("/workflow/{flow_id}/import/")
async def import_workflow(flow_id : int, db: db_dependency, file: UploadFile = File()):
    """Using pandas to read excel file and return dict of data."""
    contents = await file.read()
    df = pd.read_excel(io.BytesIO(contents))
    data = df.to_json(orient="records")
    json_data = json.loads(data)

    workflow_data = models.WorkflowsImportsData(
        data = json_data,
        workflow_id = flow_id,
        filename = file.filename
    )

    db.add(workflow_data)
    db.commit()
    db.refresh(workflow_data)
    return workflow_data

# New endpoint to fetch the latest imported file's metadata for a workflow
@app.get("/workflow/{flow_id}/file-metadata")
async def get_workflow_file_metadata(flow_id: int, db: db_dependency):
    """Fetch metadata of the latest imported file for a given workflow."""
    latest_file = db.query(models.WorkflowsImportsData).filter(models.WorkflowsImportsData.workflow_id == flow_id).first()
    if not latest_file:
        raise HTTPException(status_code=404, detail="No imported files found for this workflow.")

    # Return only metadata, like file name
    return {"filename": latest_file.filename}

conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_FROM=MAIL_USERNAME,
    MAIL_PORT = 465,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_STARTTLS = False,
    MAIL_SSL_TLS = True,
    USE_CREDENTIALS = True,
)
