/**
 * Chapter 6 Timeline - "Violet Window" (L3 Hero Beat)
 *
 * Frame A/B (0-40% of chapter): Ballroom scene with text sequence
 * - Scene visible from chapter start (layers continue from Ch4/5)
 * - Persistent text (from Ch5) fades out
 * - 3 new text blocks appear sequentially
 *
 * Frame C (40-72% of chapter): Hero transition to exterior silhouettes
 * - BG crossfades from C4BG to exterior-windows-silhouette (hero beat)
 * - FG layers (coupleStanding, mirrorBroken) fade out with BG
 * - Text 4 persists through transition, then fades
 * - Text 5 and 6 appear sequentially over exterior scene
 *
 * Scroll Region: 47-62% of total scroll (15% duration)
 * Complexity: L3 (Signature) - full orchestration allowed
 *
 * This is the poster beat - the most iconic moment of the experience.
 * "Breath, not bounce" - elements fade and drift like smoke or fabric.
 */

import { gsap, brandEase } from '../register'
import { chapterScrollRegions } from '../scroll'

// Chapter 6's duration as fraction of total scroll (0-1)
const D = chapterScrollRegions[6].end - chapterScrollRegions[6].start // 0.15

// Helper to scale chapter-relative position to global position
const pos = (chapterPercent: number) => chapterPercent * D
// Helper to scale chapter-relative duration to global duration
const dur = (chapterPercent: number) => chapterPercent * D

/**
 * Create Chapter 6 timeline with positions pre-scaled for master timeline
 */
export function createChapter6Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // ============== GET ELEMENTS ==============
  // Layers
  const bg = container.querySelector('[data-layer="bg"]')
  const bgExterior = container.querySelector('[data-layer="bgExterior"]')
  const coupleStanding = container.querySelector('[data-layer="coupleStanding"]')
  const mirrorBroken = container.querySelector('[data-layer="mirrorBroken"]')

  // Text blocks
  const text1 = container.querySelector('[data-text-block="1"]') // Persistent from Ch5
  const text2 = container.querySelector('[data-text-block="2"]')
  const text3 = container.querySelector('[data-text-block="3"]')
  const text4 = container.querySelector('[data-text-block="4"]')
  const text5 = container.querySelector('[data-text-block="5"]')
  const text6 = container.querySelector('[data-text-block="6"]')

  // ============== FRAME A: PERSISTENT TEXT FADE (0-15% of chapter) ==============
  tl.addLabel('frame-a', 0)

  // Text 1 (persistent from Ch5): visible at start, fades out
  if (text1) {
    // Already visible from chapter start (persistent from Ch5)
    tl.set(text1, { opacity: 1, y: 0 }, 0)

    // Fade out at 5-12% of chapter
    tl.to(
      text1,
      {
        opacity: 0,
        duration: dur(0.07),
        ease: brandEase.exit,
      },
      pos(0.05)
    )
  }

  // ============== FRAME B: NEW TEXT SEQUENCE (15-40% of chapter) ==============
  tl.addLabel('frame-b', pos(0.15))

  // Text 2: "She killed the main lanterns..." - appears at 15%, fades at 36%
  if (text2) {
    addTextLifecycle(tl, text2, 0.15, 0.36, -10)
  }

  // Text 3: "The glass flared..." - appears at 25%, fades at 38%
  if (text3) {
    addTextLifecycle(tl, text3, 0.25, 0.38, -8)
  }

  // Text 4: appears at 35%, persists through Frame C transition, fades at 50%
  if (text4) {
    addTextLifecycle(tl, text4, 0.35, 0.5, -8)
  }

  // ============== FRAME C: HERO TRANSITION (40-72% of chapter) ==============
  tl.addLabel('frame-c', pos(0.4))

  // Background crossfade (hero beat - ~1000ms feel at 7% of chapter)
  if (bg && bgExterior) {
    // C4BG fades out
    tl.to(
      bg,
      {
        opacity: 0,
        duration: dur(0.07),
        ease: brandEase.enter,
      },
      pos(0.4)
    )

    // Exterior windows silhouette fades in (hero shot)
    tl.to(
      bgExterior,
      {
        opacity: 1,
        duration: dur(0.07),
        ease: brandEase.enter,
      },
      pos(0.4)
    )
  }

  // Foreground layers fade out with BG transition
  if (coupleStanding) {
    tl.to(
      coupleStanding,
      {
        opacity: 0,
        duration: dur(0.07),
        ease: brandEase.enter,
      },
      pos(0.4)
    )
  }

  if (mirrorBroken) {
    tl.to(
      mirrorBroken,
      {
        opacity: 0,
        duration: dur(0.07),
        ease: brandEase.enter,
      },
      pos(0.4)
    )
  }

  // Text 5: "A gasp rose from the square..." - appears at 50%, fades at 68%
  if (text5) {
    addTextLifecycle(tl, text5, 0.5, 0.68, -8)
  }

  // Text 6: "Only shadows remained..." - appears at 55%, fades at 72%
  if (text6) {
    addTextLifecycle(tl, text6, 0.55, 0.72, -8)
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
 * Get the duration of Chapter 6 as a proportion of the total experience
 * Based on scroll region: 47% - 62% = 0.15
 */
export const CHAPTER_6_DURATION = 0.15

/**
 * Chapter 6 scroll position in master timeline
 */
export const CHAPTER_6_START = 0.47
