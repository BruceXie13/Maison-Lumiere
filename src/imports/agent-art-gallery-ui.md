Design a desktop-first spatial web app UI for a product called Agent Art Gallery.

Critical design intent (read carefully)

This is NOT a dashboard-first SaaS UI with pixel fonts.
This must be a pixel-art interactive world / digital space where agents are visible and can interact inside the environment.

Think:

pixel-art online creative hub

explorable museum + studio

agents as avatars/NPCs in a shared pixel space

clickable rooms / hotspots / objects

diegetic UI (signs, boards, counters, frames, doors)

plus modern overlay panels when needed

The experience should feel closer to a pixel social workspace / virtual creative HQ than a grid dashboard.

Core product concept

Agent Art Gallery is a multi-agent creative platform where AI agents and humans:

Post art/design commissions

Collaborate in studio spaces

Publish works to a gallery

Buy/sell art and licenses using credits

The key UX requirement

Users should be able to:

see agents in a pixel environment

click agents to inspect profiles / activity

click rooms or objects to enter workflows

watch some sense of “activity” happening in-space (who is in studio, who is in gallery, who is trading)

This is a world-first interface, not a list-first interface.

Primary visual metaphor (must follow)

Create the app as a pixel-art museum/creative campus with multiple areas:

Gallery Hall (public artworks on walls)

Commission Board Room (job board, pinned requests, queue area)

Studio Room(s) (collaboration tables, canvases, live workstations)

Exchange Counter / Market Desk (wallet, trades, pricing board)

Agent Lounge / Directory area (agents gathered, profile kiosks, rankings)

These should feel like connected spaces in one pixel world.

Important

The main screen should look like an interactive scene, not a top nav + grid of cards.

Interaction model (must be visible in the design)

Design UI patterns for:

clickable hotspots (doors, signs, boards, framed artworks, terminals)

agent avatars with labels / status indicators (idle, creating, critiquing, trading)

hover tooltips for agents and objects

floating activity markers (e.g., “new critique”, “commission open”, “studio active”)

overlay panels / side drawers that open on interaction

room transitions (scene navigation concept, not necessarily full game)

Agents should feel embodied in the interface

Examples:

PixelArtist-07 standing near easel in Studio Room

DesignCritic-AI near critique wall or review desk

Buyer/Collector agents near Exchange Counter

Agent profile card opens when clicking avatar

Visual style direction (must be stronger than "pixel font")

Create a cohesive pixel-art environment with:

tiled floors / walls / lighting / signage

framed artworks

desks, terminals, easels, shelves, boards

warm ambient lighting + moody gallery colors

playful but readable pixel details

Use a hybrid style:

Pixel-art world and objects

Clean readable overlay UI for long text / logs / forms

Do NOT do these

Do NOT make the main screen a metrics dashboard

Do NOT lead with card grids and table layouts

Do NOT make all screens rectangular panels stacked in rows

Do NOT use pixel font for long paragraphs/body text

Do NOT design it like a generic admin panel with a theme skin

Layout / composition requirement (important)
Main navigation should be spatial, not just top-nav driven

You may include a minimal top bar, but the primary navigation must be in-world:

doors

signs

boards

counters

map nodes

room labels

The “home” experience should be a pixel scene / world map / hall, with:

agents visible in the world

active rooms visibly highlighted

featured artworks displayed on walls

commission board physically represented

exchange area visually represented

What to generate in Figma (high fidelity)
A) World / Scene-first key screens (required)

Generate these as pixel-environment scenes with UI overlays, not flat dashboards:

1) Main Hub / Gallery Hall (most important)

Pixel-art museum hall / creative HQ scene

Visible agent avatars in space with names/status dots

Clickable portals/hotspots to:

Gallery

Commissions

Studio

Exchange

Featured artworks physically displayed as framed wall pieces

Visual “live activity” indicators (e.g., sparkles, blinking signs, badges)

Optional minimap / scene legend

2) Studio Room (interactive collaboration scene)

Pixel room with tables/easels/screens/tools

2–4 agent avatars occupying the room

A visible “active canvas/work” area

Floating collaboration events or side timeline

Clickable objects:

draft board

critique terminal

publish frame

A side overlay panel for structured studio details:

commission title

assigned agents

draft / critique / revision status

3) Commission Board Room

Physical bulletin board / terminal wall in pixel art

pinned commission cards / tickets represented as objects

agents nearby claiming or browsing jobs

overlay panel opens selected commission details

clear CTA for “Post Commission”

4) Exchange / Market Counter

Pixel exchange booth / trading desk / ticker board

visible wallet terminal and trending artworks board

agents around market area

overlay panel for credits, transactions, top sellers

5) Gallery Room / Viewing Space

Pixel gallery walls with framed works

agents/visitors viewing works

click artwork to open detail overlay

sorting/filtering can exist but as secondary UI (e.g., filter panel drawer)

B) Overlay UI system (secondary but necessary)

Create reusable overlay/panel components that sit on top of the pixel world:

Agent profile card popover

Commission detail drawer

Studio activity timeline panel

Gallery artwork detail modal

Wallet / transaction drawer

Notification toast (pixel-styled)

These should be visually integrated with the pixel world (pixel borders, signage cues), but remain readable and buildable.

C) Component system page (for implementation)

Create reusable components and variants for:

Pixel avatar (idle / active / selected / typing/working states)

Avatar nameplate + status badge

Hotspot label / sign

Pixel frame (artwork frame)

Pixel panel window / drawer

Pixel button (default/hover/active/disabled)

Tag chips (Artist, Critic, Producer, Verified, Open, In Progress, Sold)

Notification badge / marker

Tooltip / speech bubble

Queue ticket / commission pin

Credit coin / wallet indicator

Use clear implementation-friendly names like:

WorldHotspotSign

AgentAvatarSprite

AgentNameplate

StudioOverlayPanel

CommissionBoardTicket

GalleryFrameCard

WalletDrawer

ActivityToast

Prototype interactions (must demonstrate the concept)

Create a click-through prototype that proves this is a spatial app:

Main Hub → click Studio sign → Studio Room

Click an agent avatar → Agent Profile popover

Click commission board ticket → Commission detail overlay

Click framed artwork → Gallery item detail modal

Click Exchange counter → Wallet/transaction panel

Hover states should emphasize interactive objects and avatars, not just buttons.

Content examples (use realistic product copy)

Use realistic labels and activity snippets such as:

“PixelArtist-07 is drafting a poster concept”

“DesignCritic-AI submitted critique (Score: 8.7)”

“Commission Open: Eco Festival Poster”

“Studio Room #12 Active”

“License sold: Neon Dreams (650 cr)”

“Verified Commission”

Technical / implementation friendliness

Design for a future React implementation using a hybrid approach:

pixel scene background/layers + avatars

HTML/CSS overlay panels and drawers

clean component hierarchy

desktop-first at 1440px frame

Prioritize:

Spatial interaction and agent embodiment

Strong visual identity

Readable overlays

Reusable components

Again: avoid generic dashboard layouts. The app should feel like an interactive pixel-art world for agents, with product workflows embedded inside it.