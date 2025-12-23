/**
 * Chapter 1 Timeline - "The Held Breath"
 *
 * Pure time-based implementation using timeToScroll() for both positions and durations.
 * All timing in milliseconds, converted to global scroll proportions.
 *
 * Per Scroll-Telling Maps:
 * - 0-20% chapter: BG + Ceci + texts 1-3
 * - 20-60% chapter: Jack enters at ~25%, texts 4-6
 * - 60-100% chapter: texts 7-8, beat text reveal
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
const textBlocks = sceneConfigs[1].textBlocks
const getTextContent = (num: number): string =>
  textBlocks.find((t) => t.num === num)?.content ?? ''

// Stagger between texts appearing in the same frame (ms)
const TEXT_STAGGER_MS = 300

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
 * Create Chapter 1 timeline with pure time-based positioning
 */
export function createChapter1Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // Cursor tracks cumulative time in ms from chapter start
  let cursor = 0

  // ============== GET ELEMENTS ==============
  const ceci = container.querySelector('[data-layer="ceci"]')
  const jack = container.querySelector('[data-layer="jack"]')

  // Debug logging
  console.log('[Chapter1] Elements found:', {
    ceci: !!ceci,
    jack: !!jack,
    allLayers: container.querySelectorAll('[data-layer]').length,
    layerIds: Array.from(container.querySelectorAll('[data-layer]')).map(el => el.getAttribute('data-layer'))
  })

  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')
  const text3 = container.querySelector('[data-text-block="3"]')
  const text4 = container.querySelector('[data-text-block="4"]')
  const text5 = container.querySelector('[data-text-block="5"]')
  const text6 = container.querySelector('[data-text-block="6"]')
  const text7 = container.querySelector('[data-text-block="7"]')
  const text8 = container.querySelector('[data-text-block="8"]')
  const beatText = container.querySelector('[data-beat]')

  // ============== FRAME A: CECI CLAIMS THE HALL ==============
  // Per Scroll-Telling Map: 0-20% of chapter
  tl.addLabel('frame-a', timeToScroll(cursor))

  // Initial breath before content
  cursor += BRAND_DURATIONS.section

  // Ceci appears
  if (ceci) {
    tl.to(
      ceci,
      {
        opacity: 1,
        scale: 1,
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
    cursor = addTextLifecycleTimeBased(tl, text1, cursor, readTime, -15)
  }

  // Text 2: Overlaps with text 1
  if (text2) {
    const text2Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(2))
    cursor = addTextLifecycleTimeBased(tl, text2, text2Start, readTime, -12)
  }

  // Text 3: Overlaps with text 2
  if (text3) {
    const text3Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(3))
    cursor = addTextLifecycleTimeBased(tl, text3, text3Start, readTime, -10)
  }

  // Transition pause before Frame B
  cursor += BRAND_DURATIONS.section

  // ============== FRAME B: JACK ENTERS ==============
  // Per Scroll-Telling Map: 20-60% of chapter, Jack at ~25%
  tl.addLabel('frame-b', timeToScroll(cursor))

  // Jack appears
  if (jack) {
    tl.to(
      jack,
      {
        opacity: 1,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.enter,
      },
      timeToScroll(cursor)
    )
    cursor += BRAND_DURATIONS.section
  }

  // Text 4: First Frame B text
  if (text4) {
    const readTime = calculateReadingTime(getTextContent(4))
    cursor = addTextLifecycleTimeBased(tl, text4, cursor, readTime, -18)
  }

  // Text 5: Overlaps with text 4
  if (text5) {
    const text5Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(5))
    cursor = addTextLifecycleTimeBased(tl, text5, text5Start, readTime, -15)
  }

  // Text 6: Overlaps with text 5
  if (text6) {
    const text6Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(6))
    cursor = addTextLifecycleTimeBased(tl, text6, text6Start, readTime, -12)
  }

  // Transition pause before Frame C
  cursor += BRAND_DURATIONS.section

  // ============== FRAME C: SHARED MOMENT ==============
  // Per Scroll-Telling Map: 60-100% of chapter
  tl.addLabel('frame-c', timeToScroll(cursor))

  // Text 7: First Frame C text
  if (text7) {
    const readTime = calculateReadingTime(getTextContent(7))
    cursor = addTextLifecycleTimeBased(tl, text7, cursor, readTime, -15)
  }

  // Text 8: Overlaps with text 7
  if (text8) {
    const text8Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(8))
    cursor = addTextLifecycleTimeBased(tl, text8, text8Start, readTime, -12)
  }

  // Held breath before beat text
  cursor += BRAND_DURATIONS.sectionHeld

  // Beat text - signature moment
  if (beatText) {
    const beatContent = beatText.querySelector('.typography-beat') || beatText

    try {
      const split = new SplitText(beatContent, {
        type: 'chars,words',
        charsClass: 'beat-char',
      })

      // Make the container visible first (master timeline sets it to opacity: 0)
      tl.set(beatText, { opacity: 1, y: 0 }, timeToScroll(cursor))

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

      // Drift after reveal
      const beatDuration = BRAND_DURATIONS.signature + 40 * split.chars.length
      cursor += beatDuration

      tl.to(
        beatContent,
        {
          y: -10,
          duration: timeToScroll(BRAND_DURATIONS.sectionHeld),
          ease: brandEase.transform,
        },
        timeToScroll(cursor)
      )

      cursor += BRAND_DURATIONS.sectionHeld
    } catch (e) {
      console.warn('[Chapter1] SplitText failed, using simple fade:', e)
      tl.fromTo(
        beatText,
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
  const globalScrollEnd = timeToScroll(cursor)
  console.log('[Chapter1] Final cursor:', cursor, 'ms')
  console.log('[Chapter1] Final cursor as global scroll:', (globalScrollEnd * 100).toFixed(3), '%')
  console.log('[Chapter1] Chapter 1 region ends at:', '(check derive-regions output)')
  console.log('[Chapter1] Timeline duration:', tl.duration())

  return tl
}
