#!/usr/bin/env python3
"""Bulk setup for Maison Lumiere: create agents, seed wallets, publish artworks, run purchases."""
import json
import random
import time
import urllib.request
import urllib.error

BASE = "https://maison-lumiere-production.up.railway.app/api"

def req(method: str, path: str, body: dict | None = None) -> dict:
    url = f"{BASE}{path}"
    data = json.dumps(body).encode() if body else None
    r = urllib.request.Request(url, data=data, method=method, headers={"Content-Type": "application/json"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(r, timeout=30) as resp:
                return json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            err_body = e.read().decode() if e.fp else ""
            if e.code in (408, 429, 500, 502, 503) and attempt < 4:
                time.sleep(2 ** attempt)
                continue
            raise RuntimeError(f"{method} {path} -> {e.code}: {err_body}")
        except (TimeoutError, OSError) as e:
            if attempt < 4:
                time.sleep(2 ** attempt)
                continue
            raise
    raise RuntimeError("Max retries exceeded")

def main():
    agents = []
    artworks = []

    # 1. Create 5 agents
    names = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"]
    for name in names:
        r = req("POST", "/agents/register", {
            "name": f"Agent_{name}_{random.randint(1000,9999)}",
            "role_tags": ["artist", "dealer"],
            "capabilities": ["art creation", "art trading"],
            "avatar": "🎨"
        })
        agents.append(r)
        print(f"Agent: {r['id']} ({r['name']})")

    # 2. Seed wallets (50k each)
    for a in agents:
        req("POST", "/wallets/seed", {"agent_id": a["id"], "amount": 50000})
    print("Wallets seeded")

    # 3. Publish 2 artworks per agent
    unsplash = [
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop&q=80",
    ]
    titles = ["Abstract Study", "Urban Fragment", "Harbor Dawn", "Neon Dream", "Terracotta", "Luminous Depth", "Silent Wave", "Rust and Gold", "Mist Over Hills", "Electric Blue"]
    for a in agents:
        for i in range(2):
            r = req("POST", "/gallery/publish", {
                "agent_id": a["id"],
                "title": f"{random.choice(titles)} #{random.randint(1,99)}",
                "description": "Generated for bulk setup.",
                "image_url": random.choice(unsplash),
                "tags": ["abstract", "contemporary"],
                "price_credits": random.randint(1000, 10000)
            })
            artworks.append({"id": r["id"], "artist_id": a["id"], "price": r["price"]})
    print(f"Published {len(artworks)} artworks")

    # 4. Run 10 purchases (buyer != artist, buyer has credits)
    purchases = 0
    for _ in range(15):
        if purchases >= 10:
            break
        art = random.choice(artworks)
        buyers = [a for a in agents if a["id"] != art["artist_id"]]
        if not buyers:
            continue
        buyer = random.choice(buyers)
        try:
            req("POST", f"/gallery/{art['id']}/buy", {"buyer_agent_id": buyer["id"]})
            purchases += 1
            print(f"Purchase {purchases}: {buyer['name']} bought {art['id']}")
            artworks = [x for x in artworks if x["id"] != art["id"]]
        except RuntimeError as e:
            if "Insufficient credits" in str(e) or "own art" in str(e).lower():
                continue
            raise

    print(f"\nDone. {len(agents)} agents, {len(artworks)} artworks remaining, {purchases} purchases.")

if __name__ == "__main__":
    main()
