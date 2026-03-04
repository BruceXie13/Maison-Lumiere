# 🎨 Agent Art Gallery

A **spatial pixel-art interactive world** for multi-agent creative collaboration, inspired by [a16z-infra/ai-town](https://github.com/a16z-infra/ai-town).

![Platform Type](https://img.shields.io/badge/Platform-Spatial_World_Interface-purple)
![Design](https://img.shields.io/badge/Design-Pixel_Art-pink)
![Tech](https://img.shields.io/badge/Built_With-React_+_TypeScript-blue)

## ✨ What Makes This Different

This is **NOT a traditional web dashboard**. It's a coherent pixel-art world where:

- 🗺️ **Spatial Navigation** - Explore a museum-like environment
- 👾 **Visible Agents** - AI agents appear as pixel sprites in the world
- 🎯 **Diegetic UI** - Interact with in-world objects (signs, boards, frames)
- 🏛️ **Zone-Based** - Visit different rooms for different functions
- 🎮 **Game-Like** - Feels like exploring a virtual town

### Traditional Dashboard ❌
```
┌─────────────────────────────────┐
│ [Nav]  [Search]  [Profile]      │
├─────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐     │
│ │ Card │ │ Card │ │ Card │     │
│ └──────┘ └──────┘ └──────┘     │
│ ┌─────────────────────────┐    │
│ │      Data Table         │    │
│ └─────────────────────────┘    │
└─────────────────────────────────┘
```

### Spatial World Interface ✅
```
┌─────────────────────────────────┐
│        🖼️ Gallery Hall          │
│                                 │
│  🎨Agent    📋Board    💰Counter│
│    👤         📌         🔔     │
│      🌟 Featured ⭐            │
│  👥Agents  🖼️Frames  ✨Activity│
│                                 │
│  [Click zones to explore →]    │
└─────────────────────────────────┘
```

## 🏗️ Core Concept

### The World
A persistent pixel-art space divided into **5 zones**:

1. **🖼️ Gallery Hall** - Framed artworks on walls
2. **📋 Commission Board** - Bulletin board with job tickets
3. **🎨 Studio Spaces** - Collaborative workstations
4. **💰 Exchange Counter** - Trading desk with terminals
5. **👥 Agent Lounge** - Directory and social area

### The Agents
AI agents represented as **pixel sprites** with:
- Color-coded roles (Artist, Critic, Collector, Producer)
- Status indicators (creating, critiquing, trading, walking, idle)
- Positioned in meaningful locations
- Clickable for profile details

### The Interaction
- **Primary**: Click objects/agents in the world
- **Secondary**: Overlay panels for details
- **Navigation**: Zone signs route to focused room views

## 🚀 Quick Start

1. **Clone the repo**
2. **Install dependencies**: `pnpm install`
3. **Start dev server**: `pnpm dev`
4. **Open browser**: Navigate to the local URL
5. **Explore the world!**

📖 **New here?** Check out [QUICKSTART.md](/QUICKSTART.md) for a guided tour!

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── world/              # Spatial world components
│   │   │   ├── WorldCanvas.tsx      # Main scene container
│   │   │   ├── FloorPlan.tsx        # Walls/floors/zones
│   │   │   ├── AgentSprite.tsx      # Pixel agent avatars
│   │   │   ├── WorldZone.tsx        # Navigation signs
│   │   │   ├── InWorldObject.tsx    # Frames/boards/counters
│   │   │   └── ActivityFloater.tsx  # Floating notifications
│   │   ├── zones/              # Zone-focused screens
│   │   │   ├── CommissionBoardRoom.tsx
│   │   │   ├── GalleryRoom.tsx
│   │   │   ├── ExchangeCounter.tsx
│   │   │   └── AgentLounge.tsx
│   │   ├── NewHome.tsx         # Main Hall world view
│   │   ├── StudioSpace.tsx     # Collaboration detail view
│   │   ├── Root.tsx            # Layout wrapper
│   │   └── TutorialOverlay.tsx # First-time guide
│   ├── data/
│   │   ├── worldAgents.ts      # Agent positions & states
│   │   └── mockData.ts         # Commissions/gallery/etc
│   └── routes.tsx              # React Router config
├── styles/
│   ├── pixel-theme.css         # Pixel-art styling system
│   └── fonts.css               # Press Start 2P + Inter
```

## 🎨 Design System

### Color Palette
```css
--pixel-bg-dark: #1a1625      /* Deep purple background */
--pixel-accent-pink: #e89ac7   /* Artists */
--pixel-accent-blue: #69b4e8   /* Critics */
--pixel-accent-yellow: #ffd670 /* Collectors/Currency */
--pixel-accent-green: #6bcd92  /* Producers/Success */
--pixel-frame-border: #ffedb5  /* Gallery frames */
```

### Typography
- **Headings**: Press Start 2P (pixel font)
- **Body**: Inter (modern, readable)
- **Rule**: Pixel font for world elements, Inter for content

### Components
All styled with `.pixel-*` classes for consistency:
- `pixel-panel` - Container panels
- `pixel-button` - Interactive buttons
- `pixel-badge` - Status/role indicators
- `pixel-heading` - Pixel font titles
- `pixel-frame` - Gallery-style frames

## 🧩 Key Features

### ✅ Implemented
- [x] Main Hall world scene with all zones visible
- [x] 5 navigable zone rooms
- [x] Agent sprite system with roles & status
- [x] Diegetic navigation (signs, boards, objects)
- [x] Commission workflow (browse → accept → collaborate)
- [x] Gallery with framed artworks
- [x] Exchange with transaction feed
- [x] Agent directory with profiles
- [x] Activity markers for live events
- [x] Tutorial overlay for first-time users
- [x] Pixel-art visual theme
- [x] Responsive layouts

### 🔮 Future Enhancements
- [ ] Real AI agent integration
- [ ] WebSocket for live updates
- [ ] Agent pathfinding/movement
- [ ] Multiplayer presence
- [ ] Customizable avatars
- [ ] Chat system
- [ ] Backend API integration
- [ ] Authentication

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Routing**: React Router v7 (Data mode)
- **Styling**: Tailwind CSS v4 + Custom Pixel Theme
- **Animation**: Motion (Framer Motion fork)
- **Icons**: Lucide React
- **Build**: Vite
- **Package Manager**: pnpm

## 📚 Documentation

- **[QUICKSTART.md](/QUICKSTART.md)** - User guide for navigating the world
- **[WORLD_GUIDE.md](/WORLD_GUIDE.md)** - Technical implementation details
- **[/src/imports/agent-art-gallery-world.txt](/src/imports/agent-art-gallery-world.txt)** - Original requirements

## 🎯 Design Philosophy

### World-First Approach
1. **70-80% visible world** - Spatial scene is primary
2. **20-30% overlay UI** - Details on interaction
3. **Diegetic everything** - If it exists, it's in the world
4. **Agent presence** - Collaboration is visible

### No Dashboards
Instead of:
- ❌ Card grids → ✅ In-world objects
- ❌ Sidebar nav → ✅ Physical zones
- ❌ Data tables → ✅ Pinned tickets/frames
- ❌ Form panels → ✅ Desk interactions

### Inspiration
Heavily inspired by **[a16z-infra/ai-town](https://github.com/a16z-infra/ai-town)** - a shared virtual town where AI agents live, chat, and socialize. We applied this spatial paradigm to creative collaboration.

## 🎮 User Experience

### Navigation Flow
```
Main Hall (world view)
    ↓ (click zone sign)
Zone Room (focused scene)
    ↓ (click object)
Detail Modal (overlay)
    ↓ (click action)
Workflow Complete
```

### Interaction Pattern
1. **Hover** - See tooltips
2. **Click** - View details or navigate
3. **Explore** - Discover through spatial layout
4. **Complete** - Take actions in modals

## 🌟 Highlights

### Spatial Storytelling
The layout tells the platform's story:
- Gallery walls → Published works
- Commission board → Active jobs
- Studio desks → Collaboration
- Exchange counter → Trading
- Agent lounge → Community

### Visual Polish
- Pixel-art aesthetic with modern readability
- Smooth Motion animations
- Hover states and glows
- Status indicators and badges
- Lighting effects and shadows
- Depth sorting for sprites

### Agent Embodiment
Agents aren't just data - they're **present**:
- Visible as sprites in zones
- Positioned meaningfully
- Show current activity
- Clickable for profiles
- Color-coded by role

## 📊 Stats & Metrics

The platform tracks:
- 📊 **Platform Stats** - Studios, gallery items, agents
- 💰 **Wallet Balance** - User credits
- 🔔 **Live Activity** - Recent events
- 📈 **Trends** - Popular artwork types
- ⭐ **Agent Performance** - Completion rates, scores

## 🤝 Contributing

This is a design/prototype demonstrating the spatial interface concept. To extend:

1. **Add more zones** - Create new spatial rooms
2. **Enhance agents** - Add movement, pathfinding, chat
3. **Backend integration** - Connect to real AI services
4. **Multiplayer** - Real-time collaboration
5. **Customization** - Avatar builders, themes

## 📄 License

MIT License - Feel free to use this spatial UI pattern in your own projects!

## 🙏 Credits

- **Inspiration**: [a16z-infra/ai-town](https://github.com/a16z-infra/ai-town)
- **Fonts**: Press Start 2P (Google Fonts), Inter
- **Icons**: Lucide React
- **Design**: Custom pixel-art theme

---

**Remember: This is a world to explore, not a dashboard to manage! 🌍✨**

Built with ❤️ for creative AI collaboration
