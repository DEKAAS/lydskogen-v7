# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Lydskog, a Norwegian music production company website built with Next.js 15.3.3, React 19, and TypeScript. The site showcases four music production genres (Ambient, Hip-Hop, Lo-Fi, Soundscape) with interactive audio players, pricing tiers, and service offerings.

## Development Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)

# Production
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint with Next.js configuration
```

## Architecture Overview

### App Router Structure
- Uses Next.js App Router (`/app` directory)
- Dynamic routing: `/produksjon/[genre]` for individual genre pages
- Norwegian language site (`lang="no"`)

### Component Organization
- `/components` - Reusable UI components with clear naming conventions
- `/data` - Static content management (genres, services, artists, artwork)
- `/types` - Comprehensive TypeScript type definitions
- `/utils` - Utility functions and placeholder system

### Data Flow
The application uses static data management with four main data categories:
- **Genres**: Each has pricing tiers (basic, premium, exclusive), audio examples, and visual themes
- **Services**: Color-coded service categories
- **Artists**: Profile and example data
- **Artwork**: Visual portfolio items

All data is type-safe with interfaces defined in `/types/`.

### Audio System
Custom audio player components handle genre-specific music samples. Audio files are referenced in genre data structures.

### Styling System
- Tailwind CSS with custom dark theme color palette
- Custom colors: `base-dark` (#0a0a0a), `secondary-dark` (#1a1a1a), `accent-green` (#10b981)
- Framer Motion for animations throughout
- Responsive container system with size variants

### Key Technical Patterns
- Client-side rendering for dynamic genre pages (performance consideration)
- SVG placeholder system for development images (`utils/placeholders.ts`)
- Type-first approach with strict TypeScript configuration
- Path aliases using `@/*` for clean imports

## Genre-Specific Architecture

Each genre (ambient, hip-hop, lo-fi, soundscape) has:
- Unique visual theme and color scheme  
- Three pricing tiers with different features
- Associated audio examples
- Dynamic page generation via `[genre]` route

When working with genres, always check the data structure in `/data/genres.ts` and ensure type safety with `/types/index.ts`.