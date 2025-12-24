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
import { setVioletActive } from '$stores'

// Get text content and config for reading time calculations and bridge handling
const textBlocks = sceneConfigs[6].textBlocks
const getTextContent = (num: number): string =>
  textBlocks.find((t) => t.num === num)?.content ?? ''
const getTextConfig = (num: number) => textBlocks.find((t) => t.num === num)

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
  const text12 = container.querySelector('[data-text-block="12"]')

  // ============== FRAME A: BRIDGED TEXT FROM CH5 ==============
  tl.addLabel('frame-a', timeToScroll(cursor))

  // Initial breath before content
  cursor += BRAND_DURATIONS.section

  // Text 1 is already visible (bridged from Chapter 5)
  // Set it to visible state at bridgeDriftEnd position, then fade out after reading time
  if (text1) {
    const text1Config = getTextConfig(1)
    const bridgeDriftEnd = text1Config?.bridgeDriftEnd ?? 0

    // Ensure text is visible at chapter start, matching source chapter's drift end position
    tl.set(text1, { opacity: 1, y: bridgeDriftEnd }, 0)

    const readTime = calculateReadingTime(getTextContent(1))

    // Fade out after reading time (continue drifting slightly during fade)
    tl.to(
      text1,
      {
        opacity: 0,
        y: bridgeDriftEnd - 8, // Continue drift direction
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

  // Activate violet light when text 2 appears ("violet spill surging into the windows")
  // Use tween with callbacks for bi-directional scrubbing support
  const violetOnTween = gsap.fromTo({}, {}, { duration: 0.001 })
  violetOnTween.eventCallback('onStart', () => setVioletActive(true))
  violetOnTween.eventCallback('onReverseComplete', () => setVioletActive(false))
  tl.add(violetOnTween, timeToScroll(cursor))

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

  // Text 8: Beat - "'Always,'"
  if (text8) {
    const text8Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(8))
    cursor = addTextLifecycleTimeBased(tl, text8, text8Start, readTime, -4)
  }

  // Text 12: "he answered..." - follows the beat
  if (text12) {
    const text12Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(12))
    cursor = addTextLifecycleTimeBased(tl, text12, text12Start, readTime, -6)
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
  // Uses bridgeDriftEnd from config so destination chapter can match
  if (text11) {
    const text11Config = getTextConfig(11)
    const text11Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(11))
    const drift = text11Config?.bridgeDriftEnd ?? -5
    cursor = addTextLifecycleTimeBased(tl, text11, text11Start, readTime, drift, true)
  }

  // Final hold before chapter transition
  cursor += BRAND_DURATIONS.section

  return tl
}
