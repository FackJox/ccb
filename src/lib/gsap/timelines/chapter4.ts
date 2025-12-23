/**
 * Chapter 4 Timeline - "The Crack"
 *
 * Pure time-based implementation using timeToScroll() for both positions and durations.
 * All timing in milliseconds, converted to global scroll proportions.
 *
 * Frame A (first ~40%): Mirror scene with text bridged from Chapter 3
 * - Text 1 (mirror text) visible immediately (continues from Chapter 3)
 * - Text 1 fades out after reading time
 * - Mirror intact visible, starts to fall
 *
 * Frame B (remaining ~60%): Mirror shatter sequence
 * - Mirror crossfade (intact → broken with jitter)
 * - Sequential beat: "Un." → "Deux." → "Trois."
 * - Couple standing fades in
 * - Narrative text appears
 *
 * Complexity: L2 (Expressive)
 * Motion Allowed: FG swap with jitter, beat text, layer fades
 * Motion Forbidden: No animated shards, no particles
 */

import { gsap, brandEase } from '../register'
import {
  timeToScroll,
  calculateReadingTime,
  BRAND_DURATIONS,
} from '../timing'
import { sceneConfigs } from '$data/scenes'

// Get text content for reading time calculations
const textBlocks = sceneConfigs[4].textBlocks
const getTextContent = (num: number): string =>
  textBlocks.find((t) => t.num === num)?.content ?? ''

// Overlap: how much before previous text ends does next text start (ms)
const TEXT_OVERLAP_MS = 800

// Beat text stagger timing (ms between each beat word)
const BEAT_STAGGER_MS = 150

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
 * Create Chapter 4 timeline with pure time-based positioning
 */
export function createChapter4Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // Cursor tracks cumulative time in ms from chapter start
  let cursor = 0

  // ============== GET ELEMENTS ==============
  const bg = container.querySelector('[data-layer="bg"]')
  const mirrorIntact = container.querySelector('[data-layer="mirrorIntact"]')
  const mirrorBroken = container.querySelector('[data-layer="mirrorBroken"]')
  const coupleStanding = container.querySelector('[data-layer="coupleStanding"]')

  // Debug logging
  console.log('[Chapter4] Elements found:', {
    bg: !!bg,
    mirrorIntact: !!mirrorIntact,
    mirrorBroken: !!mirrorBroken,
    coupleStanding: !!coupleStanding,
    allLayers: container.querySelectorAll('[data-layer]').length,
    layerIds: Array.from(container.querySelectorAll('[data-layer]')).map(el => el.getAttribute('data-layer'))
  })

  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')  // "Un."
  const text3 = container.querySelector('[data-text-block="3"]')  // "Deux."
  const text4 = container.querySelector('[data-text-block="4"]')  // "Trois."
  const text5 = container.querySelector('[data-text-block="5"]')  // Narrative

  console.log('[Chapter4] Text elements found:', {
    text1: !!text1,
    text2: !!text2,
    text3: !!text3,
    text4: !!text4,
    text5: !!text5,
  })

  // ============== FRAME A: MIRROR SCENE ==============
  tl.addLabel('frame-a', timeToScroll(cursor))

  // Initial breath before content
  cursor += BRAND_DURATIONS.section

  // Text 1 is already visible (bridged from Chapter 3)
  // Set it to visible state, then fade out after reading time
  if (text1) {
    // Ensure text is visible at chapter start
    tl.set(text1, { opacity: 1, y: 0 }, 0)

    // Calculate reading time for this text
    const readTime = calculateReadingTime(getTextContent(1))

    // Fade out after reading time
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

  // Mirror starts to fall (translates down before shatter)
  if (mirrorIntact) {
    tl.to(
      mirrorIntact,
      {
        y: 30,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.exit,
      },
      timeToScroll(cursor)
    )
  }

  // Transition pause
  cursor += BRAND_DURATIONS.section

  // ============== FRAME B: MIRROR SHATTER SEQUENCE ==============
  tl.addLabel('frame-b', timeToScroll(cursor))

  // Mirror swap: mirrorIntact → mirrorBroken crossfade with jitter
  if (mirrorIntact && mirrorBroken) {
    // Set broken mirror to same fallen position
    tl.set(mirrorBroken, { y: 30 }, timeToScroll(cursor))

    // Quick crossfade (micro duration ~230ms)
    tl.to(
      mirrorIntact,
      {
        opacity: 0,
        x: '+=2',  // 2px jitter for impact feel
        duration: timeToScroll(BRAND_DURATIONS.micro),
        ease: brandEase.exit,
      },
      timeToScroll(cursor)
    )

    tl.to(
      mirrorBroken,
      {
        opacity: 1,
        duration: timeToScroll(BRAND_DURATIONS.micro),
        ease: brandEase.enter,
      },
      timeToScroll(cursor)
    )

    cursor += BRAND_DURATIONS.micro
  }

  // Held breath after impact - moment of shock
  cursor += BRAND_DURATIONS.sectionHeld

  // Beat text sequence: "Un. Deux. Trois."
  // Beats OVERLAP - each starts before the previous finishes (punchy, rapid-fire)
  const beatTexts = [text2, text3, text4].filter(Boolean) as Element[]
  const BEAT_OVERLAP_STAGGER = BRAND_DURATIONS.signature + BEAT_STAGGER_MS  // 1200ms between beat starts

  beatTexts.forEach((beat, i) => {
    // Overlapping stagger: each beat starts 1200ms after previous
    const beatStart = cursor + (i * BEAT_OVERLAP_STAGGER)

    // Appear with signature timing
    tl.fromTo(
      beat,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: timeToScroll(BRAND_DURATIONS.signature),
        ease: brandEase.enter,
      },
      timeToScroll(beatStart)
    )

    // Drift up while visible
    tl.to(
      beat,
      {
        y: -15,
        duration: timeToScroll(BRAND_DURATIONS.sectionHeld),
        ease: 'none',
      },
      timeToScroll(beatStart + BRAND_DURATIONS.signature)
    )

    // Fade out
    tl.to(
      beat,
      {
        opacity: 0,
        duration: timeToScroll(BRAND_DURATIONS.micro),
        ease: brandEase.exit,
      },
      timeToScroll(beatStart + BRAND_DURATIONS.signature + BRAND_DURATIONS.sectionHeld)
    )
  })

  // Cursor advances to when LAST beat finishes (not sum of all beats)
  // Last beat starts at: cursor + (n-1) * stagger
  // Last beat ends at: that + signature + sectionHeld + micro
  if (beatTexts.length > 0) {
    const lastBeatStart = cursor + (beatTexts.length - 1) * BEAT_OVERLAP_STAGGER
    const beatLifecycle = BRAND_DURATIONS.signature + BRAND_DURATIONS.sectionHeld + BRAND_DURATIONS.micro
    cursor = lastBeatStart + beatLifecycle
  }

  // coupleStanding fades in during/after beat sequence
  if (coupleStanding) {
    // Start fade slightly before cursor (overlap with last beat)
    const coupleStart = cursor - BRAND_DURATIONS.section
    tl.to(
      coupleStanding,
      {
        opacity: 1,
        duration: timeToScroll(BRAND_DURATIONS.section),
        ease: brandEase.enter,
      },
      timeToScroll(coupleStart)
    )
  }

  // Text 5: Narrative close
  if (text5) {
    const readTime = calculateReadingTime(getTextContent(5))
    cursor = addTextLifecycleTimeBased(tl, text5, cursor, readTime, -10)
  }

  // Final hold before chapter transition
  cursor += BRAND_DURATIONS.section

  // Log final cursor position for debugging
  console.log('[Chapter4] Final cursor:', cursor, 'ms =', timeToScroll(cursor), 'global scroll')

  return tl
}
