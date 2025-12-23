/**
 * Chapter 7 Timeline - "Heat & Tide" (L3 Signature)
 *
 * Pure time-based implementation using timeToScroll() for both positions and durations.
 * All timing in milliseconds, converted to global scroll proportions.
 *
 * Frame A (crowd scene): Text 1 bridged from Ch6, text 2 over crowd
 * - BG fades in with scale pulse (crowd breathing as single organism)
 * - Text 1 visible from start (bridged from Ch6 text 11), fades out
 * - Text 2 appears with overlap
 *
 * Frame B (exterior windows): Crossfade to bgExterior, texts 3-4
 * - BG → bgExterior crossfade
 * - Texts 3-4 appear with overlap
 *
 * Frame C (interior with couple): Crossfade to bg2, texts 5-6
 * - bgExterior → bg2 crossfade
 * - Texts 5-6 appear with overlap
 *
 * Frame D (final intimate moment): Text 7
 * - bg2 continues
 * - Text 7 (confession) - normal fade out
 *
 * Scroll Region: 62-74% of total scroll (12% duration)
 * Complexity: L3 (Signature) - full orchestration allowed
 *
 * This chapter interweaves intimate romance with public revolution.
 * "Breath, not bounce" - the crowd breathes together; elements fade and drift.
 */

import { gsap, brandEase } from '../register'
import {
  timeToScroll,
  calculateReadingTime,
  BRAND_DURATIONS,
} from '../timing'
import { sceneConfigs } from '$data/scenes'

// Get text content for reading time calculations
const textBlocks = sceneConfigs[7].textBlocks
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
 * Create Chapter 7 timeline with pure time-based positioning
 */
export function createChapter7Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // Cursor tracks cumulative time in ms from chapter start
  let cursor = 0

  // ============== GET ELEMENTS ==============
  // Layers
  const bg = container.querySelector('[data-layer="bg"]')
  const bgExterior = container.querySelector('[data-layer="bgExterior"]')
  const bg2 = container.querySelector('[data-layer="bg2"]')

  // Text blocks
  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')
  const text3 = container.querySelector('[data-text-block="3"]')
  const text4 = container.querySelector('[data-text-block="4"]')
  const text5 = container.querySelector('[data-text-block="5"]')
  const text6 = container.querySelector('[data-text-block="6"]')
  const text7 = container.querySelector('[data-text-block="7"]')

  // ============== FRAME A: CROWD SCENE ==============
  tl.addLabel('frame-a', timeToScroll(cursor))

  // BG fades in with scale pulse (crowd breathing as single organism)
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

    // Scale pulse: 0.99 → 1.01 (crowd breathing as single organism)
    // This runs for the duration of Frame A - long, slow pulse
    tl.to(
      bg,
      {
        scale: 1.01,
        duration: timeToScroll(BRAND_DURATIONS.signature * 2),
        ease: brandEase.transform,
      },
      timeToScroll(cursor)
    )
  }

  cursor += BRAND_DURATIONS.section

  // Text 1 is already visible (bridged from Chapter 6)
  // Set it to visible state, then fade out after reading time
  if (text1) {
    tl.set(text1, { opacity: 1, y: 0 }, 0)

    const readTime = calculateReadingTime(getTextContent(1))

    tl.to(
      text1,
      {
        opacity: 0,
        y: -8,
        duration: timeToScroll(BRAND_DURATIONS.micro),
        ease: brandEase.exit,
      },
      timeToScroll(cursor + readTime)
    )
    cursor += readTime + BRAND_DURATIONS.micro
  }

  // Text 2: "The patrol tried to push through..." - overlaps with text 1
  if (text2) {
    const text2Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(2))
    cursor = addTextLifecycleTimeBased(tl, text2, text2Start, readTime, -8)
  }

  // Transition pause before Frame B
  cursor += BRAND_DURATIONS.section

  // ============== FRAME B: EXTERIOR WINDOWS SILHOUETTE ==============
  tl.addLabel('frame-b', timeToScroll(cursor))

  // Crossfade: bg → bgExterior
  if (bg && bgExterior) {
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
      bgExterior,
      {
        opacity: 1,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.enter,
      },
      timeToScroll(cursor)
    )
  }

  cursor += BRAND_DURATIONS.section

  // Text 3: "Heat traveled through him like memory."
  if (text3) {
    const readTime = calculateReadingTime(getTextContent(3))
    cursor = addTextLifecycleTimeBased(tl, text3, cursor, readTime, -8)
  }

  // Text 4: "Ceci slid her fingers..." - overlaps with text 3
  if (text4) {
    const text4Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(4))
    cursor = addTextLifecycleTimeBased(tl, text4, text4Start, readTime, -8)
  }

  // Transition pause before Frame C
  cursor += BRAND_DURATIONS.section

  // ============== FRAME C: INTERIOR WITH COUPLE ==============
  tl.addLabel('frame-c', timeToScroll(cursor))

  // Crossfade: bgExterior → bg2
  if (bgExterior && bg2) {
    tl.to(
      bgExterior,
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

  // Text 5: "Heat gathered and traveled..."
  if (text5) {
    const readTime = calculateReadingTime(getTextContent(5))
    cursor = addTextLifecycleTimeBased(tl, text5, cursor, readTime, -8)
  }

  // Text 6: "A question. A vow..." - overlaps with text 5
  if (text6) {
    const text6Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(6))
    cursor = addTextLifecycleTimeBased(tl, text6, text6Start, readTime, -6)
  }

  // Transition pause before Frame D
  cursor += BRAND_DURATIONS.section

  // ============== FRAME D: FINAL INTIMATE MOMENT ==============
  tl.addLabel('frame-d', timeToScroll(cursor))

  // Text 7: "Jack exhaled her name..." - normal fade (no bridge to Ch8)
  if (text7) {
    const readTime = calculateReadingTime(getTextContent(7))
    cursor = addTextLifecycleTimeBased(tl, text7, cursor, readTime, -8)
  }

  // Final hold before chapter transition
  cursor += BRAND_DURATIONS.section

  return tl
}
