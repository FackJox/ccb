/**
 * Chapter 5 Timeline - "Authority Enters"
 *
 * Frame A (0-100% for now): Square scene with boots entering
 * - BG already visible (chapter container manages opacity)
 * - Text 1 fades in, then boots fade in from below, then text 2
 * - L1 Complexity: Fade only, no complex transforms
 *
 * Scroll Region: 38-47% of total scroll (9% duration)
 * Complexity: L1 (Functional)
 *
 * All positions are PRE-SCALED to global timeline (multiply by D = 0.09)
 */

import { gsap, brandEase } from '../register'
import { chapterScrollRegions } from '../scroll'

// Chapter 5's duration as fraction of total scroll (0-1)
const D = chapterScrollRegions[5].end - chapterScrollRegions[5].start // 0.09

// Helper to scale chapter-relative position to global position
const pos = (chapterPercent: number) => chapterPercent * D
// Helper to scale chapter-relative duration to global duration
const dur = (chapterPercent: number) => chapterPercent * D

/**
 * Create Chapter 5 timeline with positions pre-scaled for master timeline
 */
export function createChapter5Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // ============== GET ELEMENTS ==============
  const boots = container.querySelector('[data-layer="boots"]')
  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')

  // ============== FRAME A: AUTHORITY ENTERS (0-100% of chapter) ==============
  tl.addLabel('frame-a', 0)

  // Text block 1: appears at 5%, fades at 60%
  if (text1) {
    addTextLifecycle(tl, text1, 0.05, 0.60, -12)
  }

  // Boots fade in at 20% from diagonal top-left (authority entering)
  if (boots) {
    tl.fromTo(boots,
      { opacity: 0, x: -20, y: -20 },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: dur(0.10),
        ease: brandEase.enter,
      },
      pos(0.20)
    )
  }

  // Text block 2: appears at 35%, fades at 85%
  if (text2) {
    addTextLifecycle(tl, text2, 0.35, 0.85, -10)
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
 * Get the duration of Chapter 5 as a proportion of the total experience
 * Based on scroll region: 38% - 47% = 0.09
 */
export const CHAPTER_5_DURATION = 0.09

/**
 * Chapter 5 scroll position in master timeline
 */
export const CHAPTER_5_START = 0.38
