/**
 * Chapter 5 Timeline - "Authority Enters"
 *
 * Frame A (0-30%): Square scene with boots entering
 * - BG already visible (chapter container manages opacity)
 * - Text 1 fades in, boots fade in, text 2 fades
 *
 * Frame B (30-50%): BG crossfade to night street, text 3
 * - BG/boots fade out, BG2 fades in
 * - Text 3 appears and fades
 *
 * Frame C (50-70%): Captain's order, text 4
 * - Text 4 appears and fades
 *
 * Frame D (70-100%): Ceci's response, text 5
 * - Text 5 appears and holds to chapter end
 *
 * Scroll Region: 38-47% of total scroll (9% duration)
 * Complexity: L1 (Functional) - fade/crossfade only
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
  // Layers
  const bg = container.querySelector('[data-layer="bg"]')
  const bg2 = container.querySelector('[data-layer="bg2"]')
  const boots = container.querySelector('[data-layer="boots"]')
  // Text blocks
  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')
  const text3 = container.querySelector('[data-text-block="3"]')
  const text4 = container.querySelector('[data-text-block="4"]')
  const text5 = container.querySelector('[data-text-block="5"]')

  // ============== FRAME A: AUTHORITY ENTERS (0-30% of chapter) ==============
  tl.addLabel('frame-a', 0)

  // Text block 1: appears at 3%, fades at 25%
  if (text1) {
    addTextLifecycle(tl, text1, 0.03, 0.25, -8)
  }

  // Boots fade in at 8% from diagonal top-left (authority entering)
  if (boots) {
    tl.fromTo(boots,
      { opacity: 0, x: -20, y: -20 },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: dur(0.08),
        ease: brandEase.enter,
      },
      pos(0.08)
    )
  }

  // Text block 2: appears at 12%, fades at 28%
  if (text2) {
    addTextLifecycle(tl, text2, 0.12, 0.28, -6)
  }

  // ============== FRAME B: BG CROSSFADE + TEXT 3 (30-50% of chapter) ==============
  tl.addLabel('frame-b', pos(0.30))

  // BG crossfade at 30%: bg fades out, bg2 fades in
  if (bg) {
    tl.to(bg, {
      opacity: 0,
      duration: dur(0.08),
      ease: brandEase.exit,
    }, pos(0.30))
  }

  if (bg2) {
    tl.to(bg2, {
      opacity: 1,
      duration: dur(0.08),
      ease: brandEase.enter,
    }, pos(0.30))
  }

  // Boots fade out with BG
  if (boots) {
    tl.to(boots, {
      opacity: 0,
      duration: dur(0.06),
      ease: brandEase.exit,
    }, pos(0.30))
  }

  // Text 3: appears at 35%, fades at 48%
  if (text3) {
    addTextLifecycle(tl, text3, 0.35, 0.48, -8)
  }

  // ============== FRAME C: CAPTAIN'S ORDER (50-70% of chapter) ==============
  tl.addLabel('frame-c', pos(0.50))

  // Text 4: appears at 52%, fades at 68%
  if (text4) {
    addTextLifecycle(tl, text4, 0.52, 0.68, -8)
  }

  // ============== FRAME D: CECI'S RESPONSE (70-100% of chapter) ==============
  tl.addLabel('frame-d', pos(0.70))

  // Text 5: appears at 72%, holds to end (no fadeout - chapter transition handles it)
  if (text5) {
    addTextAppear(tl, text5, 0.72)
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
 * Add text appear animation (appear only, no fade out)
 * For text that holds to end of chapter
 */
function addTextAppear(
  tl: gsap.core.Timeline,
  target: Element,
  appearAt: number
): void {
  tl.fromTo(target,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: dur(0.08), ease: brandEase.enter },
    pos(appearAt)
  )
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
