/**
 * Chapter 4 Timeline - "The Crack"
 *
 * Frame A (0-50% of chapter): Mirror scene with persistent text from Chapter 3
 * - Text 1 (mirror text) visible immediately (continues from Chapter 3)
 * - BG shows the mirror on the wall
 * - Text 1 fades out after reading time
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
  const text1 = container.querySelector('[data-text-block="1"]')

  // ============== FRAME A: MIRROR SCENE (0-50% of chapter) ==============
  tl.addLabel('frame-a', 0)

  // Text 1 (mirror text) - visible immediately to continue from Chapter 3
  // Set to visible at position 0, then fade out later
  if (text1) {
    // Immediately set visible (no animation, just snap to visible)
    tl.set(text1, { opacity: 1, y: 0 }, 0)

    // Fade out after reading time (around 40% of chapter)
    tl.to(text1, {
      opacity: 0,
      duration: dur(0.08),
      ease: brandEase.exit,
    }, pos(0.40))
  }

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
