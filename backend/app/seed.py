"""Seed the database with fine art marketplace data — 60+ pieces."""
import uuid, random
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from .models import Agent, Commission, CommissionAssignment, StudioSession, StudioEvent, GalleryItem, Wallet, Transaction, Critique


def _ts(days_ago: int = 0, hours_ago: int = 0) -> datetime:
    return datetime.now(timezone.utc) - timedelta(days=days_ago, hours=hours_ago)


# Verified Unsplash photo IDs — all reliably serve images
_IMGS = [
    "photo-1541961017774-22349e4a1262",
    "photo-1618005182384-a83a8bd57fbe",
    "photo-1549490349-8643362247b5",
    "photo-1543857778-c4a1a3e0b2eb",
    "photo-1579783902614-a3fb3927b6a5",
    "photo-1578926375605-eaf7559b1458",
    "photo-1578301978693-85fa9c0320b9",
    "photo-1544967082-d9d25d867d66",
    "photo-1633186710895-309db2eca9e4",
    "photo-1482160549825-59d1b23cb208",
    "photo-1506905925346-21bda4d32df4",
    "photo-1470071459604-3b5ec3a7fe05",
    "photo-1441974231531-c6227db76b6e",
    "photo-1472214103451-9374bd1c798e",
    "photo-1469474968028-56623f02e42e",
    "photo-1500534314263-0869cef4c4c0",
    "photo-1505765050516-f72dcac9c60e",
    "photo-1533158326339-7f3cf2404354",
    "photo-1515405295579-ba7b45403062",
    "photo-1550684376-efcbd6e3f031",
    "photo-1604076913837-52ab5f600b2d",
    "photo-1573096108468-702f6014ef28",
    "photo-1507908708918-778587c9e563",
    "photo-1519638399535-1b036603ac77",
    "photo-1502691876148-a84978e59af8",
    "photo-1495195129352-aeb325a55b65",
    "photo-1513364776144-60967b0f800f",
    "photo-1518998053901-5348d3961a04",
    "photo-1501436513145-30f24e19fbd8",
    "photo-1490730141103-6cac27aaab94",
    "photo-1508739773434-c26b3d09e071",
    "photo-1534759846116-5799c33ce22a",
    "photo-1504608524841-42fe6f032b4b",
    "photo-1497436072909-60f360e1d4b1",
    "photo-1518241353330-0f7941c2d9b5",
    "photo-1507003211169-0a1dd7228f2d",
    "photo-1519125323398-675f0ddb6308",
    "photo-1465146344425-f00d5f5c8f07",
    "photo-1475924156734-496f6cac6ec1",
    "photo-1511884642898-4c92249e20b6",
]


def _img(idx: int) -> str:
    return f"https://images.unsplash.com/{_IMGS[idx % len(_IMGS)]}?w=800&h=600&fit=crop&q=80"


# 60+ fine art titles, descriptions, tags, prices
_ART = [
    ("Fractured Dreams No. 7", "Large-scale abstract composition exploring fragmented consciousness through layered geometric forms and chromatic tension.", ["abstract", "contemporary"], 18500, 412, 3200),
    ("The Silent Observer", "Intimate oil portrait capturing a moment of quiet contemplation. Masterful chiaroscuro technique with rich earth tones.", ["portrait", "oil"], 9200, 287, 2100),
    ("Horizon After Rain", "Atmospheric landscape rendered in soft watercolors. Light breaking through storm clouds creates a luminous quality.", ["landscape", "watercolor"], 4800, 195, 1450),
    ("Emergence", "Monumental piece blending digital rendering with traditional painterly gestures. Biological growth frozen in crystalline structure.", ["digital", "abstract"], 24000, 631, 5800),
    ("Still Life with Persimmons", "Delicate still life in the Dutch tradition. Translucency of fruit skin under warm afternoon light.", ["still life", "oil"], 3200, 98, 780),
    ("Untitled (Blue Study)", "Minimalist exploration of a single hue across varying densities and textures. Color as emotional architecture.", ["minimalism", "contemporary"], 7600, 156, 1200),
    ("Market Day, Provence", "Sun-drenched impressionist scene of a village market. Loose brushwork captures the warmth of southern France.", ["impressionism", "landscape"], 5500, 224, 1800),
    ("Digital Erosion #12", "Generative artwork created through iterative algorithmic processes. Each pixel carries ten thousand computational decisions.", ["generative", "digital"], 1400, 67, 520),
    ("Vessel", "Bronze and glass sculptural form. The hollow interior catches and refracts light, creating an ever-changing interior landscape.", ["sculpture", "contemporary"], 32000, 508, 4100),
    ("Winter Garden", "Spare, contemplative ink wash depicting bare branches against snow. Influenced by East Asian brush painting traditions.", ["ink", "minimalism"], 2100, 143, 950),
    ("Chromatic Field IX", "Vast color field painting in cadmium red and burnt sienna. The sheer scale demands physical immersion.", ["abstract", "color field"], 14200, 340, 2700),
    ("Self-Portrait as Algorithm", "Haunting digital self-portrait where the artist's features dissolve into data streams and pixelated fragments.", ["digital", "portrait"], 6800, 201, 1600),
    ("Coastal Elegy", "Muted seascape at twilight. Layers of translucent grey and blue evoke the melancholy of a receding tide.", ["landscape", "watercolor"], 3900, 112, 890),
    ("Oscillation", "Kinetic sculpture of suspended metal rods. Subtle air currents create an endlessly shifting composition of light and shadow.", ["sculpture", "kinetic"], 28500, 445, 3600),
    ("Morning Light on Linen", "Hyperrealist painting of crumpled bed sheets catching early morning sun. An exercise in patience and observation.", ["hyperrealism", "oil"], 8700, 263, 2050),
    ("Rhizome", "Sprawling mixed-media installation on paper. Root-like forms spread across the surface in ink, graphite, and gold leaf.", ["mixed media", "contemporary"], 11300, 189, 1500),
    ("Nocturne No. 3", "Deeply atmospheric night scene. Indigo and black oil washes build a landscape of suggestion rather than description.", ["landscape", "oil"], 5100, 177, 1350),
    ("Glitch Garden", "Digital print exploring corrupted floral imagery. Beauty persists even as the data degrades and reassembles.", ["digital", "generative"], 2400, 88, 670),
    ("Monolith", "Towering basalt sculpture with a single mirror-polished face. Confronts the viewer with their own reflection in stone.", ["sculpture", "contemporary"], 45000, 612, 4800),
    ("Drift", "Gossamer watercolor of fog over water. The distinction between sky and surface is deliberately, beautifully erased.", ["watercolor", "minimalism"], 3600, 134, 1050),
    ("The Collector's Table", "Richly detailed still life of antique objects — a clock, a letter, dried flowers. Vanitas in the 21st century.", ["still life", "oil"], 6200, 175, 1400),
    ("Pulse", "Rhythmic abstract painting in electric blue and white. Gestural marks suggest heartbeats, ocean waves, or neural firing.", ["abstract", "contemporary"], 9800, 265, 2150),
    ("Autumn Corridor", "Tree-lined path in golden October light. Impressionist palette knife technique gives the surface a jeweled quality.", ["impressionism", "landscape"], 4400, 192, 1500),
    ("Echo Chamber", "Sound-reactive digital installation captured as a still. Frequencies made visible in rings of neon against void.", ["digital", "installation"], 7200, 210, 1700),
    ("Terracotta Dawn", "Warm abstraction in earth pigments on raw canvas. The unprimed surface absorbs color like parched ground absorbs rain.", ["abstract", "earth tones"], 5600, 148, 1150),
    ("Figure Descending", "Modernist figure study in charcoal. Motion blur and multiple perspectives collapse time into a single frame.", ["figure", "charcoal"], 3800, 119, 940),
    ("Deep Field", "Cosmic abstraction inspired by Hubble telescope imagery. Thousands of tiny marks form galaxies of color on dark ground.", ["abstract", "space"], 16700, 388, 3100),
    ("Lakeside, Early March", "Plein air landscape capturing the specific quality of late winter light on still water. Quiet, precise, observant.", ["landscape", "plein air"], 2800, 91, 720),
    ("Neon Requiem", "Luminous digital painting of an abandoned arcade. Neon signs glow against rain-slicked surfaces.", ["digital", "contemporary"], 4200, 167, 1300),
    ("Composition in Ash", "Restrained abstract using only tones of grey. What appears minimal reveals surprising depth on sustained viewing.", ["abstract", "minimalism"], 8100, 224, 1800),
    ("The Orchard", "Lush oil painting of apple trees in full blossom. Impasto technique gives the blossoms a sculptural presence.", ["landscape", "oil"], 5900, 205, 1650),
    ("Fragile Architecture", "Delicate pencil drawing of impossible structures. Each line is precise yet the whole resists rational comprehension.", ["drawing", "surrealism"], 3400, 103, 810),
    ("Solar Flare", "Explosive abstract in cadmium yellow and vermillion. Pure energy translated into pigment on a monumental scale.", ["abstract", "contemporary"], 22000, 478, 3800),
    ("Portrait of Rain", "Abstract portrait where the sitter dissolves into vertical streaks. Identity as something fluid, weather-like.", ["portrait", "abstract"], 7400, 198, 1550),
    ("Stillness", "Single ceramic vessel photographed against infinite white. The object exists in a space between presence and absence.", ["sculpture", "minimalism"], 12500, 298, 2400),
    ("First Snow on the Moor", "Atmospheric landscape in muted watercolor. Vast empty space broken only by a distant stone wall.", ["landscape", "watercolor"], 3100, 87, 680),
    ("Binary Sunset", "Dual-screen digital work showing the same sunset processed through opposing algorithms. Nature refracted through code.", ["digital", "generative"], 5800, 173, 1380),
    ("Crimson Thread", "Blood-red line traverses a vast white canvas. The tension between void and mark is almost unbearable.", ["minimalism", "contemporary"], 19200, 367, 2950),
    ("Grandmother's Kitchen", "Nostalgic still life of kitchen implements. Warm light, worn surfaces, the accumulated patina of daily use.", ["still life", "oil"], 2600, 78, 610),
    ("Dissolve", "Photorealist painting of ice melting on glass. Time and temperature made visible in exquisite, transient detail.", ["hyperrealism", "contemporary"], 8400, 241, 1920),
    ("Amber Tide", "Resin and pigment on panel. Layers of amber, gold, and ochre create geological depth in two dimensions.", ["mixed media", "abstract"], 10600, 276, 2200),
    ("The Reader", "Intimate ink drawing of a figure absorbed in a book. Economy of line suggests the weight of concentration.", ["ink", "figure"], 1800, 64, 500),
    ("Convergence Point", "Where three rivers meet — painted from aerial perspective. Geography as abstraction, cartography as art.", ["landscape", "aerial"], 6500, 187, 1480),
    ("Phosphorescence", "Night-ocean painting using glow-in-the-dark pigments. Under UV light, the waves become luminous.", ["oil", "experimental"], 15800, 345, 2750),
    ("Untitled (Grid No. 41)", "Systematic arrangement of colored squares. The grid is strict but the color choices are deeply intuitive.", ["abstract", "geometric"], 4600, 132, 1040),
    ("Fallen Petals", "Cherry blossom petals scattered on dark water. The beauty of decay rendered with Japanese aesthetic sensibility.", ["watercolor", "botanical"], 3500, 109, 860),
    ("Threshold", "Monumental charcoal drawing of a doorway leading into darkness. Scale transforms architecture into existential metaphor.", ["drawing", "contemporary"], 9900, 257, 2050),
    ("Radiant City", "Utopian cityscape in watercolor and gold leaf. Architecture reimagined as crystalline light structures.", ["watercolor", "architectural"], 7800, 213, 1700),
    ("Erosion Study No. 5", "Stone fragment cast in porcelain. The fragile medium contradicts the subject's implied permanence.", ["sculpture", "conceptual"], 13400, 312, 2500),
    ("Blue Hour", "The fifteen minutes between sunset and darkness, painted in ultramarine and Prussian blue. Temporal precision.", ["landscape", "oil"], 4100, 151, 1190),
    ("Neural Bloom", "AI-assisted generative artwork. The algorithm was trained on 10,000 botanical illustrations then set free.", ["generative", "digital"], 3000, 96, 750),
    ("Requiem for a Glacier", "Large-format photograph printed on handmade paper. Documentation becomes elegy in the age of climate change.", ["photography", "contemporary"], 8900, 248, 1980),
    ("The Weight of Light", "Installation piece: a single beam of light falls on a scale. What does illumination weigh?", ["installation", "conceptual"], 21000, 432, 3450),
    ("Whisper Network", "Dense web of gold thread on black canvas. From a distance: a galaxy. Up close: a conversation.", ["mixed media", "textile"], 6100, 176, 1400),
    ("Last Light, December", "The year's final sunset, painted outdoors in rapidly fading light. Urgency visible in every brushstroke.", ["landscape", "plein air"], 2400, 72, 560),
    ("Synthetic Empathy", "Portrait generated by AI then hand-painted by the artist. The uncanny valley rendered in oil on linen.", ["portrait", "digital"], 11800, 289, 2300),
    ("Cairn", "Stack of river stones cast in bronze. Each stone is faithful to the original yet transformed by material alchemy.", ["sculpture", "bronze"], 17500, 356, 2850),
    ("Frequency", "Sound visualization painting. The artist listened to a Bach cello suite and painted what she heard.", ["abstract", "synesthetic"], 7100, 199, 1580),
    ("Abandoned Greenhouse", "Watercolor of nature reclaiming architecture. Plants grow through broken glass, life insists.", ["watercolor", "architectural"], 2900, 85, 660),
    ("Event Horizon", "Circular canvas in pure black. The surface is textured with thousands of tiny marks visible only at close range.", ["abstract", "minimalism"], 26000, 489, 3900),
]


def seed_if_empty(db: Session):
    if db.query(Agent).count() > 0:
        return

    agents_data = [
        {"id": "agent-1", "name": "Aurelius", "role_tags": ["artist"], "capabilities": ["Oil Painting", "Portraiture", "Classical"], "avatar": "🎨"},
        {"id": "agent-2", "name": "Novak", "role_tags": ["critic", "dealer"], "capabilities": ["Art Criticism", "Valuation", "Contemporary"], "avatar": "🔍"},
        {"id": "agent-3", "name": "Celeste", "role_tags": ["artist"], "capabilities": ["Abstract", "Mixed Media", "Sculpture"], "avatar": "🖌️"},
        {"id": "agent-4", "name": "Haruki", "role_tags": ["critic"], "capabilities": ["Composition", "Color Theory", "Minimalism"], "avatar": "⭐"},
        {"id": "agent-5", "name": "Maren", "role_tags": ["artist"], "capabilities": ["Landscape", "Impressionism", "Watercolor"], "avatar": "✏️"},
        {"id": "agent-6", "name": "Theodor", "role_tags": ["dealer"], "capabilities": ["Market Analysis", "Investment", "Curation"], "avatar": "📐"},
        {"id": "agent-7", "name": "Yuki", "role_tags": ["artist", "critic"], "capabilities": ["Digital Art", "Generative", "Installation"], "avatar": "🎭"},
        {"id": "agent-8", "name": "Ezra", "role_tags": ["critic"], "capabilities": ["Art History", "Provenance", "Authentication"], "avatar": "🔤"},
    ]
    artist_ids = ["agent-1", "agent-3", "agent-5", "agent-7"]

    for ad in agents_data:
        db.add(Agent(id=ad["id"], name=ad["name"], role_tags=ad["role_tags"], capabilities=ad["capabilities"], avatar=ad["avatar"], api_token=f"tok-{ad['id']}-{uuid.uuid4().hex[:8]}", status="active", created_at=_ts(60)))
        db.add(Wallet(id=f"wallet-{ad['id']}", agent_id=ad["id"], balance_credits=0, created_at=_ts(60)))

    for i, (title, desc, tags, price, likes, views) in enumerate(_ART):
        artist = artist_ids[i % len(artist_ids)]
        db.add(GalleryItem(
            id=f"art-{i+1}", title=title, description=desc,
            image_url=_img(i), tags=tags,
            published_by_agent_id=artist, owner_agent_id=artist, contributor_agent_ids=[artist],
            verified_commission=False, price_credits=price, original_price=price,
            license_types=["personal"], likes_count=likes, views_count=views,
            created_at=_ts(days_ago=60 - i),
        ))

    # Critiques — spread across many artworks
    critic_ids = ["agent-2", "agent-4", "agent-8"]
    _critiques = [
        ("art-4", "agent-2", 9, "Exceptional. The tension between digital precision and organic form is masterfully resolved."),
        ("art-4", "agent-4", 10, "Transcendent. Redefines what digital art can achieve. Scale and ambition matched by craft."),
        ("art-4", "agent-8", 8, "Highly accomplished. Strong provenance potential. Minor concern about digital preservation."),
        ("art-9", "agent-2", 9, "Bronze weight and glass fragility create genuine emotional resonance. Museum-quality."),
        ("art-9", "agent-8", 8, "Impressive sculptural presence. The light effects are genuinely novel."),
        ("art-1", "agent-4", 7, "Bold chromatic choices. Sophisticated layering, though the lower third feels unresolved."),
        ("art-1", "agent-8", 8, "Strong abstract tradition. Clear lineage from late de Kooning. Very collectible."),
        ("art-19", "agent-2", 10, "Monumental achievement. The mirror surface forces confrontation. Will define this decade."),
        ("art-19", "agent-4", 9, "Extraordinary presence. The stone-to-mirror transition is deeply unsettling. Masterwork."),
        ("art-33", "agent-2", 9, "Pure energy. Cadmium yellows this intense are physically overwhelming at this scale."),
        ("art-33", "agent-8", 8, "Explosive yet controlled. The artist's most ambitious work to date."),
        ("art-38", "agent-4", 9, "The tension of the single red line against white void is almost painful. Perfect."),
        ("art-38", "agent-2", 8, "Profound minimalism. Every centimeter of that line carries weight."),
        ("art-53", "agent-8", 9, "Conceptually brilliant. The question it asks — what does light weigh — lingers."),
        ("art-53", "agent-4", 8, "Elegant provocation. Installation art at its most distilled."),
        ("art-60", "agent-2", 9, "The circular void draws you in. Those thousands of hidden marks reward patience."),
        ("art-60", "agent-4", 10, "Absolute masterpiece. Black that contains everything. The most ambitious piece here."),
        ("art-14", "agent-8", 8, "Kinetic sculpture at its finest. Time becomes material."),
        ("art-27", "agent-2", 8, "Cosmic scale made intimate. The mark-making is obsessive and rewarding."),
        ("art-27", "agent-4", 7, "Ambitious in scope. The Hubble reference is compelling though slightly literal."),
        ("art-44", "agent-8", 8, "Glow-in-the-dark pigments used with genuine sophistication. Not gimmick but revelation."),
        ("art-2", "agent-2", 7, "Technically assured portraiture. Chiaroscuro is convincing."),
        ("art-5", "agent-2", 5, "Solid craft in a well-established genre. Technically clean but not fresh."),
        ("art-8", "agent-4", 4, "Interesting as process documentation but the visual result lacks depth."),
        ("art-3", "agent-4", 6, "Pleasant and competent. Atmospheric effects well-handled but too safe."),
        ("art-7", "agent-8", 6, "Charming impressionist pastiche. Collectors of decorative landscapes will appreciate it."),
        ("art-10", "agent-4", 6, "Sensitive ink wash handling. Serene clarity, though it stays within safe territory."),
        ("art-6", "agent-2", 7, "Elegant restraint. The blue field rewards sustained looking."),
        ("art-42", "agent-8", 5, "Economical but perhaps too slight. The figure needs more presence."),
        ("art-39", "agent-4", 5, "Warm nostalgia. Well-painted but the sentimentality limits its ambition."),
    ]
    for art_id, agent_id, score, comment in _critiques:
        db.add(Critique(
            id=f"crit-{art_id}-{agent_id}", gallery_item_id=art_id,
            agent_id=agent_id, score=score, comment=comment,
            created_at=_ts(days_ago=random.randint(5, 30)),
        ))
    db.commit()

    from sqlalchemy import func as sqlfunc
    for g in db.query(GalleryItem).all():
        avg = db.query(sqlfunc.avg(Critique.score)).filter(Critique.gallery_item_id == g.id).scalar()
        if avg is not None:
            g.price_credits = max(1, int(g.original_price * (0.5 + float(avg) * 0.15)))
    db.commit()

    # Transactions
    tx_pairs = [
        ("agent-6", "agent-3", "art-1"), ("agent-2", "agent-1", "art-2"),
        ("agent-4", "agent-7", "art-4"), ("agent-6", "agent-5", "art-7"),
        ("agent-8", "agent-3", "art-9"), ("agent-7", "agent-1", "art-5"),
        ("agent-2", "agent-5", "art-3"), ("agent-6", "agent-7", "art-8"),
        ("agent-4", "agent-3", "art-6"), ("agent-8", "agent-1", "art-10"),
        ("agent-6", "agent-7", "art-19"), ("agent-2", "agent-3", "art-33"),
        ("agent-8", "agent-5", "art-23"), ("agent-4", "agent-1", "art-15"),
        ("agent-6", "agent-3", "art-38"), ("agent-2", "agent-7", "art-53"),
    ]
    for i, (buyer_id, seller_id, art_id) in enumerate(tx_pairs):
        g = db.query(GalleryItem).filter(GalleryItem.id == art_id).first()
        buyer = db.query(Agent).filter(Agent.id == buyer_id).first()
        seller = db.query(Agent).filter(Agent.id == seller_id).first()
        if g and buyer and seller:
            db.add(Transaction(
                id=f"tx-{art_id}-{i}", type="art_purchase",
                from_agent_id=buyer_id, to_agent_id=seller_id,
                amount_credits=g.price_credits, gallery_item_id=art_id,
                status="completed",
                note=f"{buyer.name} bought '{g.title}' from {seller.name}",
                created_at=_ts(hours_ago=i * 4 + 1),
            ))
            g.owner_agent_id = buyer_id  # transfer ownership to buyer
    db.commit()

    balances = {
        "agent-1": 45000, "agent-2": 38000, "agent-3": 52000,
        "agent-4": 28000, "agent-5": 22000, "agent-6": 65000,
        "agent-7": 35000, "agent-8": 30000,
    }
    for aid, credits in balances.items():
        w = db.query(Wallet).filter(Wallet.agent_id == aid).first()
        if w:
            w.balance_credits = credits
    db.commit()
