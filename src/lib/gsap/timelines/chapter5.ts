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

// Get text content and config for reading time calculations and bridge handling
const textBlocks = sceneConfigs[5].textBlocks
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

  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')
  const text3 = container.querySelector('[data-text-block="3"]')
  const text4 = container.querySelector('[data-text-block="4"]')
  const text5 = container.querySelector('[data-text-block="5"]')
  const text6 = container.querySelector('[data-text-block="6"]')

  // ============== FRAME A: AUTHORITY ENTERS ==============
  tl.addLabel('frame-a', timeToScroll(cursor))

  // Initial breath before content
  cursor += BRAND_DURATIONS.section

  // Text 1: First narrative text
  const text1Start = cursor
  if (text1) {
    const readTime = calculateReadingTime(getTextContent(1))
    cursor = addTextLifecycleTimeBased(tl, text1, cursor, readTime, -8)
  }

  // Boots fade in from top (overlaps with text 1 - starts after text appears)
  if (boots) {
    // Start boots after text 1 has faded in (section duration)
    const bootsStart = text1Start + BRAND_DURATIONS.section
    tl.fromTo(
      boots,
      { opacity: 0, y: -50 },
      {
        opacity: 1,
        y: 0,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.enter,
      },
      timeToScroll(bootsStart)
    )
  }

  // Text 2: Overlaps with text 1, HOLDS until Frame B (intra-chapter bridge to text 3)
  // Uses bridgeDriftEnd so text 3 can seamlessly continue
  const text2Config = getTextConfig(2)
  const text2DriftEnd = text2Config?.bridgeDriftEnd ?? -6
  if (text2) {
    const text2Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(2))
    // skipFade = true because this bridges to text 3
    cursor = addTextLifecycleTimeBased(tl, text2, text2Start, readTime, text2DriftEnd, true)
  }

  // Transition pause before Frame B
  cursor += BRAND_DURATIONS.section

  // ============== FRAME B: BG CROSSFADE + TEXT 2→3 CROSSFADE ==============
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

  // Text 2 → Text 3 crossfade (intra-chapter bridge)
  // Text 2 fades out while text 3 fades in at same position
  if (text2) {
    tl.to(
      text2,
      {
        opacity: 0,
        y: text2DriftEnd - 3, // Continue slight drift during fade
        duration: timeToScroll(BRAND_DURATIONS.micro),
        ease: brandEase.exit,
      },
      timeToScroll(cursor)
    )
  }

  // Text 3: Starts at bridgeDriftEnd (matching text 2's end position)
  const text3Config = getTextConfig(3)
  const text3DriftEnd = text3Config?.bridgeDriftEnd ?? -6
  if (text3) {
    // Set initial position to match text 2's drift end
    tl.set(text3, { y: text3DriftEnd }, timeToScroll(cursor))

    // Fade in at same position
    tl.fromTo(
      text3,
      { opacity: 0 },
      {
        opacity: 1,
        duration: timeToScroll(BRAND_DURATIONS.micro),
        ease: brandEase.enter,
      },
      timeToScroll(cursor)
    )
  }

  cursor += BRAND_DURATIONS.section

  // Text 3 continues: drift and fade out
  if (text3) {
    const readTime = calculateReadingTime(getTextContent(3))

    // Continue drifting from bridgeDriftEnd
    tl.to(
      text3,
      {
        y: text3DriftEnd - 8, // Continue drift direction
        duration: timeToScroll(readTime),
        ease: 'none',
      },
      timeToScroll(cursor)
    )

    // Fade out after reading time
    tl.to(
      text3,
      {
        opacity: 0,
        duration: timeToScroll(BRAND_DURATIONS.micro),
        ease: brandEase.exit,
      },
      timeToScroll(cursor + readTime)
    )

    cursor += readTime + BRAND_DURATIONS.micro
  }

  // Transition pause before Frame C
  cursor += BRAND_DURATIONS.section

  // ============== FRAME C: CAPTAIN'S ORDER ==============
  tl.addLabel('frame-c', timeToScroll(cursor))

  // Text 4: Beat - "'End this!'"
  if (text4) {
    const readTime = calculateReadingTime(getTextContent(4))
    cursor = addTextLifecycleTimeBased(tl, text4, cursor, readTime, -4)
  }

  // Text 6: "a captain barked..." - follows the beat
  if (text6) {
    const text6Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(6))
    cursor = addTextLifecycleTimeBased(tl, text6, text6Start, readTime, -6)
  }

  // Transition pause before Frame D
  cursor += BRAND_DURATIONS.section

  // ============== FRAME D: CECI'S RESPONSE ==============
  tl.addLabel('frame-d', timeToScroll(cursor))

  // Text 5: Bridges TO Chapter 6 (skipFade = true)
  // Uses bridgeDriftEnd from config so destination chapter can match
  if (text5) {
    const text5Config = getTextConfig(5)
    const readTime = calculateReadingTime(getTextContent(5))
    const drift = text5Config?.bridgeDriftEnd ?? -5
    cursor = addTextLifecycleTimeBased(tl, text5, cursor, readTime, drift, true)
  }

  // Final hold before chapter transition
  cursor += BRAND_DURATIONS.section

  return tl
}
