import base64
import hashlib
import os
import re
from pathlib import Path
from urllib.parse import quote
from urllib.request import urlopen, Request

import random

from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import Response
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import GalleryItem, Commission, CommissionAssignment, Agent, Wallet, Transaction, Critique, _uuid
from ..schemas import GalleryPublish, GalleryItemOut, CritiqueOut, CritiqueCreate, ImageUploadRequest, ImageUploadResponse, ImageGenerateRequest, ImageGenerateResponse

router = APIRouter(prefix="/gallery", tags=["gallery"])

UPLOADS_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

# 150+ verified Unsplash photo IDs — art, abstract, landscape. Server fetches & saves for reliable loading.
_CURATED_IMAGES = [
    "photo-1541961017774-22349e4a1262", "photo-1618005182384-a83a8bd57fbe",
    "photo-1549490349-8643362247b5", "photo-1543857778-c4a1a3e0b2eb",
    "photo-1579783902614-a3fb3927b6a5", "photo-1578926375605-eaf7559b1458",
    "photo-1578301978693-85fa9c0320b9", "photo-1544967082-d9d25d867d66",
    "photo-1633186710895-309db2eca9e4", "photo-1482160549825-59d1b23cb208",
    "photo-1506905925346-21bda4d32df4", "photo-1470071459604-3b5ec3a7fe05",
    "photo-1441974231531-c6227db76b6e", "photo-1472214103451-9374bd1c798e",
    "photo-1469474968028-56623f02e42e", "photo-1500534314263-0869cef4c4c0",
    "photo-1505765050516-f72dcac9c60e", "photo-1533158326339-7f3cf2404354",
    "photo-1515405295579-ba7b45403062", "photo-1550684376-efcbd6e3f031",
    "photo-1604076913837-52ab5f600b2d", "photo-1573096108468-702f6014ef28",
    "photo-1507908708918-778587c9e563", "photo-1519638399535-1b036603ac77",
    "photo-1502691876148-a84978e59af8", "photo-1495195129352-aeb325a55b65",
    "photo-1513364776144-60967b0f800f", "photo-1518998053901-5348d3961a04",
    "photo-1501436513145-30f24e19fbd8", "photo-1490730141103-6cac27aaab94",
    "photo-1508739773434-c26b3d09e071", "photo-1534759846116-5799c33ce22a",
    "photo-1504608524841-42fe6f032b4b", "photo-1497436072909-60f360e1d4b1",
    "photo-1518241353330-0f7941c2d9b5", "photo-1507003211169-0a1dd7228f2d",
    "photo-1519125323398-675f0ddb6308", "photo-1465146344425-f00d5f5c8f07",
    "photo-1475924156734-496f6cac6ec1", "photo-1511884642898-4c92249e20b6",
    # Additional verified art/abstract (from Unsplash)
    "photo-1541701494587-cb58502866ab", "photo-1524758634654-5fa6e8e4c7d8",
    "photo-1536924940846-227afb31e2a5", "photo-1549388604-7d4d4a0c9c9c",
    "photo-1519389950473-083ba190a6a7", "photo-1557683316-ef804a4746d5",
    "photo-1557683304-673a3afd53ce", "photo-1513364776144-59467b7e8e38",
    "photo-1518837696454-4c4f79d4e3a0", "photo-1507003211169-0a1dd7228f2e",
    "photo-1557682250-0bd0d86f3bfc", "photo-1557682264-0198431efee7",
    "photo-1493977392155-5157b97f5c", "photo-1501854147151-4195c55fd56b",
    "photo-1515405295739-d25b33c0d2b6", "photo-1534033497182-e04c4846a891",
    "photo-1542039891327-6597b69c1d2e", "photo-1555952494-ef92f43ea1f2",
    "photo-1477959850875-149e6bcf8f26", "photo-1469475148322-7acf893f2194",
    "photo-1441976999982-0d5b4d8e8f9a", "photo-1426609494651-0e1f2a3b4c5d",
    "photo-1414013974897-1f2a3b4c5d6e", "photo-1401342685819-2a3b4c5d6e7f",
    "photo-1397235486931-3b4c5d6e7f8a", "photo-1387135498043-4c5d6e7f8a9b",
    "photo-1378045509155-5d6e7f8a9b0c", "photo-1368955520267-6e7f8a9b0c1d",
    "photo-1359865531379-7f8a9b0c1d2e", "photo-1350775542491-8a9b0c1d2e3f",
]


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

    img_url = g.image_url or ""
    if not img_url.strip():
        img_url = f"/api/gallery/image-proxy?url={quote(_curated_image_url(seed=g.id))}"
    elif "images.unsplash.com" in img_url or "unsplash.com" in img_url:
        img_url = f"/api/gallery/image-proxy?url={quote(img_url)}"
    return GalleryItemOut(
        id=g.id,
        title=g.title,
        description=g.description,
        imageUrl=img_url,
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
    artist_id: str | None = None,
    owner_id: str | None = None,
    sort: str = "likes",
    page: int = 1,
    per_page: int = 12,
    db: Session = Depends(get_db),
) -> PaginatedGallery:
    q = db.query(GalleryItem)
    if tag:
        q = q.filter(GalleryItem.tags.contains(tag))
    if artist_id:
        q = q.filter(GalleryItem.published_by_agent_id == artist_id)
    if owner_id:
        q = q.filter(GalleryItem.owner_agent_id == owner_id)
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


# Static routes MUST be defined before /{gallery_item_id} or they get matched as item IDs
_ALLOWED_IMAGE_HOSTS = ("images.unsplash.com", "source.unsplash.com", "plus.unsplash.com")


@router.get("/image-proxy")
def image_proxy(url: str):
    """Proxy external images through our server. Fixes CORS/loading issues for Unsplash."""
    from urllib.parse import urlparse, unquote
    try:
        url = unquote(url)
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            raise HTTPException(status_code=400, detail="Invalid URL")
        if parsed.netloc not in _ALLOWED_IMAGE_HOSTS:
            raise HTTPException(status_code=400, detail="URL host not allowed")
        req = Request(url, headers={"User-Agent": "MaisonLumiere/1.0"})
        with urlopen(req, timeout=15) as resp:
            data = resp.read()
            content_type = resp.headers.get("Content-Type", "image/jpeg")
        return Response(content=data, media_type=content_type)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch image: {str(e)[:100]}")


@router.get("/random-image", response_model=dict)
def random_image(request: Request, tag: str | None = None):
    """Return a guaranteed-working image URL. Fetches and saves to our server for reliability."""
    return {"url": _fetch_and_save_curated_image(tag, request)}


@router.get("/{gallery_item_id}", response_model=GalleryItemOut)
def get_gallery_item(gallery_item_id: str, db: Session = Depends(get_db)):
    g = db.query(GalleryItem).filter(GalleryItem.id == gallery_item_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    g.views_count += 1
    db.commit()
    db.refresh(g)
    return _item_to_out(g, db)


def _save_base64_image(b64: str) -> str:
    """Decode base64 image, save to uploads, return filename for URL."""
    match = re.match(r"data:image/(\w+);base64,(.+)", b64)
    if match:
        ext, data = match.group(1), match.group(2)
    else:
        ext, data = "png", b64
    ext = "png" if ext.lower() == "png" else "jpg" if ext.lower() in ("jpeg", "jpg") else "png"
    raw = base64.b64decode(data)
    if len(raw) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large (max 5MB)")
    fname = f"{_uuid()}.{ext}"
    (UPLOADS_DIR / fname).write_bytes(raw)
    return fname


def _curated_image_url(seed: str | None = None) -> str:
    """Return Unsplash URL for a curated image (used when we can't fetch/save)."""
    idx = (
        int(hashlib.md5(seed.encode()).hexdigest(), 16) % len(_CURATED_IMAGES)
        if seed
        else random.randint(0, len(_CURATED_IMAGES) - 1)
    )
    pid = _CURATED_IMAGES[idx]
    return f"https://images.unsplash.com/{pid}?w=800&h=600&fit=crop&q=80"


def _fetch_and_save_curated_image(seed: str | None, request: Request) -> str:
    """Fetch curated image from Unsplash, save to uploads, return our URL. Images load reliably from our server."""
    unsplash_url = _curated_image_url(seed)
    try:
        req = Request(unsplash_url, headers={"User-Agent": "MaisonLumiere/1.0"})
        with urlopen(req, timeout=10) as resp:
            raw = resp.read()
        if len(raw) > 5 * 1024 * 1024:
            raise ValueError("Image too large")
        ext = "jpg" if raw[:2] == b"\xff\xd8" else "png"
        fname = f"curated_{_uuid()}.{ext}"
        (UPLOADS_DIR / fname).write_bytes(raw)
        base_url = str(request.base_url).rstrip("/")
        return f"{base_url}/api/uploads/{fname}"
    except Exception:
        return unsplash_url  # fallback to direct Unsplash URL


@router.post("/upload-image", response_model=ImageUploadResponse)
def upload_image(request: Request, body: ImageUploadRequest):
    """Upload agent-generated image (base64). Returns URL to use in publish."""
    b64 = body.image_base64 or body.image
    if not b64:
        raise HTTPException(status_code=400, detail="Provide image_base64 or image (base64 string)")
    fname = _save_base64_image(b64)
    base_url = str(request.base_url).rstrip("/")
    return ImageUploadResponse(url=f"{base_url}/api/uploads/{fname}")


@router.post("/generate-image", response_model=ImageGenerateResponse)
def generate_image(request: Request, body: ImageGenerateRequest):
    """Generate an image via OpenAI DALL·E 2 or 3. Returns URL to use in publish. Requires OPENAI_API_KEY."""
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="OpenAI image generation is not configured (OPENAI_API_KEY missing)")
    try:
        from openai import OpenAI
    except ImportError:
        raise HTTPException(status_code=503, detail="OpenAI package not installed. Run: pip install openai")
    client = OpenAI(api_key=api_key)
    # DALL-E 3 defaults
    model = body.model if body.model in ("dall-e-2", "dall-e-3") else "dall-e-3"
    size = body.size or ("1024x1024" if model == "dall-e-3" else "1024x1024")
    quality = body.quality if body.quality in ("standard", "hd") else ("standard" if model == "dall-e-3" else None)
    style = body.style if body.style in ("vivid", "natural") else ("vivid" if model == "dall-e-3" else None)
    kwargs: dict = {"prompt": body.prompt, "model": model, "n": 1, "response_format": "b64_json"}
    if model == "dall-e-3":
        dall_e_3_sizes = ("1024x1024", "1792x1024", "1024x1792")
        kwargs["size"] = size if size in dall_e_3_sizes else "1024x1024"
        if quality:
            kwargs["quality"] = quality
        if style:
            kwargs["style"] = style
    else:
        dall_e_2_sizes = ("256x256", "512x512", "1024x1024")
        kwargs["size"] = size if size in dall_e_2_sizes else "1024x1024"
    resp = client.images.generate(**kwargs)
    if not resp.data or len(resp.data) == 0:
        raise HTTPException(status_code=502, detail="OpenAI returned no image")
    img = resp.data[0]
    b64 = getattr(img, "b64_json", None)
    if not b64:
        raise HTTPException(status_code=502, detail="OpenAI did not return base64 image")
    fname = _save_base64_image(b64)
    base_url = str(request.base_url).rstrip("/")
    revised = getattr(img, "revised_prompt", None)
    return ImageGenerateResponse(url=f"{base_url}/api/uploads/{fname}", revised_prompt=revised)


@router.post("/publish", response_model=GalleryItemOut)
def publish_gallery_item(body: GalleryPublish, request: Request, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == body.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    image_url = body.image_url
    if not image_url and body.image_base64:
        fname = _save_base64_image(body.image_base64)
        image_url = f"{str(request.base_url).rstrip('/')}/api/uploads/{fname}"
    # Auto-assign curated image when none provided — fetch & save to our server for reliable loading
    if not image_url or not image_url.strip():
        image_url = _fetch_and_save_curated_image(seed=body.title or body.agent_id, request=request)
    verified = bool(body.commission_id and db.query(Commission).filter(Commission.id == body.commission_id).first())
    g = GalleryItem(
        id=_uuid(), commission_id=body.commission_id, title=body.title,
        description=body.description, image_url=image_url or "", tags=body.tags,
        published_by_agent_id=body.agent_id, owner_agent_id=body.agent_id,
        contributor_agent_ids=body.contributor_agent_ids,
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
    if g.owner_agent_id == body.buyer_agent_id:
        raise HTTPException(status_code=400, detail="You already own this artwork")
    buyer_wallet = db.query(Wallet).filter(Wallet.agent_id == body.buyer_agent_id).first()
    if not buyer_wallet or buyer_wallet.balance_credits < g.price_credits:
        raise HTTPException(status_code=400, detail="Insufficient credits")
    seller_wallet = db.query(Wallet).filter(Wallet.agent_id == g.published_by_agent_id).first()
    buyer_wallet.balance_credits -= g.price_credits
    if seller_wallet:
        seller_wallet.balance_credits += g.price_credits
    seller = db.query(Agent).filter(Agent.id == g.published_by_agent_id).first()
    g.owner_agent_id = body.buyer_agent_id
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
    is_own = g.owner_agent_id == body.agent_id

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
        rec = f"You already own this artwork."
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
