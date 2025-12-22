# Time-Based Scroll Timing Architecture

## Problem Statement

The current implementation uses arbitrary percentage-based durations scaled to chapter scroll regions. This leads to:

1. Motion that feels "too quick" in places
2. No connection between code values and design doc specifications (450ms, 900ms, etc.)
3. Compounding compression when implementing chapters in stages
4. Inconsistent pacing across devices

## Solution Overview

Define all timing in **milliseconds** matching design docs, then derive scroll positions through a single conversion layer. Chapter scroll regions become **derived values** based on content needs rather than hardcoded percentages.

```
┌─────────────────────────────────────────────────────────────┐
│                    DESIGN LAYER (time-based)                │
│  • Brand durations: micro (230ms), section (550ms), etc.    │
│  • Reading time: 500ms base + 200ms per word                │
│  • Signature moments: 1050ms                                │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    timeToScroll(ms) conversion
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  SCROLL LAYER (normalized)                  │
│  • Everything expressed as % of total scroll                │
│  • Scroll height = PERFECT_DURATION × SCROLL_SPEED          │
│  • Device-normalized via multipliers                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Constants

```typescript
// src/lib/gsap/timing.ts

// ============== EXPERIENCE DURATION ==============
// The canonical "perfect reading pace" - will be DERIVED from content
// Initially set manually, then replaced by calculateTotalDuration()
export const PERFECT_DURATION_SECONDS = 90

// ============== BRAND DURATION TOKENS (from design docs) ==============
export const BRAND_DURATIONS = {
  // Micro-interactions (120-160ms fast, 200-260ms normal)
  microFast: 140,
  micro: 230,

  // Content/section transitions (450-650ms)
  section: 550,

  // Held breath moments (750-900ms)
  sectionHeld: 825,

  // Signature moments (900-1200ms)
  signature: 1050,
} as const

// ============== READING TIME FORMULA ==============
const READING_BASE_MS = 500        // Minimum visibility for any text
const READING_MS_PER_WORD = 200    // ~300 WPM comfortable reading

export function calculateReadingTime(text: string): number {
  const wordCount = text.trim().split(/\s+/).length
  return READING_BASE_MS + (wordCount * READING_MS_PER_WORD)
}

// ============== SCROLL SPEED ==============
// Comfortable reading scroll speed (research: 50-80px/s)
const COMFORTABLE_SCROLL_SPEED = 65  // px/s

// Target scroll distance
export const TARGET_SCROLL_DISTANCE = PERFECT_DURATION_SECONDS * COMFORTABLE_SCROLL_SPEED

// ============== CORE CONVERSION ==============
export function timeToScroll(ms: number): number {
  return (ms / 1000) / PERFECT_DURATION_SECONDS
}
```

---

## Text Block Timing

### Option A: Automatic Reading Time (Default)

```typescript
// Calculated from content
const visibleDuration = calculateReadingTime(block.content)

// Example: "The violin faltered once, a heartbeat snag..." (12 words)
// = 500 + (12 × 200) = 2900ms visibility
```

### Option B: Manual Override

```typescript
interface SceneTextBlock {
  // ... existing fields

  // Optional: override calculated reading time
  visibleDurationMs?: number
}

// Usage in scenes.ts
{
  num: 3,
  content: "A pattern older than their names.",
  visibleDurationMs: 4000,  // Hold this poetic line longer
}
```

### Option C: Frame-Based (Existing Pattern)

Frame boundaries from Scroll-Telling Maps define when text groups transition. This is preserved - frames structure the sequence, reading time determines the actual durations within.

---

## Cross-Chapter Persistence

Formalize the existing pattern with explicit metadata:

```typescript
interface SceneTextBlock {
  // ... existing fields

  // Persistence metadata (documentation + validation)
  bridgesTo?: {
    chapter: number
    textNum: number
  }
  bridgesFrom?: {
    chapter: number
    textNum: number
  }
}
```

**Example - Chapter 6 → 7 bridge:**

```typescript
// Chapter 6, text 11:
{
  num: 11,
  content: "Someone clapped on the count...",
  position: { top: '65%', left: '5%' },
  bridgesTo: { chapter: 7, textNum: 1 }
}

// Chapter 7, text 1:
{
  num: 1,
  content: "Someone clapped on the count...",  // MUST match
  position: { top: '65%', left: '5%' },        // MUST match
  bridgesFrom: { chapter: 6, textNum: 11 }
}
```

**Behavior (unchanged):**
- Master timeline crossfades chapter containers at boundary
- Source chapter: text doesn't fade out (holds to end)
- Target chapter: text starts visible, fades out later

**Build-time validation:**
```typescript
// Verify bridged texts match
function validateBridges(configs: Record<number, SceneConfig>): void {
  for (const [chapterId, config] of Object.entries(configs)) {
    for (const text of config.textBlocks) {
      if (text.bridgesTo) {
        const target = configs[text.bridgesTo.chapter]
          ?.textBlocks.find(t => t.num === text.bridgesTo!.textNum)

        if (!target) throw new Error(`Bridge target not found: Ch${chapterId} text ${text.num}`)
        if (target.content !== text.content) throw new Error(`Bridge content mismatch`)
        if (JSON.stringify(target.position) !== JSON.stringify(text.position)) {
          throw new Error(`Bridge position mismatch`)
        }
      }
    }
  }
}
```

---

## Content-Driven Chapter Durations

### Frame Definition

```typescript
interface FrameDefinition {
  id: string                              // e.g., '1A', '1B'
  texts: number[]                         // text block nums in this frame
  layerTransition?: keyof typeof BRAND_DURATIONS
  holdAfter?: number                      // ms - breathing room
}

interface ChapterDefinition {
  id: number
  frames: FrameDefinition[]
  transitionIn: keyof typeof BRAND_DURATIONS   // from previous chapter
  transitionOut: keyof typeof BRAND_DURATIONS  // to next chapter
}
```

### Duration Calculation

```typescript
function calculateFrameDuration(
  frame: FrameDefinition,
  textBlocks: SceneTextBlock[],
  overrides: Map<number, number>
): number {
  let maxTextEnd = 0

  for (const textNum of frame.texts) {
    const block = textBlocks.find(t => t.num === textNum)
    if (!block) continue

    const appearDur = BRAND_DURATIONS.section
    const visibleDur = block.visibleDurationMs
      ?? overrides.get(textNum)
      ?? calculateReadingTime(block.content)
    const fadeDur = block.bridgesTo ? 0 : BRAND_DURATIONS.micro

    maxTextEnd = Math.max(maxTextEnd, appearDur + visibleDur + fadeDur)
  }

  const layerDur = frame.layerTransition
    ? BRAND_DURATIONS[frame.layerTransition]
    : 0

  return maxTextEnd + layerDur + (frame.holdAfter ?? 0)
}

function calculateChapterDuration(chapter: ChapterDefinition, textBlocks: SceneTextBlock[]): number {
  const transIn = BRAND_DURATIONS[chapter.transitionIn]
  const transOut = BRAND_DURATIONS[chapter.transitionOut]
  const frameDurations = chapter.frames.map(f =>
    calculateFrameDuration(f, textBlocks, new Map())
  )

  return transIn + frameDurations.reduce((a, b) => a + b, 0) + transOut
}
```

### Deriving Scroll Regions

```typescript
function deriveScrollRegions(
  chapters: ChapterDefinition[],
  sceneConfigs: Record<number, SceneConfig>
): Record<number, { start: number; end: number }> {

  // Calculate all chapter durations in ms
  const durationsMs = chapters.map(ch =>
    calculateChapterDuration(ch, sceneConfigs[ch.id].textBlocks)
  )

  const totalMs = durationsMs.reduce((a, b) => a + b, 0)

  // Convert to proportions
  const regions: Record<number, { start: number; end: number }> = {}
  let cursor = 0

  durationsMs.forEach((dur, i) => {
    const proportion = dur / totalMs
    regions[i + 1] = { start: cursor, end: cursor + proportion }
    cursor += proportion
  })

  return regions
}

// REPLACES hardcoded chapterScrollRegions
export const chapterScrollRegions = deriveScrollRegions(chapterDefinitions, sceneConfigs)
```

---

## Timeline Integration

### Chapter Timing Helpers

```typescript
export function createChapterTimingHelpers(chapterId: number) {
  const region = chapterScrollRegions[chapterId]
  const chapterScrollSpan = region.end - region.start

  // Convert ms to chapter-relative scroll proportion
  const dur = (ms: number): number => {
    const globalProportion = timeToScroll(ms)
    return globalProportion / chapterScrollSpan
  }

  // Position within chapter (0-1) from cumulative ms offset
  const pos = (cumulativeMs: number): number => {
    return timeToScroll(cumulativeMs) / chapterScrollSpan
  }

  return { dur, pos, chapterScrollSpan }
}
```

### Refactored Text Lifecycle

```typescript
interface TextLifecycleOptions {
  appearAtMs: number      // cumulative ms from chapter start
  appearDurMs?: number    // default: BRAND_DURATIONS.section
  visibleDurMs: number    // from reading time or override
  fadeDurMs?: number      // default: BRAND_DURATIONS.micro
  drift: number           // pixels
  skipFade?: boolean      // for bridging texts
}

function addTextLifecycle(
  tl: gsap.core.Timeline,
  target: Element,
  opts: TextLifecycleOptions,
  helpers: ReturnType<typeof createChapterTimingHelpers>
): number {  // Returns end time in ms for sequencing
  const { dur, pos } = helpers

  const appearDur = opts.appearDurMs ?? BRAND_DURATIONS.section
  const fadeDur = opts.skipFade ? 0 : (opts.fadeDurMs ?? BRAND_DURATIONS.micro)

  // Appear
  tl.fromTo(target,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: dur(appearDur), ease: brandEase.enter },
    pos(opts.appearAtMs)
  )

  // Drift while visible
  tl.to(target, {
    y: opts.drift,
    duration: dur(opts.visibleDurMs),
    ease: 'none',
  }, pos(opts.appearAtMs + appearDur))

  // Fade out (unless bridging)
  if (!opts.skipFade) {
    tl.to(target, {
      opacity: 0,
      duration: dur(fadeDur),
      ease: brandEase.exit,
    }, pos(opts.appearAtMs + appearDur + opts.visibleDurMs))
  }

  return opts.appearAtMs + appearDur + opts.visibleDurMs + fadeDur
}
```

### Example: Chapter 1 Refactored

```typescript
// BEFORE (arbitrary percentages)
addTextLifecycle(tl, text1, 0.03, 0.18, -15)

// AFTER (time-based)
const { dur, pos } = createChapterTimingHelpers(1)
const text1Content = "The violin faltered once, a heartbeat snag..."

let cursor = 500  // Start 500ms into chapter

cursor = addTextLifecycle(tl, text1, {
  appearAtMs: cursor,
  visibleDurMs: calculateReadingTime(text1Content),
  drift: -15
}, { dur, pos })

// cursor now holds the end time, ready for next text
```

---

## Scroll Container Sizing

### Device Normalization

```typescript
// src/lib/gsap/scroll-config.ts

export function getDeviceScrollMultiplier(): number {
  if (typeof window === 'undefined') return 1

  const width = window.innerWidth
  if (width < 768) return 0.7       // Mobile: faster swipes
  if (width < 1024) return 0.85     // Tablet
  return 1                           // Desktop
}

export function getScrollHeight(): number {
  return TARGET_SCROLL_DISTANCE * getDeviceScrollMultiplier()
}

// For viewport-relative sizing
export function calculateScrollHeightVh(viewportHeight: number): number {
  const targetVh = getScrollHeight() / viewportHeight
  return Math.max(400, Math.min(800, targetVh))  // Clamp to reasonable range
}
```

### ScrollSmoother Configuration

```typescript
export const defaultScrollConfig: ScrollSmootherConfig = {
  smooth: 1.5,              // Languid, velvet feel (brand-appropriate)
  effects: true,
  normalizeScroll: true,
  ignoreMobileResize: true,
}
```

---

## Implementation Checklist

### New Files

- [ ] `src/lib/gsap/timing.ts` - Core timing constants and conversion functions
- [ ] `src/lib/data/chapter-definitions.ts` - Frame structures per chapter

### Modified Files

- [ ] `src/lib/gsap/scroll.ts` - Replace hardcoded `chapterScrollRegions` with derived values
- [ ] `src/lib/gsap/scroll.ts` - Update `defaultScrollConfig.smooth` to 1.5
- [ ] `src/lib/data/scenes.ts` - Add `bridgesTo`/`bridgesFrom` and optional `visibleDurationMs` to interface
- [ ] `src/lib/gsap/timelines/chapter1.ts` through `chapter9.ts` - Migrate to time-based helpers

### Migration Strategy

1. **Phase 1: Foundation**
   - Create `timing.ts` with constants and helpers
   - Add `chapter-definitions.ts` with frame structures
   - Keep existing `chapterScrollRegions` temporarily

2. **Phase 2: Validation**
   - Add `bridgesTo`/`bridgesFrom` metadata to `scenes.ts`
   - Implement build-time validation for bridges
   - No runtime changes yet

3. **Phase 3: Chapter Migration**
   - Migrate one chapter at a time (start with Chapter 1)
   - Use new timing helpers alongside old percentages
   - Verify feel matches design intent

4. **Phase 4: Derived Regions**
   - Switch `chapterScrollRegions` to derived calculation
   - Update scroll container sizing
   - Update ScrollSmoother smooth to 1.5

5. **Phase 5: Cleanup**
   - Remove old percentage-based code
   - Document any manual overrides used

---

## Key Formulas Reference

| Concept | Formula |
|---------|---------|
| Reading time | `500 + (wordCount × 200)` ms |
| Time → scroll | `(ms / 1000) / PERFECT_DURATION_SECONDS` |
| Scroll distance | `PERFECT_DURATION_SECONDS × 65` px |
| Device multiplier | Desktop: 1.0, Tablet: 0.85, Mobile: 0.7 |

---

## Design Decisions Log

| Decision | Rationale |
|----------|-----------|
| 90s perfect duration | Allows ~1min reading + transitions; tunable |
| 200ms per word | ~300 WPM comfortable reading pace |
| 500ms base visibility | Even short phrases need minimum dwell time |
| smooth: 1.5 | Matches brand "velvet" feel, slower scroll response |
| Device multipliers | Mobile users swipe faster; compensate with shorter scroll |
