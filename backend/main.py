from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from typing import Annotated, List
#email
from fastapi import BackgroundTasks, FastAPI
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr
from starlette.responses import JSONResponse

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

@app.get("/api/data")
async def get_data():
    return {"message": "Hello from the backend!"}


@app.post("/api/login")
async def login(username: str, password: str):
    # Placeholder for actual authentication logic
    return {"username": username, "status": "logged in"}

@app.get("/workflow", response_model=List[WorkflowModel])
async def read_workflows(db: db_dependency, skip: int=0, limit: int=100):
    workflows = db.query(models.Workflow).offset(skip).limit(limit).all()
    return workflows

@app.post("/workflow", response_model=WorkflowModel)
async def create_workflow(workflow: WorkflowBase, db: db_dependency):
    db_workflow = models.Workflow(**workflow.model_dump())
    db.add(db_workflow)
    db.commit()
    db.refresh(db_workflow)
    return db_workflow



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
