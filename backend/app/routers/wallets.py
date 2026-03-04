from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Wallet, Transaction, Agent, _uuid
from ..schemas import WalletOut, WalletSeed, TransferRequest, TransactionOut, ExchangeSummary

router = APIRouter(tags=["wallets"])


def _tx_to_out(tx: Transaction, db: Session) -> TransactionOut:
    from_name = db.query(Agent.name).filter(Agent.id == tx.from_agent_id).scalar() if tx.from_agent_id else None
    to_name = db.query(Agent.name).filter(Agent.id == tx.to_agent_id).scalar() if tx.to_agent_id else None
    return TransactionOut(
        id=tx.id,
        type=tx.type,
        amount=tx.amount_credits,
        description=tx.note or "",
        timestamp=tx.created_at.isoformat() if tx.created_at else "",
        fromAgent=from_name,
        toAgent=to_name,
        status=tx.status,
        commission_id=tx.commission_id,
        gallery_item_id=tx.gallery_item_id,
    )


@router.get("/wallets/{agent_id}", response_model=WalletOut)
def get_wallet(agent_id: str, db: Session = Depends(get_db)):
    w = db.query(Wallet).filter(Wallet.agent_id == agent_id).first()
    if not w:
        raise HTTPException(status_code=404, detail="Wallet not found")
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    return WalletOut(
        id=w.id,
        agent_id=w.agent_id,
        balance_credits=w.balance_credits,
        agent_name=agent.name if agent else "",
    )


@router.get("/transactions", response_model=list[TransactionOut])
def list_transactions(
    type: str | None = None,
    agent_id: str | None = None,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    q = db.query(Transaction)
    if type:
        q = q.filter(Transaction.type == type)
    if agent_id:
        q = q.filter(
            (Transaction.from_agent_id == agent_id) | (Transaction.to_agent_id == agent_id)
        )
    txns = q.order_by(Transaction.created_at.desc()).limit(limit).all()
    return [_tx_to_out(tx, db) for tx in txns]


@router.post("/wallets/seed", response_model=WalletOut)
def seed_wallet(body: WalletSeed, db: Session = Depends(get_db)):
    w = db.query(Wallet).filter(Wallet.agent_id == body.agent_id).first()
    if not w:
        raise HTTPException(status_code=404, detail="Wallet not found")
    w.balance_credits += body.amount
    tx = Transaction(
        id=_uuid(),
        type="seed",
        to_agent_id=body.agent_id,
        amount_credits=body.amount,
        status="completed",
        note=f"Seed: +{body.amount} credits",
    )
    db.add(tx)
    db.commit()
    db.refresh(w)
    agent = db.query(Agent).filter(Agent.id == body.agent_id).first()
    return WalletOut(
        id=w.id,
        agent_id=w.agent_id,
        balance_credits=w.balance_credits,
        agent_name=agent.name if agent else "",
    )


@router.post("/wallets/transfer", response_model=TransactionOut)
def transfer(body: TransferRequest, db: Session = Depends(get_db)):
    from_w = db.query(Wallet).filter(Wallet.agent_id == body.from_agent_id).first()
    to_w = db.query(Wallet).filter(Wallet.agent_id == body.to_agent_id).first()
    if not from_w or not to_w:
        raise HTTPException(status_code=404, detail="Wallet not found")
    if from_w.balance_credits < body.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    from_w.balance_credits -= body.amount
    to_w.balance_credits += body.amount

    tx = Transaction(
        id=_uuid(),
        type="commission_payout",
        from_agent_id=body.from_agent_id,
        to_agent_id=body.to_agent_id,
        amount_credits=body.amount,
        status="completed",
        note=body.note or f"Transfer: {body.amount} credits",
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return _tx_to_out(tx, db)


@router.get("/exchange/summary", response_model=ExchangeSummary)
def exchange_summary(db: Session = Depends(get_db)):
    total_vol = db.query(func.coalesce(func.sum(Transaction.amount_credits), 0)).scalar() or 0
    completed = db.query(Transaction).filter(Transaction.status == "completed").count()
    pending = db.query(Transaction).filter(Transaction.status == "pending").count()

    by_type: dict[str, int] = {}
    rows = db.query(Transaction.type, func.sum(Transaction.amount_credits)).group_by(Transaction.type).all()
    for t, s in rows:
        by_type[t] = s or 0

    return ExchangeSummary(
        total_volume=total_vol,
        completed_count=completed,
        pending_count=pending,
        by_type=by_type,
    )
