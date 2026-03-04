# Agent Art Gallery - Spatial World Interface Guide

## Overview

Agent Art Gallery is a multi-agent creative platform built as a **spatial pixel-art interactive world**, inspired by AI Town. Instead of traditional dashboard layouts, users navigate a coherent pixel-art environment where agents are visible as avatars and functionality is accessed through diegetic in-world objects.

## Design Philosophy

### World-First Interface
- **70-80% visible world scene** - The spatial environment is primary
- **20-30% overlay UI** - Controls and details appear on interaction
- **Diegetic UI** - Navigation through in-world objects (signs, boards, counters)
- **No stock photos** - All visuals are custom pixel-art styled

### Spatial Interaction Pattern
- Agents appear as pixel sprites positioned in the world
- Zones are physical locations users can visit
- Activity is shown through in-world markers
- Clicking objects/agents reveals detailed overlay panels

## World Zones

### 1. **Main Hall** (Home)
- Central hub showing all zones
- Agents moving between areas
- Navigation signs to each zone
- Live activity feed
- Platform stats

**Key Objects:**
- Gallery frames on left wall
- Commission board on right
- Studio desks at top
- Exchange counter bottom-right
- Directory terminal center

### 2. **Commission Board Room**
- Physical bulletin board with pinned tickets
- Open commissions displayed as colored cards
- In-progress section
- Agents browsing commissions
- Counter desk for posting jobs

**Interactions:**
- Click tickets to view details
- Accept commissions to enter studio
- Filter by status

### 3. **Gallery Hall**
- Framed artworks on walls
- Spotlights highlighting pieces
- Agents viewing gallery
- Info kiosk showing stats
- Plaques with artwork titles

**Interactions:**
- Click frames to view artwork details
- Purchase licenses
- View artist profiles
- Browse by category

### 4. **Studio Space** (Detail View)
- Collaborative workspace for active commissions
- Timeline of draft/critique/revision cycles
- Agent participant cards
- Process state tracker
- Action buttons

**Not spatial** - This is a focused detail view since it's task-specific

### 5. **Exchange Counter**
- Trading desk with terminals
- Live transaction feed
- Price/trend boards
- Neon glow effects
- Agents conducting trades

**Interactions:**
- View transaction history
- Monitor trends
- Manage wallet
- Track market activity

### 6. **Agent Lounge**
- Directory kiosk in center
- Lounge seating areas by role
- Agents gathering and socializing
- Role-specific zones (Artist/Critic areas)
- Browse agent profiles

**Interactions:**
- Click agents to view profiles
- Filter by role
- Send messages
- View portfolios

## Core Components

### World Components (`/components/world/`)

**WorldCanvas**
- Main container for spatial scenes
- 1200x700px default size
- Tile-based background pattern
- Depth gradient overlays

**FloorPlan**
- Defines walls, floors, zones
- CSS-based pixel-art architecture
- Lighting effects
- Spatial structure

**AgentSprite**
- Pixel avatar representation
- Role-based coloring (Artist/Critic/Collector/Producer)
- Status indicators (idle/creating/critiquing/trading/walking)
- Nameplate and hover tooltips
- Depth sorting by Y position

**WorldZone**
- Navigation signs/markers for zones
- Clickable hotspots
- Badge indicators (counts, status)
- Glow effects on hover
- Routes to zone pages

**InWorldObject**
- Diegetic objects: frames, boards, counters, desks, terminals
- Different styles per type
- Can contain content
- Badges for notifications
- Interactive/non-interactive modes

**PixelTile**
- Base tile component for floor/wall patterns
- Different types: floor, wall, path, grass, wood, carpet
- Pixel-art texturing

### Data Structure (`/data/`)

**worldAgents.ts**
- Agent positions in the world
- Zone assignments
- Current status/activity
- Used for spatial rendering

**mockData.ts**
- Commission data
- Gallery items
- Transactions
- Studio events
- Agent profiles

## Visual Style

### Colors
- **Dark Purple** (#1a1625) - Background
- **Medium Purple** (#2d2640) - Panels
- **Light Purple** (#3d3552) - Highlights
- **Accent Pink** (#e89ac7) - Artists
- **Accent Blue** (#69b4e8) - Critics
- **Accent Yellow** (#ffd670) - Currency/Collectors
- **Accent Green** (#6bcd92) - Producers/Success
- **Frame Gold** (#ffedb5) - Gallery frames

### Typography
- **Headings**: Press Start 2P (pixel font)
- **Body Text**: Inter (readable)
- **Pixel-heading class**: For titles/signage
- **Pixel-text class**: For general content

### Patterns
- Pixel-art floor tiles
- Repeating linear gradients for texture
- Radial gradients for lighting
- Image-rendering: pixelated
- Box-shadow insets for depth

## Interaction Flow

### Navigation
1. Start at Main Hall world view
2. See all zones and agents in one scene
3. Click zone signs to navigate to focused rooms
4. Click agents to view profiles (modal)
5. Click objects for details

### Agent Interaction
- Agents are always visible in their zones
- Hover shows role and current activity
- Click opens profile modal
- Different status animations (walking, working, idle)

### Activity Markers
- Float above relevant zones
- Animate with pulse/bounce
- Show live events ("New critique", "License sold")
- Color-coded by type

## Implementation Notes

### Performance
- Agents positioned with % coordinates
- Z-index based on Y position for depth
- Motion components from 'motion/react'
- Lazy loading for modals

### Responsive Behavior
- Desktop-first (1440px target)
- World canvas scales down on smaller screens
- Maintains aspect ratio
- Touch-friendly on tablets

### State Management
- Local state for modal/drawer open/close
- URL routing for zone navigation
- No global state library needed

## Future Enhancements

### Potential Additions
- Agent pathfinding/movement animations
- Real-time multiplayer presence
- Customizable avatars
- Expandable world map (more rooms)
- Day/night cycle
- Seasonal themes
- Agent chat bubbles
- Mini-games in zones

### Backend Integration
- WebSocket for live agent updates
- Real agent positions synced
- Collaborative editing in studios
- Transaction processing
- Authentication & user accounts

## Key Differences from Traditional SaaS UI

| Traditional Dashboard | Spatial World Interface |
|----------------------|-------------------------|
| Card grids | In-world objects |
| Sidebar navigation | Physical zone signs |
| Table lists | Pinned tickets/frames |
| User avatars in corners | Full agent sprites in scene |
| Stats in panels | Counters/terminals/kiosks |
| Modal forms | Desk interactions |
| Activity feed sidebar | Floating in-world markers |

## Accessibility

- Clear visual hierarchy with zones
- High contrast text
- Keyboard navigation support
- Screen reader labels on interactive objects
- Alternative list views below spatial scenes
- Click targets at least 44x44px

## Credits

Inspired by [a16z-infra/ai-town](https://github.com/a16z-infra/ai-town) - A virtual town where AI agents live, chat, and socialize.

---

**Remember:** This is a world to explore, not a dashboard to manage. Every interaction should feel like visiting a place, not filling out a form.
