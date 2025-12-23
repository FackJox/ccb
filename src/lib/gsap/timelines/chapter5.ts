/**
 * Chapter 5 Timeline - "Authority Enters"
 *
 * Pure time-based implementation using timeToScroll() for both positions and durations.
 * All timing in milliseconds, converted to global scroll proportions.
 *
 * Frame A (first ~30%): Square scene with boots entering
 * - BG visible from start
 * - Boots fade in from bottom
 * - Text blocks 1-2 appear with staggered-overlap pattern
 *
 * Frame B (~30-50%): BG crossfade to night street
 * - BG fades out, BG2 fades in
 * - Boots fade out with BG
 * - Text 3 appears
 *
 * Frame C (~50-70%): Captain's order
 * - Text 4 appears
 *
 * Frame D (~70-100%): Ceci's response
 * - Text 5 appears and HOLDS (bridges to Chapter 6)
 *
 * Scroll Region: 38-47% of total scroll (9% duration)
 * Complexity: L1 (Functional) - fade/crossfade only
 */

import { gsap, brandEase } from '../register'
import {
  timeToScroll,
  calculateReadingTime,
  BRAND_DURATIONS,
} from '../timing'
import { sceneConfigs } from '$data/scenes'

// Get text content for reading time calculations
const textBlocks = sceneConfigs[5].textBlocks
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
 * Create Chapter 5 timeline with pure time-based positioning
 */
export function createChapter5Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // Cursor tracks cumulative time in ms from chapter start
  let cursor = 0

  // ============== GET ELEMENTS ==============
  const bg = container.querySelector('[data-layer="bg"]')
  const bg2 = container.querySelector('[data-layer="bg2"]')
  const boots = container.querySelector('[data-layer="boots"]')

  // Debug logging
  console.log('[Chapter5] Elements found:', {
    bg: !!bg,
    bg2: !!bg2,
    boots: !!boots,
    allLayers: container.querySelectorAll('[data-layer]').length,
    layerIds: Array.from(container.querySelectorAll('[data-layer]')).map(el => el.getAttribute('data-layer'))
  })

  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')
  const text3 = container.querySelector('[data-text-block="3"]')
  const text4 = container.querySelector('[data-text-block="4"]')
  const text5 = container.querySelector('[data-text-block="5"]')

  console.log('[Chapter5] Text elements found:', {
    text1: !!text1,
    text2: !!text2,
    text3: !!text3,
    text4: !!text4,
    text5: !!text5,
  })

  // ============== FRAME A: AUTHORITY ENTERS ==============
  tl.addLabel('frame-a', timeToScroll(cursor))

  // Initial breath before content
  cursor += BRAND_DURATIONS.section

  // Boots fade in from bottom
  if (boots) {
    tl.fromTo(
      boots,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
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

  // ============== FRAME B: BG CROSSFADE + TEXT 3 ==============
  tl.addLabel('frame-b', timeToScroll(cursor))

  // BG crossfade: bg → bg2, boots fade out simultaneously
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

  if (boots) {
    tl.to(
      boots,
      {
        opacity: 0,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.exit,
      },
      timeToScroll(cursor)
    )
  }

  cursor += BRAND_DURATIONS.section

  // Text 3
  if (text3) {
    const readTime = calculateReadingTime(getTextContent(3))
    cursor = addTextLifecycleTimeBased(tl, text3, cursor, readTime, -8)
  }

  // Transition pause before Frame C
  cursor += BRAND_DURATIONS.section

  // ============== FRAME C: CAPTAIN'S ORDER ==============
  tl.addLabel('frame-c', timeToScroll(cursor))

  // Text 4
  if (text4) {
    const readTime = calculateReadingTime(getTextContent(4))
    cursor = addTextLifecycleTimeBased(tl, text4, cursor, readTime, -6)
  }

  // Transition pause before Frame D
  cursor += BRAND_DURATIONS.section

  // ============== FRAME D: CECI'S RESPONSE ==============
  tl.addLabel('frame-d', timeToScroll(cursor))

  // Text 5: Bridges TO Chapter 6 (skipFade = true)
  if (text5) {
    const readTime = calculateReadingTime(getTextContent(5))
    cursor = addTextLifecycleTimeBased(tl, text5, cursor, readTime, -5, true)
  }

  // Final hold before chapter transition
  cursor += BRAND_DURATIONS.section

  // Log final cursor position for debugging
  console.log('[Chapter5] Final cursor:', cursor, 'ms =', timeToScroll(cursor), 'global scroll')

  return tl
}

/**
 * Get the duration of Chapter 5 as a proportion of the total experience
 * Based on scroll region: 38% - 47% = 0.09
 */
export const CHAPTER_5_DURATION = 0.09

/**
 * Chapter 5 scroll position in master timeline
 */
export const CHAPTER_5_START = 0.38
