/**
 * Chapter 4 Timeline - "The Crack"
 *
 * Frame A (0-45% of chapter): Mirror scene with persistent text from Chapter 3
 * - Text 1 (mirror text) visible immediately (continues from Chapter 3)
 * - Mirror intact visible
 * - Text 1 fades out at 40%
 *
 * Frame B (45-100% of chapter): Mirror shatter sequence
 * - Mirror falls (Y translate down)
 * - Mirror crossfade (intact → broken)
 * - Sequential beat: "Un." → "Deux." → "Trois."
 * - Couple standing fades in
 * - Narrative text appears
 *
 * Scroll Region: 27-38% of total scroll (11% duration)
 * Complexity: L2 (Expressive)
 *
 * All positions are PRE-SCALED to global timeline (multiply by D = 0.11)
 */

import { gsap, brandEase } from '../register'
import { chapterScrollRegions } from '../scroll'

// Chapter 4's duration as fraction of total scroll (0-1)
const D = chapterScrollRegions[4].end - chapterScrollRegions[4].start // 0.11

// Helper to scale chapter-relative position to global position
const pos = (chapterPercent: number) => chapterPercent * D
// Helper to scale chapter-relative duration to global duration
const dur = (chapterPercent: number) => chapterPercent * D

/**
 * Create Chapter 4 timeline with positions pre-scaled for master timeline
 */
export function createChapter4Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // ============== GET ELEMENTS ==============
  // Layers
  const mirrorIntact = container.querySelector('[data-layer="mirrorIntact"]')
  const mirrorBroken = container.querySelector('[data-layer="mirrorBroken"]')
  const coupleStanding = container.querySelector('[data-layer="coupleStanding"]')
  // Text blocks
  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')  // "Un."
  const text3 = container.querySelector('[data-text-block="3"]')  // "Deux."
  const text4 = container.querySelector('[data-text-block="4"]')  // "Trois."
  const text5 = container.querySelector('[data-text-block="5"]')  // Narrative

  // ============== FRAME A: MIRROR SCENE (0-45% of chapter) ==============
  tl.addLabel('frame-a', 0)

  // Text 1 (mirror text) - visible immediately to continue from Chapter 3
  if (text1) {
    tl.set(text1, { opacity: 1, y: 0 }, 0)
    // Fade out before mirror falls
    tl.to(text1, {
      opacity: 0,
      duration: dur(0.08),
      ease: brandEase.exit,
    }, pos(0.40))
  }

  // ============== FRAME B: MIRROR SHATTER SEQUENCE (45-100% of chapter) ==============
  tl.addLabel('frame-b', pos(0.45))

  // 1. Mirror falls (intact mirror translates down)
  if (mirrorIntact) {
    tl.to(mirrorIntact, {
      y: 30,  // Fall distance in pixels
      duration: dur(0.10),
      ease: brandEase.transform,
    }, pos(0.45))
  }

  // 2. Mirror crossfade (intact → broken)
  if (mirrorIntact && mirrorBroken) {
    // Set broken mirror to same fallen position
    tl.set(mirrorBroken, { y: 30 }, pos(0.55))
    // Crossfade
    tl.to(mirrorIntact, {
      opacity: 0,
      duration: dur(0.04),
      ease: brandEase.transform,
    }, pos(0.55))
    tl.to(mirrorBroken, {
      opacity: 1,
      duration: dur(0.04),
      ease: brandEase.transform,
    }, pos(0.55))
  }

  // 3. Sequential beat: "Un." → "Deux." → "Trois."
  // Each word appears, holds briefly, then fades as next appears
  if (text2) {
    tl.fromTo(text2,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: dur(0.03), ease: brandEase.enter },
      pos(0.58)
    )
    tl.to(text2,
      { opacity: 0, duration: dur(0.02), ease: brandEase.exit },
      pos(0.61)
    )
  }

  if (text3) {
    tl.fromTo(text3,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: dur(0.03), ease: brandEase.enter },
      pos(0.62)
    )
    tl.to(text3,
      { opacity: 0, duration: dur(0.02), ease: brandEase.exit },
      pos(0.65)
    )
  }

  if (text4) {
    tl.fromTo(text4,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: dur(0.03), ease: brandEase.enter },
      pos(0.66)
    )
    tl.to(text4,
      { opacity: 0, duration: dur(0.02), ease: brandEase.exit },
      pos(0.70)
    )
  }

  // 4. Couple fades in (during "Deux." beat)
  if (coupleStanding) {
    tl.to(coupleStanding, {
      opacity: 1,
      duration: dur(0.08),
      ease: brandEase.enter,
    }, pos(0.62))
  }

  // 5. Narrative text appears after beat sequence
  if (text5) {
    tl.fromTo(text5,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: dur(0.08), ease: brandEase.enter },
      pos(0.72)
    )
  }
  // Narrative text holds until chapter end (natural chapter fade handles exit)

  return tl
}

/**
 * Get the duration of Chapter 4 as a proportion of the total experience
 * Based on scroll region: 27% - 38% = 0.11
 */
export const CHAPTER_4_DURATION = 0.11

/**
 * Chapter 4 scroll position in master timeline
 */
export const CHAPTER_4_START = 0.27
