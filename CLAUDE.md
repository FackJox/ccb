# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (runs panda codegen first)
npm run build        # Production build
npm run preview      # Preview production build
npm run check        # TypeScript/Svelte type checking
npm run lint         # Prettier + ESLint
npm run panda:codegen # Regenerate styled-system from panda.config.ts
```

## Architecture Overview

**Violet Square** is a scroll-driven cinematic narrative built with SvelteKit 5, PandaCSS, and GSAP. The experience tells a 9-chapter story through layered illustrations and typography, all controlled by a **Master Timeline scrubbed 0–100%** via scroll position.

### Tech Stack
- **Framework**: SvelteKit 5 with Svelte 5 runes (`$state`, `$derived`)
- **Styling**: PandaCSS (centralized design system in `panda.config.ts`)
- **Animation**: GSAP with ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin, MotionPathPlugin
- **Build**: Vite, static adapter (outputs to `build/`)

### Path Aliases
```
$components  → src/lib/components
$gsap        → src/lib/gsap
$data        → src/lib/data
$stores      → src/lib/stores
$utils       → src/lib/utils
$styled      → styled-system
```

## Scrollytelling Architecture

### Master Timeline Pattern
The entire page is a single scroll-scrubbed timeline (0–100%). Scroll position maps directly to visual state:

```
Chapter 1: 0–11%   | Chapter 4: 27–38%  | Chapter 7: 62–74%
Chapter 2: 11–20%  | Chapter 5: 38–47%  | Chapter 8: 74–88%
Chapter 3: 20–27%  | Chapter 6: 47–62%  | Chapter 9: 88–100%
```

Key files:
- `src/lib/gsap/scroll.ts` – ScrollSmoother creation, chapter regions
- `src/lib/stores/scroll.svelte.ts` – Reactive scroll state with Svelte 5 runes
- `src/lib/data/chapters.ts` – Chapter metadata and scroll regions

### Layer Composition
Each scene uses **2-layer compositions** (BG + FG), occasionally 3. Crowds and architectural details are baked into BG images.

Available motion:
- Opacity (fade in/out)
- Transform (scale, translate)
- Crossfade between layers
- FG swap within scenes
- Parallax (BG at 0.8x, FG at 1.0x scroll speed)
- Violet lens mask overlays

### Complexity Levels
- **L1 – Functional**: fade/crossfade only (Chapter 5)
- **L2 – Expressive**: 2–3 motion types (Chapters 1–4, 8–9)
- **L3 – Signature**: full orchestration (Chapters 6–7 only)

## GSAP Patterns

### Plugin Registration
Call `registerGSAP()` once on client before using plugins:
```typescript
import { registerGSAP, gsap, ScrollTrigger, ScrollSmoother } from '$gsap'
```

### Brand Motion Tokens
```typescript
// Easing
brandEase.enter     // 'power2.out' – breath exhaled
brandEase.exit      // 'power2.in' – smoke dispersing
brandEase.transform // 'power3.inOut' – dancer pivoting

// Durations (seconds)
brandDurations.micro        // 0.23
brandDurations.section      // 0.55
brandDurations.sectionHeld  // 0.825
brandDurations.signature    // 1.05
```

### Animation Factories
Use `src/lib/gsap/animations.ts` for brand-compliant animations:
- `fadeIn()`, `fadeOut()`, `crossfade()`
- `slideIn(direction)`, `parallaxLayer()`
- `fgSwap(from, to, {jitter})` – for mirror break moments
- `violetLensMask()` – signature transition
- `typographyBeat()` – for "Un. Deux. Trois." reveals
- `crowdBreathe()` – subtle scale pulse for L3 chapters

## PandaCSS Design System

All tokens defined in `panda.config.ts`. After changes, run `npm run panda:codegen`.

### Brand Colors
```
velvetSoot      #0B0508  – Primary background (60–70%)
bakeryParchment #F4E3C9  – Text panels, parchment slabs
stageViolet     #A248FF  – Accent, window light, progress indicator
deepBrass       #9B7A46  – Dividers (sparing)
bloodMuted      #6A1E29  – Danger highlights (rare)
```

### Typography
- **Display**: `Canela Bold` – titles, chapter markers, typography beats
- **Body**: `Spectral` (set as `body` font) – narrative text

### Motion Tokens
Easings (`easings.brandEnter`, etc.) and durations (`durations.signature`, etc.) are defined as PandaCSS tokens for consistency with GSAP usage.

### Patterns
- `frameContainer` – 852×393px reference frame
- `textFragment` – torn-flyer parchment block
- `layer` – positioned layer for BG/FG stacking

## Component Structure

```
components/
├── scroll/        # ScrollContainer, Chapter, Frame, ProgressIndicator
├── layers/        # LayerStack, BackgroundLayer, ForegroundLayer
├── text/          # TextFragment, ConsentHotspot, TypographyBeat
├── effects/       # VioletMask
└── ui/            # LandscapeEnforcer, LoadingScreen
```

## Asset Organization

Assets live in `static/assets/`:
```
static/assets/
├── shared/
│   ├── fg/   # couple-closeup, couple-standing, mirror-intact, mirror-broken
│   └── bg/   # exterior-windows-silhouette
├── C1/ ... C9/   # Chapter-specific BG and FG images
└── fonts/        # Canela-Bold.otf
```

Asset paths and metadata in `src/lib/data/assets.ts`.

## Brand Guidelines

Full specifications in `docs/Brand Guidelines.md` and `docs/Design/`:
- Motion: "Breath, not bounce" – no springs, elements fade and drift
- Consent lines ("Will you follow?", "Follow me") get soft hover echo effect
- Violet is always light-as-substance, never flat UI color
- Violence shown as aftermath only, never impact

## Chapter Implementation Patterns

**IMPORTANT:** Always consult these design docs before implementing a chapter:

| Document | Purpose |
|----------|---------|
| `docs/Design/1 Brand Physics Archetype.md` | Motion tokens, easing, duration scale |
| `docs/Design/4 Chapter Motion Boards.md` | Per-chapter motion annotations (Entry/Focus/Exit) |
| `docs/Design/5 Scroll-Telling Maps.md` | Scroll position → visual state mapping |
| `docs/storyboard/Chapter N *.jpg` | Visual reference for text positioning per frame |

### Text Block Configuration

Text blocks are defined in `src/lib/data/scenes.ts` with positioning:

```typescript
interface SceneTextBlock {
  num: number              // GSAP target: data-text-block="num"
  content: string
  type: 'fragment' | 'beat' | 'consent'
  style: 'parchment' | 'transparent' | 'beat'
  emphasis?: boolean
  position?: {             // CSS positioning from storyboard
    top?: string           // e.g., '12%', '35%'
    right?: string         // e.g., '0', '5%'
    left?: string
  }
}
```

**Pattern:** Match `position` values to storyboard frame images (`docs/storyboard/Chapter N A.jpg`, etc.)

### Timeline Timing Pattern

Each chapter timeline in `src/lib/gsap/timelines/chapterN.ts` must align with `docs/Design/5 Scroll-Telling Maps.md`:

1. **Frame boundaries** from Scroll-Telling Map define when text groups appear/fade
2. **Text visibility** should span the frame duration (not compress into small windows)
3. **Frame-by-frame replacement**: texts from Frame A fade before Frame B texts appear

Example (Chapter 1):
```typescript
// Per Scroll-Telling Map: Frame A (0-20%), Frame B (20-60%), Frame C (60-100%)

// Frame A texts - staggered entry, fade together at frame end
addTextLifecycle(tl, text1, 0.03, 0.18, -15)  // ~15% visible
addTextLifecycle(tl, text2, 0.07, 0.18, -12)  // ~11% visible
addTextLifecycle(tl, text3, 0.11, 0.18, -10)  // ~7% visible

// Frame B texts - appear after Frame A fades
addTextLifecycle(tl, text4, 0.22, 0.55, -18)  // ~33% visible
// ... etc
```

### Duration Guidelines (from Brand Physics)

- **Section transitions** (text blocks): 450-650ms feel
- **Held breath moments**: 750-900ms
- **Signature moments**: 900-1200ms
- Text slabs stack with **40ms stagger** within frames

## Critical Constraints

**What we CAN do:**
- Crossfade between BG images
- Layer FG with independent opacity/transform
- Violet mask/lens overlays
- Scale/translate for zoom/parallax

**What we CANNOT do:**
- Animate individual crowd members (baked into BG)
- Separate MG parallax
- Complex morphing between illustrations
- 3D transforms or particle effects

## Key Files Reference

| Purpose | File |
|---------|------|
| Design system | `panda.config.ts` |
| GSAP setup | `src/lib/gsap/register.ts` |
| Scroll regions | `src/lib/gsap/scroll.ts` |
| Animation factories | `src/lib/gsap/animations.ts` |
| Chapter data | `src/lib/data/chapters.ts` |
| Scene configs (layers + text) | `src/lib/data/scenes.ts` |
| Asset paths | `src/lib/data/assets.ts` |
| Scroll state | `src/lib/stores/scroll.svelte.ts` |
| Chapter scene renderer | `src/lib/components/chapters/ChapterScene.svelte` |
| Chapter timelines | `src/lib/gsap/timelines/chapter*.ts` |
| Main page | `src/routes/+page.svelte` |
