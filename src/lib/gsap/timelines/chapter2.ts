/**
 * Chapter 2 Timeline - "The Offer"
 *
 * Pure time-based implementation using timeToScroll() for both positions and durations.
 * All timing in milliseconds, converted to global scroll proportions.
 *
 * Frame A (first ~40%): Table scene with progressive text
 * - BG visible from start
 * - FG couple fades in with subtle zoom (1.0→1.03)
 * - Text blocks 1-2 appear with staggered-overlap pattern
 *
 * Frame B (remaining ~60%): Intimate closeup transition
 * - FG couple (table) fades out
 * - couple-closeup fades in
 * - Text 3: "Consent lives in small sentences."
 * - Text 4: "She tipped her head..." (longer narrative)
 * - Text 5: "Not control." (emphasis, quick)
 * - Text 6: "Permission." (emphasis, tight pairing with text 5)
 * - Text 7: "Her palm hovered..." (final narrative)
 * - Text 8: "Will you follow?" (consent signature beat)
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

  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')
  const text3 = container.querySelector('[data-text-block="3"]')
  const text4 = container.querySelector('[data-text-block="4"]')
  const text5 = container.querySelector('[data-text-block="5"]')
  const text6 = container.querySelector('[data-text-block="6"]')
  const text7 = container.querySelector('[data-text-block="7"]')
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

    // Text 3: "Consent lives in small sentences." - short, impactful opener
    if (text3) {
      const readTime = calculateReadingTime(getTextContent(3))
      cursor = addTextLifecycleTimeBased(tl, text3, cursor, readTime, -8)
    }

    // Text 4: "She tipped her head..." - overlaps with text 3
    if (text4) {
      const text4Start = cursor - TEXT_OVERLAP_MS
      const readTime = calculateReadingTime(getTextContent(4))
      cursor = addTextLifecycleTimeBased(tl, text4, text4Start, readTime, -10)
    }

    // Text 5 & 6: "Not control." and "Permission." - quick succession, dramatic pause between
    if (text5) {
      const text5Start = cursor - TEXT_OVERLAP_MS
      const readTime = calculateReadingTime(getTextContent(5))
      cursor = addTextLifecycleTimeBased(tl, text5, text5Start, readTime, -5)
    }

    if (text6) {
      // Short pause then "Permission." appears - tight dramatic pairing
      const text6Start = cursor - 400 // Tighter overlap for dramatic effect
      const readTime = calculateReadingTime(getTextContent(6))
      cursor = addTextLifecycleTimeBased(tl, text6, text6Start, readTime, -5)
    }

    // Text 7: "Her palm hovered..." - final narrative before consent
    if (text7) {
      const text7Start = cursor - TEXT_OVERLAP_MS
      const readTime = calculateReadingTime(getTextContent(7))
      cursor = addTextLifecycleTimeBased(tl, text7, text7Start, readTime, -8)
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
      } catch {
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
      cursor = addTextLifecycleTimeBased(tl, text3, cursor, readTime, -8)
    }

    if (text4) {
      const text4Start = cursor - TEXT_OVERLAP_MS
      const readTime = calculateReadingTime(getTextContent(4))
      cursor = addTextLifecycleTimeBased(tl, text4, text4Start, readTime, -10)
    }

    if (text5) {
      const text5Start = cursor - TEXT_OVERLAP_MS
      const readTime = calculateReadingTime(getTextContent(5))
      cursor = addTextLifecycleTimeBased(tl, text5, text5Start, readTime, -5)
    }

    if (text6) {
      const text6Start = cursor - 400
      const readTime = calculateReadingTime(getTextContent(6))
      cursor = addTextLifecycleTimeBased(tl, text6, text6Start, readTime, -5)
    }

    if (text7) {
      const text7Start = cursor - TEXT_OVERLAP_MS
      const readTime = calculateReadingTime(getTextContent(7))
      cursor = addTextLifecycleTimeBased(tl, text7, text7Start, readTime, -8)
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

  return tl
}
