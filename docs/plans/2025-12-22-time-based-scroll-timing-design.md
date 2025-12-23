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

- [x] `src/lib/gsap/timing-constants.ts` - Base timing constants (no deps)
- [x] `src/lib/gsap/timing.ts` - Timing helpers with derived duration
- [x] `src/lib/gsap/derive-regions.ts` - Content-driven chapter regions
- [x] `src/lib/data/chapter-definitions.ts` - Frame structures per chapter

### Modified Files

- [x] `src/lib/gsap/scroll.ts` - Replace hardcoded `chapterScrollRegions` with derived values
- [x] `src/lib/gsap/scroll.ts` - Update `defaultScrollConfig.smooth` to 1.5
- [x] `src/lib/data/scenes.ts` - Add `bridgesTo`/`bridgesFrom` and optional `visibleDurationMs` to interface
- [x] `src/lib/gsap/timelines/chapter1.ts` - Migrated to time-based (PROVEN PATTERN)
- [ ] `src/lib/gsap/timelines/chapter2.ts` through `chapter9.ts` - Migrate to time-based

### Migration Strategy

1. **Phase 1: Foundation** ✅ COMPLETE
   - Created `timing-constants.ts` and `timing.ts` with constants and helpers
   - Added `chapter-definitions.ts` with frame structures
   - Created `derive-regions.ts` for content-driven regions

2. **Phase 2: Validation** ✅ COMPLETE
   - Added `bridgesTo`/`bridgesFrom` metadata to `scenes.ts`
   - `visibleDurationMs` override support added

3. **Phase 3: Chapter Migration** 🔄 IN PROGRESS
   - ✅ Chapter 1 migrated and verified working
   - Remaining: Chapters 2-9

4. **Phase 4: Derived Regions** ✅ COMPLETE
   - Switched `chapterScrollRegions` to derived calculation
   - `timeToScroll()` now uses derived total duration
   - ScrollSmoother smooth already at 1.5

5. **Phase 5: Cleanup**
   - Remove old percentage-based code after all chapters migrated

---

## Proven Pattern (from Chapter 1 Migration)

### Critical Architecture

The system uses **two aligned calculations** that MUST use the same timing logic:

1. **`derive-regions.ts`** - Calculates chapter proportions from content
2. **`timing.ts:timeToScroll()`** - Converts ms to scroll proportion

Both now use the **same denominator**: `getDerivedDurationSeconds()` (memoized total from content).

### Sequential-with-Overlap Timing

Texts appear in staggered sequence with 800ms overlap:

```
TEXT 1:  |====appear====|====visible====|==fade==|
TEXT 2:           |====appear====|====visible====|==fade==|
                  ↑
                  TEXT_OVERLAP_MS = 800ms before TEXT 1 ends
```

**Critical:** The `TEXT_OVERLAP_MS = 800` constant must match in:
- `src/lib/gsap/timelines/chapterN.ts` - timeline cursor positioning
- `src/lib/gsap/derive-regions.ts` - duration calculation

### Pure Time-Based Timeline Pattern

```typescript
import { gsap, SplitText, brandEase } from '../register'
import { timeToScroll, calculateReadingTime, BRAND_DURATIONS } from '../timing'
import { sceneConfigs } from '$data/scenes'

const textBlocks = sceneConfigs[N].textBlocks
const getTextContent = (num: number): string =>
  textBlocks.find((t) => t.num === num)?.content ?? ''

const TEXT_OVERLAP_MS = 800

function addTextLifecycleTimeBased(
  tl: gsap.core.Timeline,
  target: Element,
  appearAtMs: number,
  visibleDurMs: number,
  drift: number,
  skipFade = false
): number {
  const appearDur = BRAND_DURATIONS.section
  const fadeDur = skipFade ? 0 : BRAND_DURATIONS.micro

  // ALL conversions via timeToScroll for global positions/durations
  tl.fromTo(target,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: timeToScroll(appearDur), ease: brandEase.enter },
    timeToScroll(appearAtMs)
  )

  if (visibleDurMs > 0) {
    tl.to(target, {
      y: drift,
      duration: timeToScroll(visibleDurMs),
      ease: 'none',
    }, timeToScroll(appearAtMs + appearDur))
  }

  if (!skipFade) {
    tl.to(target, {
      opacity: 0,
      duration: timeToScroll(fadeDur),
      ease: brandEase.exit,
    }, timeToScroll(appearAtMs + appearDur + visibleDurMs))
  }

  return appearAtMs + appearDur + visibleDurMs + fadeDur
}

export function createChapterNTimeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()
  let cursor = 0

  // Get elements
  const text1 = container.querySelector('[data-text-block="1"]')
  // ... more elements

  // Initial breath
  cursor += BRAND_DURATIONS.section

  // Text 1: First text
  if (text1) {
    const readTime = calculateReadingTime(getTextContent(1))
    cursor = addTextLifecycleTimeBased(tl, text1, cursor, readTime, -15)
  }

  // Text 2: Overlaps with text 1
  if (text2) {
    const text2Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(2))
    cursor = addTextLifecycleTimeBased(tl, text2, text2Start, readTime, -12)
  }

  // Frame transition pause
  cursor += BRAND_DURATIONS.section

  // ... continue pattern

  console.log('[ChapterN] Final cursor:', cursor, 'ms')
  return tl
}
```

### Why This Works

1. **Same denominator**: `timeToScroll(ms)` divides by `getDerivedDurationSeconds()`, which sums all chapter durations
2. **Same overlap**: Both timeline and derive-regions use `TEXT_OVERLAP_MS = 800`
3. **Same duration tokens**: Both use `BRAND_DURATIONS` for appear/fade/transition timing
4. **Content-driven**: Chapter regions proportional to actual reading time needed

---

## Key Formulas Reference

| Concept | Formula |
|---------|---------|
| Reading time | `500 + (wordCount × 200)` ms |
| Time → scroll | `(ms / 1000) / getDerivedDurationSeconds()` |
| Total duration | Sum of all chapter durations (derived from content) |
| Text overlap | 800ms before previous text ends |
| Scroll distance | `derivedDuration × 65` px |
| Device multiplier | Desktop: 1.0, Tablet: 0.85, Mobile: 0.7 |

---

## Design Decisions Log

| Decision | Rationale |
|----------|-----------|
| Derived duration | Content-driven; ~260s from current text content |
| 200ms per word | ~300 WPM comfortable reading pace |
| 500ms base visibility | Even short phrases need minimum dwell time |
| 800ms text overlap | Staggered-parallel feel; texts fade as next appears |
| smooth: 1.5 | Matches brand "velvet" feel, slower scroll response |
| Device multipliers | Mobile users swipe faster; compensate with shorter scroll |
