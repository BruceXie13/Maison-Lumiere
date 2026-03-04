Design a desktop-first web app UI for a product called Agent Art Gallery — a multi-agent creative platform where AI agents and humans collaborate on art/design commissions.

Product concept

This is not a generic dashboard. It should feel like a pixel-art creative museum + studio workspace, inspired by:

a cozy creative studio desk setup

a real art gallery exhibition

a pixel-art museum / game-like space

The app has 4 core surfaces:

Commission Board (post and browse creative requests)

Gallery (published works and process replay)

Studio Space (agents collaborate: draft → critique → revision → publish)

Exchange / Wallet (credits, transactions, trends, agent reputation)

Visual style direction (important)

Create a hybrid style:

Pixel-art world vibe (rooms, frames, icons, signage, playful atmosphere)

Modern readable product UI for forms, logs, cards, lists, and data

This should feel like a pixel museum app skin over a real product workflow, not a full game UI.

Design goals

Feels polished, playful, and memorable

Clear enough for a class demo / product demo

Makes multi-agent collaboration visually legible

Easy to implement later in React (clean component structure)

Strong visual identity without sacrificing readability

Design constraints

Desktop-first layout (1440px wide frame), responsive-friendly structure

Use Auto Layout everywhere possible

Create reusable components and variants

Use a consistent spacing/grid system (pixel-friendly rhythm, e.g. 8px grid)

Use a limited color palette (cozy museum / studio tones + a few accent colors)

Use pixel-inspired heading/display typography, but use a clean readable UI font for body text/logs

Avoid visual clutter and tiny unreadable pixel text in long content areas

Deliverables to generate in Figma

Please generate a small but complete UI system + key screens:

A. Design system / component page

Include:

Color palette (named tokens)

Typography styles

Spacing tokens

Buttons (primary/secondary/ghost, default/hover/disabled)

Tags/chips (Artist, Critic, Open, In Progress, Completed, Verified)

Pixel-style panel/frame components

Cards (Commission card, Gallery card, Agent card, Transaction row)

Status badges / notifications

Pixel icons (brush, frame, coin, star, clock, message, warning)

B. Key screens (high fidelity)

Create these screens:

1) Main Hub / Gallery Hall (home screen)

A pixel-art “museum hall” themed home screen with:

top nav / title

visible section entry points (Gallery / Commissions / Studio / Exchange)

featured gallery works

live activity feed preview

active studio sessions preview

agent ranking/spotlight preview
This should establish the app’s identity immediately.

2) Commission Board screen

Include:

commission list/grid with filters (type, status, budget, tags)

“Post Commission” button

commission cards with title, brief snippet, budget, deadline, status

a side panel or modal for detailed commission view

role claim actions (Artist / Critic)

3) Studio Space screen (most important)

This is the core multi-agent collaboration screen.
Include:

studio header (commission title, status, assigned agents)

main activity timeline / event log (draft, critique, revision, publish)

current draft artifact panel (text concept card + optional image preview placeholder)

critique panel (structured feedback, score, suggestions)

participants panel (Artist Agent, Critic Agent, optional Producer placeholder)

actions area (submit draft / critique / revision / publish)

visible process state (waiting for draft / critique / revision / ready to publish)

This screen should feel like a creative control room, not a generic chat.

4) Gallery screen

Include:

gallery grid/list with framed artworks

cards show title, tags, agents involved, likes/views, “Verified Commission” badge

sorting/filter options

quick preview hover state

“view details” entry point

5) Gallery Item Detail screen

Include:

large artwork/display area

metadata (brief, creators/agents, tags, timestamps)

process replay summary (who did what)

license options (personal / commercial / exclusive)

price in credits

buy/license CTA

related works / same agent

6) Agent Directory / Profile screen (HW3 readiness)

Include:

agent cards with avatar/icon, role tags, specialties

stats (commissions completed, credits earned, completion rate, gallery items)

recent activity

profile detail variant with portfolio and reputation indicators

7) Exchange / Wallet screen (HW3 readiness)

Include:

wallet balance

recent transactions

top-selling agents/works

simple trend chart placeholder

buy/sell/license activity list

C. Prototype interactions (basic)

Add simple click-through prototype flows:

Home → Commission Board → Studio Space → Gallery → Gallery Item Detail

Hover/active states for key cards/buttons

Optional notification badge state (“new critique”, “studio active”)

Content style / copy tone

Use realistic product copy (not lorem ipsum), for example:

“Poster commission for eco-themed student event”

“Critique submitted by PixelCritic-03”

“Revision 2: stronger focal point and cleaner type hierarchy”

“Verified Commission”

Implementation friendliness (important for next step)

Name components clearly so they can be mapped into React:

CommissionCard

StudioEventItem

GalleryArtworkCard

AgentProfileCard

WalletTransactionRow

PixelPanelFrame
etc.

Prioritize clarity + product usability + visual identity over extreme decorative complexity.