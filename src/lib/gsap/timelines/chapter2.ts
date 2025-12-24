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
 * Add consent text animation with SplitText character reveal
 */
function addConsentTextAnimation(
  tl: gsap.core.Timeline,
  consentText: Element | null,
  cursor: number
): number {
  if (!consentText) return cursor

  // Target the .beat-text span inside TypographyBeat
  const beatTextSpan = consentText.querySelector('.beat-text')
  const consentContent = beatTextSpan || consentText.querySelector('.typography-beat') || consentText

  try {
    const split = new SplitText(consentContent, {
      type: 'chars,words',
      charsClass: 'beat-char',
    })

    // Make the parent container visible
    tl.to(
      consentText,
      {
        opacity: 1,
        y: 0,
        duration: timeToScroll(BRAND_DURATIONS.micro),
        ease: brandEase.enter,
      },
      timeToScroll(cursor)
    )

    // Calculate total reveal duration
    const beatDuration = BRAND_DURATIONS.signature + 40 * split.chars.length

    // Animate characters
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

    // Drift runs in parallel with reveal (same start time, longer duration)
    tl.to(
      consentContent,
      {
        y: -10,
        duration: timeToScroll(beatDuration + BRAND_DURATIONS.sectionHeld),
        ease: brandEase.transform,
      },
      timeToScroll(cursor)
    )

    cursor += beatDuration + BRAND_DURATIONS.sectionHeld

    // Fade out the consent text
    tl.to(
      consentText,
      {
        opacity: 0,
        duration: timeToScroll(BRAND_DURATIONS.micro),
        ease: brandEase.exit,
      },
      timeToScroll(cursor)
    )

    cursor += BRAND_DURATIONS.micro
  } catch (err) {
    console.error('[Chapter2] SplitText failed:', err)
    // Fallback: simple fade in
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

    // Fade out
    tl.to(
      consentText,
      {
        opacity: 0,
        duration: timeToScroll(BRAND_DURATIONS.micro),
        ease: brandEase.exit,
      },
      timeToScroll(cursor)
    )
    cursor += BRAND_DURATIONS.micro
  }

  return cursor
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

  // Frame A: text 1, 2, 3 (consent)
  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')
  const consentText = container.querySelector('[data-consent]') // text 3

  // Frame B: text 4, 5, 6, 7, 8
  const text4 = container.querySelector('[data-text-block="4"]')
  const text5 = container.querySelector('[data-text-block="5"]')
  const text6 = container.querySelector('[data-text-block="6"]')
  const text7 = container.querySelector('[data-text-block="7"]')
  const text8 = container.querySelector('[data-text-block="8"]')

  // DEBUG: Log found elements
  console.log('[Chapter2] Elements found:', {
    couple: !!couple,
    coupleCloseup: !!coupleCloseup,
    text1: !!text1,
    text2: !!text2,
    consentText: !!consentText,
    text4: !!text4,
    text5: !!text5,
    text6: !!text6,
    text7: !!text7,
    text8: !!text8,
  })

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

    // Consent text (text 3): "Will you follow?" - signature moment in Frame A
    cursor += BRAND_DURATIONS.sectionHeld // Held breath before consent
    cursor = addConsentTextAnimation(tl, consentText, cursor)

    // Calculate zoom duration to cover Frame A (including consent text)
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

    // Consent text in fallback path
    cursor += BRAND_DURATIONS.sectionHeld
    cursor = addConsentTextAnimation(tl, consentText, cursor)
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

    // Text 4: "Consent lives in small sentences." - short, impactful opener
    if (text4) {
      const readTime = calculateReadingTime(getTextContent(4))
      cursor = addTextLifecycleTimeBased(tl, text4, cursor, readTime, -8)
    }

    // Text 5: "She tipped her head..." - overlaps with text 4
    if (text5) {
      const text5Start = cursor - TEXT_OVERLAP_MS
      const readTime = calculateReadingTime(getTextContent(5))
      cursor = addTextLifecycleTimeBased(tl, text5, text5Start, readTime, -10)
    }

    // Text 6: "Her palm hovered..." - overlaps with text 5
    if (text6) {
      const text6Start = cursor - TEXT_OVERLAP_MS
      const readTime = calculateReadingTime(getTextContent(6))
      cursor = addTextLifecycleTimeBased(tl, text6, text6Start, readTime, -5)
    }

    // Text 7: "Not control." - tight dramatic pairing with text 8
    if (text7) {
      const text7Start = cursor - 400 // Tighter overlap for dramatic effect
      const block7 = textBlocks.find((t) => t.num === 7)
      const readTime = block7?.visibleDurationMs ?? calculateReadingTime(getTextContent(7))
      cursor = addTextLifecycleTimeBased(tl, text7, text7Start, readTime, -5)
    }

    // Text 8: "Permission." - paired with text 7 for tension
    if (text8) {
      const text8Start = cursor - TEXT_OVERLAP_MS
      const block8 = textBlocks.find((t) => t.num === 8)
      const readTime = block8?.visibleDurationMs ?? calculateReadingTime(getTextContent(8))
      cursor = addTextLifecycleTimeBased(tl, text8, text8Start, readTime, -8)
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

    if (text4) {
      const readTime = calculateReadingTime(getTextContent(4))
      cursor = addTextLifecycleTimeBased(tl, text4, cursor, readTime, -8)
    }

    if (text5) {
      const text5Start = cursor - TEXT_OVERLAP_MS
      const readTime = calculateReadingTime(getTextContent(5))
      cursor = addTextLifecycleTimeBased(tl, text5, text5Start, readTime, -10)
    }

    if (text6) {
      const text6Start = cursor - TEXT_OVERLAP_MS
      const readTime = calculateReadingTime(getTextContent(6))
      cursor = addTextLifecycleTimeBased(tl, text6, text6Start, readTime, -5)
    }

    if (text7) {
      const text7Start = cursor - 400
      const block7 = textBlocks.find((t) => t.num === 7)
      const readTime = block7?.visibleDurationMs ?? calculateReadingTime(getTextContent(7))
      cursor = addTextLifecycleTimeBased(tl, text7, text7Start, readTime, -5)
    }

    if (text8) {
      const text8Start = cursor - TEXT_OVERLAP_MS
      const block8 = textBlocks.find((t) => t.num === 8)
      const readTime = block8?.visibleDurationMs ?? calculateReadingTime(getTextContent(8))
      cursor = addTextLifecycleTimeBased(tl, text8, text8Start, readTime, -8)
    }
  }

  // Final hold before chapter transition
  cursor += BRAND_DURATIONS.section

  console.log('[Chapter2] Final cursor:', cursor, 'ms, scroll:', timeToScroll(cursor))

  // Compare with chapter region
  import('../scroll').then(({ chapterScrollRegions }) => {
    const region = chapterScrollRegions[2]
    const regionDuration = region.end - region.start
    console.log('[Chapter2] Region:', region, 'duration:', regionDuration)
    console.log('[Chapter2] Timeline scroll duration:', timeToScroll(cursor))
    console.log('[Chapter2] Match?', Math.abs(regionDuration - timeToScroll(cursor)) < 0.01)
  })

  return tl
}
