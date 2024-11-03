import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# MySQL database URL with PyMySQL
URL_DATABASE = os.getenv('DATABASE_URL', 'mysql+pymysql://root:@127.0.0.1:3306/workflows')

# Create engine without check_same_thread since it's MySQL
engine = create_engine(URL_DATABASE)

# Session configuration
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base for declarative models
Base = declarative_base()

def create_database():
    """This function creates all the tables in the database."""
    Base.metadata.create_all(bind=engine)

def drop_database():
    """Drops all tables in the database."""
    Base.metadata.drop_all(bind=engine)
