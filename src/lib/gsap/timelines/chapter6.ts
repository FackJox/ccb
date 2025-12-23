/**
 * Chapter 6 Timeline - "Violet Window" (L3 Hero Beat)
 *
 * Pure time-based implementation using timeToScroll() for both positions and durations.
 * All timing in milliseconds, converted to global scroll proportions.
 *
 * Frame A (bridged text from Ch5): Text 1 visible, fades out
 * Frame B (build to hero): Texts 2-4 appear sequentially
 * Frame C (HERO BEAT): bg → bgExterior crossfade (signature 1050ms), texts 5-6
 * Frame D (intimate closeup): bgExterior → bgC2, coupleCloseup, texts 7-8
 * Frame E (return to exterior): bgC2 → bgExterior, texts 9-11 (text 11 bridges to Ch7)
 *
 * Scroll Region: 47-62% of total scroll (15% duration)
 * Complexity: L3 (Signature) - full orchestration allowed
 *
 * This is THE poster beat - the most iconic moment of the experience.
 * "Breath, not bounce" - elements fade and drift like smoke or fabric.
 */

import { gsap, brandEase } from '../register'
import {
  timeToScroll,
  calculateReadingTime,
  BRAND_DURATIONS,
} from '../timing'
import { sceneConfigs } from '$data/scenes'

// Get text content for reading time calculations
const textBlocks = sceneConfigs[6].textBlocks
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
 * Create Chapter 6 timeline with pure time-based positioning
 */
export function createChapter6Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // Cursor tracks cumulative time in ms from chapter start
  let cursor = 0

  // ============== GET ELEMENTS ==============
  // Layers
  const bg = container.querySelector('[data-layer="bg"]')
  const bgExterior = container.querySelector('[data-layer="bgExterior"]')
  const coupleStanding = container.querySelector('[data-layer="coupleStanding"]')
  const mirrorBroken = container.querySelector('[data-layer="mirrorBroken"]')
  const bgC2 = container.querySelector('[data-layer="bgC2"]')
  const coupleCloseup = container.querySelector('[data-layer="coupleCloseup"]')

  // Debug logging
  console.log('[Chapter6] Elements found:', {
    bg: !!bg,
    bgExterior: !!bgExterior,
    bgC2: !!bgC2,
    coupleStanding: !!coupleStanding,
    mirrorBroken: !!mirrorBroken,
    coupleCloseup: !!coupleCloseup,
    allLayers: container.querySelectorAll('[data-layer]').length,
    layerIds: Array.from(container.querySelectorAll('[data-layer]')).map(el => el.getAttribute('data-layer'))
  })

  // Text blocks
  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')
  const text3 = container.querySelector('[data-text-block="3"]')
  const text4 = container.querySelector('[data-text-block="4"]')
  const text5 = container.querySelector('[data-text-block="5"]')
  const text6 = container.querySelector('[data-text-block="6"]')
  const text7 = container.querySelector('[data-text-block="7"]')
  const text8 = container.querySelector('[data-text-block="8"]')
  const text9 = container.querySelector('[data-text-block="9"]')
  const text10 = container.querySelector('[data-text-block="10"]')
  const text11 = container.querySelector('[data-text-block="11"]')

  console.log('[Chapter6] Text elements found:', {
    text1: !!text1,
    text2: !!text2,
    text3: !!text3,
    text4: !!text4,
    text5: !!text5,
    text6: !!text6,
    text7: !!text7,
    text8: !!text8,
    text9: !!text9,
    text10: !!text10,
    text11: !!text11,
  })

  // ============== FRAME A: BRIDGED TEXT FROM CH5 ==============
  tl.addLabel('frame-a', timeToScroll(cursor))

  // Initial breath before content
  cursor += BRAND_DURATIONS.section

  // Text 1 is already visible (bridged from Chapter 5)
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

  // Transition pause before Frame B
  cursor += BRAND_DURATIONS.section

  // ============== FRAME B: BUILD TO HERO ==============
  tl.addLabel('frame-b', timeToScroll(cursor))

  // Text 2: "She killed the main lanterns..."
  if (text2) {
    const readTime = calculateReadingTime(getTextContent(2))
    cursor = addTextLifecycleTimeBased(tl, text2, cursor, readTime, -10)
  }

  // Text 3: "The glass flared..." - overlaps with text 2
  if (text3) {
    const text3Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(3))
    cursor = addTextLifecycleTimeBased(tl, text3, text3Start, readTime, -8)
  }

  // Text 4: "Their bodies became silhouettes..." - overlaps with text 3
  if (text4) {
    const text4Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(4))
    cursor = addTextLifecycleTimeBased(tl, text4, text4Start, readTime, -8)
  }

  // Transition pause before Frame C (hero beat)
  cursor += BRAND_DURATIONS.section

  // ============== FRAME C: HERO BEAT - EXTERIOR SILHOUETTE ==============
  tl.addLabel('frame-c', timeToScroll(cursor))

  // HERO TRANSITION: bg → bgExterior (signature duration for hero beat)
  if (bg && bgExterior) {
    tl.to(
      bg,
      {
        opacity: 0,
        duration: timeToScroll(BRAND_DURATIONS.signature), // 1050ms for hero
        ease: brandEase.exit,
      },
      timeToScroll(cursor)
    )

    tl.to(
      bgExterior,
      {
        opacity: 1,
        duration: timeToScroll(BRAND_DURATIONS.signature),
        ease: brandEase.enter,
      },
      timeToScroll(cursor)
    )
  }

  // FG layers fade out with BG
  if (coupleStanding) {
    tl.to(
      coupleStanding,
      {
        opacity: 0,
        duration: timeToScroll(BRAND_DURATIONS.signature),
        ease: brandEase.exit,
      },
      timeToScroll(cursor)
    )
  }

  if (mirrorBroken) {
    tl.to(
      mirrorBroken,
      {
        opacity: 0,
        duration: timeToScroll(BRAND_DURATIONS.signature),
        ease: brandEase.exit,
      },
      timeToScroll(cursor)
    )
  }

  cursor += BRAND_DURATIONS.signature

  // Text 5: "A gasp rose from the square..."
  if (text5) {
    const readTime = calculateReadingTime(getTextContent(5))
    cursor = addTextLifecycleTimeBased(tl, text5, cursor, readTime, -8)
  }

  // Text 6: "Only shadows remained..." - overlaps with text 5
  if (text6) {
    const text6Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(6))
    cursor = addTextLifecycleTimeBased(tl, text6, text6Start, readTime, -8)
  }

  // Transition pause before Frame D
  cursor += BRAND_DURATIONS.section

  // ============== FRAME D: INTIMATE CLOSEUP ==============
  tl.addLabel('frame-d', timeToScroll(cursor))

  // Scene transition: bgExterior → bgC2, coupleCloseup fades in
  if (bgExterior && bgC2) {
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
      bgC2,
      {
        opacity: 1,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.enter,
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
  }

  cursor += BRAND_DURATIONS.section

  // Text 7: "She stepped into him..." / "Follow me"
  if (text7) {
    const readTime = calculateReadingTime(getTextContent(7))
    cursor = addTextLifecycleTimeBased(tl, text7, cursor, readTime, -8)
  }

  // Text 8: "'Always,' he answered..." - overlaps with text 7
  if (text8) {
    const text8Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(8))
    cursor = addTextLifecycleTimeBased(tl, text8, text8Start, readTime, -6)
  }

  // Transition pause before Frame E
  cursor += BRAND_DURATIONS.section

  // ============== FRAME E: RETURN TO EXTERIOR ==============
  tl.addLabel('frame-e', timeToScroll(cursor))

  // Scene transition: bgC2 → bgExterior (return), coupleCloseup fades out
  if (bgC2 && bgExterior) {
    tl.to(
      bgC2,
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

  if (coupleCloseup) {
    tl.to(
      coupleCloseup,
      {
        opacity: 0,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.exit,
      },
      timeToScroll(cursor)
    )
  }

  cursor += BRAND_DURATIONS.section

  // Text 9: "They waltzed, framed by darkness..."
  if (text9) {
    const readTime = calculateReadingTime(getTextContent(9))
    cursor = addTextLifecycleTimeBased(tl, text9, cursor, readTime, -8)
  }

  // Text 10: "She pressed her palm to his chest..." - overlaps with text 9
  if (text10) {
    const text10Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(10))
    cursor = addTextLifecycleTimeBased(tl, text10, text10Start, readTime, -6)
  }

  // Text 11: "Someone clapped on the count..." - bridges TO Chapter 7 (skipFade = true)
  if (text11) {
    const text11Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(11))
    cursor = addTextLifecycleTimeBased(tl, text11, text11Start, readTime, -5, true)
  }

  // Final hold before chapter transition
  cursor += BRAND_DURATIONS.section

  // Log final cursor position for debugging
  console.log('[Chapter6] Final cursor:', cursor, 'ms =', timeToScroll(cursor), 'global scroll')

  return tl
}

/**
 * Get the duration of Chapter 6 as a proportion of the total experience
 * Based on scroll region: 47% - 62% = 0.15
 */
export const CHAPTER_6_DURATION = 0.15

/**
 * Chapter 6 scroll position in master timeline
 */
export const CHAPTER_6_START = 0.47
