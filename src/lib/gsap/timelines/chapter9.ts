/**
 * Chapter 9 Timeline - "Residue & Dawn" (L2 Expressive)
 *
 * Pure time-based implementation using timeToScroll() for both positions and durations.
 * All timing in milliseconds, converted to global scroll proportions.
 *
 * Frame A (dawn room): FG appears first, then BG materializes
 * - FG (couple) fades in first at x: 55% (characters anchor the scene)
 * - Text 1 appears: "At dawn, they broomed glass..."
 * - BG fades in (world materializes around them)
 * - FG fades out
 *
 * Frame B (same room, new composition): FG repositions to left
 * - FG repositions to x: 5% while hidden
 * - Text 2 appears: "For a long time, the smell..."
 * - FG fades in at new position
 * - FG fades out
 *
 * Frame C (CJ door): bg → bg2 crossfade
 * - Crossfade to backstage door with CJ chalk mark
 * - Text 3 appears: "On the backstage door..."
 *
 * Frame D (brooms floor): bg2 → bg3, stacked poem, final texts on black
 * - Crossfade to brooms floor scene
 * - Stacked poem (texts 4-7) with tight stagger
 * - bg3 + poem texts fade out together
 * - Texts 8-9 appear on black: "Old as anything.", "New as dawn."
 * - holdAfter: 1500ms (longest in experience - final chapter)
 *
 * Scroll Region: 88-100% of total scroll (12% duration)
 * Complexity: L2 (Expressive) - quiet epilogue, intimate aftermath
 *
 * "Breath, not bounce" - elements fade and drift like smoke or fabric.
 * This is the soft landing zone - intimate aftermath, not continued drama.
 */

import { gsap, brandEase } from '../register'
import {
  timeToScroll,
  calculateReadingTime,
  BRAND_DURATIONS,
} from '../timing'
import { sceneConfigs } from '$data/scenes'

// Get text content for reading time calculations
const textBlocks = sceneConfigs[9].textBlocks
const getTextContent = (num: number): string =>
  textBlocks.find((t) => t.num === num)?.content ?? ''

// Overlap: how much before previous text ends does next text start (ms)
const TEXT_OVERLAP_MS = 800

// Tighter stagger for poem rhythm (texts 4-7)
const POEM_STAGGER_MS = 400

/**
 * Add text lifecycle animation using pure time-based positioning
 */
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

  // All conversions via timeToScroll for global positions/durations
  tl.fromTo(
    target,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: timeToScroll(appearDur),
      ease: brandEase.enter,
    },
    timeToScroll(appearAtMs)
  )

  // Drift while visible
  if (visibleDurMs > 0) {
    tl.to(
      target,
      {
        y: drift,
        duration: timeToScroll(visibleDurMs),
        ease: 'none',
      },
      timeToScroll(appearAtMs + appearDur)
    )
  }

  // Fade out (unless bridging to next chapter)
  if (!skipFade) {
    tl.to(
      target,
      {
        opacity: 0,
        duration: timeToScroll(fadeDur),
        ease: brandEase.exit,
      },
      timeToScroll(appearAtMs + appearDur + visibleDurMs)
    )
  }

  // Return end time for cursor tracking
  return appearAtMs + appearDur + visibleDurMs + fadeDur
}

/**
 * Create Chapter 9 timeline with pure time-based positioning
 */
export function createChapter9Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // Cursor tracks cumulative time in ms from chapter start
  let cursor = 0

  // ============== GET ELEMENTS ==============
  // Layers
  const bg = container.querySelector('[data-layer="bg"]')
  const bg2 = container.querySelector('[data-layer="bg2"]')
  const bg3 = container.querySelector('[data-layer="bg3"]')
  const fg = container.querySelector('[data-layer="couple"]')

  // Text blocks
  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')
  const text3 = container.querySelector('[data-text-block="3"]')
  const text4 = container.querySelector('[data-text-block="4"]')
  const text5 = container.querySelector('[data-text-block="5"]')
  const text6 = container.querySelector('[data-text-block="6"]')
  const text7 = container.querySelector('[data-text-block="7"]')
  const text8 = container.querySelector('[data-text-block="8"]')
  // text9 ("New as dawn.") is rendered as overlay in +page.svelte above the closing curtain
  const finalTextOverlay = document.querySelector('[data-final-text]')

  // ============== FRAME A: DAWN ROOM - FG FIRST ==============
  tl.addLabel('frame-a', timeToScroll(cursor))

  // Set initial FG position (right side)
  if (fg) {
    tl.set(fg, { x: '55%' }, 0)
  }

  // Initial breath before content
  cursor += BRAND_DURATIONS.section

  // FG (couple) fades in FIRST - characters anchor the scene
  if (fg) {
    tl.to(
      fg,
      {
        opacity: 1,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.enter,
      },
      timeToScroll(cursor)
    )
  }

  cursor += BRAND_DURATIONS.section

  // Text 1: "At dawn, they broomed glass..."
  if (text1) {
    const readTime = calculateReadingTime(getTextContent(1))
    cursor = addTextLifecycleTimeBased(tl, text1, cursor, readTime, -8)
  }

  // BG fades in (world materializes around characters)
  // Overlaps with text 1 reading
  if (bg) {
    tl.to(
      bg,
      {
        opacity: 1,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.enter,
      },
      timeToScroll(cursor - BRAND_DURATIONS.section)
    )
  }

  // FG fades out before Frame B
  if (fg) {
    tl.to(
      fg,
      {
        opacity: 0,
        duration: timeToScroll(BRAND_DURATIONS.micro),
        ease: brandEase.exit,
      },
      timeToScroll(cursor)
    )
  }

  cursor += BRAND_DURATIONS.micro

  // Transition pause before Frame B
  cursor += BRAND_DURATIONS.section

  // ============== FRAME B: SAME ROOM, FG REPOSITIONS ==============
  tl.addLabel('frame-b', timeToScroll(cursor))

  // Reposition FG while hidden (instant) - move to left side
  if (fg) {
    tl.set(fg, { x: '5%' }, timeToScroll(cursor))
  }

  // Text 2: "For a long time, the smell..."
  let text2ReadTime = 0
  if (text2) {
    text2ReadTime = calculateReadingTime(getTextContent(2))
    cursor = addTextLifecycleTimeBased(tl, text2, cursor, text2ReadTime, -8)
  }

  // FG fades in at new position (midway through text 2)
  if (fg && text2ReadTime > 0) {
    const fgFadeInStart = cursor - text2ReadTime / 2 - BRAND_DURATIONS.section - BRAND_DURATIONS.micro
    tl.to(
      fg,
      {
        opacity: 1,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.enter,
      },
      timeToScroll(fgFadeInStart)
    )
  }

  // FG fades out
  if (fg) {
    tl.to(
      fg,
      {
        opacity: 0,
        duration: timeToScroll(BRAND_DURATIONS.micro),
        ease: brandEase.exit,
      },
      timeToScroll(cursor)
    )
  }

  cursor += BRAND_DURATIONS.micro

  // Transition pause before Frame C
  cursor += BRAND_DURATIONS.section

  // ============== FRAME C: CJ DOOR ==============
  tl.addLabel('frame-c', timeToScroll(cursor))

  // Crossfade: bg → bg2 (backstage door with CJ chalk mark)
  if (bg && bg2) {
    tl.to(
      bg,
      {
        opacity: 0,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.exit,
      },
      timeToScroll(cursor)
    )

    tl.to(
      bg2,
      {
        opacity: 1,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.enter,
      },
      timeToScroll(cursor)
    )
  }

  cursor += BRAND_DURATIONS.section

  // Text 3: "On the backstage door..."
  if (text3) {
    const readTime = calculateReadingTime(getTextContent(3))
    cursor = addTextLifecycleTimeBased(tl, text3, cursor, readTime, -8)
  }

  // Transition pause before Frame D
  cursor += BRAND_DURATIONS.section

  // ============== FRAME D: BROOMS FLOOR - STACKED POEM ==============
  tl.addLabel('frame-d', timeToScroll(cursor))

  // Crossfade: bg2 → bg3 (brooms floor scene)
  if (bg2 && bg3) {
    tl.to(
      bg2,
      {
        opacity: 0,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.exit,
      },
      timeToScroll(cursor)
    )

    tl.to(
      bg3,
      {
        opacity: 1,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.enter,
      },
      timeToScroll(cursor)
    )
  }

  cursor += BRAND_DURATIONS.section

  // STACKED POEM: Texts 4-7 appear sequentially with tight stagger
  const poemTexts = [text4, text5, text6, text7].filter(Boolean) as Element[]
  const poemStartCursor = cursor

  poemTexts.forEach((text, i) => {
    const textNum = i + 4
    const textStart = poemStartCursor + (i * POEM_STAGGER_MS)
    const readTime = calculateReadingTime(getTextContent(textNum))

    // Appear with section timing
    tl.fromTo(
      text,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.enter,
      },
      timeToScroll(textStart)
    )

    // Drift while visible
    tl.to(
      text,
      {
        y: -6,
        duration: timeToScroll(readTime),
        ease: 'none',
      },
      timeToScroll(textStart + BRAND_DURATIONS.section)
    )
  })

  // Cursor advances to when last poem text is fully visible + reading time
  const lastPoemStart = poemStartCursor + (3 * POEM_STAGGER_MS)
  const lastPoemRead = calculateReadingTime(getTextContent(7))
  cursor = lastPoemStart + BRAND_DURATIONS.section + lastPoemRead

  // Hold for reading the stacked poem
  cursor += BRAND_DURATIONS.sectionHeld

  // Fade out bg3 + texts 4-7 together (transition to black)
  if (bg3) {
    tl.to(
      bg3,
      {
        opacity: 0,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.exit,
      },
      timeToScroll(cursor)
    )
  }

  poemTexts.forEach((text) => {
    tl.to(
      text,
      {
        opacity: 0,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.exit,
      },
      timeToScroll(cursor)
    )
  })

  cursor += BRAND_DURATIONS.section

  // FINAL TEXTS ON BLACK: Texts 8-9
  // Text 8: "Old as anything."
  if (text8) {
    const readTime = calculateReadingTime(getTextContent(8))
    cursor = addTextLifecycleTimeBased(tl, text8, cursor, readTime, -6)
  }

  // Text 9: "New as dawn." - rendered as overlay above the closing curtain
  // Uses same timing pattern as other text blocks for consistency
  if (finalTextOverlay) {
    const text9Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime('New as dawn.')

    // Fade in with standard section timing
    tl.fromTo(
      finalTextOverlay,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.enter,
      },
      timeToScroll(text9Start)
    )

    // Drift while visible
    tl.to(
      finalTextOverlay,
      {
        y: -6,
        duration: timeToScroll(readTime),
        ease: 'none',
      },
      timeToScroll(text9Start + BRAND_DURATIONS.section)
    )

    // Update cursor to track end of text 9
    cursor = text9Start + BRAND_DURATIONS.section + readTime
  }

  // FINAL HOLD: 1500ms (from chapter definition - longest in experience)
  cursor += 1500

  // Final transition out (signature duration for deliberate fade)
  cursor += BRAND_DURATIONS.signature

  return tl
}
