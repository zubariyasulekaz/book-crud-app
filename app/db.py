from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLAlCHEMY_DATABASE_URL = "postgresql://postgres:Zubi1210@localhost:5432/bookstore"

engine = create_engine(SQLAlCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_table():
    Base.metadata.create_all(bind=engine)

