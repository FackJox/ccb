/**
 * Chapter 2 Timeline - "The Offer"
 *
 * Pure time-based implementation using timeToScroll() for both positions and durations.
 * All timing in milliseconds, converted to global scroll proportions.
 *
 * Frame A (first ~60%): Table scene with progressive text
 * - BG visible from start
 * - FG couple fades in with subtle zoom (1.0→1.03)
 * - Text blocks 1-2 appear with staggered-overlap pattern
 *
 * Frame B (remaining ~40%): Intimate closeup transition
 * - FG couple (table) fades out
 * - Text 3 ("Consent lives in small sentences...") appears
 * - couple-closeup fades in
 * - Text 4 ("Her palm hovered...") overlaps
 * - Text 5 ("Will you follow?") as consent signature beat
 * - Slow zoom on couple-closeup at exit
 *
 * Complexity: L2 (Expressive)
 */

import { gsap, SplitText, brandEase } from '../register'
import {
  timeToScroll,
  calculateReadingTime,
  BRAND_DURATIONS,
} from '../timing'
import { sceneConfigs } from '$data/scenes'

// Get text content for reading time calculations
const textBlocks = sceneConfigs[2].textBlocks
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
 * Create Chapter 2 timeline with pure time-based positioning
 */
export function createChapter2Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // Cursor tracks cumulative time in ms from chapter start
  let cursor = 0

  // ============== GET ELEMENTS ==============
  const couple = container.querySelector('[data-layer="couple"]')
  const coupleCloseup = container.querySelector('[data-layer="coupleCloseup"]')

  // Debug logging
  console.log('[Chapter2] Elements found:', {
    couple: !!couple,
    coupleCloseup: !!coupleCloseup,
    allLayers: container.querySelectorAll('[data-layer]').length,
    layerIds: Array.from(container.querySelectorAll('[data-layer]')).map(el => el.getAttribute('data-layer'))
  })

  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')
  const text3 = container.querySelector('[data-text-block="3"]')
  const text4 = container.querySelector('[data-text-block="4"]')
  const consentText = container.querySelector('[data-consent]')

  // ============== FRAME A: TABLE SCENE ==============
  tl.addLabel('frame-a', timeToScroll(cursor))

  // Initial breath before content
  cursor += BRAND_DURATIONS.section

  // Couple layer fades in with subtle zoom
  if (couple) {
    tl.to(
      couple,
      {
        opacity: 1,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.enter,
      },
      timeToScroll(cursor)
    )

    // Store zoom start position for later
    const zoomStartMs = cursor
    cursor += BRAND_DURATIONS.section

    // Text 1: First narrative text
    if (text1) {
      const readTime = calculateReadingTime(getTextContent(1))
      cursor = addTextLifecycleTimeBased(tl, text1, cursor, readTime, -12)
    }

    // Text 2: Overlaps with text 1
    if (text2) {
      const text2Start = cursor - TEXT_OVERLAP_MS
      const readTime = calculateReadingTime(getTextContent(2))
      cursor = addTextLifecycleTimeBased(tl, text2, text2Start, readTime, -10)
    }

    // Calculate zoom duration to cover Frame A
    const zoomDuration = cursor - zoomStartMs + BRAND_DURATIONS.section
    tl.to(
      couple,
      {
        scale: 1.03,
        duration: timeToScroll(zoomDuration),
        ease: 'none',
      },
      timeToScroll(zoomStartMs)
    )
  } else {
    // Still add texts even if couple layer is missing
    if (text1) {
      const readTime = calculateReadingTime(getTextContent(1))
      cursor = addTextLifecycleTimeBased(tl, text1, cursor, readTime, -12)
    }

    if (text2) {
      const text2Start = cursor - TEXT_OVERLAP_MS
      const readTime = calculateReadingTime(getTextContent(2))
      cursor = addTextLifecycleTimeBased(tl, text2, text2Start, readTime, -10)
    }
  }

  // Transition pause before Frame B
  cursor += BRAND_DURATIONS.section

  // ============== FRAME B: INTIMATE CLOSEUP ==============
  tl.addLabel('frame-b', timeToScroll(cursor))

  // Couple (table scene) fades out, coupleCloseup fades in simultaneously
  if (couple) {
    tl.to(
      couple,
      {
        opacity: 0,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.exit,
      },
      timeToScroll(cursor)
    )
  }

  if (coupleCloseup) {
    tl.to(
      coupleCloseup,
      {
        opacity: 1,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.enter,
      },
      timeToScroll(cursor)
    )

    // Store zoom start for coupleCloseup
    const closeupZoomStart = cursor
    cursor += BRAND_DURATIONS.section

    // Text 3: First Frame B text
    if (text3) {
      const readTime = calculateReadingTime(getTextContent(3))
      cursor = addTextLifecycleTimeBased(tl, text3, cursor, readTime, -10)
    }

    // Text 4: Overlaps with text 3
    if (text4) {
      const text4Start = cursor - TEXT_OVERLAP_MS
      const readTime = calculateReadingTime(getTextContent(4))
      cursor = addTextLifecycleTimeBased(tl, text4, text4Start, readTime, -8)
    }

    // Held breath before consent text
    cursor += BRAND_DURATIONS.sectionHeld

    // Consent text ("Will you follow?") - signature moment
    if (consentText) {
      const consentContent = consentText.querySelector('.typography-beat') || consentText

      try {
        const split = new SplitText(consentContent, {
          type: 'chars,words',
          charsClass: 'beat-char',
        })

        tl.fromTo(
          split.chars,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: timeToScroll(BRAND_DURATIONS.signature),
            stagger: timeToScroll(40),
            ease: brandEase.enter,
          },
          timeToScroll(cursor)
        )

        // Calculate total reveal duration
        const beatDuration = BRAND_DURATIONS.signature + 40 * split.chars.length
        cursor += beatDuration

        // Drift after reveal
        tl.to(
          consentContent,
          {
            y: -10,
            duration: timeToScroll(BRAND_DURATIONS.sectionHeld),
            ease: brandEase.transform,
          },
          timeToScroll(cursor)
        )

        cursor += BRAND_DURATIONS.sectionHeld
      } catch (e) {
        console.warn('[Chapter2] SplitText failed, using simple fade:', e)
        tl.fromTo(
          consentText,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: timeToScroll(BRAND_DURATIONS.signature),
            ease: brandEase.enter,
          },
          timeToScroll(cursor)
        )
        cursor += BRAND_DURATIONS.signature
      }
    }

    // Calculate zoom duration for coupleCloseup (covers Frame B)
    const closeupZoomDuration = cursor - closeupZoomStart + BRAND_DURATIONS.section
    tl.to(
      coupleCloseup,
      {
        scale: 1.03,
        duration: timeToScroll(closeupZoomDuration),
        ease: 'none',
      },
      timeToScroll(closeupZoomStart)
    )
  } else {
    // Still add texts even if coupleCloseup layer is missing
    cursor += BRAND_DURATIONS.section

    if (text3) {
      const readTime = calculateReadingTime(getTextContent(3))
      cursor = addTextLifecycleTimeBased(tl, text3, cursor, readTime, -10)
    }

    if (text4) {
      const text4Start = cursor - TEXT_OVERLAP_MS
      const readTime = calculateReadingTime(getTextContent(4))
      cursor = addTextLifecycleTimeBased(tl, text4, text4Start, readTime, -8)
    }

    cursor += BRAND_DURATIONS.sectionHeld

    if (consentText) {
      tl.fromTo(
        consentText,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: timeToScroll(BRAND_DURATIONS.signature),
          ease: brandEase.enter,
        },
        timeToScroll(cursor)
      )
      cursor += BRAND_DURATIONS.signature
    }
  }

  // Final hold before chapter transition
  cursor += BRAND_DURATIONS.section

  // Log final cursor position for debugging
  console.log('[Chapter2] Final cursor:', cursor, 'ms =', timeToScroll(cursor), 'global scroll')

  return tl
}

/**
 * Get the duration of Chapter 2 as a proportion of the total experience
 * Based on scroll region: 11% - 20% = 0.09
 */
export const CHAPTER_2_DURATION = 0.09

/**
 * Chapter 2 scroll position in master timeline
 */
export const CHAPTER_2_START = 0.11
