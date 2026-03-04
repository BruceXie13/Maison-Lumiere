import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Agent(Base):
    __tablename__ = "agents"

    id = Column(String, primary_key=True, default=_uuid)
    name = Column(String, unique=True, nullable=False, index=True)
    role_tags = Column(JSON, default=list)
    capabilities = Column(JSON, default=list)
    avatar = Column(String, default="🤖")
    api_token = Column(String, unique=True, nullable=False, index=True)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=_now)

    assignments = relationship("CommissionAssignment", back_populates="agent")
    events = relationship("StudioEvent", back_populates="agent")
    wallet = relationship("Wallet", back_populates="agent", uselist=False)
    published_items = relationship("GalleryItem", back_populates="publisher", foreign_keys="GalleryItem.published_by_agent_id")


class Commission(Base):
    __tablename__ = "commissions"

    id = Column(String, primary_key=True, default=_uuid)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    type = Column(String, default="general")
    status = Column(String, default="open")
    budget_credits = Column(Integer, default=0)
    deadline = Column(String, nullable=True)
    tags = Column(JSON, default=list)
    created_by = Column(String, default="human")
    created_at = Column(DateTime, default=_now)
    updated_at = Column(DateTime, default=_now, onupdate=_now)

    assignments = relationship("CommissionAssignment", back_populates="commission")
    studio_session = relationship("StudioSession", back_populates="commission", uselist=False)
    gallery_items = relationship("GalleryItem", back_populates="commission")


class CommissionAssignment(Base):
    __tablename__ = "commission_assignments"

    id = Column(String, primary_key=True, default=_uuid)
    commission_id = Column(String, ForeignKey("commissions.id"), nullable=False)
    agent_id = Column(String, ForeignKey("agents.id"), nullable=False)
    role = Column(String, nullable=False)
    claimed_at = Column(DateTime, default=_now)

    commission = relationship("Commission", back_populates="assignments")
    agent = relationship("Agent", back_populates="assignments")


class StudioSession(Base):
    __tablename__ = "studio_sessions"

    id = Column(String, primary_key=True, default=_uuid)
    commission_id = Column(String, ForeignKey("commissions.id"), nullable=False, unique=True)
    status = Column(String, default="waiting_for_roles")
    created_at = Column(DateTime, default=_now)
    updated_at = Column(DateTime, default=_now, onupdate=_now)

    commission = relationship("Commission", back_populates="studio_session")
    events = relationship("StudioEvent", back_populates="studio_session", order_by="StudioEvent.created_at")


class StudioEvent(Base):
    __tablename__ = "studio_events"

    id = Column(String, primary_key=True, default=_uuid)
    request_id = Column(String, nullable=True, index=True)
    studio_session_id = Column(String, ForeignKey("studio_sessions.id"), nullable=False)
    commission_id = Column(String, ForeignKey("commissions.id"), nullable=False)
    agent_id = Column(String, ForeignKey("agents.id"), nullable=False)
    role = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    content = Column(Text, default="")
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=_now)

    studio_session = relationship("StudioSession", back_populates="events")
    agent = relationship("Agent", back_populates="events")


class GalleryItem(Base):
    __tablename__ = "gallery_items"

    id = Column(String, primary_key=True, default=_uuid)
    commission_id = Column(String, ForeignKey("commissions.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    image_url = Column(String, default="")
    tags = Column(JSON, default=list)
    published_by_agent_id = Column(String, ForeignKey("agents.id"), nullable=True)
    owner_agent_id = Column(String, ForeignKey("agents.id"), nullable=True)  # current owner (creator until sold)
    contributor_agent_ids = Column(JSON, default=list)
    verified_commission = Column(Boolean, default=False)
    price_credits = Column(Integer, default=0)
    original_price = Column(Integer, default=0)
    license_types = Column(JSON, default=lambda: ["personal"])
    likes_count = Column(Integer, default=0)
    views_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=_now)

    commission = relationship("Commission", back_populates="gallery_items")
    publisher = relationship("Agent", back_populates="published_items", foreign_keys=[published_by_agent_id])
    critiques = relationship("Critique", back_populates="gallery_item", order_by="Critique.created_at.desc()")


class Critique(Base):
    __tablename__ = "critiques"

    id = Column(String, primary_key=True, default=_uuid)
    gallery_item_id = Column(String, ForeignKey("gallery_items.id"), nullable=False)
    agent_id = Column(String, ForeignKey("agents.id"), nullable=False)
    score = Column(Integer, nullable=False)  # 1-10
    comment = Column(Text, default="")
    created_at = Column(DateTime, default=_now)

    gallery_item = relationship("GalleryItem", back_populates="critiques")
    agent = relationship("Agent")


class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(String, primary_key=True, default=_uuid)
    agent_id = Column(String, ForeignKey("agents.id"), unique=True, nullable=False)
    balance_credits = Column(Integer, default=0)
    created_at = Column(DateTime, default=_now)
    updated_at = Column(DateTime, default=_now, onupdate=_now)

    agent = relationship("Agent", back_populates="wallet")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, default=_uuid)
    type = Column(String, nullable=False)
    from_agent_id = Column(String, ForeignKey("agents.id"), nullable=True)
    to_agent_id = Column(String, ForeignKey("agents.id"), nullable=True)
    amount_credits = Column(Integer, nullable=False)
    commission_id = Column(String, ForeignKey("commissions.id"), nullable=True)
    gallery_item_id = Column(String, ForeignKey("gallery_items.id"), nullable=True)
    status = Column(String, default="completed")
    note = Column(Text, default="")
    created_at = Column(DateTime, default=_now)
