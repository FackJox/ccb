/**
 * Chapter 3 Timeline - "Consent as Choreography"
 *
 * Pure time-based implementation using timeToScroll() for both positions and durations.
 * All timing in milliseconds, converted to global scroll proportions.
 *
 * Frame A (first ~70%): Dip pose reveal from black
 * - FG (coupleDip) fades in FIRST from darkness
 * - BG fades in behind them
 * - Text blocks 1-2 appear with staggered-overlap pattern
 *
 * Frame B (remaining ~30%): Mirror introduction
 * - Text 3 appears (bridges to Chapter 4, no fade out)
 *
 * Complexity: L2 (Expressive, monastic restraint)
 * Motion Forbidden: NO zoom (composition is static/anchored)
 */

import { gsap, brandEase } from '../register'
import {
  timeToScroll,
  calculateReadingTime,
  BRAND_DURATIONS,
} from '../timing'
import { sceneConfigs } from '$data/scenes'

// Get text content for reading time calculations
const textBlocks = sceneConfigs[3].textBlocks
const getTextContent = (num: number): string =>
  textBlocks.find((t) => t.num === num)?.content ?? ''

// Overlap: how much before previous text ends does next text start (ms)
const TEXT_OVERLAP_MS = 800

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
 * Create Chapter 3 timeline with pure time-based positioning
 */
export function createChapter3Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // Cursor tracks cumulative time in ms from chapter start
  let cursor = 0

  // ============== GET ELEMENTS ==============
  const bg = container.querySelector('[data-layer="bg"]')
  const coupleDip = container.querySelector('[data-layer="coupleDip"]')

  // Debug logging
  console.log('[Chapter3] Elements found:', {
    bg: !!bg,
    coupleDip: !!coupleDip,
    allLayers: container.querySelectorAll('[data-layer]').length,
    layerIds: Array.from(container.querySelectorAll('[data-layer]')).map(el => el.getAttribute('data-layer'))
  })

  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')
  const text3 = container.querySelector('[data-text-block="3"]')

  // ============== FRAME A: DIP POSE REVEAL ==============
  tl.addLabel('frame-a', timeToScroll(cursor))

  // Initial breath before content
  cursor += BRAND_DURATIONS.section

  // Step 1: FG couple fades in FIRST from black
  // (Reverse of typical pattern - couple emerges from darkness before scene)
  if (coupleDip) {
    tl.to(
      coupleDip,
      {
        opacity: 1,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.enter,
      },
      timeToScroll(cursor)
    )
    cursor += BRAND_DURATIONS.section
  }

  // Step 2: BG ballroom fades in behind them
  if (bg) {
    tl.to(
      bg,
      {
        opacity: 1,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.enter,
      },
      timeToScroll(cursor)
    )
    cursor += BRAND_DURATIONS.section
  }

  // Text 1: First narrative text
  if (text1) {
    const readTime = calculateReadingTime(getTextContent(1))
    cursor = addTextLifecycleTimeBased(tl, text1, cursor, readTime, -8)
  }

  // Text 2: Overlaps with text 1
  if (text2) {
    const text2Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(2))
    cursor = addTextLifecycleTimeBased(tl, text2, text2Start, readTime, -6)
  }

  // Transition pause before Frame B
  cursor += BRAND_DURATIONS.section

  // ============== FRAME B: MIRROR INTRODUCTION ==============
  tl.addLabel('frame-b', timeToScroll(cursor))

  // Text 3: Mirror text - BRIDGES TO CHAPTER 4 (skipFade = true)
  if (text3) {
    const readTime = calculateReadingTime(getTextContent(3))
    cursor = addTextLifecycleTimeBased(
      tl,
      text3,
      cursor,
      readTime,
      -5,
      true // skipFade = true because this text bridges to Chapter 4
    )
  }

  // Final hold before chapter transition
  cursor += BRAND_DURATIONS.section

  // Log final cursor position for debugging
  console.log('[Chapter3] Final cursor:', cursor, 'ms =', timeToScroll(cursor), 'global scroll')

  return tl
}
