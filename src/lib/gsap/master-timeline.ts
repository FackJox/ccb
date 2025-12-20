/**
 * Master Timeline Controller
 *
 * Single scroll-scrubbed timeline for the entire scrollytelling experience.
 * This is the GSAP best practice for seamless multi-chapter transitions.
 *
 * Architecture:
 * - One ScrollTrigger attached to the entire content
 * - Child timelines added at their normalized scroll positions (0-1)
 * - Each chapter timeline handles its own internal frame transitions
 * - gsap.context() used for cleanup
 */

import { gsap, ScrollTrigger } from './register'
import { chapterScrollRegions } from './scroll'
import {
  createChapter1Timeline,
  createChapter2Timeline,
  createChapter3Timeline,
  createChapter4Timeline,
  createChapter5Timeline,
  createChapter6Timeline,
  createChapter7Timeline,
  createChapter8Timeline,
  createChapter9Timeline,
} from './timelines'

export interface MasterTimelineConfig {
  scrub?: number | boolean
  markers?: boolean
  onUpdate?: (progress: number) => void
}

const defaultConfig: MasterTimelineConfig = {
  scrub: 1, // Smooth scroll-linked animation
  markers: false,
}

/**
 * Create the master timeline for the entire scrollytelling experience
 *
 * @param content - The scroll content container element
 * @param config - Optional configuration overrides
 * @returns gsap.Context for cleanup via context.revert()
 */
export function createMasterTimeline(
  content: HTMLElement,
  config: MasterTimelineConfig = {}
): gsap.Context {
  const mergedConfig = { ...defaultConfig, ...config }

  const ctx = gsap.context(() => {
    // Create the master timeline with ScrollTrigger
    const masterTL = gsap.timeline({
      scrollTrigger: {
        trigger: content,
        start: 'top top',
        end: 'bottom bottom',
        scrub: mergedConfig.scrub,
        markers: mergedConfig.markers,
        onUpdate: mergedConfig.onUpdate
          ? (self) => mergedConfig.onUpdate!(self.progress)
          : undefined,
      },
    })

    // Add chapter timelines at their normalized scroll positions
    // Each chapter timeline is a child that plays during its scroll region

    // Chapter 1: The Held Breath (0% - 11%)
    const chapter1Container = content.querySelector('[data-chapter="1"]')
    if (chapter1Container) {
      const ch1TL = createChapter1Timeline(chapter1Container as HTMLElement)
      masterTL.add(ch1TL, chapterScrollRegions[1].start)
    }

    // Chapter 2: The Offer (11% - 20%)
    const chapter2Container = content.querySelector('[data-chapter="2"]')
    if (chapter2Container) {
      const ch2TL = createChapter2Timeline(chapter2Container as HTMLElement)
      masterTL.add(ch2TL, chapterScrollRegions[2].start)
    }

    // Chapter 3: Consent as Choreography (20% - 27%)
    const chapter3Container = content.querySelector('[data-chapter="3"]')
    if (chapter3Container) {
      const ch3TL = createChapter3Timeline(chapter3Container as HTMLElement)
      masterTL.add(ch3TL, chapterScrollRegions[3].start)
    }

    // Chapter 4: The Crack (27% - 38%)
    const chapter4Container = content.querySelector('[data-chapter="4"]')
    if (chapter4Container) {
      const ch4TL = createChapter4Timeline(chapter4Container as HTMLElement)
      masterTL.add(ch4TL, chapterScrollRegions[4].start)
    }

    // Chapter 5: Authority Enters (38% - 47%)
    const chapter5Container = content.querySelector('[data-chapter="5"]')
    if (chapter5Container) {
      const ch5TL = createChapter5Timeline(chapter5Container as HTMLElement)
      masterTL.add(ch5TL, chapterScrollRegions[5].start)
    }

    // Chapter 6: Violet Window - HERO BEAT (47% - 62%)
    const chapter6Container = content.querySelector('[data-chapter="6"]')
    if (chapter6Container) {
      const ch6TL = createChapter6Timeline(chapter6Container as HTMLElement)
      masterTL.add(ch6TL, chapterScrollRegions[6].start)
    }

    // Chapter 7: Heat & Tide - L3 (62% - 74%)
    const chapter7Container = content.querySelector('[data-chapter="7"]')
    if (chapter7Container) {
      const ch7TL = createChapter7Timeline(chapter7Container as HTMLElement)
      masterTL.add(ch7TL, chapterScrollRegions[7].start)
    }

    // Chapter 8: Release (74% - 88%)
    const chapter8Container = content.querySelector('[data-chapter="8"]')
    if (chapter8Container) {
      const ch8TL = createChapter8Timeline(chapter8Container as HTMLElement)
      masterTL.add(ch8TL, chapterScrollRegions[8].start)
    }

    // Chapter 9: Residue & Dawn (88% - 100%)
    const chapter9Container = content.querySelector('[data-chapter="9"]')
    if (chapter9Container) {
      const ch9TL = createChapter9Timeline(chapter9Container as HTMLElement)
      masterTL.add(ch9TL, chapterScrollRegions[9].start)
    }

    // Store reference for debugging
    if (typeof window !== 'undefined') {
      ;(window as unknown as { __masterTimeline: gsap.core.Timeline }).__masterTimeline = masterTL
    }
  }, content)

  return ctx
}

/**
 * Debug helper: Get the current master timeline
 */
export function getMasterTimeline(): gsap.core.Timeline | undefined {
  if (typeof window !== 'undefined') {
    return (window as unknown as { __masterTimeline?: gsap.core.Timeline }).__masterTimeline
  }
  return undefined
}

/**
 * Debug helper: Jump to a specific progress in the master timeline
 */
export function seekMasterTimeline(progress: number): void {
  const tl = getMasterTimeline()
  if (tl) {
    tl.progress(progress)
  }
}

/**
 * Refresh the master timeline's ScrollTrigger
 * Call after layout changes
 */
export function refreshMasterTimeline(): void {
  ScrollTrigger.refresh()
}
