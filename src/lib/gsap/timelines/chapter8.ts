/**
 * Chapter 8 Timeline - "Release" (L2 Expressive)
 *
 * Frame 8A (0-25% of chapter): Street scene with soldiers retreating
 * - C8BG visible from chapter start
 * - Text 1 and 2 appear sequentially
 *
 * Frame 8C (25-50% of chapter): C8BG continues
 * - Text 2 persists/fades
 *
 * Frame 8D (50-75% of chapter): Dancing crowd triumph
 * - C8BG2 crossfades in over C8BG
 * - Text 3 appears
 *
 * Frame 8E (75-100% of chapter): Night interior, final breath
 * - C8BG3 crossfades in over C8BG2
 * - Text 4 appears, violet lights gutter out
 * - Text 5 appears (intimate moment)
 *
 * Scroll Region: 77-90% of total scroll (13% duration)
 * Complexity: L2 - emotional decompression, tender/slow feel
 *
 * "Breath, not bounce" - elements fade and drift like smoke or fabric.
 * This is the decompression chamber after the L3 spectacles (Chapters 6-7).
 */

import { gsap, brandEase } from '../register'
import { chapterScrollRegions } from '../scroll'

// Chapter 8's duration as fraction of total scroll (0-1)
const D = chapterScrollRegions[8].end - chapterScrollRegions[8].start // 0.13

// Helper to scale chapter-relative position to global position
const pos = (chapterPercent: number) => chapterPercent * D
// Helper to scale chapter-relative duration to global duration
const dur = (chapterPercent: number) => chapterPercent * D

/**
 * Create Chapter 8 timeline with positions pre-scaled for master timeline
 */
export function createChapter8Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // ============== GET ELEMENTS ==============
  // Layers
  const bg2 = container.querySelector('[data-layer="bg2"]')
  const bg3 = container.querySelector('[data-layer="bg3"]')

  // Text blocks
  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')
  const text3 = container.querySelector('[data-text-block="3"]')
  const text4 = container.querySelector('[data-text-block="4"]')
  const text5 = container.querySelector('[data-text-block="5"]')

  // ============== FRAME 8A: STREET SCENE (0-25% of chapter) ==============
  tl.addLabel('frame-8a', 0)

  // Text 1: "From the street, they looked untouchable..." - appears at 5%, fades at 22%
  if (text1) {
    addTextLifecycle(tl, text1, 0.05, 0.22, -8)
  }

  // Text 2: "The rhythm swallowed their authority..." - appears at 12%, persists into Frame 8C, fades at 45%
  if (text2) {
    addTextLifecycle(tl, text2, 0.12, 0.45, -8)
  }

  // ============== FRAME 8C: C8BG CONTINUES (25-50% of chapter) ==============
  tl.addLabel('frame-8c', pos(0.25))
  // Text 2 persists from Frame 8A, fades during this frame

  // ============== FRAME 8D: BG TRANSITION + CROWD TRIUMPH (50-75% of chapter) ==============
  tl.addLabel('frame-8d', pos(0.50))

  // Background crossfade: C8BG2 fades in over C8BG
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

  // Text 3: "The tide of dancers took the space..." - appears at 54%, fades at 72%
  if (text3) {
    addTextLifecycle(tl, text3, 0.54, 0.72, -8)
  }

  // ============== FRAME 8E: NIGHT INTERIOR + FINAL BREATH (75-100% of chapter) ==============
  tl.addLabel('frame-8e', pos(0.75))

  // Background crossfade: C8BG3 fades in over C8BG2
  if (bg3) {
    tl.to(
      bg3,
      {
        opacity: 1,
        duration: dur(0.07),
        ease: brandEase.enter,
      },
      pos(0.75)
    )
  }

  // Text 4: "When the final note faded..." - appears at 78%, fades at 88%
  if (text4) {
    addTextLifecycle(tl, text4, 0.78, 0.88, -8)
  }

  // Text 5: "In the dark, Ceci rested her forehead..." - appears at 85%, fades at 96%
  if (text5) {
    addTextLifecycle(tl, text5, 0.85, 0.96, -8)
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
  tl.fromTo(
    target,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: dur(appearDur), ease: brandEase.enter },
    pos(appearAt)
  )

  // Drift while visible
  const driftDur = fadeOutAt - appearAt - appearDur - 0.05
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
      duration: dur(0.05),
      ease: brandEase.exit,
    },
    pos(fadeOutAt)
  )
}

/**
 * Get the duration of Chapter 8 as a proportion of the total experience
 * Based on scroll region: 77% - 90% = 0.13
 */
export const CHAPTER_8_DURATION = 0.13

/**
 * Chapter 8 scroll position in master timeline
 */
export const CHAPTER_8_START = 0.77
