/**
 * Chapter 1 Timeline - "The Held Breath"
 *
 * Single continuous scene with layered animations per Scroll-Telling Map:
 * - Frame A (0-20% of chapter): BG + Ceci appears, texts 1-3
 * - Frame B (20-60% of chapter): Jack appears, texts 4-6
 * - Frame C (60-100% of chapter): texts 7-8 (transparent), beat text reveal
 *
 * Scroll Region: 0-11% of total scroll
 * All positions are PRE-SCALED to global timeline (multiply by D = 0.11)
 *
 * Complexity: L2 (Expressive)
 */

import { gsap, SplitText, brandEase } from '../register'
import { chapterScrollRegions } from '../scroll'

// Chapter 1's duration as fraction of total scroll (0-1)
const D = chapterScrollRegions[1].end - chapterScrollRegions[1].start // 0.11

// Helper to scale chapter-relative position to global position
const pos = (chapterPercent: number) => chapterPercent * D
// Helper to scale chapter-relative duration to global duration
const dur = (chapterPercent: number) => chapterPercent * D

/**
 * Create Chapter 1 timeline with positions pre-scaled for master timeline
 */
export function createChapter1Timeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()

  // ============== GET ELEMENTS ==============
  const ceci = container.querySelector('[data-layer="ceci"]')
  const jack = container.querySelector('[data-layer="jack"]')
  const text1 = container.querySelector('[data-text-block="1"]')
  const text2 = container.querySelector('[data-text-block="2"]')
  const text3 = container.querySelector('[data-text-block="3"]')
  const text4 = container.querySelector('[data-text-block="4"]')
  const text5 = container.querySelector('[data-text-block="5"]')
  const text6 = container.querySelector('[data-text-block="6"]')
  const text7 = container.querySelector('[data-text-block="7"]')
  const text8 = container.querySelector('[data-text-block="8"]')
  const beatText = container.querySelector('[data-beat]')

  // ============== FRAME A: CECI CLAIMS THE HALL (0-20% of chapter) ==============
  tl.addLabel('frame-a', 0)

  // Ceci appears at 2% of chapter
  if (ceci) {
    tl.to(ceci, {
      opacity: 1,
      scale: 1,
      duration: dur(0.05),
      ease: brandEase.enter,
    }, pos(0.02))
  }

  // Text block 1: appears at 3%, fades at 18% (~15% visible)
  if (text1) {
    addTextLifecycle(tl, text1, 0.03, 0.18, -15)
  }

  // Text block 2: appears at 7%, fades at 18% (~11% visible)
  if (text2) {
    addTextLifecycle(tl, text2, 0.07, 0.18, -12)
  }

  // Text block 3: appears at 11%, fades at 18% (~7% visible)
  if (text3) {
    addTextLifecycle(tl, text3, 0.11, 0.18, -10)
  }

  // ============== FRAME B: JACK ENTERS (20-60% of chapter) ==============
  tl.addLabel('frame-b', pos(0.20))

  // Jack appears at 18% of chapter (just before Frame B)
  if (jack) {
    tl.to(jack, {
      opacity: 1,
      duration: dur(0.05),
      ease: brandEase.enter,
    }, pos(0.18))
  }

  // Text block 4: appears at 22%, fades at 55% (~33% visible)
  if (text4) {
    addTextLifecycle(tl, text4, 0.22, 0.55, -18)
  }

  // Text block 5: appears at 30%, fades at 55% (~25% visible)
  if (text5) {
    addTextLifecycle(tl, text5, 0.30, 0.55, -15)
  }

  // Text block 6: appears at 38%, fades at 55% (~17% visible)
  if (text6) {
    addTextLifecycle(tl, text6, 0.38, 0.55, -12)
  }

  // ============== FRAME C: SHARED MOMENT (60-100% of chapter) ==============
  tl.addLabel('frame-c', pos(0.60))

  // Text block 7: appears at 62%, fades at 90% (~28% visible)
  if (text7) {
    addTextLifecycle(tl, text7, 0.62, 0.90, -15)
  }

  // Text block 8: appears at 70%, fades at 90% (~20% visible)
  if (text8) {
    addTextLifecycle(tl, text8, 0.70, 0.90, -12)
  }

  // Beat text at 80% of chapter
  if (beatText) {
    const beatContent = beatText.querySelector('.typography-beat') || beatText

    try {
      const split = new SplitText(beatContent, {
        type: 'chars,words',
        charsClass: 'beat-char',
      })

      tl.fromTo(split.chars,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: dur(0.10),
          stagger: dur(0.02),
          ease: brandEase.enter,
        },
        pos(0.80)
      )

      tl.to(beatContent, {
        y: -10,
        duration: dur(0.08),
        ease: brandEase.transform,
      }, pos(0.92))

    } catch (e) {
      console.warn('[Chapter1] SplitText failed, using simple fade:', e)
      tl.fromTo(beatText,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: dur(0.10), ease: brandEase.enter },
        pos(0.80)
      )
    }
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
 * Get the duration of Chapter 1 as a proportion of the total experience
 * Based on scroll region: 0% - 11% = 0.11
 */
export const CHAPTER_1_DURATION = 0.11

/**
 * Chapter 1 scroll position in master timeline
 */
export const CHAPTER_1_START = 0

/**
 * Snap points within Chapter 1 (relative to chapter, 0-1)
 * - 0.20: Frame A → B transition (Jack enters)
 * - 0.60: Frame B → C transition (shared moment)
 */
export const CHAPTER_1_SNAP_POINTS = [0.20, 0.60]

/**
 * Convert chapter-relative snap points to global positions
 * For use in master timeline scroll configuration
 */
export function getChapter1GlobalSnapPoints(): number[] {
  return CHAPTER_1_SNAP_POINTS.map(
    (point) => CHAPTER_1_START + point * CHAPTER_1_DURATION
  )
}
