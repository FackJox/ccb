/**
 * Chapter 8 Timeline - "Release" (L2 Expressive)
 *
 * Pure time-based implementation using timeToScroll() for both positions and durations.
 * All timing in milliseconds, converted to global scroll proportions.
 *
 * Frame A (street scene): Texts 1-2, soldiers retreat
 * - BG visible from chapter start (initialOpacity: 1)
 * - Text 1 appears: "From the street, they looked untouchable..."
 * - Text 2 overlaps: "The rhythm swallowed their authority..."
 *
 * Frame B (scene change only): No texts - just a pause in the rhythm
 *
 * Frame C (scene change only): No texts - alternating scene rhythm
 *
 * Frame D (dancing crowd triumph): bg2 crossfade, text 3
 * - bg → bg2 crossfade (soldiers retreat, dancers take space)
 * - Text 3: "The tide of dancers took the space..."
 *
 * Frame E (night interior, final breath): bg3 crossfade, texts 4-5
 * - bg2 → bg3 crossfade (interior night scene)
 * - Text 4: "When the final note faded..."
 * - Text 5: "In the dark, Ceci rested her forehead..."
 * - holdAfter: 800ms extra hold before chapter transition
 *
 * Scroll Region: 74-88% of total scroll (14% duration)
 * Complexity: L2 (Expressive) - emotional decompression after L3 spectacles
 *
 * This is the decompression chamber after the L3 spectacles (Chapters 6-7).
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
const textBlocks = sceneConfigs[8].textBlocks
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
 * Create Chapter 8 timeline with pure time-based positioning
 */
export function createChapter8Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // Cursor tracks cumulative time in ms from chapter start
  let cursor = 0

  // ============== GET ELEMENTS ==============
  // Layers
  const bg = container.querySelector('[data-layer="bg"]')
  const bg2 = container.querySelector('[data-layer="bg2"]')
  const bg3 = container.querySelector('[data-layer="bg3"]')

  // Debug logging
  console.log('[Chapter8] Elements found:', {
    bg: !!bg,
    bg2: !!bg2,
    bg3: !!bg3,
    allLayers: container.querySelectorAll('[data-layer]').length,
    layerIds: Array.from(container.querySelectorAll('[data-layer]')).map(el => el.getAttribute('data-layer'))
  })

  // Text blocks
  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')
  const text3 = container.querySelector('[data-text-block="3"]')
  const text4 = container.querySelector('[data-text-block="4"]')
  const text5 = container.querySelector('[data-text-block="5"]')

  console.log('[Chapter8] Text elements found:', {
    text1: !!text1,
    text2: !!text2,
    text3: !!text3,
    text4: !!text4,
    text5: !!text5,
  })

  // ============== FRAME A: STREET SCENE ==============
  tl.addLabel('frame-a', timeToScroll(cursor))

  // BG is already visible (initialOpacity: 1)
  // Initial breath before content
  cursor += BRAND_DURATIONS.section

  // Text 1: "From the street, they looked untouchable..."
  if (text1) {
    const readTime = calculateReadingTime(getTextContent(1))
    cursor = addTextLifecycleTimeBased(tl, text1, cursor, readTime, -8)
  }

  // Text 2: "The rhythm swallowed their authority..." - overlaps with text 1
  if (text2) {
    const text2Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(2))
    cursor = addTextLifecycleTimeBased(tl, text2, text2Start, readTime, -8)
  }

  // Transition pause before Frame B
  cursor += BRAND_DURATIONS.section

  // ============== FRAME B: SCENE CHANGE ONLY ==============
  tl.addLabel('frame-b', timeToScroll(cursor))

  // Just a pause - alternating scene rhythm (no texts)
  cursor += BRAND_DURATIONS.section

  // ============== FRAME C: SCENE CHANGE ONLY ==============
  tl.addLabel('frame-c', timeToScroll(cursor))

  // Just a pause - alternating scene rhythm (no texts)
  cursor += BRAND_DURATIONS.section

  // ============== FRAME D: DANCING CROWD TRIUMPH ==============
  tl.addLabel('frame-d', timeToScroll(cursor))

  // Crossfade: bg → bg2 (soldiers retreat, dancers take space)
  if (bg2) {
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

  // Text 3: "The tide of dancers took the space..."
  if (text3) {
    const readTime = calculateReadingTime(getTextContent(3))
    cursor = addTextLifecycleTimeBased(tl, text3, cursor, readTime, -8)
  }

  // Transition pause before Frame E
  cursor += BRAND_DURATIONS.section

  // ============== FRAME E: NIGHT INTERIOR, FINAL BREATH ==============
  tl.addLabel('frame-e', timeToScroll(cursor))

  // Crossfade: bg2 → bg3 (interior night scene)
  if (bg3) {
    tl.to(
      bg3,
      {
        opacity: 1,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.enter,
      },
      timeToScroll(cursor)
    )
  }

  cursor += BRAND_DURATIONS.section

  // Text 4: "When the final note faded..." (typography bridge)
  if (text4) {
    const readTime = calculateReadingTime(getTextContent(4))
    cursor = addTextLifecycleTimeBased(tl, text4, cursor, readTime, -8)
  }

  // Text 5: "In the dark, Ceci rested her forehead..." - overlaps with text 4
  if (text5) {
    const text5Start = cursor - TEXT_OVERLAP_MS
    const readTime = calculateReadingTime(getTextContent(5))
    cursor = addTextLifecycleTimeBased(tl, text5, text5Start, readTime, -6)
  }

  // Extra hold after Frame E (from chapter definition: holdAfter: 800)
  cursor += 800

  // Final hold before chapter transition (sectionHeld per transitionOut)
  cursor += BRAND_DURATIONS.sectionHeld

  // Log final cursor position for debugging
  console.log('[Chapter8] Final cursor:', cursor, 'ms =', timeToScroll(cursor), 'global scroll')

  return tl
}

/**
 * Get the duration of Chapter 8 as a proportion of the total experience
 * Based on scroll region: 74% - 88% = 0.14
 */
export const CHAPTER_8_DURATION = 0.14

/**
 * Chapter 8 scroll position in master timeline
 */
export const CHAPTER_8_START = 0.74
