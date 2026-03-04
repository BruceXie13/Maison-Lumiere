from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Commission, CommissionAssignment, StudioSession, StudioEvent, Agent, _uuid, _now
from ..schemas import CommissionCreate, CommissionOut, ClaimRole

router = APIRouter(prefix="/commissions", tags=["commissions"])

STATUS_MAP = {
    "open": "open",
    "claimed_partial": "open",
    "in_progress": "in-progress",
    "submitted_final": "in-progress",
    "completed": "completed",
}


def _commission_to_out(c: Commission, db: Session) -> CommissionOut:
    assignments = db.query(CommissionAssignment).filter(CommissionAssignment.commission_id == c.id).all()
    artist_id = next((a.agent_id for a in assignments if a.role == "artist"), None)
    critic_id = next((a.agent_id for a in assignments if a.role == "critic"), None)
    return CommissionOut(
        id=c.id,
        title=c.title,
        description=c.description,
        budget=c.budget_credits,
        deadline=c.deadline,
        status=STATUS_MAP.get(c.status, c.status),
        type=c.type,
        tags=c.tags or [],
        artistId=artist_id,
        criticId=critic_id,
        createdAt=c.created_at.isoformat() if c.created_at else "",
        created_by=c.created_by,
    )


@router.post("", response_model=CommissionOut)
def create_commission(body: CommissionCreate, db: Session = Depends(get_db)):
    comm = Commission(
        id=_uuid(),
        title=body.title,
        description=body.description,
        type=body.type,
        budget_credits=body.budget_credits,
        deadline=body.deadline,
        tags=body.tags,
        created_by=body.created_by,
    )
    db.add(comm)

    studio = StudioSession(id=_uuid(), commission_id=comm.id, status="waiting_for_roles")
    db.add(studio)

    db.commit()
    db.refresh(comm)
    return _commission_to_out(comm, db)


@router.get("", response_model=list[CommissionOut])
def list_commissions(status: str | None = None, type: str | None = None, db: Session = Depends(get_db)):
    q = db.query(Commission)
    if status:
        reverse_status = {v: k for k, v in STATUS_MAP.items()}
        internal = reverse_status.get(status, status)
        if status == "in-progress":
            q = q.filter(Commission.status.in_(["in_progress", "submitted_final", "claimed_partial"]))
        else:
            q = q.filter(Commission.status == internal)
    if type:
        q = q.filter(Commission.type == type)
    comms = q.order_by(Commission.created_at.desc()).all()
    return [_commission_to_out(c, db) for c in comms]


@router.get("/{commission_id}", response_model=CommissionOut)
def get_commission(commission_id: str, db: Session = Depends(get_db)):
    c = db.query(Commission).filter(Commission.id == commission_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Commission not found")
    return _commission_to_out(c, db)


@router.post("/{commission_id}/claim", response_model=CommissionOut)
def claim_commission(commission_id: str, body: ClaimRole, db: Session = Depends(get_db)):
    c = db.query(Commission).filter(Commission.id == commission_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Commission not found")
    if c.status == "completed":
        raise HTTPException(status_code=400, detail="Commission already completed")

    agent = db.query(Agent).filter(Agent.id == body.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    if body.role not in ("artist", "critic"):
        raise HTTPException(status_code=400, detail="Role must be 'artist' or 'critic'")

    existing_same_role = (
        db.query(CommissionAssignment)
        .filter(CommissionAssignment.commission_id == commission_id, CommissionAssignment.role == body.role)
        .first()
    )
    if existing_same_role:
        raise HTTPException(status_code=400, detail=f"Role '{body.role}' already claimed")

    existing_agent = (
        db.query(CommissionAssignment)
        .filter(CommissionAssignment.commission_id == commission_id, CommissionAssignment.agent_id == body.agent_id)
        .first()
    )
    if existing_agent:
        raise HTTPException(status_code=400, detail="Agent already assigned to this commission (cannot hold both roles)")

    assignment = CommissionAssignment(
        id=_uuid(),
        commission_id=commission_id,
        agent_id=body.agent_id,
        role=body.role,
    )
    db.add(assignment)

    studio = db.query(StudioSession).filter(StudioSession.commission_id == commission_id).first()
    if studio:
        event = StudioEvent(
            id=_uuid(),
            studio_session_id=studio.id,
            commission_id=commission_id,
            agent_id=body.agent_id,
            role=body.role,
            event_type="role_claimed",
            content=f"{agent.name} claimed {body.role} role",
        )
        db.add(event)

    all_assignments = (
        db.query(CommissionAssignment)
        .filter(CommissionAssignment.commission_id == commission_id)
        .all()
    )
    roles_filled = {a.role for a in all_assignments} | {body.role}

    if "artist" in roles_filled and "critic" in roles_filled:
        c.status = "in_progress"
        if studio:
            studio.status = "waiting_for_draft"
    else:
        c.status = "claimed_partial"

    c.updated_at = _now()
    db.commit()
    db.refresh(c)
    return _commission_to_out(c, db)
