/**
 * Master Timeline Controller
 *
 * Single scroll-scrubbed timeline for the entire scrollytelling experience.
 * This is the GSAP best practice for seamless multi-chapter transitions.
 *
 * Architecture:
 * - Stage element is pinned for entire scroll duration
 * - All chapters stack at the same position within the stage
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
 * @param stage - The stage element (pinned viewport container)
 * @param config - Optional configuration overrides
 * @returns gsap.Context for cleanup via context.revert()
 */
export function createMasterTimeline(
  stage: HTMLElement,
  config: MasterTimelineConfig = {}
): gsap.Context {
  console.log('[createMasterTimeline] Called with stage:', stage)
  console.log('[createMasterTimeline] Stage dimensions:', stage?.offsetWidth, 'x', stage?.offsetHeight)

  const mergedConfig = { ...defaultConfig, ...config }
  console.log('[createMasterTimeline] Config:', mergedConfig)

  const ctx = gsap.context(() => {
    console.log('[createMasterTimeline] Inside gsap.context()')

    // Create the master timeline with ScrollTrigger
    // The stage is pinned for the entire scroll duration (700vh spacer)
    console.log('[createMasterTimeline] Creating master timeline with ScrollTrigger...')
    const masterTL = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: '+=700%', // Match scroll-spacer height
        pin: true,
        pinSpacing: false, // Spacer already provides scroll distance
        scrub: mergedConfig.scrub,
        markers: mergedConfig.markers,
        onUpdate: mergedConfig.onUpdate
          ? (self) => mergedConfig.onUpdate!(self.progress)
          : undefined,
      },
    })
    console.log('[createMasterTimeline] Master timeline created:', masterTL)
    console.log('[createMasterTimeline] ScrollTrigger attached:', masterTL.scrollTrigger)

    // Add chapter timelines at their normalized scroll positions
    // Each chapter timeline is a child that plays during its scroll region

    // Set initial visibility: all chapters hidden except chapter 1
    const allChapters = stage.querySelectorAll('[data-chapter]')
    allChapters.forEach((chapter) => {
      const chapterNum = chapter.getAttribute('data-chapter')
      // Chapter 1 visible at start, others hidden
      gsap.set(chapter, { opacity: chapterNum === '1' ? 1 : 0 })

      // Within each chapter, only first frame visible
      const frames = chapter.querySelectorAll('[data-frame]')
      frames.forEach((frame, index) => {
        gsap.set(frame, { opacity: index === 0 ? 1 : 0 })
      })
    })

    // Chapter 1: The Held Breath (0% - 11%)
    const chapter1Container = stage.querySelector('[data-chapter="1"]')
    if (chapter1Container) {
      console.log('[createMasterTimeline] Found Chapter 1 container')
      const ch1TL = createChapter1Timeline(chapter1Container as HTMLElement)
      masterTL.add(ch1TL, chapterScrollRegions[1].start)

      // Fade out chapter 1 at end of its region
      masterTL.to(chapter1Container, {
        opacity: 0,
        duration: 0.02,
        ease: 'power2.out',
      }, chapterScrollRegions[1].end - 0.02)
    }

    // Helper to add chapter with fade in/out transitions
    const addChapterWithTransitions = (
      chapterNum: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
      createTimeline: (container: HTMLElement) => gsap.core.Timeline
    ) => {
      const container = stage.querySelector(`[data-chapter="${chapterNum}"]`)
      if (!container) return

      const region = chapterScrollRegions[chapterNum]
      const fadeDuration = 0.02 // 2% of total scroll for fade

      // Fade in at start (except chapter 1 which starts visible)
      if (chapterNum > 1) {
        masterTL.to(container, {
          opacity: 1,
          duration: fadeDuration,
          ease: 'power2.out',
        }, region.start)
      }

      // Add chapter's internal timeline
      const chapterTL = createTimeline(container as HTMLElement)
      masterTL.add(chapterTL, region.start)

      // Fade out at end (except chapter 9 which holds)
      if (chapterNum < 9) {
        masterTL.to(container, {
          opacity: 0,
          duration: fadeDuration,
          ease: 'power2.in',
        }, region.end - fadeDuration)
      }
    }

    // Add all chapters with transitions
    addChapterWithTransitions(2, createChapter2Timeline)
    addChapterWithTransitions(3, createChapter3Timeline)
    addChapterWithTransitions(4, createChapter4Timeline)
    addChapterWithTransitions(5, createChapter5Timeline)
    addChapterWithTransitions(6, createChapter6Timeline)
    addChapterWithTransitions(7, createChapter7Timeline)
    addChapterWithTransitions(8, createChapter8Timeline)
    addChapterWithTransitions(9, createChapter9Timeline)

    // Store reference for debugging
    if (typeof window !== 'undefined') {
      ;(window as unknown as { __masterTimeline: gsap.core.Timeline }).__masterTimeline = masterTL
    }
  }, stage)

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
