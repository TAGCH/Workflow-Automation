from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
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
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime, timedelta
from sqlalchemy.sql import func
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

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

scheduler = AsyncIOScheduler()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://workflow-automation-app.netlify.app", "http://localhost:3000", ],
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


@app.get("/workflow/{flow_id}/", response_model=WorkflowModel)
async def read_workflow(flow_id: int, db: db_dependency, user: User = _fastapi.Depends(_services.get_current_user)):
    workflow = db.query(models.Workflow).filter(models.Workflow.id == flow_id).first()
    return workflow

@app.get("/workflows/", response_model=List[WorkflowModel])
async def read_workflows(
    db: db_dependency,
    skip: int=0,
    limit: int=100,
    user: User = _fastapi.Depends(_services.get_current_user)):
    
    workflows = db.query(models.Workflow).filter(models.Workflow.owner_id == user.id).offset(skip).limit(limit).all()
    return workflows

@app.post("/workflows/", response_model=WorkflowModel)
async def create_workflows(workflow: WorkflowBase, db: db_dependency, skip: int=0, limit: int=100):
    workflow = models.Workflow(**workflow.model_dump())
    db.add(workflow)
    db.commit()
    db.refresh(workflow)
    print('workflow created and save to database')
    return workflow

@app.put("/workflows/{flow_id}/", response_model=WorkflowModel)
async def update_workflow(flow_id: int, updatedflow: UpdateflowStatusBase, db: db_dependency):
    # Fetch the existing workflow from the database
    db_workflow = db.query(models.Workflow).filter(models.Workflow.id == flow_id).first()

    # If the workflow is not found, raise a 404 error
    if not db_workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")

    # Update the fields of the existing workflow
    for key, value in updatedflow.dict(exclude_unset=True).items():
        setattr(db_workflow, key, value)

    # Commit the changes to the database
    db.commit()
    db.refresh(db_workflow)

    # Return the updated workflow
    return db_workflow

@app.delete("/workflows/{workflow_id}", response_model=WorkflowModel)
async def delete_workflow(workflow_id: int, db: db_dependency):
    workflow = db.query(models.Workflow).filter(models.Workflow.id == workflow_id).first()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    db.delete(workflow)
    db.commit()
    return workflow

@app.get("/timestamps/{workflow_id}", response_model=List[TimestampModel])
async def read_timestamps(workflow_id: int, db: db_dependency, skip: int=0, limit: int=100):
    timestamps = db.query(models.Timestamp).filter(models.Timestamp.workflow_id == workflow_id).offset(skip).limit(limit).all()
    seen_times = set()
    duplicates = []
    unique_timestamps = []

    for timestamp in timestamps:
        if timestamp.trigger_time in seen_times:
            duplicates.append(timestamp)
        else:
            seen_times.add(timestamp.trigger_time)
            unique_timestamps.append(timestamp)

    # Remove duplicates from the database
    for duplicate in duplicates:
        try:
            db.delete(duplicate)
        except IntegrityError:
            db.rollback()  # Ensure the transaction stays valid
            raise HTTPException(
                status_code=500,
                detail="Error deleting duplicate timestamp."
            )

    # Commit the deletions to the database
    db.commit()

    return unique_timestamps

@app.post("/timestamps/", response_model=TimestampModel)
async def create_timestamp(timestampbase: TimestampBase, db: db_dependency):
    try:
        # Create a new Gmailflow entry to save in the database
        timestampmodel = models.Timestamp(**timestampbase.model_dump())

        # Save the new entry to the database
        db.add(timestampmodel)
        db.commit()
        db.refresh(timestampmodel)

        # Return the newly created GmailflowModel
        return timestampmodel
    
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/timestamp/{timestamp_id}", response_model=TimestampModel)
async def delete_timestamp(timestamp_id: int, db: db_dependency):
    timestamp = db.query(models.Timestamp).filter(models.Timestamp.id == timestamp_id).first()
    if not timestamp:
        raise HTTPException(status_code=404, detail="Timestamp not found")
    db.delete(timestamp)
    db.commit()
    return timestamp
    

@app.post("/gmailflow/", response_model=GmailflowModel)
async def save_email(gmailflowbase: GmailflowBase, db: db_dependency):

    try:
        # Create a new Gmailflow entry to save in the database
        gmailflowmodel = models.Gmailflow(**gmailflowbase.model_dump())

        # Save the new entry to the database
        db.add(gmailflowmodel)
        db.commit()
        db.refresh(gmailflowmodel)

        # Return the newly created GmailflowModel
        return gmailflowmodel
    
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/gmailflow/{flow_id}/recent")
async def get_recent_gmailflow(flow_id: int, db: db_dependency):
    try:
        recent_flow = (
            db.query(models.Gmailflow)
            .filter(models.Gmailflow.workflow_id == flow_id)
            .order_by(models.Gmailflow.id.desc())
            .first()
        )
        if not recent_flow:
            raise HTTPException(status_code=404, detail="No recent data found.")
        return recent_flow
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    
@app.post("/sendmail/{flow_id}/")
async def send_email(flow_id: int, gmailflow: GmailflowBase, db: db_dependency):

    try:
        workflow = db.query(models.Workflow).filter(models.Workflow.id == flow_id).first()
        print(workflow)
        # Create the message to send
        message = MessageSchema(
            subject=gmailflow.title,
            recipients=[gmailflow.recipient_email],
            body=gmailflow.body,
            subtype=MessageType.html
        )

        conf = ConnectionConfig(
            MAIL_USERNAME=workflow.sender_email,
            MAIL_PASSWORD=workflow.sender_hashed_password,
            MAIL_FROM=workflow.sender_email,
            MAIL_PORT = 465,
            MAIL_SERVER = "smtp.gmail.com",
            MAIL_STARTTLS = False,
            MAIL_SSL_TLS = True,
            USE_CREDENTIALS = True,
        )

        fm = FastMail(conf)
        await fm.send_message(message)
        print('Mail sent.')

        # Create a new Gmailflow entry to save in the database
        new_gmailflow = models.Gmailflow(**gmailflow.model_dump())
    
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=400, detail=str(e))

async def check_workflows_for_trigger():
    # Function to check workflows and send emails for matching trigger times
    db: Session = next(get_db())
    current_time = datetime.now()
    # Query workflows where trigger_time is around the current time and status is True (started)
    
    # print(f"condition1: {models.Timestamp.trigger_time != None}")
    # print(f"condition2: {models.Timestamp.trigger_time <= current_time}")
    # print(f"condition3: {current_time < func.date_add(models.Timestamp.trigger_time, text("INTERVAL 10 SECOND"))}")
    timestamps = db.query(models.Timestamp).filter(
        models.Timestamp.trigger_time != None,
        models.Timestamp.trigger_time <= current_time,
        current_time < func.date_add(models.Timestamp.trigger_time, text("INTERVAL 59 SECOND")),
    ).all()

    print(f"Scheduled Timestamps: {timestamps}")

    # this one most likely ain't right need to verify 1.timerange 2.active status 3. workflow_id == timestamps_id
    workflow_ids = []
    for time in timestamps:
        workflow_ids.append(time.workflow_id) 

    print(f"Scheduled Workflow IDs: {workflow_ids}")
        
    workflows = db.query(models.Workflow).filter(models.Workflow.id.in_(workflow_ids),
                                                 models.Workflow.status == True
                                                 ).all()

    print(f"Scheduled Workflows: {workflows}")

    for workflow in workflows:
        print(f"triggered workflow with id: {workflow.id}")
        try:
            # Send the email and handle errors if they arise
            await send_email_for_scheduled_workflow(workflow, db)
            # Update the next trigger time based on frequency
            db.commit()
        
        except Exception as e:
            # Log error and rollback changes if something fails
            print(f"Error processing workflow {workflow.id}: {e}")
            db.rollback()

async def send_email_for_scheduled_workflow(workflow: models.Workflow, db: Session):
    # Build email details and send

    gmailflow = db.query(models.Gmailflow).filter(workflow.id == models.Gmailflow.workflow_id)[-1]
    message = MessageSchema(
        subject=gmailflow.title,
        recipients=[gmailflow.recipient_email],
        body=gmailflow.body,
        subtype=MessageType.html
    )

    conf = ConnectionConfig(
        MAIL_USERNAME=workflow.sender_email,
        MAIL_PASSWORD=workflow.sender_hashed_password,
        MAIL_FROM=workflow.sender_email,
        MAIL_PORT=465,
        MAIL_SERVER="smtp.gmail.com",
        MAIL_STARTTLS=False,
        MAIL_SSL_TLS=True,
        USE_CREDENTIALS=True,
    )

    fm = FastMail(conf)
    await fm.send_message(message)
    print("mail sent")

@app.on_event("startup")
async def start_scheduler():
    pass
    scheduler.add_job(check_workflows_for_trigger, 'interval', seconds=59)
    scheduler.start()

@app.get("/workflow/{flow_id}/import/", response_model=List[WorkflowImportsDataModel])
async def read_flow_sheets( db: db_dependency, skip: int=0, limit: int=100):
    sheets = db.query(models.WorkflowsImportsData).offset(skip).limit(limit).all()
    return sheets

@app.post("/workflow/{flow_id}/import/")
async def import_workflow(flow_id : int, db: db_dependency, file: UploadFile = File()):
    """Using pandas to read excel file and return dict of data."""
    contents = await file.read()

    try:
        df = pd.read_excel(io.BytesIO(contents), dtype={'tel': str})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid file format.")

    data = df.to_json(orient="records")
    json_data = json.loads(data)

    existed_data = db.query(models.WorkflowsImportsData).filter(models.WorkflowsImportsData.workflow_id == flow_id).first()

    if not existed_data:
        # create new data
        workflow_data = models.WorkflowsImportsData(
            data = json_data,
            workflow_id = flow_id,
            filename = file.filename
        )
        db.add(workflow_data)
    else:
        # update data
        existed_data.data = json_data
        existed_data.filename = file.filename

    db.commit()
    db.refresh(existed_data)
    return existed_data

# Endpoint to fetch the latest imported file's metadata for a workflow
@app.get("/workflow/{flow_id}/file-metadata/")
async def get_workflow_file_metadata(flow_id: int, db: db_dependency):
    """Fetch metadata of the latest imported file for a given workflow."""
    latest_file = db.query(models.WorkflowsImportsData).filter(models.WorkflowsImportsData.workflow_id == flow_id).first()
    if not latest_file:
        raise HTTPException(status_code=404, detail="No imported files found for this workflow.")

    # Return only metadata, like file name
    return {"filename": latest_file.filename}

@app.get("/workflow/{flow_id}/keysname/")
async def get_data_keys(flow_id: int, db: db_dependency):
    """Fetch unique keys from imported data."""

    workflow_data = db.query(models.WorkflowsImportsData).filter(models.WorkflowsImportsData.workflow_id == flow_id).first()
    # No data is found
    if not workflow_data or not workflow_data.data:
        raise HTTPException(status_code=404, detail="Workflow data not found")

    # Extract unique keys from all dictionaries in the list
    unique_keys = {key for record in workflow_data.data for key in record.keys()}
    return {"keyNames": list(unique_keys)}

@app.get("/workflow/{flow_id}/data")
async def get_data_records(flow_id: int, db: db_dependency):
    """Fetch record's data from imported data."""
    workflow_data = db.query(models.WorkflowsImportsData).filter(models.WorkflowsImportsData.workflow_id == flow_id).first()
    # No data is found
    if not workflow_data or not workflow_data.data:
        raise HTTPException(status_code=404, detail="Workflow data not found")
    return workflow_data.data
