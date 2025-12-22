# Time-Based Scroll Timing Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace arbitrary percentage-based scroll durations with time-based values (milliseconds) derived from design docs and content reading time.

**Architecture:** All timing defined in milliseconds matching brand guidelines. Single `timeToScroll()` conversion function. Chapter scroll regions derived from content needs. Device-normalized scroll container sizing with ScrollSmoother lerp.

**Tech Stack:** SvelteKit 5, GSAP + ScrollTrigger + ScrollSmoother, TypeScript

---

## Phase 1: Foundation

### Task 1.1: Create timing.ts with core constants

**Files:**
- Create: `src/lib/gsap/timing.ts`

**Step 1: Create the timing module with brand duration constants**

```typescript
/**
 * Time-Based Scroll Timing
 *
 * All timing defined in milliseconds matching design docs.
 * Single conversion function transforms ms → scroll proportion.
 */

// ============== EXPERIENCE DURATION ==============
// The canonical "perfect reading pace" - will be DERIVED from content later
// Initially set manually based on design estimate
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

export type BrandDurationKey = keyof typeof BRAND_DURATIONS

// ============== READING TIME FORMULA ==============
const READING_BASE_MS = 500 // Minimum visibility for any text
const READING_MS_PER_WORD = 200 // ~300 WPM comfortable reading

/**
 * Calculate reading time for text content
 * @param text - The text content to calculate reading time for
 * @returns Duration in milliseconds
 */
export function calculateReadingTime(text: string): number {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  return READING_BASE_MS + wordCount * READING_MS_PER_WORD
}

// ============== SCROLL SPEED ==============
// Comfortable reading scroll speed (research: 50-80px/s)
const COMFORTABLE_SCROLL_SPEED = 65 // px/s

// Target scroll distance in pixels
export const TARGET_SCROLL_DISTANCE = PERFECT_DURATION_SECONDS * COMFORTABLE_SCROLL_SPEED

// ============== CORE CONVERSION ==============
/**
 * Convert milliseconds to scroll proportion (0-1)
 * @param ms - Duration in milliseconds
 * @returns Proportion of total scroll (0-1)
 */
export function timeToScroll(ms: number): number {
  return ms / 1000 / PERFECT_DURATION_SECONDS
}

/**
 * Convert scroll proportion back to milliseconds
 * @param scrollProportion - Proportion of total scroll (0-1)
 * @returns Duration in milliseconds
 */
export function scrollToTime(scrollProportion: number): number {
  return scrollProportion * PERFECT_DURATION_SECONDS * 1000
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run check`
Expected: No errors related to timing.ts

**Step 3: Commit**

```bash
git add src/lib/gsap/timing.ts
git commit -m "feat(timing): add core timing constants and conversion functions"
```

---

### Task 1.2: Add chapter timing helpers

**Files:**
- Modify: `src/lib/gsap/timing.ts`

**Step 1: Add createChapterTimingHelpers function**

Append to `src/lib/gsap/timing.ts`:

```typescript
// ============== CHAPTER TIMING HELPERS ==============

/**
 * Temporary import - will be replaced when scroll regions become derived
 */
import { chapterScrollRegions, type ChapterNumber } from './scroll'

export interface ChapterTimingHelpers {
  /** Convert ms to chapter-relative scroll proportion */
  dur: (ms: number) => number
  /** Convert cumulative ms to chapter-relative position (0-1) */
  pos: (cumulativeMs: number) => number
  /** The chapter's scroll span as proportion of total */
  chapterScrollSpan: number
}

/**
 * Create timing helpers for a specific chapter
 * Converts milliseconds to chapter-relative scroll proportions
 *
 * @param chapterId - The chapter number (1-9)
 * @returns Timing helper functions
 */
export function createChapterTimingHelpers(chapterId: ChapterNumber): ChapterTimingHelpers {
  const region = chapterScrollRegions[chapterId]
  const chapterScrollSpan = region.end - region.start

  const dur = (ms: number): number => {
    const globalProportion = timeToScroll(ms)
    return globalProportion / chapterScrollSpan
  }

  const pos = (cumulativeMs: number): number => {
    return timeToScroll(cumulativeMs) / chapterScrollSpan
  }

  return { dur, pos, chapterScrollSpan }
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run check`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/gsap/timing.ts
git commit -m "feat(timing): add chapter timing helpers"
```

---

### Task 1.3: Add text lifecycle helper

**Files:**
- Modify: `src/lib/gsap/timing.ts`

**Step 1: Add TextLifecycleOptions interface and addTextLifecycle function**

Append to `src/lib/gsap/timing.ts`:

```typescript
import { gsap } from './register'
import { brandEase } from './register'

// ============== TEXT LIFECYCLE ==============

export interface TextLifecycleOptions {
  /** Cumulative ms from chapter start when text appears */
  appearAtMs: number
  /** Duration of appear animation in ms (default: BRAND_DURATIONS.section) */
  appearDurMs?: number
  /** Duration text stays visible in ms (from reading time or override) */
  visibleDurMs: number
  /** Duration of fade out in ms (default: BRAND_DURATIONS.micro) */
  fadeDurMs?: number
  /** Vertical drift in pixels while visible */
  drift: number
  /** Skip fade out (for bridging texts that persist to next chapter) */
  skipFade?: boolean
}

/**
 * Add text lifecycle animation (appear → drift → fade)
 *
 * @param tl - The GSAP timeline to add animations to
 * @param target - The DOM element to animate
 * @param opts - Lifecycle options
 * @param helpers - Chapter timing helpers
 * @returns End time in ms for sequencing next element
 */
export function addTextLifecycle(
  tl: gsap.core.Timeline,
  target: Element,
  opts: TextLifecycleOptions,
  helpers: ChapterTimingHelpers
): number {
  const { dur, pos } = helpers

  const appearDur = opts.appearDurMs ?? BRAND_DURATIONS.section
  const fadeDur = opts.skipFade ? 0 : (opts.fadeDurMs ?? BRAND_DURATIONS.micro)

  // Appear
  tl.fromTo(
    target,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: dur(appearDur), ease: brandEase.enter },
    pos(opts.appearAtMs)
  )

  // Drift while visible
  if (opts.visibleDurMs > 0) {
    tl.to(
      target,
      {
        y: opts.drift,
        duration: dur(opts.visibleDurMs),
        ease: 'none',
      },
      pos(opts.appearAtMs + appearDur)
    )
  }

  // Fade out (unless bridging)
  if (!opts.skipFade) {
    tl.to(
      target,
      {
        opacity: 0,
        duration: dur(fadeDur),
        ease: brandEase.exit,
      },
      pos(opts.appearAtMs + appearDur + opts.visibleDurMs)
    )
  }

  return opts.appearAtMs + appearDur + opts.visibleDurMs + fadeDur
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run check`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/gsap/timing.ts
git commit -m "feat(timing): add text lifecycle animation helper"
```

---

### Task 1.4: Export timing module from gsap index

**Files:**
- Modify: `src/lib/gsap/index.ts` (or create if doesn't exist)

**Step 1: Check if index.ts exists and add export**

First check what exports exist:

Run: `cat src/lib/gsap/index.ts 2>/dev/null || echo "File does not exist"`

If file exists, add this export. If not, the timing module can be imported directly.

Add to exports (if index.ts exists):
```typescript
export * from './timing'
```

**Step 2: Verify TypeScript compiles**

Run: `npm run check`
Expected: No errors

**Step 3: Commit (if changes made)**

```bash
git add src/lib/gsap/index.ts
git commit -m "feat(gsap): export timing module"
```

---

### Task 1.5: Update ScrollSmoother config to smooth: 1.5

**Files:**
- Modify: `src/lib/gsap/scroll.ts:21-26`

**Step 1: Update defaultScrollConfig**

Change `smooth: 1.2` to `smooth: 1.5`:

```typescript
export const defaultScrollConfig: ScrollSmootherConfig = {
  smooth: 1.5,  // Languid, velvet feel (brand-appropriate)
  effects: true,
  normalizeScroll: true,
  ignoreMobileResize: true,
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run check`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/gsap/scroll.ts
git commit -m "feat(scroll): update smooth to 1.5 for brand-appropriate feel"
```

---

## Phase 2: Scene Data Extensions

### Task 2.1: Extend SceneTextBlock interface

**Files:**
- Modify: `src/lib/data/scenes.ts:36-47`

**Step 1: Add new optional fields to interface**

Update the `SceneTextBlock` interface:

```typescript
/**
 * Text block definition
 */
export interface SceneTextBlock {
  num: number // GSAP target: data-text-block="num"
  content: string
  type: 'fragment' | 'beat' | 'consent'
  style: 'parchment' | 'transparent' | 'beat'
  emphasis?: boolean // Bold styling
  position?: {
    top?: string // e.g., '15%', '35%'
    right?: string // e.g., '0', '5%'
    left?: string // Alternative to right
  }
  /** Optional: override calculated reading time (in ms) */
  visibleDurationMs?: number
  /** Persistence: this text bridges to another chapter */
  bridgesTo?: {
    chapter: number
    textNum: number
  }
  /** Persistence: this text continues from another chapter */
  bridgesFrom?: {
    chapter: number
    textNum: number
  }
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run check`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/data/scenes.ts
git commit -m "feat(scenes): extend SceneTextBlock with timing and bridge metadata"
```

---

### Task 2.2: Add bridge metadata to Chapter 3 → 4 texts

**Files:**
- Modify: `src/lib/data/scenes.ts` (Chapter 3 text 3 and Chapter 4 text 1)

**Step 1: Add bridgesTo to Chapter 3, text 3**

Find the text block in Chapter 3 config and add `bridgesTo`:

```typescript
// Frame B text - mirror crash introduction (bridges to Chapter 4)
{
  num: 3,
  content: "When the mirror on the far wall slipped its wire and crashed, the silence struck like a held breath—but Ceci didn't flinch.",
  type: 'fragment',
  style: 'parchment',
  position: { top: '38%', left: '4%' },
  bridgesTo: { chapter: 4, textNum: 1 },
},
```

**Step 2: Add bridgesFrom to Chapter 4, text 1**

```typescript
// Frame A text - same as Chapter 3B (persists across chapter transition)
{
  num: 1,
  content: "When the mirror on the far wall slipped its wire and crashed, the silence struck like a held breath—but Ceci didn't flinch.",
  type: 'fragment',
  style: 'parchment',
  position: { top: '38%', left: '4%' },
  bridgesFrom: { chapter: 3, textNum: 3 },
},
```

**Step 3: Verify TypeScript compiles**

Run: `npm run check`
Expected: No errors

**Step 4: Commit**

```bash
git add src/lib/data/scenes.ts
git commit -m "feat(scenes): add bridge metadata for Ch3→Ch4 text persistence"
```

---

### Task 2.3: Add bridge metadata to Chapter 5 → 6 texts

**Files:**
- Modify: `src/lib/data/scenes.ts` (Chapter 5 text 5 and Chapter 6 text 1)

**Step 1: Add bridgesTo to Chapter 5, text 5**

```typescript
// Frame D text (5D) - persists into Chapter 6A
{
  num: 5,
  content: "Ceci's chin lifted by a fraction—recognition, defiance, maybe destiny. Ceci moved first.",
  type: 'fragment',
  style: 'parchment',
  position: { top: '8%', right: '5%' },
  bridgesTo: { chapter: 6, textNum: 1 },
},
```

**Step 2: Add bridgesFrom to Chapter 6, text 1**

```typescript
// Frame A text - same as Chapter 5D (persists across chapter transition)
{
  num: 1,
  content: "Ceci's chin lifted by a fraction—recognition, defiance, maybe destiny. Ceci moved first.",
  type: 'fragment',
  style: 'parchment',
  position: { top: '8%', right: '5%' },
  bridgesFrom: { chapter: 5, textNum: 5 },
},
```

**Step 3: Verify TypeScript compiles**

Run: `npm run check`
Expected: No errors

**Step 4: Commit**

```bash
git add src/lib/data/scenes.ts
git commit -m "feat(scenes): add bridge metadata for Ch5→Ch6 text persistence"
```

---

### Task 2.4: Add bridge metadata to Chapter 6 → 7 texts

**Files:**
- Modify: `src/lib/data/scenes.ts` (Chapter 6 text 11 and Chapter 7 text 1)

**Step 1: Add bridgesTo to Chapter 6, text 11**

```typescript
{
  num: 11,
  content:
    'Someone clapped on the count. Another joined. Soon the crowd swayed like a single creature.',
  type: 'fragment',
  style: 'parchment',
  position: { top: '65%', left: '5%' },
  bridgesTo: { chapter: 7, textNum: 1 },
},
```

**Step 2: Add bridgesFrom to Chapter 7, text 1**

```typescript
// Text 1 persists from Chapter 6 - MUST match Chapter 6 text 11 position exactly
{
  num: 1,
  content:
    'Someone clapped on the count. Another joined. Soon the crowd swayed like a single creature.',
  type: 'fragment',
  style: 'parchment',
  position: { top: '65%', left: '5%' },
  bridgesFrom: { chapter: 6, textNum: 11 },
},
```

**Step 3: Verify TypeScript compiles**

Run: `npm run check`
Expected: No errors

**Step 4: Commit**

```bash
git add src/lib/data/scenes.ts
git commit -m "feat(scenes): add bridge metadata for Ch6→Ch7 text persistence"
```

---

### Task 2.5: Create bridge validation utility

**Files:**
- Create: `src/lib/data/validate-bridges.ts`

**Step 1: Create validation function**

```typescript
/**
 * Bridge Validation
 *
 * Validates that bridged texts have matching content and position.
 * Run at build time or in development to catch mismatches.
 */

import { sceneConfigs, type SceneTextBlock } from './scenes'

interface ValidationError {
  sourceChapter: number
  sourceTextNum: number
  targetChapter: number
  targetTextNum: number
  error: string
}

/**
 * Validate all bridge connections in scene configs
 * @returns Array of validation errors (empty if all valid)
 */
export function validateBridges(): ValidationError[] {
  const errors: ValidationError[] = []

  for (const [chapterIdStr, config] of Object.entries(sceneConfigs)) {
    const chapterId = parseInt(chapterIdStr)

    for (const text of config.textBlocks) {
      if (text.bridgesTo) {
        const targetConfig = sceneConfigs[text.bridgesTo.chapter]

        if (!targetConfig) {
          errors.push({
            sourceChapter: chapterId,
            sourceTextNum: text.num,
            targetChapter: text.bridgesTo.chapter,
            targetTextNum: text.bridgesTo.textNum,
            error: `Target chapter ${text.bridgesTo.chapter} not found`,
          })
          continue
        }

        const targetText = targetConfig.textBlocks.find(
          (t) => t.num === text.bridgesTo!.textNum
        )

        if (!targetText) {
          errors.push({
            sourceChapter: chapterId,
            sourceTextNum: text.num,
            targetChapter: text.bridgesTo.chapter,
            targetTextNum: text.bridgesTo.textNum,
            error: `Target text block ${text.bridgesTo.textNum} not found in chapter ${text.bridgesTo.chapter}`,
          })
          continue
        }

        // Validate content matches
        if (targetText.content !== text.content) {
          errors.push({
            sourceChapter: chapterId,
            sourceTextNum: text.num,
            targetChapter: text.bridgesTo.chapter,
            targetTextNum: text.bridgesTo.textNum,
            error: `Content mismatch`,
          })
        }

        // Validate position matches
        if (JSON.stringify(targetText.position) !== JSON.stringify(text.position)) {
          errors.push({
            sourceChapter: chapterId,
            sourceTextNum: text.num,
            targetChapter: text.bridgesTo.chapter,
            targetTextNum: text.bridgesTo.textNum,
            error: `Position mismatch: ${JSON.stringify(text.position)} vs ${JSON.stringify(targetText.position)}`,
          })
        }

        // Validate target has bridgesFrom pointing back
        if (
          !targetText.bridgesFrom ||
          targetText.bridgesFrom.chapter !== chapterId ||
          targetText.bridgesFrom.textNum !== text.num
        ) {
          errors.push({
            sourceChapter: chapterId,
            sourceTextNum: text.num,
            targetChapter: text.bridgesTo.chapter,
            targetTextNum: text.bridgesTo.textNum,
            error: `Target missing or incorrect bridgesFrom reference`,
          })
        }
      }
    }
  }

  return errors
}

/**
 * Throw if any bridge validation errors
 * Use in build scripts or tests
 */
export function assertBridgesValid(): void {
  const errors = validateBridges()
  if (errors.length > 0) {
    const messages = errors.map(
      (e) =>
        `Ch${e.sourceChapter} text ${e.sourceTextNum} → Ch${e.targetChapter} text ${e.targetTextNum}: ${e.error}`
    )
    throw new Error(`Bridge validation failed:\n${messages.join('\n')}`)
  }
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run check`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/data/validate-bridges.ts
git commit -m "feat(validation): add bridge validation utility"
```

---

## Phase 3: Migrate Chapter 1 Timeline

### Task 3.1: Refactor Chapter 1 to use time-based helpers

**Files:**
- Modify: `src/lib/gsap/timelines/chapter1.ts`

**Step 1: Update imports and add timing helpers**

Replace the imports and helper section at the top of the file:

```typescript
/**
 * Chapter 1 Timeline - "The Held Breath"
 *
 * TIME-BASED VERSION
 *
 * Single continuous scene with layered animations:
 * - Frame A: BG + Ceci appears, texts 1-3
 * - Frame B: Jack appears, texts 4-6
 * - Frame C: texts 7-8 (transparent), beat text reveal
 *
 * Scroll Region: 0-11% of total scroll
 * Complexity: L2 (Expressive)
 */

import { gsap, SplitText, brandEase } from '../register'
import {
  createChapterTimingHelpers,
  addTextLifecycle,
  calculateReadingTime,
  BRAND_DURATIONS,
} from '../timing'
import { sceneConfigs } from '$data/scenes'

// Get text content for reading time calculation
const textBlocks = sceneConfigs[1].textBlocks
const getTextContent = (num: number): string =>
  textBlocks.find((t) => t.num === num)?.content ?? ''
```

**Step 2: Refactor createChapter1Timeline function**

Replace the function body:

```typescript
/**
 * Create Chapter 1 timeline with time-based positioning
 */
export function createChapter1Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()
  const helpers = createChapterTimingHelpers(1)
  const { dur, pos } = helpers

  // ============== GET ELEMENTS ==============
  const ceci = container.querySelector('[data-layer="ceci"]')
  const jack = container.querySelector('[data-layer="jack"]')
  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')
  const text3 = container.querySelector('[data-text-block="3"]')
  const text4 = container.querySelector('[data-text-block="4"]')
  const text5 = container.querySelector('[data-text-block="5"]')
  const text6 = container.querySelector('[data-text-block="6"]')
  const text7 = container.querySelector('[data-text-block="7"]')
  const text8 = container.querySelector('[data-text-block="8"]')
  const beatText = container.querySelector('[data-beat]')

  // ============== FRAME A: CECI CLAIMS THE HALL ==============
  tl.addLabel('frame-a', 0)

  // Ceci appears at 300ms
  if (ceci) {
    tl.to(
      ceci,
      {
        opacity: 1,
        scale: 1,
        duration: dur(BRAND_DURATIONS.section),
        ease: brandEase.enter,
      },
      pos(300)
    )
  }

  // Frame A texts - staggered entry
  let cursor = 500 // Start texts 500ms into chapter

  if (text1) {
    cursor = addTextLifecycle(
      tl,
      text1,
      {
        appearAtMs: cursor,
        visibleDurMs: calculateReadingTime(getTextContent(1)),
        drift: -15,
      },
      helpers
    )
  }

  // Stagger: next text starts 200ms before previous ends
  const staggerOverlap = 800

  if (text2) {
    cursor = addTextLifecycle(
      tl,
      text2,
      {
        appearAtMs: cursor - staggerOverlap,
        visibleDurMs: calculateReadingTime(getTextContent(2)),
        drift: -12,
      },
      helpers
    )
  }

  if (text3) {
    cursor = addTextLifecycle(
      tl,
      text3,
      {
        appearAtMs: cursor - staggerOverlap,
        visibleDurMs: calculateReadingTime(getTextContent(3)),
        drift: -10,
      },
      helpers
    )
  }

  // ============== FRAME B: JACK ENTERS ==============
  const frameBStart = cursor + 500 // Breathing room after Frame A
  tl.addLabel('frame-b', pos(frameBStart))

  // Jack appears slightly before Frame B texts
  if (jack) {
    tl.to(
      jack,
      {
        opacity: 1,
        duration: dur(BRAND_DURATIONS.section),
        ease: brandEase.enter,
      },
      pos(frameBStart - 200)
    )
  }

  cursor = frameBStart

  if (text4) {
    cursor = addTextLifecycle(
      tl,
      text4,
      {
        appearAtMs: cursor,
        visibleDurMs: calculateReadingTime(getTextContent(4)),
        drift: -18,
      },
      helpers
    )
  }

  if (text5) {
    cursor = addTextLifecycle(
      tl,
      text5,
      {
        appearAtMs: cursor - staggerOverlap,
        visibleDurMs: calculateReadingTime(getTextContent(5)),
        drift: -15,
      },
      helpers
    )
  }

  if (text6) {
    cursor = addTextLifecycle(
      tl,
      text6,
      {
        appearAtMs: cursor - staggerOverlap,
        visibleDurMs: calculateReadingTime(getTextContent(6)),
        drift: -12,
      },
      helpers
    )
  }

  // ============== FRAME C: SHARED MOMENT ==============
  const frameCStart = cursor + 500
  tl.addLabel('frame-c', pos(frameCStart))

  cursor = frameCStart

  if (text7) {
    cursor = addTextLifecycle(
      tl,
      text7,
      {
        appearAtMs: cursor,
        visibleDurMs: calculateReadingTime(getTextContent(7)),
        drift: -15,
      },
      helpers
    )
  }

  if (text8) {
    cursor = addTextLifecycle(
      tl,
      text8,
      {
        appearAtMs: cursor - staggerOverlap,
        visibleDurMs: calculateReadingTime(getTextContent(8)),
        drift: -12,
      },
      helpers
    )
  }

  // Beat text with character animation
  const beatStart = cursor + 300
  if (beatText) {
    const beatContent = beatText.querySelector('.typography-beat') || beatText

    try {
      const split = new SplitText(beatContent, {
        type: 'chars,words',
        charsClass: 'beat-char',
      })

      tl.fromTo(
        split.chars,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: dur(BRAND_DURATIONS.signature),
          stagger: dur(50), // 50ms per character
          ease: brandEase.enter,
        },
        pos(beatStart)
      )

      tl.to(
        beatContent,
        {
          y: -10,
          duration: dur(BRAND_DURATIONS.sectionHeld),
          ease: brandEase.transform,
        },
        pos(beatStart + BRAND_DURATIONS.signature + 500)
      )
    } catch (e) {
      console.warn('[Chapter1] SplitText failed, using simple fade:', e)
      tl.fromTo(
        beatText,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: dur(BRAND_DURATIONS.signature),
          ease: brandEase.enter,
        },
        pos(beatStart)
      )
    }
  }

  return tl
}
```

**Step 3: Remove old helper function and constants**

Remove these from the file (they're no longer used):
- The old `addTextLifecycle` function at the bottom
- `CHAPTER_1_DURATION`, `CHAPTER_1_START`, `CHAPTER_1_SNAP_POINTS`, `getChapter1GlobalSnapPoints` exports (if not used elsewhere)

**Step 4: Verify TypeScript compiles**

Run: `npm run check`
Expected: No errors

**Step 5: Test in browser**

Run: `npm run dev`
Expected: Chapter 1 animations play with timing that matches reading pace

**Step 6: Commit**

```bash
git add src/lib/gsap/timelines/chapter1.ts
git commit -m "refactor(chapter1): migrate to time-based timing helpers"
```

---

## Phase 4: Create Chapter Definitions

### Task 4.1: Create chapter-definitions.ts

**Files:**
- Create: `src/lib/data/chapter-definitions.ts`

**Step 1: Create frame and chapter definition structures**

```typescript
/**
 * Chapter Definitions
 *
 * Frame structures per chapter defining which texts appear in each frame
 * and transition timing between frames.
 */

import { BRAND_DURATIONS, type BrandDurationKey } from '$gsap/timing'

/**
 * Frame definition within a chapter
 */
export interface FrameDefinition {
  /** Frame identifier, e.g., '1A', '1B' */
  id: string
  /** Text block numbers that appear in this frame */
  texts: number[]
  /** Layer transition type (determines duration) */
  layerTransition?: BrandDurationKey
  /** Additional hold time after frame content (ms) */
  holdAfter?: number
}

/**
 * Chapter definition with frames and transitions
 */
export interface ChapterDefinition {
  id: number
  frames: FrameDefinition[]
  /** Transition type from previous chapter */
  transitionIn: BrandDurationKey
  /** Transition type to next chapter */
  transitionOut: BrandDurationKey
}

/**
 * All chapter definitions
 */
export const chapterDefinitions: ChapterDefinition[] = [
  // Chapter 1: The Held Breath
  {
    id: 1,
    frames: [
      { id: '1A', texts: [1, 2, 3], layerTransition: 'section' },
      { id: '1B', texts: [4, 5, 6], layerTransition: 'section' },
      { id: '1C', texts: [7, 8, 9], holdAfter: 500 },
    ],
    transitionIn: 'section',
    transitionOut: 'section',
  },

  // Chapter 2: The Offer
  {
    id: 2,
    frames: [
      { id: '2A', texts: [1, 2], layerTransition: 'section' },
      { id: '2B', texts: [3, 4, 5] },
    ],
    transitionIn: 'section',
    transitionOut: 'section',
  },

  // Chapter 3: Consent as Choreography
  {
    id: 3,
    frames: [
      { id: '3A', texts: [1, 2] },
      { id: '3B', texts: [3] }, // Text 3 bridges to Ch4
    ],
    transitionIn: 'section',
    transitionOut: 'micro', // Quick crossfade for text bridge
  },

  // Chapter 4: The Crack
  {
    id: 4,
    frames: [
      { id: '4A', texts: [1], layerTransition: 'micro' }, // Mirror swap
      { id: '4B', texts: [2, 3, 4, 5], holdAfter: 300 },
    ],
    transitionIn: 'micro', // Crossfade from Ch3
    transitionOut: 'section',
  },

  // Chapter 5: Authority Enters (L1 - minimal)
  {
    id: 5,
    frames: [
      { id: '5A', texts: [1, 2] },
      { id: '5B', texts: [3] },
      { id: '5C', texts: [4] },
      { id: '5D', texts: [5] }, // Text 5 bridges to Ch6
    ],
    transitionIn: 'section',
    transitionOut: 'micro',
  },

  // Chapter 6: Violet Window (L3 - Hero)
  {
    id: 6,
    frames: [
      { id: '6A', texts: [1] }, // Persistent from Ch5
      { id: '6B', texts: [2, 3, 4], layerTransition: 'signature' }, // Hero transition
      { id: '6C', texts: [5, 6], layerTransition: 'signature' },
      { id: '6D', texts: [7, 8], layerTransition: 'section' },
      { id: '6E', texts: [9, 10, 11] }, // Text 11 bridges to Ch7
    ],
    transitionIn: 'micro',
    transitionOut: 'micro',
  },

  // Chapter 7: Heat & Tide (L3)
  {
    id: 7,
    frames: [
      { id: '7A', texts: [1, 2], layerTransition: 'section' }, // Text 1 from Ch6
      { id: '7B', texts: [3, 4], layerTransition: 'section' },
      { id: '7C', texts: [5, 6], layerTransition: 'section' },
      { id: '7D', texts: [7] },
    ],
    transitionIn: 'micro',
    transitionOut: 'section',
  },

  // Chapter 8: Release
  {
    id: 8,
    frames: [
      { id: '8A', texts: [1, 2], layerTransition: 'section' },
      { id: '8B', texts: [], layerTransition: 'section' }, // Scene change only
      { id: '8C', texts: [], layerTransition: 'section' },
      { id: '8D', texts: [3], layerTransition: 'section' },
      { id: '8E', texts: [4, 5], holdAfter: 800 },
    ],
    transitionIn: 'section',
    transitionOut: 'sectionHeld',
  },

  // Chapter 9: Residue & Dawn
  {
    id: 9,
    frames: [
      { id: '9A', texts: [1] },
      { id: '9B', texts: [2], layerTransition: 'section' },
      { id: '9C', texts: [3], layerTransition: 'section' },
      { id: '9D', texts: [4, 5, 6, 7, 8, 9], holdAfter: 1500 }, // Final hold
    ],
    transitionIn: 'sectionHeld',
    transitionOut: 'signature', // Long fade out
  },
]

/**
 * Get chapter definition by ID
 */
export function getChapterDefinition(id: number): ChapterDefinition | undefined {
  return chapterDefinitions.find((ch) => ch.id === id)
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run check`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/data/chapter-definitions.ts
git commit -m "feat(data): add chapter frame definitions for timing calculation"
```

---

## Phase 5: Derived Scroll Regions

### Task 5.1: Add duration calculation to timing.ts

**Files:**
- Modify: `src/lib/gsap/timing.ts`

**Step 1: Add frame and chapter duration calculations**

Append to `src/lib/gsap/timing.ts`:

```typescript
import type { FrameDefinition, ChapterDefinition } from '$data/chapter-definitions'
import type { SceneTextBlock } from '$data/scenes'

// ============== DURATION CALCULATION ==============

/**
 * Calculate frame duration from its text content
 */
export function calculateFrameDuration(
  frame: FrameDefinition,
  textBlocks: SceneTextBlock[]
): number {
  let maxTextEnd = 0

  for (const textNum of frame.texts) {
    const block = textBlocks.find((t) => t.num === textNum)
    if (!block) continue

    const appearDur = BRAND_DURATIONS.section
    const visibleDur = block.visibleDurationMs ?? calculateReadingTime(block.content)
    const fadeDur = block.bridgesTo ? 0 : BRAND_DURATIONS.micro

    maxTextEnd = Math.max(maxTextEnd, appearDur + visibleDur + fadeDur)
  }

  const layerDur = frame.layerTransition ? BRAND_DURATIONS[frame.layerTransition] : 0

  return maxTextEnd + layerDur + (frame.holdAfter ?? 0)
}

/**
 * Calculate total chapter duration from frames
 */
export function calculateChapterDuration(
  chapter: ChapterDefinition,
  textBlocks: SceneTextBlock[]
): number {
  const transIn = BRAND_DURATIONS[chapter.transitionIn]
  const transOut = BRAND_DURATIONS[chapter.transitionOut]

  const frameDurations = chapter.frames.map((f) => calculateFrameDuration(f, textBlocks))

  return transIn + frameDurations.reduce((a, b) => a + b, 0) + transOut
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run check`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/gsap/timing.ts
git commit -m "feat(timing): add frame and chapter duration calculation"
```

---

### Task 5.2: Add derived scroll regions function

**Files:**
- Modify: `src/lib/gsap/timing.ts`

**Step 1: Add deriveScrollRegions function**

Append to `src/lib/gsap/timing.ts`:

```typescript
import { chapterDefinitions } from '$data/chapter-definitions'
import { sceneConfigs } from '$data/scenes'

/**
 * Derive scroll regions from chapter content
 * Returns regions as proportions (0-1) of total scroll
 */
export function deriveScrollRegions(): Record<number, { start: number; end: number }> {
  // Calculate all chapter durations in ms
  const durationsMs = chapterDefinitions.map((ch) =>
    calculateChapterDuration(ch, sceneConfigs[ch.id]?.textBlocks ?? [])
  )

  const totalMs = durationsMs.reduce((a, b) => a + b, 0)

  // Convert to proportions
  const regions: Record<number, { start: number; end: number }> = {}
  let cursor = 0

  durationsMs.forEach((dur, i) => {
    const proportion = dur / totalMs
    const chapterId = chapterDefinitions[i].id
    regions[chapterId] = { start: cursor, end: cursor + proportion }
    cursor += proportion
  })

  return regions
}

/**
 * Get derived PERFECT_DURATION from content
 * Call this to get the actual total experience duration in seconds
 */
export function calculateTotalDuration(): number {
  const durationsMs = chapterDefinitions.map((ch) =>
    calculateChapterDuration(ch, sceneConfigs[ch.id]?.textBlocks ?? [])
  )
  return durationsMs.reduce((a, b) => a + b, 0) / 1000
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run check`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/gsap/timing.ts
git commit -m "feat(timing): add derived scroll regions calculation"
```

---

### Task 5.3: Update scroll.ts to use derived regions (optional switch)

**Files:**
- Modify: `src/lib/gsap/scroll.ts`

**Step 1: Add flag to switch between hardcoded and derived regions**

Add near the top of the file, after imports:

```typescript
import { deriveScrollRegions } from './timing'

// Feature flag: set to true to use content-derived scroll regions
const USE_DERIVED_REGIONS = false

// Hardcoded regions (original)
const HARDCODED_SCROLL_REGIONS = {
  1: { start: 0, end: 0.11 },
  2: { start: 0.11, end: 0.20 },
  3: { start: 0.20, end: 0.27 },
  4: { start: 0.27, end: 0.38 },
  5: { start: 0.38, end: 0.47 },
  6: { start: 0.47, end: 0.67 },
  7: { start: 0.67, end: 0.77 },
  8: { start: 0.77, end: 0.90 },
  9: { start: 0.90, end: 1.0 },
} as const

/**
 * Chapter scroll regions as percentages of total scroll height
 * Can be hardcoded or derived from content
 */
export const chapterScrollRegions: Record<number, { start: number; end: number }> =
  USE_DERIVED_REGIONS ? deriveScrollRegions() : HARDCODED_SCROLL_REGIONS
```

**Step 2: Remove the old hardcoded chapterScrollRegions constant**

Delete the old `chapterScrollRegions` constant that was at lines ~88-98.

**Step 3: Verify TypeScript compiles**

Run: `npm run check`
Expected: No errors

**Step 4: Commit**

```bash
git add src/lib/gsap/scroll.ts
git commit -m "feat(scroll): add feature flag for derived scroll regions"
```

---

## Phase 6: Enable Derived Regions

### Task 6.1: Enable derived regions and test

**Files:**
- Modify: `src/lib/gsap/scroll.ts`

**Step 1: Set USE_DERIVED_REGIONS to true**

```typescript
const USE_DERIVED_REGIONS = true
```

**Step 2: Test in browser**

Run: `npm run dev`
Expected: All chapters render with proportional timing based on content

**Step 3: Compare old vs new regions**

Add temporary logging to see the difference:
```typescript
console.log('Derived regions:', deriveScrollRegions())
console.log('Hardcoded regions:', HARDCODED_SCROLL_REGIONS)
```

**Step 4: Commit**

```bash
git add src/lib/gsap/scroll.ts
git commit -m "feat(scroll): enable content-derived scroll regions"
```

---

## Phase 7: Migrate Remaining Chapters

Repeat Task 3.1 pattern for each remaining chapter (2-9). Each task follows the same structure:

1. Update imports to use timing helpers
2. Refactor timeline to use `addTextLifecycle` with `calculateReadingTime`
3. Use `createChapterTimingHelpers(N)` for the chapter
4. Test in browser
5. Commit

---

## Summary

**Files Created:**
- `src/lib/gsap/timing.ts` - Core timing utilities
- `src/lib/data/chapter-definitions.ts` - Frame structures
- `src/lib/data/validate-bridges.ts` - Bridge validation

**Files Modified:**
- `src/lib/gsap/scroll.ts` - ScrollSmoother smooth: 1.5, derived regions
- `src/lib/data/scenes.ts` - Extended interface, bridge metadata
- `src/lib/gsap/timelines/chapter1.ts` through `chapter9.ts` - Time-based timing

**Key Commands:**
- `npm run check` - Verify TypeScript
- `npm run dev` - Test in browser
- `npm run build` - Production build

---

Plan complete and saved to `docs/plans/2025-12-22-time-based-scroll-timing-plan.md`.

**Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
