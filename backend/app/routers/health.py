from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Agent, Commission, StudioSession, GalleryItem, Transaction, StudioEvent
from ..schemas import HealthOut, MetricsOut, StateOut, FeedEntry, AgentOut, AgentStats, GalleryItemOut

router = APIRouter()


@router.get("/health", response_model=HealthOut)
def health():
    return HealthOut()


@router.get("/metrics", response_model=MetricsOut)
def metrics(db: Session = Depends(get_db)):
    return MetricsOut(
        agents=db.query(Agent).count(),
        commissions=db.query(Commission).count(),
        open_commissions=db.query(Commission).filter(Commission.status == "open").count(),
        active_studios=db.query(StudioSession).filter(
            StudioSession.status.notin_(["published", "waiting_for_roles"])
        ).count(),
        gallery_items=db.query(GalleryItem).count(),
        transactions=db.query(Transaction).count(),
        total_credits_volume=db.query(func.coalesce(func.sum(Transaction.amount_credits), 0)).scalar() or 0,
    )


@router.get("/state", response_model=StateOut)
def state(db: Session = Depends(get_db)):
    m = metrics(db)

    events = (
        db.query(StudioEvent)
        .join(Agent, StudioEvent.agent_id == Agent.id)
        .order_by(StudioEvent.created_at.desc())
        .limit(10)
        .all()
    )
    feed: list[FeedEntry] = []
    for e in events:
        type_labels = {
            "draft_submitted": "submitted a draft",
            "critique_submitted": "submitted a critique",
            "revision_submitted": "submitted a revision",
            "publish_requested": "requested publish",
            "published": "published to gallery",
            "role_claimed": "claimed a role",
        }
        text = f"{e.agent.name} {type_labels.get(e.event_type, e.event_type)}"
        feed.append(FeedEntry(
            id=e.id,
            type=e.event_type,
            text=text,
            timestamp=e.created_at.isoformat(),
            agent_name=e.agent.name,
            metadata=e.metadata_json or {},
        ))

    txns = db.query(Transaction).order_by(Transaction.created_at.desc()).limit(5).all()
    for tx in txns:
        from_name = db.query(Agent.name).filter(Agent.id == tx.from_agent_id).scalar() if tx.from_agent_id else None
        to_name = db.query(Agent.name).filter(Agent.id == tx.to_agent_id).scalar() if tx.to_agent_id else None
        feed.append(FeedEntry(
            id=tx.id,
            type=f"tx_{tx.type}",
            text=tx.note or f"Transaction: {tx.amount_credits} cr",
            timestamp=tx.created_at.isoformat(),
            agent_name=from_name or to_name,
            metadata={"amount": tx.amount_credits, "from": from_name, "to": to_name},
        ))

    feed.sort(key=lambda f: f.timestamp, reverse=True)
    feed = feed[:15]

    from .agents import _agent_to_out
    top = db.query(Agent).filter(Agent.status == "active").all()
    top_agents = [_agent_to_out(a, db) for a in top]
    top_agents.sort(key=lambda a: a.stats.creditsEarned, reverse=True)
    top_agents = top_agents[:5]

    from .gallery import _item_to_out
    featured = db.query(GalleryItem).order_by(GalleryItem.likes_count.desc()).limit(4).all()
    featured_out = [_item_to_out(g, db) for g in featured]

    return StateOut(
        metrics=m,
        recent_feed=feed,
        top_agents=top_agents,
        featured_gallery=featured_out,
    )
