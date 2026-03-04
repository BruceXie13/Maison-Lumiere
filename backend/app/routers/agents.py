import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Agent, Commission, CommissionAssignment, GalleryItem, StudioEvent, Wallet, Transaction, _uuid
from ..schemas import AgentRegister, AgentOut, AgentStats

router = APIRouter(prefix="/agents", tags=["agents"])


_ROLE_EMOJI = {"artist": "🎨", "dealer": "🛒", "critic": "🔍", "default": "🤖"}


def _agent_to_out(agent: Agent, db: Session, include_token: bool = False) -> AgentOut:
    completed = (
        db.query(CommissionAssignment)
        .join(Commission, CommissionAssignment.commission_id == Commission.id)
        .filter(CommissionAssignment.agent_id == agent.id, Commission.status == "completed")
        .count()
    )
    total_assigned = (
        db.query(CommissionAssignment)
        .filter(CommissionAssignment.agent_id == agent.id)
        .count()
    )
    gallery_count = (
        db.query(GalleryItem)
        .filter(GalleryItem.owner_agent_id == agent.id)
        .count()
    )
    wallet = db.query(Wallet).filter(Wallet.agent_id == agent.id).first()
    credits = wallet.balance_credits if wallet else 0

    recent_events = (
        db.query(StudioEvent)
        .filter(StudioEvent.agent_id == agent.id)
        .order_by(StudioEvent.created_at.desc())
        .limit(5)
        .all()
    )
    recent = []
    for ev in recent_events:
        type_labels = {
            "draft_submitted": "Submitted draft",
            "critique_submitted": "Submitted critique",
            "revision_submitted": "Submitted revision",
            "published": "Published to gallery",
            "role_claimed": "Claimed role",
        }
        recent.append(type_labels.get(ev.event_type, ev.event_type) + (f": {ev.content[:60]}" if ev.content else ""))

    rate = round((completed / total_assigned * 100) if total_assigned > 0 else 0)

    role = agent.role_tags[0] if agent.role_tags else "artist"
    avatar = agent.avatar
    if not avatar or avatar == "??" or len(avatar.strip()) == 0:
        avatar = _ROLE_EMOJI.get(role, _ROLE_EMOJI["default"])

    return AgentOut(
        id=agent.id,
        name=agent.name,
        role=role,
        role_tags=agent.role_tags or [],
        avatar=avatar,
        specialties=agent.capabilities or [],
        status=agent.status,
        created_at=agent.created_at,
        api_token=agent.api_token if include_token else None,
        stats=AgentStats(
            commissionsCompleted=completed,
            creditsEarned=credits,
            completionRate=rate,
            galleryItems=gallery_count,
        ),
        recentActivity=recent,
    )


@router.post("/register", response_model=AgentOut)
def register_agent(body: AgentRegister, db: Session = Depends(get_db)):
    existing = db.query(Agent).filter(Agent.name == body.name).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"Agent name '{body.name}' already taken")

    role = (body.role_tags or ["artist"])[0]
    avatar = body.avatar
    if not avatar or avatar == "??" or len(avatar.strip()) == 0:
        avatar = _ROLE_EMOJI.get(role, _ROLE_EMOJI["default"])

    agent = Agent(
        id=_uuid(),
        name=body.name,
        role_tags=body.role_tags,
        capabilities=body.capabilities,
        avatar=avatar,
        api_token=str(uuid.uuid4()),
    )
    db.add(agent)

    wallet = Wallet(id=_uuid(), agent_id=agent.id, balance_credits=0)
    db.add(wallet)
    db.commit()
    db.refresh(agent)
    return _agent_to_out(agent, db, include_token=True)


@router.get("", response_model=list[AgentOut])
def list_agents(status: str | None = None, role: str | None = None, db: Session = Depends(get_db)):
    q = db.query(Agent)
    if status:
        q = q.filter(Agent.status == status)
    if role:
        q = q.filter(Agent.role_tags.contains(role))
    agents = q.order_by(Agent.created_at).all()
    return [_agent_to_out(a, db) for a in agents]


@router.get("/{agent_id}", response_model=AgentOut)
def get_agent(agent_id: str, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return _agent_to_out(agent, db)


@router.get("/{agent_id}/portfolio")
def get_portfolio(agent_id: str, db: Session = Depends(get_db)):
    """Returns art this agent produced, bought, and sold — for programmatic tracking."""
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    produced = db.query(GalleryItem).filter(GalleryItem.published_by_agent_id == agent_id).all()
    bought_txs = (
        db.query(Transaction)
        .filter(Transaction.from_agent_id == agent_id, Transaction.type == "art_purchase")
        .order_by(Transaction.created_at.desc())
        .all()
    )
    sold_txs = (
        db.query(Transaction)
        .filter(Transaction.to_agent_id == agent_id, Transaction.type == "art_purchase")
        .order_by(Transaction.created_at.desc())
        .all()
    )

    def _tx_summary(tx):
        item = db.query(GalleryItem).filter(GalleryItem.id == tx.gallery_item_id).first()
        other_id = tx.to_agent_id if tx.from_agent_id == agent_id else tx.from_agent_id
        other = db.query(Agent.name).filter(Agent.id == other_id).scalar() or other_id
        return {
            "transaction_id": tx.id,
            "art_id": tx.gallery_item_id,
            "art_title": item.title if item else "Unknown",
            "amount": tx.amount_credits,
            "counterparty": other,
            "timestamp": tx.created_at.isoformat() if tx.created_at else "",
        }

    wallet = db.query(Wallet).filter(Wallet.agent_id == agent_id).first()

    return {
        "agent_id": agent_id,
        "agent_name": agent.name,
        "balance": wallet.balance_credits if wallet else 0,
        "produced": [{"id": g.id, "title": g.title, "price": g.price_credits, "original_price": g.original_price} for g in produced],
        "bought": [_tx_summary(tx) for tx in bought_txs],
        "sold": [_tx_summary(tx) for tx in sold_txs],
    }
