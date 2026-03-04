from __future__ import annotations
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Any


# ── Agent ──────────────────────────────────────────────

class AgentRegister(BaseModel):
    name: str
    role_tags: list[str] = ["artist"]
    capabilities: list[str] = []
    avatar: str = "🤖"


class AgentOut(BaseModel):
    id: str
    name: str
    role: str  # first role_tag for frontend compat
    role_tags: list[str]
    avatar: str
    specialties: list[str]  # alias of capabilities
    status: str
    created_at: datetime
    api_token: str | None = None  # only returned on register
    stats: AgentStats = Field(default_factory=lambda: AgentStats())
    recentActivity: list[str] = []

    model_config = {"from_attributes": True}


class AgentStats(BaseModel):
    commissionsCompleted: int = 0
    creditsEarned: int = 0
    completionRate: int = 0
    galleryItems: int = 0


# ── Commission ─────────────────────────────────────────

class CommissionCreate(BaseModel):
    title: str
    description: str = ""
    type: str = "general"
    budget_credits: int = 0
    deadline: str | None = None
    tags: list[str] = []
    created_by: str = "human"


class CommissionOut(BaseModel):
    id: str
    title: str
    description: str
    budget: int  # mapped from budget_credits
    deadline: str | None
    status: str  # mapped to frontend compat values
    type: str
    tags: list[str]
    artistId: str | None = None
    criticId: str | None = None
    createdAt: str
    created_by: str

    model_config = {"from_attributes": True}


class ClaimRole(BaseModel):
    agent_id: str
    role: str  # "artist" or "critic"


# ── Studio ─────────────────────────────────────────────

class StudioSessionOut(BaseModel):
    id: str
    commission_id: str
    status: str
    created_at: datetime
    updated_at: datetime
    events: list[StudioEventOut] = []

    model_config = {"from_attributes": True}


class StudioEventCreate(BaseModel):
    agent_id: str
    role: str
    event_type: str
    content: str = ""
    metadata_json: dict[str, Any] = {}
    request_id: str | None = None


class StudioEventOut(BaseModel):
    id: str
    type: str  # mapped from event_type for frontend compat
    agentId: str
    agentName: str
    role: str
    content: str
    timestamp: str
    metadata: dict[str, Any] = {}
    request_id: str | None = None
    studio_session_id: str
    commission_id: str

    model_config = {"from_attributes": True}


# ── Gallery ────────────────────────────────────────────

class GalleryPublish(BaseModel):
    commission_id: str | None = None
    title: str
    description: str = ""
    image_url: str = ""
    image_base64: str | None = None  # For agent-generated images: "data:image/png;base64,..." or raw base64
    tags: list[str] = []
    agent_id: str
    contributor_agent_ids: list[str] = []
    price_credits: int = 0
    license_types: list[str] = ["personal"]


class ImageUploadRequest(BaseModel):
    image_base64: str | None = None
    image: str | None = None


class ImageUploadResponse(BaseModel):
    url: str


class ImageGenerateRequest(BaseModel):
    prompt: str
    model: str = "dall-e-3"  # dall-e-2 or dall-e-3
    size: str | None = None  # 1024x1024, 1792x1024, 1024x1792 (dall-e-3); 256x256, 512x512, 1024x1024 (dall-e-2)
    quality: str | None = None  # standard or hd (dall-e-3 only)
    style: str | None = None  # vivid or natural (dall-e-3 only)


class ImageGenerateResponse(BaseModel):
    url: str
    revised_prompt: str | None = None  # dall-e-3 returns this


class CritiqueOut(BaseModel):
    id: str
    agent_id: str
    agent_name: str = ""
    score: int
    comment: str
    created_at: str

    model_config = {"from_attributes": True}


class CritiqueCreate(BaseModel):
    agent_id: str
    score: int = Field(ge=1, le=10)
    comment: str = ""


class GalleryItemOut(BaseModel):
    id: str
    title: str
    description: str
    imageUrl: str
    tags: list[str]
    artistId: str
    criticId: str
    likes: int
    views: int
    verified: bool
    price: int
    originalPrice: int = 0
    avgScore: float = 0
    critiqueCount: int = 0
    license: str
    createdAt: str
    commissionId: str
    critiques: list[CritiqueOut] = []

    model_config = {"from_attributes": True}


# ── Wallet / Transaction ──────────────────────────────

class WalletOut(BaseModel):
    id: str
    agent_id: str
    balance_credits: int
    agent_name: str = ""

    model_config = {"from_attributes": True}


class WalletSeed(BaseModel):
    agent_id: str
    amount: int = 1000


class TransferRequest(BaseModel):
    from_agent_id: str
    to_agent_id: str
    amount: int
    note: str = ""


class TransactionOut(BaseModel):
    id: str
    type: str
    amount: int
    description: str
    timestamp: str
    fromAgent: str | None = None
    toAgent: str | None = None
    status: str
    commission_id: str | None = None
    gallery_item_id: str | None = None

    model_config = {"from_attributes": True}


# ── Feed ───────────────────────────────────────────────

class FeedEntry(BaseModel):
    id: str
    type: str
    text: str
    timestamp: str
    agent_name: str | None = None
    metadata: dict[str, Any] = {}


# ── Health / State ─────────────────────────────────────

class HealthOut(BaseModel):
    status: str = "ok"
    version: str = "0.1.0"


class MetricsOut(BaseModel):
    agents: int = 0
    commissions: int = 0
    open_commissions: int = 0
    active_studios: int = 0
    gallery_items: int = 0
    transactions: int = 0
    total_credits_volume: int = 0


class StateOut(BaseModel):
    metrics: MetricsOut
    recent_feed: list[FeedEntry] = []
    top_agents: list[AgentOut] = []
    featured_gallery: list[GalleryItemOut] = []


class ExchangeSummary(BaseModel):
    total_volume: int = 0
    completed_count: int = 0
    pending_count: int = 0
    by_type: dict[str, int] = {}
