/**
 * Chapter 9 Timeline - "Residue & Dawn" (L2 Expressive)
 *
 * Frame 9A (0-25% of chapter): Dawn room, couple appears first
 * - FG fades in first (characters anchor the scene)
 * - Text 1 appears (upper-left)
 * - BG fades in (world materializes around them)
 * - FG and Text 1 fade out
 *
 * Frame 9B (25-50% of chapter): Same room, new composition
 * - Text 2 appears (right-side)
 * - FG fades in at NEW left position
 * - FG and Text 2 fade out
 *
 * Frame 9C (50-70% of chapter): CJ Door
 * - BG2 (CJ door) crossfades in
 * - Text 3 appears (lower-right)
 * - Text 3 fades out
 *
 * Frame 9D (70-100% of chapter): Brooms Floor - Stacked Poem
 * - BG3 (brooms floor) crossfades in
 * - Texts 4-7 appear sequentially (stacked poem)
 * - BG3 and Texts 4-7 fade out together
 * - Texts 8-9 appear on black ("Old as anything", "New as dawn")
 *
 * Scroll Region: 90-100% of total scroll (10% duration)
 * Complexity: L2 - melancholic satisfaction, tender/slow feel
 *
 * "Breath, not bounce" - elements fade and drift like smoke or fabric.
 * This is the epilogue: still important, but intimate and restrained.
 */

import { gsap, brandEase } from '../register'
import { chapterScrollRegions } from '../scroll'

// Chapter 9's duration as fraction of total scroll (0-1)
const D = chapterScrollRegions[9].end - chapterScrollRegions[9].start // 0.10

// Helper to scale chapter-relative position to global position
const pos = (chapterPercent: number) => chapterPercent * D
// Helper to scale chapter-relative duration to global duration
const dur = (chapterPercent: number) => chapterPercent * D

/**
 * Create Chapter 9 timeline with positions pre-scaled for master timeline
 */
export function createChapter9Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // ============== GET ELEMENTS ==============
  // Layers
  const bg = container.querySelector('[data-layer="bg"]')
  const bg2 = container.querySelector('[data-layer="bg2"]')
  const bg3 = container.querySelector('[data-layer="bg3"]')
  const fg = container.querySelector('[data-layer="couple"]')

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

  // ============== FRAME 9A: COUPLE FIRST (0-25% of chapter) ==============
  tl.addLabel('frame-9a', 0)

  // Set initial FG position for Frame A (right side)
  if (fg) {
    tl.set(fg, { x: '55%' }, 0) // Push to right
  }

  // Step 1: FG fades in at 2%
  if (fg) {
    tl.to(
      fg,
      {
        opacity: 1,
        duration: dur(0.05),
        ease: brandEase.enter,
      },
      pos(0.02)
    )
  }

  // Step 2: Text 1 appears at 6%, fades at 22%
  if (text1) {
    addTextLifecycle(tl, text1, 0.06, 0.22, -8)
  }

  // Step 3: BG fades in at 10% (world materializes around characters)
  if (bg) {
    tl.to(
      bg,
      {
        opacity: 1,
        duration: dur(0.07),
        ease: brandEase.enter,
      },
      pos(0.10)
    )
  }

  // Step 4: FG fades out at 20%
  if (fg) {
    tl.to(
      fg,
      {
        opacity: 0,
        duration: dur(0.04),
        ease: brandEase.exit,
      },
      pos(0.20)
    )
  }

  // ============== FRAME 9B: NEW POSITION (25-50% of chapter) ==============
  tl.addLabel('frame-9b', pos(0.25))

  // Reposition FG while hidden (instant) - move to left side
  if (fg) {
    tl.set(fg, { x: '5%' }, pos(0.25))
  }

  // Step 5: Text 2 appears at 27%, fades at 45%
  if (text2) {
    addTextLifecycle(tl, text2, 0.27, 0.45, -8)
  }

  // Step 6: FG fades in at new position at 30%
  if (fg) {
    tl.to(
      fg,
      {
        opacity: 1,
        duration: dur(0.05),
        ease: brandEase.enter,
      },
      pos(0.30)
    )
  }

  // FG fades out at 45%
  if (fg) {
    tl.to(
      fg,
      {
        opacity: 0,
        duration: dur(0.04),
        ease: brandEase.exit,
      },
      pos(0.45)
    )
  }

  // ============== FRAME 9C: CJ DOOR (50-70% of chapter) ==============
  tl.addLabel('frame-9c', pos(0.50))

  // BG fades out as BG2 fades in
  if (bg) {
    tl.to(
      bg,
      {
        opacity: 0,
        duration: dur(0.07),
        ease: brandEase.exit,
      },
      pos(0.50)
    )
  }

  // Step 1: BG2 (CJ door) crossfades in
  if (bg2) {
    tl.to(
      bg2,
      {
        opacity: 1,
        duration: dur(0.07),
        ease: brandEase.enter,
      },
      pos(0.50)
    )
  }

  // Step 2: Text 3 appears at 55%, fades at 68%
  if (text3) {
    addTextLifecycle(tl, text3, 0.55, 0.68, -8)
  }

  // ============== FRAME 9D: BROOMS FLOOR (70-100% of chapter) ==============
  tl.addLabel('frame-9d', pos(0.70))

  // BG2 fades out as BG3 fades in
  if (bg2) {
    tl.to(
      bg2,
      {
        opacity: 0,
        duration: dur(0.07),
        ease: brandEase.exit,
      },
      pos(0.70)
    )
  }

  // Step 4: BG3 (brooms floor) crossfades in
  if (bg3) {
    tl.to(
      bg3,
      {
        opacity: 1,
        duration: dur(0.07),
        ease: brandEase.enter,
      },
      pos(0.70)
    )
  }

  // Steps 5-8: Stacked poem texts appear sequentially with 3% stagger
  // Set initial y offset for all poem texts
  ;[text4, text5, text6, text7, text8, text9].forEach((t) => {
    if (t) tl.set(t, { y: 20 }, 0)
  })

  if (text4) {
    tl.to(
      text4,
      {
        opacity: 1,
        y: 0,
        duration: dur(0.05),
        ease: brandEase.enter,
      },
      pos(0.72)
    )
  }
  if (text5) {
    tl.to(
      text5,
      {
        opacity: 1,
        y: 0,
        duration: dur(0.05),
        ease: brandEase.enter,
      },
      pos(0.75)
    )
  }
  if (text6) {
    tl.to(
      text6,
      {
        opacity: 1,
        y: 0,
        duration: dur(0.05),
        ease: brandEase.enter,
      },
      pos(0.78)
    )
  }
  if (text7) {
    tl.to(
      text7,
      {
        opacity: 1,
        y: 0,
        duration: dur(0.05),
        ease: brandEase.enter,
      },
      pos(0.81)
    )
  }

  // Step 9: BG3 + texts 4-7 fade out at 88%
  if (bg3) {
    tl.to(
      bg3,
      {
        opacity: 0,
        duration: dur(0.05),
        ease: brandEase.exit,
      },
      pos(0.88)
    )
  }
  if (text4) {
    tl.to(
      text4,
      {
        opacity: 0,
        duration: dur(0.05),
        ease: brandEase.exit,
      },
      pos(0.88)
    )
  }
  if (text5) {
    tl.to(
      text5,
      {
        opacity: 0,
        duration: dur(0.05),
        ease: brandEase.exit,
      },
      pos(0.88)
    )
  }
  if (text6) {
    tl.to(
      text6,
      {
        opacity: 0,
        duration: dur(0.05),
        ease: brandEase.exit,
      },
      pos(0.88)
    )
  }
  if (text7) {
    tl.to(
      text7,
      {
        opacity: 0,
        duration: dur(0.05),
        ease: brandEase.exit,
      },
      pos(0.88)
    )
  }

  // Steps 10-11: Final two texts appear on black
  if (text8) {
    tl.to(
      text8,
      {
        opacity: 1,
        y: 0,
        duration: dur(0.05),
        ease: brandEase.enter,
      },
      pos(0.91)
    )
  }
  if (text9) {
    tl.to(
      text9,
      {
        opacity: 1,
        y: 0,
        duration: dur(0.05),
        ease: brandEase.enter,
      },
      pos(0.95)
    )
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
  const appearDur = 0.05 // 5% of chapter for appear

  // Appear
  tl.fromTo(
    target,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: dur(appearDur), ease: brandEase.enter },
    pos(appearAt)
  )

  // Drift while visible
  const driftDur = fadeOutAt - appearAt - appearDur - 0.03
  if (driftDur > 0) {
    tl.to(
      target,
      {
        y: driftDistance,
        duration: dur(driftDur),
        ease: 'none', // Linear drift for scrubbed feel
      },
      pos(appearAt + appearDur)
    )
  }

  // Fade out
  tl.to(
    target,
    {
      opacity: 0,
      duration: dur(0.03),
      ease: brandEase.exit,
    },
    pos(fadeOutAt)
  )
}

/**
 * Get the duration of Chapter 9 as a proportion of the total experience
 * Based on scroll region: 90% - 100% = 0.10
 */
export const CHAPTER_9_DURATION = 0.10

/**
 * Chapter 9 scroll position in master timeline
 */
export const CHAPTER_9_START = 0.90
