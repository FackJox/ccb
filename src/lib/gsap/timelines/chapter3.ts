/**
 * Chapter 3 Timeline - "Consent as Choreography"
 *
 * Frame A (0-100% of chapter): Dip pose reveal from black
 * - Scene starts black (C2 faded out)
 * - FG (couple in dip) fades in first from darkness
 * - BG (ballroom) fades in behind them
 * - Text blocks 1-2 appear with lifecycle animations
 *
 * Scroll Region: 20-27% of total scroll (7% duration)
 * Complexity: L2 (restrained, monastic - focus on stillness)
 *
 * All positions are PRE-SCALED to global timeline (multiply by D = 0.07)
 */

import { gsap, brandEase } from '../register'
import { chapterScrollRegions } from '../scroll'

// Chapter 3's duration as fraction of total scroll (0-1)
const D = chapterScrollRegions[3].end - chapterScrollRegions[3].start // 0.07

// Helper to scale chapter-relative position to global position
const pos = (chapterPercent: number) => chapterPercent * D
// Helper to scale chapter-relative duration to global duration
const dur = (chapterPercent: number) => chapterPercent * D

/**
 * Create Chapter 3 timeline with positions pre-scaled for master timeline
 */
export function createChapter3Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // ============== GET ELEMENTS ==============
  const bg = container.querySelector('[data-layer="bg"]')
  const coupleDip = container.querySelector('[data-layer="coupleDip"]')
  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')

  // ============== FRAME A: DIP POSE REVEAL (0-100% of chapter) ==============
  tl.addLabel('frame-a', 0)

  // Step 1: FG couple fades in first from black (2-17% of chapter)
  // Couple emerges from darkness before the scene is revealed
  if (coupleDip) {
    tl.to(coupleDip, {
      opacity: 1,
      duration: dur(0.15),
      ease: brandEase.enter,
    }, pos(0.02))
  }

  // Step 2: BG ballroom fades in behind (20-38% of chapter)
  // Scene materializes around the couple after they're visible
  if (bg) {
    tl.to(bg, {
      opacity: 1,
      duration: dur(0.18),
      ease: brandEase.enter,
    }, pos(0.20))
  }

  // Step 3: Text block 1 appears (35-85% visible)
  if (text1) {
    addTextLifecycle(tl, text1, 0.35, 0.85, -10)
  }

  // Step 4: Text block 2 appears with stagger (45-90% visible)
  if (text2) {
    addTextLifecycle(tl, text2, 0.45, 0.90, -8)
  }

  return tl
}

/**
 * Add text lifecycle animation (appear -> drift -> fade)
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
 * Get the duration of Chapter 3 as a proportion of the total experience
 * Based on scroll region: 20% - 27% = 0.07
 */
export const CHAPTER_3_DURATION = 0.07

/**
 * Chapter 3 scroll position in master timeline
 */
export const CHAPTER_3_START = 0.20
