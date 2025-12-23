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

import { gsap, ScrollTrigger, brandEase } from './register'
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

/**
 * Calculate all snap points for the master timeline
 * Returns global positions (0-1) where scroll should snap
 *
 * TODO: Derive snap points from chapterScrollRegions + frame boundaries
 */
function calculateGlobalSnapPoints(): number[] {
  // Snap points disabled - return empty for now
  // Future: calculate from derived regions
  return []
}

export interface MasterTimelineConfig {
  scrub?: number | boolean
  markers?: boolean
  snap?: boolean // Enable scroll snapping at frame transitions
  onUpdate?: (progress: number) => void
}

const defaultConfig: MasterTimelineConfig = {
  scrub: 1, // Smooth scroll-linked animation
  markers: false,
  snap: false, // Disabled temporarily for debugging timing issues
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

    // Calculate snap points if snapping is enabled
    const snapPoints = mergedConfig.snap ? calculateGlobalSnapPoints() : []
    console.log('[createMasterTimeline] Snap points:', snapPoints)

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
        // Scroll snap configuration for cinematic frame transitions
        ...(mergedConfig.snap && snapPoints.length > 0 && {
          snap: {
            snapTo: snapPoints,
            duration: { min: 0.2, max: 0.4 }, // Smooth snap duration
            delay: 0.1, // Brief delay before snapping
            ease: brandEase.transform, // Use brand easing for snap
          },
        }),
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

      // Set initial layer visibility based on data-initial-opacity attribute
      // This respects scene config's initialOpacity value per layer
      const layers = chapter.querySelectorAll('[data-layer]')
      layers.forEach((layer) => {
        const layerId = layer.getAttribute('data-layer')
        const initialOpacity = parseFloat(layer.getAttribute('data-initial-opacity') || '0')
        const isBg = layerId === 'bg'
        gsap.set(layer, {
          opacity: initialOpacity,
          scale: isBg ? 1 : 1.02, // FG layers have subtle initial scale
        })
      })

      // Set initial text visibility - all text blocks hidden
      const textBlocks = chapter.querySelectorAll('[data-text-block]')
      textBlocks.forEach((block) => {
        gsap.set(block, { opacity: 0, y: 20 })
      })
    })

    // Chapter 1: The Held Breath (0% - 11%)
    // Positions in chapter1.ts are PRE-SCALED to global positions
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
      // Note: Chapter timelines should have PRE-SCALED positions
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

    // Special handling for Chapter 3 -> 4 crossfade (text persists across transition)
    const chapter3Container = stage.querySelector('[data-chapter="3"]')
    const chapter4Container = stage.querySelector('[data-chapter="4"]')

    if (chapter3Container) {
      const region3 = chapterScrollRegions[3]
      const fadeDuration = 0.02

      // Chapter 3 fade in
      masterTL.to(chapter3Container, {
        opacity: 1,
        duration: fadeDuration,
        ease: 'power2.out',
      }, region3.start)

      // Add Chapter 3 timeline
      const ch3TL = createChapter3Timeline(chapter3Container as HTMLElement)
      masterTL.add(ch3TL, region3.start)

      // Chapter 3 fades out WHILE Chapter 4 fades in (crossfade)
      masterTL.to(chapter3Container, {
        opacity: 0,
        duration: fadeDuration,
        ease: 'power2.in',
      }, region3.end) // Start fade AT the boundary, not before
    }

    if (chapter4Container) {
      const region3 = chapterScrollRegions[3]
      const region4 = chapterScrollRegions[4]
      const fadeDuration = 0.02

      // Chapter 4 starts fading in AT the chapter boundary (same time as C3 fades out)
      masterTL.to(chapter4Container, {
        opacity: 1,
        duration: fadeDuration,
        ease: 'power2.out',
      }, region3.end) // Crossfade: start at same position as C3 fadeout

      // Add Chapter 4 timeline
      const ch4TL = createChapter4Timeline(chapter4Container as HTMLElement)
      masterTL.add(ch4TL, region4.start)

      // Chapter 4 fade out at end
      masterTL.to(chapter4Container, {
        opacity: 0,
        duration: fadeDuration,
        ease: 'power2.in',
      }, region4.end - fadeDuration)
    }

    // Special handling for Chapter 5 -> 6 crossfade (text persists across transition)
    const chapter5Container = stage.querySelector('[data-chapter="5"]')
    const chapter6Container = stage.querySelector('[data-chapter="6"]')

    if (chapter5Container) {
      const region5 = chapterScrollRegions[5]
      const fadeDuration = 0.02

      // Chapter 5 fade in
      masterTL.to(chapter5Container, {
        opacity: 1,
        duration: fadeDuration,
        ease: 'power2.out',
      }, region5.start)

      // Add Chapter 5 timeline
      const ch5TL = createChapter5Timeline(chapter5Container as HTMLElement)
      masterTL.add(ch5TL, region5.start)

      // Chapter 5 fades out WHILE Chapter 6 fades in (crossfade)
      masterTL.to(chapter5Container, {
        opacity: 0,
        duration: fadeDuration,
        ease: 'power2.in',
      }, region5.end) // Start fade AT the boundary, not before
    }

    if (chapter6Container) {
      const region5 = chapterScrollRegions[5]
      const region6 = chapterScrollRegions[6]
      const fadeDuration = 0.02

      // Chapter 6 starts fading in AT the chapter boundary (same time as C5 fades out)
      masterTL.to(chapter6Container, {
        opacity: 1,
        duration: fadeDuration,
        ease: 'power2.out',
      }, region5.end) // Crossfade: start at same position as C5 fadeout

      // Add Chapter 6 timeline
      const ch6TL = createChapter6Timeline(chapter6Container as HTMLElement)
      masterTL.add(ch6TL, region6.start)

      // Chapter 6 fades out WHILE Chapter 7 fades in (crossfade for persistent text)
      masterTL.to(chapter6Container, {
        opacity: 0,
        duration: fadeDuration,
        ease: 'power2.in',
      }, region6.end) // Start fade AT the boundary, not before
    }

    // Special handling for Chapter 6 -> 7 crossfade (text persists across transition)
    const chapter7Container = stage.querySelector('[data-chapter="7"]')

    if (chapter7Container) {
      const region6 = chapterScrollRegions[6]
      const region7 = chapterScrollRegions[7]
      const fadeDuration = 0.02

      // Chapter 7 starts fading in AT the chapter boundary (same time as C6 fades out)
      masterTL.to(chapter7Container, {
        opacity: 1,
        duration: fadeDuration,
        ease: 'power2.out',
      }, region6.end) // Crossfade: start at same position as C6 fadeout

      // Add Chapter 7 timeline
      const ch7TL = createChapter7Timeline(chapter7Container as HTMLElement)
      masterTL.add(ch7TL, region7.start)

      // Chapter 7 fade out at end
      masterTL.to(chapter7Container, {
        opacity: 0,
        duration: fadeDuration,
        ease: 'power2.in',
      }, region7.end - fadeDuration)
    }
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
