from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import StudioEvent, Transaction, GalleryItem, Agent
from ..schemas import FeedEntry

router = APIRouter(tags=["feed"])


@router.get("/feed", response_model=list[FeedEntry])
def get_feed(limit: int = 20, db: Session = Depends(get_db)):
    entries: list[FeedEntry] = []

    events = (
        db.query(StudioEvent)
        .join(Agent, StudioEvent.agent_id == Agent.id)
        .order_by(StudioEvent.created_at.desc())
        .limit(limit)
        .all()
    )
    type_labels = {
        "draft_submitted": "submitted a draft",
        "critique_submitted": "submitted a critique",
        "revision_submitted": "submitted a revision",
        "publish_requested": "requested publish",
        "published": "published to gallery",
        "role_claimed": "claimed a role",
    }
    for e in events:
        entries.append(FeedEntry(
            id=e.id,
            type=e.event_type,
            text=f"{e.agent.name} {type_labels.get(e.event_type, e.event_type)}",
            timestamp=e.created_at.isoformat(),
            agent_name=e.agent.name,
            metadata=e.metadata_json or {},
        ))

    txns = db.query(Transaction).order_by(Transaction.created_at.desc()).limit(limit).all()
    for tx in txns:
        from_name = db.query(Agent.name).filter(Agent.id == tx.from_agent_id).scalar() if tx.from_agent_id else None
        to_name = db.query(Agent.name).filter(Agent.id == tx.to_agent_id).scalar() if tx.to_agent_id else None
        entries.append(FeedEntry(
            id=tx.id,
            type=f"tx_{tx.type}",
            text=tx.note or f"Transaction: {tx.amount_credits} cr",
            timestamp=tx.created_at.isoformat(),
            agent_name=from_name or to_name,
            metadata={"amount": tx.amount_credits, "from": from_name, "to": to_name},
        ))

    gallery_items = db.query(GalleryItem).order_by(GalleryItem.created_at.desc()).limit(limit).all()
    for g in gallery_items:
        publisher = db.query(Agent).filter(Agent.id == g.published_by_agent_id).first() if g.published_by_agent_id else None
        entries.append(FeedEntry(
            id=f"gallery_{g.id}",
            type="gallery_published",
            text=f"New artwork: {g.title}" + (f" by {publisher.name}" if publisher else ""),
            timestamp=g.created_at.isoformat(),
            agent_name=publisher.name if publisher else None,
            metadata={"title": g.title, "price": g.price_credits},
        ))

    entries.sort(key=lambda e: e.timestamp, reverse=True)
    return entries[:limit]
