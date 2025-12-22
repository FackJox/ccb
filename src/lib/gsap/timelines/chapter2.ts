/**
 * Chapter 2 Timeline - "The Offer"
 *
 * Frame A (0-60% of chapter): Table scene with progressive text
 * - BG visible from start
 * - FG couple fades in with subtle zoom (1.0→1.03)
 * - Text blocks 1-2 appear with lifecycle animations
 *
 * Frame B (60-100% of chapter): Intimate closeup transition
 * - FG couple (table) fades out
 * - Text 3 ("Consent lives in small sentences...") appears
 * - couple-closeup fades in
 * - Text 4 ("Her palm hovered...") appears
 * - Text 5 ("Will you follow?") as consent beat
 * - Slow zoom on couple-closeup at exit
 *
 * Scroll Region: 11-20% of total scroll (9% duration)
 * All positions are PRE-SCALED to global timeline (multiply by D = 0.09)
 *
 * Complexity: L2 (Expressive)
 */

import { gsap, brandEase } from '../register'
import { chapterScrollRegions } from '../scroll'

// Chapter 2's duration as fraction of total scroll (0-1)
const D = chapterScrollRegions[2].end - chapterScrollRegions[2].start // 0.09

// Helper to scale chapter-relative position to global position
const pos = (chapterPercent: number) => chapterPercent * D
// Helper to scale chapter-relative duration to global duration
const dur = (chapterPercent: number) => chapterPercent * D

/**
 * Create Chapter 2 timeline with positions pre-scaled for master timeline
 */
export function createChapter2Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // ============== GET ELEMENTS ==============
  // Frame A elements
  const couple = container.querySelector('[data-layer="couple"]')
  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')
  // Frame B elements
  const coupleCloseup = container.querySelector('[data-layer="coupleCloseup"]')
  const text3 = container.querySelector('[data-text-block="3"]')
  const text4 = container.querySelector('[data-text-block="4"]')
  const consentText = container.querySelector('[data-consent]')

  // ============== FRAME A: TABLE SCENE (0-60% of chapter) ==============
  tl.addLabel('frame-a', 0)

  // FG couple fades in at 2% of chapter
  if (couple) {
    tl.to(couple, {
      opacity: 1,
      duration: dur(0.05),
      ease: brandEase.enter,
    }, pos(0.02))

    // Subtle zoom while scene is active (1.0 → 1.03)
    tl.to(couple, {
      scale: 1.03,
      duration: dur(0.53),
      ease: 'none',
    }, pos(0.02))
  }

  // Text block 1: appears at 5%, fades at 50% (~45% visible)
  if (text1) {
    addTextLifecycle(tl, text1, 0.05, 0.50, -12)
  }

  // Text block 2: appears at 15%, fades at 55% (~40% visible)
  if (text2) {
    addTextLifecycle(tl, text2, 0.15, 0.55, -10)
  }

  // ============== FRAME B: INTIMATE CLOSEUP (60-100% of chapter) ==============
  tl.addLabel('frame-b', pos(0.60))

  // FG couple (table scene) fades out at 55% (overlaps with text2 fadeout)
  if (couple) {
    tl.to(couple, {
      opacity: 0,
      duration: dur(0.08),
      ease: brandEase.exit,
    }, pos(0.55))
  }

  // Text block 3: appears at 62%, fades at 88% (~26% visible)
  if (text3) {
    addTextLifecycle(tl, text3, 0.62, 0.88, -10)
  }

  // couple-closeup fades in at 65%
  if (coupleCloseup) {
    tl.to(coupleCloseup, {
      opacity: 1,
      duration: dur(0.08),
      ease: brandEase.enter,
    }, pos(0.65))

    // Slow zoom on couple-closeup (1.0 → 1.03) during Frame B exit
    tl.to(coupleCloseup, {
      scale: 1.03,
      duration: dur(0.30),
      ease: 'none',
    }, pos(0.70))
  }

  // Text block 4: appears at 72%, fades at 92% (~20% visible)
  if (text4) {
    addTextLifecycle(tl, text4, 0.72, 0.92, -8)
  }

  // Consent text ("Will you follow?"): appears at 88% as beat
  if (consentText) {
    tl.fromTo(consentText,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: dur(0.08),
        ease: brandEase.enter,
      },
      pos(0.88)
    )
  }

  return tl
}

/**
 * Add text lifecycle animation (appear → drift → fade)
 * All positions are chapter-relative (0-1), scaled internally
 */
function addTextLifecycle(
  tl: gsap.core.Timeline,
  target: Element,
  appearAt: number,
  fadeOutAt: number,
  driftDistance: number
): void {
  const appearDur = 0.08 // 8% of chapter for appear

  // Appear
  tl.fromTo(target,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: dur(appearDur), ease: brandEase.enter },
    pos(appearAt)
  )

  // Drift while visible
  const driftDur = fadeOutAt - appearAt - appearDur - 0.05
  if (driftDur > 0) {
    tl.to(target, {
      y: driftDistance,
      duration: dur(driftDur),
      ease: 'none',
    }, pos(appearAt + appearDur))
  }

  // Fade out
  tl.to(target, {
    opacity: 0,
    duration: dur(0.05),
    ease: brandEase.exit,
  }, pos(fadeOutAt))
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
