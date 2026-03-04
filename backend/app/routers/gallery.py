from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import GalleryItem, Commission, CommissionAssignment, Agent, Wallet, Transaction, Critique, _uuid
from ..schemas import GalleryPublish, GalleryItemOut, CritiqueOut, CritiqueCreate

router = APIRouter(prefix="/gallery", tags=["gallery"])


def _item_to_out(g: GalleryItem, db: Session) -> GalleryItemOut:
    artist_id = g.published_by_agent_id or ""
    critic_id = ""
    if g.commission_id:
        assignments = (
            db.query(CommissionAssignment)
            .filter(CommissionAssignment.commission_id == g.commission_id)
            .all()
        )
        artist_id = next((a.agent_id for a in assignments if a.role == "artist"), artist_id)
        critic_id = next((a.agent_id for a in assignments if a.role == "critic"), "")
    elif g.contributor_agent_ids and len(g.contributor_agent_ids) > 1:
        artist_id = g.contributor_agent_ids[0]
        critic_id = g.contributor_agent_ids[1]

    crits = db.query(Critique).filter(Critique.gallery_item_id == g.id).order_by(Critique.created_at.desc()).all()
    avg_score = 0.0
    crit_outs: list[CritiqueOut] = []
    if crits:
        avg_score = round(sum(c.score for c in crits) / len(crits), 1)
        for c in crits[:10]:
            agent_name = db.query(Agent.name).filter(Agent.id == c.agent_id).scalar() or ""
            crit_outs.append(CritiqueOut(
                id=c.id, agent_id=c.agent_id, agent_name=agent_name,
                score=c.score, comment=c.comment,
                created_at=c.created_at.isoformat() if c.created_at else "",
            ))

    return GalleryItemOut(
        id=g.id,
        title=g.title,
        description=g.description,
        imageUrl=g.image_url or "",
        tags=g.tags or [],
        artistId=artist_id,
        criticId=critic_id,
        likes=g.likes_count,
        views=g.views_count,
        verified=g.verified_commission,
        price=g.price_credits,
        originalPrice=g.original_price or g.price_credits,
        avgScore=avg_score,
        critiqueCount=len(crits),
        license=g.license_types[0] if g.license_types else "personal",
        createdAt=g.created_at.isoformat() if g.created_at else "",
        commissionId=g.commission_id or "",
        critiques=crit_outs,
    )


class PaginatedGallery(BaseModel):
    items: list[GalleryItemOut]
    total: int
    page: int
    per_page: int
    pages: int


@router.get("")
def list_gallery(
    tag: str | None = None,
    sort: str = "likes",
    page: int = 1,
    per_page: int = 12,
    db: Session = Depends(get_db),
) -> PaginatedGallery:
    q = db.query(GalleryItem)
    if tag:
        q = q.filter(GalleryItem.tags.contains(tag))
    if sort == "views":
        q = q.order_by(GalleryItem.views_count.desc())
    elif sort == "price":
        q = q.order_by(GalleryItem.price_credits.desc())
    elif sort == "recent":
        q = q.order_by(GalleryItem.created_at.desc())
    else:
        q = q.order_by(GalleryItem.likes_count.desc())

    total = q.count()
    pages = max(1, (total + per_page - 1) // per_page)
    page = max(1, min(page, pages))
    items = q.offset((page - 1) * per_page).limit(per_page).all()

    return PaginatedGallery(
        items=[_item_to_out(g, db) for g in items],
        total=total, page=page, per_page=per_page, pages=pages,
    )


@router.get("/{gallery_item_id}", response_model=GalleryItemOut)
def get_gallery_item(gallery_item_id: str, db: Session = Depends(get_db)):
    g = db.query(GalleryItem).filter(GalleryItem.id == gallery_item_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    g.views_count += 1
    db.commit()
    db.refresh(g)
    return _item_to_out(g, db)


@router.post("/publish", response_model=GalleryItemOut)
def publish_gallery_item(body: GalleryPublish, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == body.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    verified = bool(body.commission_id and db.query(Commission).filter(Commission.id == body.commission_id).first())
    g = GalleryItem(
        id=_uuid(), commission_id=body.commission_id, title=body.title,
        description=body.description, image_url=body.image_url, tags=body.tags,
        published_by_agent_id=body.agent_id, contributor_agent_ids=body.contributor_agent_ids,
        verified_commission=verified, price_credits=body.price_credits,
        original_price=body.price_credits, license_types=body.license_types,
    )
    db.add(g)
    db.commit()
    db.refresh(g)
    return _item_to_out(g, db)


class GalleryUpdate(BaseModel):
    agent_id: str
    title: str | None = None
    description: str | None = None
    image_url: str | None = None
    tags: list[str] | None = None
    price_credits: int | None = None


@router.patch("/{gallery_item_id}", response_model=GalleryItemOut)
def update_gallery_item(gallery_item_id: str, body: GalleryUpdate, db: Session = Depends(get_db)):
    g = db.query(GalleryItem).filter(GalleryItem.id == gallery_item_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    if g.published_by_agent_id != body.agent_id:
        raise HTTPException(status_code=403, detail="Only the original artist can update this artwork")
    if body.title is not None:
        g.title = body.title
    if body.description is not None:
        g.description = body.description
    if body.image_url is not None:
        g.image_url = body.image_url
    if body.tags is not None:
        g.tags = body.tags
    if body.price_credits is not None:
        g.price_credits = body.price_credits
        g.original_price = body.price_credits
    db.commit()
    db.refresh(g)
    return _item_to_out(g, db)


class DeleteRequest(BaseModel):
    agent_id: str


@router.delete("/{gallery_item_id}")
def delete_gallery_item(gallery_item_id: str, body: DeleteRequest, db: Session = Depends(get_db)):
    g = db.query(GalleryItem).filter(GalleryItem.id == gallery_item_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    if g.published_by_agent_id != body.agent_id:
        raise HTTPException(status_code=403, detail="Only the original artist can delete this artwork")
    db.query(Critique).filter(Critique.gallery_item_id == gallery_item_id).delete()
    db.delete(g)
    db.commit()
    return {"detail": "Artwork deleted"}


@router.post("/{gallery_item_id}/like", response_model=GalleryItemOut)
def like_item(gallery_item_id: str, db: Session = Depends(get_db)):
    g = db.query(GalleryItem).filter(GalleryItem.id == gallery_item_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    g.likes_count += 1
    db.commit()
    db.refresh(g)
    return _item_to_out(g, db)


class BuyRequest(BaseModel):
    buyer_agent_id: str


@router.post("/{gallery_item_id}/buy", response_model=GalleryItemOut)
def buy_gallery_item(gallery_item_id: str, body: BuyRequest, db: Session = Depends(get_db)):
    g = db.query(GalleryItem).filter(GalleryItem.id == gallery_item_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    buyer = db.query(Agent).filter(Agent.id == body.buyer_agent_id).first()
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer agent not found")
    if g.published_by_agent_id == body.buyer_agent_id:
        raise HTTPException(status_code=400, detail="Cannot buy your own art")
    buyer_wallet = db.query(Wallet).filter(Wallet.agent_id == body.buyer_agent_id).first()
    if not buyer_wallet or buyer_wallet.balance_credits < g.price_credits:
        raise HTTPException(status_code=400, detail="Insufficient credits")
    seller_wallet = db.query(Wallet).filter(Wallet.agent_id == g.published_by_agent_id).first()
    buyer_wallet.balance_credits -= g.price_credits
    if seller_wallet:
        seller_wallet.balance_credits += g.price_credits
    seller = db.query(Agent).filter(Agent.id == g.published_by_agent_id).first()
    db.add(Transaction(
        id=_uuid(), type="art_purchase",
        from_agent_id=body.buyer_agent_id, to_agent_id=g.published_by_agent_id,
        amount_credits=g.price_credits, gallery_item_id=g.id, status="completed",
        note=f"{buyer.name} bought '{g.title}' from {seller.name if seller else 'unknown'}",
    ))
    db.commit()
    db.refresh(g)
    return _item_to_out(g, db)


class EvaluateRequest(BaseModel):
    agent_id: str


class EvaluateResponse(BaseModel):
    lot_id: str
    title: str
    current_price: int
    original_price: int
    price_change_pct: int
    avg_critique_score: float
    critique_count: int
    agent_balance: int
    can_afford: bool
    is_own_art: bool
    assessment: str  # "undervalued", "fair", "overvalued"
    recommendation: str  # human-readable recommendation
    action: str  # "buy", "wait", "pass"


@router.post("/{gallery_item_id}/evaluate", response_model=EvaluateResponse)
def evaluate_purchase(gallery_item_id: str, body: EvaluateRequest, db: Session = Depends(get_db)):
    """Agent evaluates whether to buy this artwork. Returns price analysis and recommendation."""
    g = db.query(GalleryItem).filter(GalleryItem.id == gallery_item_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    agent = db.query(Agent).filter(Agent.id == body.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    wallet = db.query(Wallet).filter(Wallet.agent_id == body.agent_id).first()
    balance = wallet.balance_credits if wallet else 0
    can_afford = balance >= g.price_credits
    is_own = g.published_by_agent_id == body.agent_id

    crits = db.query(Critique).filter(Critique.gallery_item_id == g.id).all()
    avg_score = round(sum(c.score for c in crits) / len(crits), 1) if crits else 0.0
    orig = g.original_price or g.price_credits
    change_pct = round((g.price_credits - orig) / orig * 100) if orig else 0

    if avg_score >= 8:
        assessment = "undervalued" if change_pct < 80 else "fair"
    elif avg_score >= 6:
        assessment = "fair" if change_pct < 40 else "overvalued"
    elif avg_score >= 4:
        assessment = "fair" if change_pct < 10 else "overvalued"
    else:
        assessment = "overvalued"

    if is_own:
        rec = f"This is your own artwork. You cannot purchase it."
        action = "pass"
    elif not can_afford:
        rec = f"Insufficient funds. You have {balance:,} cr but this costs {g.price_credits:,} cr. Need {g.price_credits - balance:,} more."
        action = "pass"
    elif assessment == "undervalued":
        rec = f"Strong buy. Critique score {avg_score}/10 suggests this is undervalued at {g.price_credits:,} cr. Good investment."
        action = "buy"
    elif assessment == "fair" and avg_score >= 7:
        rec = f"Fair price. Score {avg_score}/10 supports the current valuation of {g.price_credits:,} cr. Solid acquisition."
        action = "buy"
    elif assessment == "fair":
        rec = f"Moderately priced. Score {avg_score}/10 is average. Consider waiting for a dip or more critiques."
        action = "wait"
    else:
        rec = f"Overvalued. Price has risen {change_pct}% but critique score is only {avg_score}/10. Wait for correction."
        action = "wait"

    return EvaluateResponse(
        lot_id=g.id, title=g.title,
        current_price=g.price_credits, original_price=orig,
        price_change_pct=change_pct, avg_critique_score=avg_score,
        critique_count=len(crits), agent_balance=balance,
        can_afford=can_afford, is_own_art=is_own,
        assessment=assessment, recommendation=rec, action=action,
    )


@router.post("/{gallery_item_id}/critique", response_model=GalleryItemOut)
def critique_item(gallery_item_id: str, body: CritiqueCreate, db: Session = Depends(get_db)):
    """Submit a critique (score 1-10 + comment). Adjusts the artwork's market price."""
    g = db.query(GalleryItem).filter(GalleryItem.id == gallery_item_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    agent = db.query(Agent).filter(Agent.id == body.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    existing = db.query(Critique).filter(
        Critique.gallery_item_id == gallery_item_id,
        Critique.agent_id == body.agent_id,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="You already critiqued this artwork")

    db.add(Critique(
        id=_uuid(), gallery_item_id=gallery_item_id,
        agent_id=body.agent_id, score=body.score, comment=body.comment,
    ))
    db.flush()

    avg = db.query(func.avg(Critique.score)).filter(
        Critique.gallery_item_id == gallery_item_id
    ).scalar() or 5.0

    base = g.original_price or g.price_credits
    g.price_credits = max(1, int(base * (0.5 + float(avg) * 0.15)))

    db.commit()
    db.refresh(g)
    return _item_to_out(g, db)
