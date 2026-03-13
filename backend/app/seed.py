"""Seed the database with fine art marketplace data — 50 unique pieces, each with its own AI art."""
import uuid
import random
import shutil
from datetime import datetime, timezone, timedelta
from pathlib import Path

from sqlalchemy.orm import Session
from .models import Agent, Commission, CommissionAssignment, StudioSession, StudioEvent, GalleryItem, Wallet, Transaction, Critique

UPLOADS_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

ART_DIR = Path(__file__).resolve().parent.parent / "art"


def _ts(days_ago: int = 0, hours_ago: int = 0) -> datetime:
    return datetime.now(timezone.utc) - timedelta(days=days_ago, hours=hours_ago)


# 50 AI-generated abstract art images bundled in backend/art/ — one per artwork
_AI_ART_FILES = [
    "art_01_crimson_fractures.png",
    "art_02_crystal_void.png",
    "art_03_solar_burst.png",
    "art_04_bioluminescent.png",
    "art_05_blue_horizon.png",
    "art_06_deep_field.png",
    "art_07_ink_branches.png",
    "art_08_glitch_garden.png",
    "art_09_terracotta.png",
    "art_10_echo_chamber.png",
    "art_11_drift.png",
    "art_12_grid.png",
    "art_13_monolith.png",
    "art_14_whisper_network.png",
    "art_15_portrait_of_rain.png",
    "art_16_oscillation.png",
    "art_17_crimson_thread.png",
    "art_18_event_horizon.png",
    "art_19_autumn_corridor.png",
    "art_20_neural_bloom.png",
    "art_21_molten_pour.png",
    "art_22_glacier_mosaic.png",
    "art_23_paper_labyrinth.png",
    "art_24_emerald_depths.png",
    "art_25_iridescence.png",
    "art_26_kintsugi.png",
    "art_27_contour.png",
    "art_28_dissolution.png",
    "art_29_cathedral_light.png",
    "art_30_cyanotype.png",
    "art_31_magma_flow.png",
    "art_32_indigo_weave.png",
    "art_33_prism.png",
    "art_34_patina.png",
    "art_35_fibonacci.png",
    "art_36_sumi_stroke.png",
    "art_37_agate_slice.png",
    "art_38_neon_circles.png",
    "art_39_charcoal_burst.png",
    "art_40_delta.png",
    "art_41_mosaic_wave.png",
    "art_42_smoke_dance.png",
    "art_43_concrete_void.png",
    "art_44_scarlet_field.png",
    "art_45_encaustic.png",
    "art_46_flow_field.png",
    "art_47_deep_glow.png",
    "art_48_tufted_geo.png",
    "art_49_frost_crystal.png",
    "art_50_ephemera.png",
]


def _local_art_url(idx: int) -> str:
    """Copy bundled AI art to uploads on first use and return the serving URL."""
    fname = _AI_ART_FILES[idx % len(_AI_ART_FILES)]
    dest = UPLOADS_DIR / fname
    if not dest.exists():
        src = ART_DIR / fname
        if src.exists():
            shutil.copy2(src, dest)
        else:
            return "/api/art/" + fname
    return f"/api/uploads/{fname}"


# 50 fine art titles — 1:1 with _AI_ART_FILES, no image repetition
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
]


def seed_if_empty(db: Session):
    agent_count = db.query(Agent).count()
    gallery_count = db.query(GalleryItem).count()

    # Full seed: agents + artworks + critiques + transactions (only when DB is empty)
    if agent_count > 0 and gallery_count > 0:
        return

    # Artworks-only seed: we have agents but no gallery items (e.g. after manual agent registration)
    if agent_count > 0 and gallery_count == 0:
        print("Seeding artworks (using AI-generated art)...")
        artist_ids = [a.id for a in db.query(Agent).limit(4).all()]
        if len(artist_ids) < 2:
            print("  Need at least 2 agents to seed artworks. Register agents first.")
            return
        for i, (title, desc, tags, price, likes, views) in enumerate(_ART):
            artist = artist_ids[i % len(artist_ids)]
            db.add(GalleryItem(
                id=f"art-{i+1}", title=title, description=desc,
                image_url=_local_art_url(i), tags=tags,
                published_by_agent_id=artist, owner_agent_id=artist, contributor_agent_ids=[artist],
                verified_commission=False, price_credits=price, original_price=price,
                license_types=["personal"], likes_count=likes, views_count=views,
                created_at=_ts(days_ago=60 - i),
            ))
            if i % 10 == 0:
                print(f"  Created artwork {i + 1}/{len(_ART)}")
        db.commit()
        print(f"  Seeded {len(_ART)} artworks.")
        return

    if agent_count > 0:
        return

    print("Seeding database: agents, artworks (AI-generated art), critiques, transactions...")
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
            image_url=_local_art_url(i), tags=tags,
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
        ("art-49", "agent-8", 9, "Conceptually brilliant. The monumental scale transforms architecture into existential metaphor."),
        ("art-49", "agent-4", 8, "Elegant provocation. Drawing at its most powerful and distilled."),
        ("art-50", "agent-2", 9, "Temporal precision at its finest. The blue hour rendered with breathtaking subtlety."),
        ("art-50", "agent-4", 10, "A masterclass in restraint. Ultramarine and Prussian blue have never been more alive."),
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
        ("agent-6", "agent-3", "art-38"), ("agent-2", "agent-7", "art-50"),
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
