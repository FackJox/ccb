/**
 * Chapter 7 Timeline - "Heat & Tide" (L3 Signature)
 *
 * Frame A (0-25% of chapter): Crowd scene with scale pulse
 * - C7BG crossfades in from Ch6's exterior-windows-silhouette
 * - Subtle scale pulse (0.99→1.01) suggests crowd breathing as single organism
 * - Text 1-2 appear sequentially over crowd scene
 *
 * Frame B (25-50% of chapter): Exterior windows silhouette
 * - Crossfade from C7BG to exterior-windows-silhouette
 * - Text 3-4 appear sequentially
 *
 * Frame C (50-80% of chapter): Interior with couple (C7BG2)
 * - Crossfade from exterior to C7BG2
 * - Text 5-6 appear sequentially
 *
 * Frame D (80-100% of chapter): Final intimate moment
 * - C7BG2 continues
 * - Text 7 appears (confession)
 *
 * Scroll Region: 67-77% of total scroll (10% duration)
 * Complexity: L3 (Signature) - full orchestration allowed
 *
 * This chapter interweaves intimate romance with public revolution.
 * "Breath, not bounce" - the crowd breathes together; elements fade and drift.
 */

import { gsap, brandEase } from '../register'
import { chapterScrollRegions } from '../scroll'

// Chapter 7's duration as fraction of total scroll (0-1)
const D = chapterScrollRegions[7].end - chapterScrollRegions[7].start

// Helper to scale chapter-relative position to global position
const pos = (chapterPercent: number) => chapterPercent * D
// Helper to scale chapter-relative duration to global duration
const dur = (chapterPercent: number) => chapterPercent * D

/**
 * Create Chapter 7 timeline with positions pre-scaled for master timeline
 */
export function createChapter7Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // ============== GET ELEMENTS ==============
  // Layers
  const bg = container.querySelector('[data-layer="bg"]')
  const bgExterior = container.querySelector('[data-layer="bgExterior"]')
  const bg2 = container.querySelector('[data-layer="bg2"]')

  // Text blocks
  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')
  const text3 = container.querySelector('[data-text-block="3"]')
  const text4 = container.querySelector('[data-text-block="4"]')
  const text5 = container.querySelector('[data-text-block="5"]')
  const text6 = container.querySelector('[data-text-block="6"]')
  const text7 = container.querySelector('[data-text-block="7"]')

  // ============== FRAME A: CROWD SCENE (0-25% of chapter) ==============
  tl.addLabel('frame-a', 0)

  // BG crossfade in from Ch6 (signature duration ~1000ms feel)
  if (bg) {
    // Fade in the crowd BG
    tl.to(
      bg,
      {
        opacity: 1,
        duration: dur(0.08),
        ease: brandEase.enter,
      },
      0
    )

    // Scale pulse: 0.99 → 1.01 (crowd breathing as single organism)
    // Uses transform easing for "dancer pivoting" feel
    tl.to(
      bg,
      {
        scale: 1.01,
        duration: dur(0.25),
        ease: brandEase.transform,
      },
      0
    )
  }

  // Text 1: "Someone clapped on the count..." - persists from Chapter 6
  // Same position as Ch6 text 11, visible immediately (Chapter 4 pattern)
  if (text1) {
    // Visible immediately to continue from Chapter 6 - same pattern as Chapter 4 text 1
    tl.set(text1, { opacity: 1, y: 0 }, 0)

    // Fade out before Frame B starts
    tl.to(
      text1,
      {
        opacity: 0,
        duration: dur(0.08),
        ease: brandEase.exit,
      },
      pos(0.2)
    )
  }

  // Text 2: "The patrol tried to push through..." - appears at 10%, fades at 23%
  if (text2) {
    addTextLifecycle(tl, text2, 0.1, 0.23, -8)
  }

  // ============== FRAME B: EXTERIOR WINDOWS SILHOUETTE (25-50% of chapter) ==============
  tl.addLabel('frame-b', pos(0.25))

  // Crossfade: C7BG → exterior-windows-silhouette
  if (bg && bgExterior) {
    // Fade out crowd BG
    tl.to(
      bg,
      {
        opacity: 0,
        duration: dur(0.07),
        ease: brandEase.exit,
      },
      pos(0.25)
    )

    // Fade in exterior silhouette
    tl.to(
      bgExterior,
      {
        opacity: 1,
        duration: dur(0.07),
        ease: brandEase.enter,
      },
      pos(0.25)
    )
  }

  // Text 3: "Heat traveled through him like memory." - appears at 28%, fades at 45%
  if (text3) {
    addTextLifecycle(tl, text3, 0.28, 0.45, -8)
  }

  // Text 4: "Ceci slid her fingers..." - appears at 33%, fades at 48%
  if (text4) {
    addTextLifecycle(tl, text4, 0.33, 0.48, -8)
  }

  // ============== FRAME C: INTERIOR WITH COUPLE (50-80% of chapter) ==============
  tl.addLabel('frame-c', pos(0.5))

  // Crossfade: exterior-windows-silhouette → C7BG2
  if (bgExterior && bg2) {
    // Fade out exterior
    tl.to(
      bgExterior,
      {
        opacity: 0,
        duration: dur(0.07),
        ease: brandEase.exit,
      },
      pos(0.5)
    )

    // Fade in C7BG2 interior
    tl.to(
      bg2,
      {
        opacity: 1,
        duration: dur(0.07),
        ease: brandEase.enter,
      },
      pos(0.5)
    )
  }

  // Text 5: "Heat gathered and traveled..." - appears at 53%, fades at 75%
  if (text5) {
    addTextLifecycle(tl, text5, 0.53, 0.75, -8)
  }

  // Text 6: "A question. A vow..." - appears at 58%, fades at 78%
  if (text6) {
    addTextLifecycle(tl, text6, 0.58, 0.78, -8)
  }

  // ============== FRAME D: FINAL INTIMATE MOMENT (80-100% of chapter) ==============
  tl.addLabel('frame-d', pos(0.8))

  // Text 7: "Jack exhaled her name..." - appears at 82%, fades at 95%
  if (text7) {
    addTextLifecycle(tl, text7, 0.82, 0.95, -8)
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
 * Get the duration of Chapter 7 as a proportion of the total experience
 * Based on scroll region: 67% - 77% = 0.10
 */
export const CHAPTER_7_DURATION = 0.1

/**
 * Chapter 7 scroll position in master timeline
 */
export const CHAPTER_7_START = 0.67
