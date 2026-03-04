from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import StudioSession, StudioEvent, Commission, CommissionAssignment, Agent, GalleryItem, _uuid, _now
from ..schemas import StudioSessionOut, StudioEventCreate, StudioEventOut

router = APIRouter(prefix="/studios", tags=["studios"])

EVENT_TYPE_MAP = {
    "draft_submitted": "draft",
    "critique_submitted": "critique",
    "revision_submitted": "revision",
    "publish_requested": "revision",
    "published": "publish",
    "role_claimed": "draft",
}

VALID_TRANSITIONS = {
    "waiting_for_draft": ["draft_submitted"],
    "waiting_for_critique": ["critique_submitted"],
    "waiting_for_revision": ["revision_submitted"],
    "ready_to_publish": ["published"],
}


def _event_to_out(e: StudioEvent, db: Session) -> StudioEventOut:
    agent = db.query(Agent).filter(Agent.id == e.agent_id).first()
    return StudioEventOut(
        id=e.id,
        type=EVENT_TYPE_MAP.get(e.event_type, e.event_type),
        agentId=e.agent_id,
        agentName=agent.name if agent else "Unknown",
        role=e.role,
        content=e.content,
        timestamp=e.created_at.isoformat() if e.created_at else "",
        metadata=e.metadata_json or {},
        request_id=e.request_id,
        studio_session_id=e.studio_session_id,
        commission_id=e.commission_id,
    )


def _studio_to_out(s: StudioSession, db: Session) -> StudioSessionOut:
    events = (
        db.query(StudioEvent)
        .filter(StudioEvent.studio_session_id == s.id)
        .order_by(StudioEvent.created_at)
        .all()
    )
    return StudioSessionOut(
        id=s.id,
        commission_id=s.commission_id,
        status=s.status,
        created_at=s.created_at,
        updated_at=s.updated_at,
        events=[_event_to_out(e, db) for e in events],
    )


@router.get("/{studio_id}")
def get_studio(studio_id: str, db: Session = Depends(get_db)):
    s = db.query(StudioSession).filter(StudioSession.id == studio_id).first()
    if not s:
        s = db.query(StudioSession).filter(StudioSession.commission_id == studio_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Studio session not found")
    return _studio_to_out(s, db)


@router.get("/{studio_id}/events", response_model=list[StudioEventOut])
def list_events(studio_id: str, db: Session = Depends(get_db)):
    s = db.query(StudioSession).filter(StudioSession.id == studio_id).first()
    if not s:
        s = db.query(StudioSession).filter(StudioSession.commission_id == studio_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Studio session not found")

    events = (
        db.query(StudioEvent)
        .filter(StudioEvent.studio_session_id == s.id)
        .order_by(StudioEvent.created_at)
        .all()
    )
    return [_event_to_out(e, db) for e in events]


@router.post("/{studio_id}/events", response_model=StudioEventOut)
def post_event(studio_id: str, body: StudioEventCreate, db: Session = Depends(get_db)):
    s = db.query(StudioSession).filter(StudioSession.id == studio_id).first()
    if not s:
        s = db.query(StudioSession).filter(StudioSession.commission_id == studio_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Studio session not found")

    if body.request_id:
        existing = (
            db.query(StudioEvent)
            .filter(
                StudioEvent.request_id == body.request_id,
                StudioEvent.agent_id == body.agent_id,
                StudioEvent.studio_session_id == s.id,
            )
            .first()
        )
        if existing:
            return _event_to_out(existing, db)

    agent = db.query(Agent).filter(Agent.id == body.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    assignment = (
        db.query(CommissionAssignment)
        .filter(
            CommissionAssignment.commission_id == s.commission_id,
            CommissionAssignment.agent_id == body.agent_id,
        )
        .first()
    )
    if not assignment:
        raise HTTPException(status_code=403, detail="Agent not assigned to this commission")

    if body.event_type != "role_claimed":
        allowed = VALID_TRANSITIONS.get(s.status, [])
        if body.event_type not in allowed and s.status != "waiting_for_roles":
            raise HTTPException(
                status_code=400,
                detail=f"Event '{body.event_type}' not valid in studio status '{s.status}'. Allowed: {allowed}",
            )

    event = StudioEvent(
        id=_uuid(),
        request_id=body.request_id,
        studio_session_id=s.id,
        commission_id=s.commission_id,
        agent_id=body.agent_id,
        role=body.role,
        event_type=body.event_type,
        content=body.content,
        metadata_json=body.metadata_json,
    )
    db.add(event)

    transition_map = {
        "draft_submitted": "waiting_for_critique",
        "critique_submitted": "waiting_for_revision",
        "revision_submitted": "ready_to_publish",
        "published": "published",
    }
    new_status = transition_map.get(body.event_type)
    if new_status:
        s.status = new_status
        s.updated_at = _now()

    comm = db.query(Commission).filter(Commission.id == s.commission_id).first()
    if body.event_type == "published" and comm:
        comm.status = "completed"
        comm.updated_at = _now()

    db.commit()
    db.refresh(event)
    return _event_to_out(event, db)
