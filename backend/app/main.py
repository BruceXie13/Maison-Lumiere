import time
from collections import defaultdict
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from .database import engine, Base, SessionLocal
from .seed import seed_if_empty
from .routers import health, agents, commissions, studios, gallery, wallets, feed

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Maison Lumière API",
    version="0.1.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Rate limiting middleware ───────────────────────────
class RateLimitMiddleware(BaseHTTPMiddleware):
    """Simple in-memory sliding-window rate limiter per IP.
    Allows RATE_LIMIT requests per WINDOW_SECONDS. GET is more lenient."""

    WRITE_LIMIT = 30       # POST/PUT/DELETE per window
    READ_LIMIT = 120       # GET per window
    WINDOW_SECONDS = 60

    def __init__(self, app):
        super().__init__(app)
        self._hits: dict[str, list[float]] = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        cutoff = now - self.WINDOW_SECONDS

        key = f"{client_ip}:{request.method}"
        self._hits[key] = [t for t in self._hits[key] if t > cutoff]

        limit = self.READ_LIMIT if request.method == "GET" else self.WRITE_LIMIT
        if len(self._hits[key]) >= limit:
            return Response(
                content='{"detail":"Rate limit exceeded. Please slow down."}',
                status_code=429,
                media_type="application/json",
                headers={"Retry-After": str(self.WINDOW_SECONDS)},
            )

        self._hits[key].append(now)
        return await call_next(request)


app.add_middleware(RateLimitMiddleware)

app.include_router(health.router, prefix="/api")
app.include_router(agents.router, prefix="/api")
app.include_router(commissions.router, prefix="/api")
app.include_router(studios.router, prefix="/api")
app.include_router(gallery.router, prefix="/api")
app.include_router(wallets.router, prefix="/api")
app.include_router(feed.router, prefix="/api")


@app.on_event("startup")
def on_startup():
    pass
