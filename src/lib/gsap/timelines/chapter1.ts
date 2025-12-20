/**
 * Chapter 1 Timeline - "The Held Breath"
 *
 * Frames: 1A → 1B → 1C
 * Scroll Region: 0-11% of total
 * Complexity: L2 (Expressive)
 *
 * Motion:
 * - 1A (0-33%): BG fades in, Ceci scales 1.02→1.0, text staggers
 * - 1B (33-66%): Jack fades in from right, text staggers
 * - 1C (66-100%): Final text, "Let them look..." beat, violet glow prep
 */

import { gsap, SplitText, brandEase, brandDurations } from '../register'

/**
 * Create Chapter 1 timeline
 * Returns a timeline that will be added to the master timeline
 */
export function createChapter1Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // Get elements - use data attributes for reliable selection
  const bg = container.querySelector('[data-layer="c1-bg"]')
  const fg1 = container.querySelector('[data-layer="c1-fg1"]') // Ceci
  const fg2 = container.querySelector('[data-layer="c1-fg2"]') // Jack

  // Get text elements for each frame
  const frame1ATexts = container.querySelectorAll('[data-frame="1A"] [data-text]')
  const frame1BTexts = container.querySelectorAll('[data-frame="1B"] [data-text]')
  const frame1CTexts = container.querySelectorAll('[data-frame="1C"] [data-text]')
  const beatText = container.querySelector('[data-frame="1C"] [data-beat]')

  // ============== FRAME 1A: The Held Breath - Ceci Claims the Hall ==============
  // Duration: 0 - 0.33 of chapter timeline
  tl.addLabel('frame-1a', 0)

  // BG fades in from velvet soot
  if (bg) {
    tl.fromTo(
      bg,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.15,
        ease: brandEase.enter,
      },
      'frame-1a'
    )
  }

  // Ceci (FG1) scales in with slight zoom
  if (fg1) {
    tl.fromTo(
      fg1,
      { opacity: 0, scale: 1.02 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.15,
        ease: brandEase.enter,
      },
      'frame-1a+=0.05'
    )
  }

  // Text fragments stagger in (40ms apart per design docs)
  if (frame1ATexts.length > 0) {
    tl.fromTo(
      frame1ATexts,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.1,
        stagger: 0.04, // 40ms stagger
        ease: brandEase.enter,
      },
      'frame-1a+=0.1'
    )
  }

  // ============== FRAME 1B: Jack Enters ==============
  // Duration: 0.33 - 0.66 of chapter timeline
  tl.addLabel('frame-1b', 0.33)

  // Fade out 1A texts before 1B
  if (frame1ATexts.length > 0) {
    tl.to(
      frame1ATexts,
      {
        opacity: 0,
        y: -10,
        duration: 0.08,
        stagger: 0.02,
        ease: brandEase.exit,
      },
      'frame-1b-=0.05'
    )
  }

  // Jack (FG2) fades in from right
  if (fg2) {
    tl.fromTo(
      fg2,
      { opacity: 0, x: 20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.12,
        ease: brandEase.enter,
      },
      'frame-1b'
    )
  }

  // Frame 1B text fragments
  if (frame1BTexts.length > 0) {
    tl.fromTo(
      frame1BTexts,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.1,
        stagger: 0.04,
        ease: brandEase.enter,
      },
      'frame-1b+=0.08'
    )
  }

  // ============== FRAME 1C: Final Beat ==============
  // Duration: 0.66 - 1.0 of chapter timeline
  tl.addLabel('frame-1c', 0.66)

  // Fade out 1B texts
  if (frame1BTexts.length > 0) {
    tl.to(
      frame1BTexts,
      {
        opacity: 0,
        y: -10,
        duration: 0.08,
        stagger: 0.02,
        ease: brandEase.exit,
      },
      'frame-1c-=0.05'
    )
  }

  // Frame 1C regular text fragments
  if (frame1CTexts.length > 0) {
    tl.fromTo(
      frame1CTexts,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.1,
        stagger: 0.04,
        ease: brandEase.enter,
      },
      'frame-1c'
    )
  }

  // Typography beat: "Let them look. Let the city breathe again."
  // This gets special SplitText treatment
  if (beatText) {
    const split = new SplitText(beatText, { type: 'chars,words' })

    tl.fromTo(
      split.chars,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.08,
        stagger: 0.03, // 30ms per character
        ease: brandEase.enter,
      },
      'frame-1c+=0.1'
    )

    // Slight drift up after reveal (design doc: "drift up")
    tl.to(
      beatText,
      {
        y: -10,
        duration: 0.15,
        ease: brandEase.transform,
      },
      'frame-1c+=0.25'
    )
  }

  // Violet glow prep at chapter exit - subtle hint
  tl.addLabel('exit-prep', 0.9)

  // Darken BG slightly
  if (bg) {
    tl.to(
      bg,
      {
        filter: 'brightness(0.85)',
        duration: 0.1,
        ease: brandEase.exit,
      },
      'exit-prep'
    )
  }

  return tl
}

/**
 * Get the duration of Chapter 1 as a proportion of the total experience
 * Based on scroll region: 0% - 11% = 0.11
 */
export const CHAPTER_1_DURATION = 0.11

/**
 * Chapter 1 scroll position in master timeline
 */
export const CHAPTER_1_START = 0
