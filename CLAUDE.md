# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Japan Trip Planner web application built with React, Vite, TypeScript, and shadcn/ui. It displays a 13-day trip itinerary for Japan (April 10-22, 2026) with interactive maps, daily schedules, smoking spot locations, and trip information. The app is designed for mobile-first viewing and supports both Bulgarian and English text.

## Development Commands

```bash
# Install dependencies (use --legacy-peer-deps flag)
npm install --legacy-peer-deps

# Run development server (starts on http://localhost:8080)
npm run dev

# Build for production
npm build

# Build in development mode
npm run build:dev

# Run linter
npm lint

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Preview production build
npm preview
```

## Architecture

### Data Structure

All trip data is centralized in `src/data/tripData.ts`:
- `tripDays`: Array of 13 days, each containing:
  - Day metadata (date, title in BG/EN, city)
  - `activities`: Timeline of activities with time, transport, costs, coordinates
  - `smokingSpots`: Designated smoking areas with coordinates
  - `hotel`: Hotel information with booking link and cost
- `tripSummary`: Total costs breakdown and trip statistics

Activity categories: `flight`, `transport`, `sightseeing`, `food`, `hotel`, `shopping`, `walk`, `smoking`

### Component Architecture

**Main Page Flow:** `src/pages/Index.tsx` orchestrates the entire app:
- Manages state for selected day, active tab, and focused map marker
- Uses `AnimatePresence` from Framer Motion for smooth tab transitions
- Four tabs: Schedule, Map, Smoking, Info

**Key Components:**
- `TripHeader`: Hero section with background image and trip title
- `DaySelector`: Horizontal scrollable day picker (sticky)
- `DayHeader`: Displays selected day's title, date, city, hotel
- `ActivityTimeline`: Main schedule view with activity cards
- `TripMap`: Interactive Leaflet map showing activities and smoking spots
- `SmokingSpots`: List of smoking areas (used in both schedule and smoking tabs)
- `BottomNav`: Fixed bottom navigation between four main tabs
- `TripInfo`: Summary page with currency converter and cost breakdown

**Cross-component Communication:**
- Activity/smoking spot clicks navigate to map tab and focus marker
- Callbacks flow from `Index.tsx` down through props

### Styling System

**CSS Variables:** All colors defined as HSL values in `src/index.css` `:root`
- Primary theme colors: `--primary`, `--accent`, `--secondary`
- Category colors: `--transport`, `--food`, `--hotel`, `--smoking`, `--sightseeing`
- Custom tokens: `--sakura`, `--gold`, `--zen` (Japanese-inspired palette)
- Gradients: `--gradient-primary`, `--gradient-hero`

**Tailwind Configuration:** `tailwind.config.ts` extends theme with:
- Custom color mappings to CSS variables
- Category-specific colors (transport, food, hotel, smoking)
- Custom animations (`float`, `accordion-down/up`)
- Font families: Inter for both display and body

**Current Color Scheme:** Yellow/gold theme (hue 48°)
- Primary: `48 96% 53%`
- Accent: `48 90% 50%`
- Hotel category also uses yellow tones

### State Management

No Redux/Zustand - uses local React state in `Index.tsx`:
- `selectedDay`: Which day (1-13) is active
- `activeTab`: Current bottom nav tab ('schedule' | 'map' | 'smoking' | 'info')
- `focusedMarker`: Activity or SmokingSpot to center on map

### Routing

Simple routing with React Router DOM:
- `/` - Main app (Index page)
- `/*` - 404 page (NotFound)
- Single-page app - all content loads on Index

### Maps

Uses React Leaflet with OpenStreetMap tiles:
- Map component: `src/components/TripMap.tsx`
- Shows activities and smoking spots with custom markers
- Focuses on selected activity/spot via `focusedMarker` prop
- Each day's map bounds auto-fit to visible markers

## Making Changes

### Adding/Modifying Trip Data
Edit `src/data/tripData.ts` - all itinerary changes go here. The app will automatically reflect updates to activities, smoking spots, hotels, and costs.

### Changing Colors
Primary colors are defined in `src/index.css` under `:root`. Use HSL format (hue saturation lightness). Key variables:
- `--primary`: Main brand color
- `--accent`: Accent/highlight color
- `--sakura`: Custom Japanese cherry blossom theme color
- Category colors: `--transport`, `--food`, `--hotel`, `--smoking`

When changing primary colors, update both light and dark foreground variants for contrast.

### Adding New Components
- Place UI primitives in `src/components/ui/` (shadcn components)
- Place feature components in `src/components/`
- Import path alias `@/` maps to `src/`

### Text Labels
Most text uses dual Bulgarian/English labels (e.g., `title` and `titleEn`). When modifying UI text, maintain both languages where present in the data structure.

## Important Notes

- The dev server runs on port 8080 (not default 5173)
- Package installation requires `--legacy-peer-deps` flag due to React 18 peer dependency conflicts
- Hero image path: `src/assets/hero-japan.jpg`
- The app uses npm, not bun (despite bun.lock files present)
- Leaflet CSS must be imported for maps to render correctly
- Smoking spots feature is culturally specific - Japan has designated smoking areas and street smoking prohibitions
