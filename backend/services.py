import fastapi as _fastapi
import fastapi.security as _security
import jwt as _jwt
import sqlalchemy.orm as _orm
import passlib.hash as _hash
from dotenv import load_dotenv
import os

import database as _database
import models as _models
import schemas as _schemas

oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "myjwtsecret")

def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)

def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_user_by_email(email: str, db: _orm.Session):
    return db.query(_models.User).filter(_models.User.email == email).first()

async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    user_obj = _models.User(email=user.email, hashed_password=_hash.bcrypt.hash(user.hashed_password))
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj

async def authenticate_user(email: str, password: str, db: _orm.Session):
    print(f"Authenticating user: {email}")
    user = await get_user_by_email(db=db, email=email)

    if not user:
        print("User not found")
        return False

    if not user.verify_password(password):
        print("Password verification failed")
        return False

    print("User authenticated")
    return user

async def create_token(user: _models.User):
    user_obj = _schemas.User.from_orm(user)

    token = _jwt.encode(user_obj.dict(), JWT_SECRET)

    return dict(access_token=token, token_type="bearer")

async def get_current_user(db: _orm.Session = _fastapi.Depends(get_db), token: str = _fastapi.Depends(oauth2schema)):
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(_models.User).filter_by(id=payload["id"]).first()
        if user is None:
            raise _fastapi.HTTPException(status_code=401, detail="User not found")
    except _jwt.ExpiredSignatureError:
        raise _fastapi.HTTPException(status_code=401, detail="Token expired")
    except _jwt.InvalidTokenError:
        raise _fastapi.HTTPException(status_code=401, detail="Invalid token")

    return _schemas.User.from_orm(user)
