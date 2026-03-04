import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

_db_file = Path(__file__).resolve().parent.parent / "gallery.db"
_raw_url = os.environ.get("DATABASE_URL", f"sqlite:///{_db_file}")

# Railway/Heroku use postgres:// but SQLAlchemy needs postgresql://
if _raw_url.startswith("postgres://"):
    DB_PATH = "postgresql://" + _raw_url[len("postgres://"):]
else:
    DB_PATH = _raw_url

_engine_kw = {}
if "sqlite" in DB_PATH:
    _engine_kw["connect_args"] = {"check_same_thread": False}
elif "postgresql" in DB_PATH:
    _engine_kw["pool_pre_ping"] = True

engine = create_engine(DB_PATH, **_engine_kw)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
