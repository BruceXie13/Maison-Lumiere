Refine the existing **Agent Art Gallery** UI (pixel-art dark theme) into a more usable, product-grade interface while preserving its strong pixel identity and “museum / creative world” vibe.

## Context

This app is a multi-agent creative platform with 4 core surfaces:

1. **Commissions** (post and track creative jobs)
2. **Gallery** (browse and license artworks)
3. **Agents** (directory / profiles / reputation)
4. **Exchange** (wallet / transactions / trends)

The current design has a strong visual identity, but needs better information hierarchy, denser content layout, and clearer primary actions.

## Main design objective (very important)

Keep the **pixel-art room / world metaphor**, but make the app feel more like a **real product UI**:

* reduce empty decorative space
* increase content density and readability
* make primary actions obvious
* improve visual hierarchy
* keep the pixel vibe as a premium skin, not a blocker to usability

## Global refinement goals

### 1) Reduce dead space and increase usable content area

* Shrink oversized empty room canvases
* Make content modules (cards, lists, feeds, panels) larger and easier to scan
* Use layout structures that prioritize actual task workflows

### 2) Strengthen hierarchy and focus

* Clear page focal point on each screen
* Strong visual difference between:

  * primary action
  * primary content
  * secondary info
  * decorative elements
* Improve spacing rhythm and alignment consistency

### 3) Keep the brand vibe, but improve product usability

* Preserve pixel borders, retro tone, dark palette, and pixel headings
* Use readable UI typography for body text and dense lists
* Avoid tiny pixel text for long-form content
* Preserve “room/zone” personality while making screens function-first

### 4) Make implementation easier

* Normalize components and spacing
* Reuse card/panel patterns across pages
* Use clean Auto Layout structures
* Design for React-friendly component reuse

---

## Specific UX/Product changes to make (page by page)

### A. Global shell / header (all pages)

Refine the top header/navigation:

* Make header more compact (less vertical height)
* Keep the pixel logo/title and wallet balance chip
* Improve selected nav state visibility
* Add a small global live activity indicator (e.g., “3 studios active”)
* Ensure nav feels premium but not oversized

Refine the page title banner:

* Reduce height significantly
* Keep title + short subtitle, but compact it
* Avoid large empty title containers
* Consider integrating title with utility actions/filter controls

---

### B. Home / Gallery Hall (main hub)

Current issue: feels like a sparse map with floating icons.

Refine into a stronger “hub dashboard + world map hybrid”:

* Keep a pixel-art “hall map / zones” visual, but make it a **secondary navigation panel** or upper section
* Add a stronger primary content layout below or beside it:

  * Featured artworks
  * Active studio sessions
  * Open commissions
  * Agent spotlights / leaderboard
  * Live feed preview
* Make zone cards (Gallery, Commissions, Studio, Exchange) larger and clearly clickable
* Reduce tiny floating decorative icons unless they communicate real activity

Goal: homepage should immediately answer:

* what is happening now
* where to click first
* which agents/artworks are active/trending

---

### C. Commissions page (Commission Board Room)

Current issue: great vibe, but not enough workflow clarity.

Refine into a true commission workflow screen:

* Keep the pinboard visual metaphor, but make commission items larger and more readable
* Add clear primary CTA: **Post Commission**
* Add filters an
