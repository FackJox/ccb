/**
 * Chapter 1 Timeline - "The Held Breath"
 *
 * Frames: 1A → 1B → 1C
 * Scroll Region: 0-11% of total
 * Complexity: L2 (Expressive)
 *
 * Motion:
 * - 1A (0-33%): BG + Ceci visible, text staggers in
 * - 1B (33-66%): Crossfade to frame with Jack, text staggers
 * - 1C (66-100%): Final text, "Let them look..." beat, violet glow prep
 */

import { gsap, SplitText, brandEase } from '../register'

/**
 * Create Chapter 1 timeline
 * Returns a timeline that will be added to the master timeline
 */
export function createChapter1Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // Get frame containers
  const frame1A = container.querySelector('[data-frame="1A"]')
  const frame1B = container.querySelector('[data-frame="1B"]')
  const frame1C = container.querySelector('[data-frame="1C"]')

  // Get text elements for each frame
  const frame1ATexts = container.querySelectorAll('[data-frame="1A"] [data-text]')
  const frame1BTexts = container.querySelectorAll('[data-frame="1B"] [data-text]')
  const frame1CTexts = container.querySelectorAll('[data-frame="1C"] [data-text]')
  const beatText = container.querySelector('[data-frame="1C"] [data-beat]')

  // ============== FRAME 1A: The Held Breath - Ceci Claims the Hall ==============
  // Duration: 0 - 0.33 of chapter timeline
  tl.addLabel('frame-1a', 0)

  // Frame 1A is already visible (set by master timeline)
  // Text fragments stagger in
  if (frame1ATexts.length > 0) {
    tl.fromTo(
      frame1ATexts,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.1,
        stagger: 0.04,
        ease: brandEase.enter,
      },
      'frame-1a+=0.05'
    )
  }

  // ============== FRAME 1B: Jack Enters ==============
  // Duration: 0.33 - 0.66 of chapter timeline
  tl.addLabel('frame-1b', 0.33)

  // Crossfade: 1A out, 1B in
  if (frame1A && frame1B) {
    tl.to(frame1A, { opacity: 0, duration: 0.05, ease: brandEase.exit }, 'frame-1b')
    tl.to(frame1B, { opacity: 1, duration: 0.05, ease: brandEase.enter }, 'frame-1b')
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
      'frame-1b+=0.05'
    )
  }

  // ============== FRAME 1C: Final Beat ==============
  // Duration: 0.66 - 1.0 of chapter timeline
  tl.addLabel('frame-1c', 0.66)

  // Crossfade: 1B out, 1C in
  if (frame1B && frame1C) {
    tl.to(frame1B, { opacity: 0, duration: 0.05, ease: brandEase.exit }, 'frame-1c')
    tl.to(frame1C, { opacity: 1, duration: 0.05, ease: brandEase.enter }, 'frame-1c')
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
      'frame-1c+=0.05'
    )
  }

  // Typography beat: "Let them look. Let the city breathe again."
  if (beatText) {
    try {
      const split = new SplitText(beatText, { type: 'chars,words' })

      tl.fromTo(
        split.chars,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.08,
          stagger: 0.03,
          ease: brandEase.enter,
        },
        'frame-1c+=0.1'
      )

      // Slight drift up after reveal
      tl.to(
        beatText,
        {
          y: -10,
          duration: 0.15,
          ease: brandEase.transform,
        },
        'frame-1c+=0.25'
      )
    } catch (e) {
      // SplitText may fail if element is hidden, just fade in instead
      tl.fromTo(
        beatText,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.15, ease: brandEase.enter },
        'frame-1c+=0.1'
      )
    }
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
