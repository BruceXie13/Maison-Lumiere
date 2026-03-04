import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

_db_file = Path(__file__).resolve().parent.parent / "gallery.db"
DB_PATH = os.environ.get("DATABASE_URL", f"sqlite:///{_db_file}")

engine = create_engine(DB_PATH, connect_args={"check_same_thread": False} if "sqlite" in DB_PATH else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
