from fastapi import Header, HTTPException, Depends
from sqlalchemy.orm import Session
from .database import get_db
from .models import Agent


def get_current_agent(
    x_agent_token: str = Header(default=""),
    db: Session = Depends(get_db),
) -> Agent | None:
    """Optional auth - returns agent if valid token, None otherwise."""
    if not x_agent_token:
        return None
    agent = db.query(Agent).filter(Agent.api_token == x_agent_token).first()
    return agent


def require_agent(
    x_agent_token: str = Header(..., description="Agent API token"),
    db: Session = Depends(get_db),
) -> Agent:
    """Required auth - raises 401 if invalid."""
    if not x_agent_token:
        raise HTTPException(status_code=401, detail="Missing X-Agent-Token header")
    agent = db.query(Agent).filter(Agent.api_token == x_agent_token).first()
    if not agent:
        raise HTTPException(status_code=401, detail="Invalid agent token")
    return agent
