import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

URL_DATABASE = 'sqlite:///./database.db'

engine = create_engine(URL_DATABASE, connect_args={'check_same_thread': False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def create_database():
    """This function creates all the tables in the database."""
    Base.metadata.create_all(bind=engine)


def drop_database():
    """Drops the database by removing the database file."""
    if os.path.exists('database.db'):
        os.remove('database.db')