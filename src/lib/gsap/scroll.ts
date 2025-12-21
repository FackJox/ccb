/**
 * ScrollSmoother Configuration
 *
 * Creates and manages the ScrollSmoother instance for smooth scrolling.
 */

import { ScrollSmoother, ScrollTrigger, gsap } from './register'

export interface ScrollSmootherConfig {
  smooth?: number
  effects?: boolean
  normalizeScroll?: boolean
  ignoreMobileResize?: boolean
}

let smootherInstance: ScrollSmoother | null = null

/**
 * Default ScrollSmoother configuration per Brand Guidelines
 */
export const defaultScrollConfig: ScrollSmootherConfig = {
  smooth: 1.2,
  effects: true,
  normalizeScroll: true,
  ignoreMobileResize: true,
}

/**
 * Create ScrollSmoother instance
 * Must be called after DOM is ready and GSAP is registered
 */
export function createScrollSmoother(
  wrapper: string | HTMLElement = '#smooth-wrapper',
  content: string | HTMLElement = '#smooth-content',
  config: ScrollSmootherConfig = {}
): ScrollSmoother {
  console.log('[createScrollSmoother] Called with:', { wrapper, content, config })

  // Kill existing instance if present
  if (smootherInstance) {
    console.log('[createScrollSmoother] Killing existing instance')
    smootherInstance.kill()
    smootherInstance = null
  }

  const mergedConfig = { ...defaultScrollConfig, ...config }
  console.log('[createScrollSmoother] Merged config:', mergedConfig)

  try {
    console.log('[createScrollSmoother] Creating ScrollSmoother.create()...')
    smootherInstance = ScrollSmoother.create({
      wrapper,
      content,
      ...mergedConfig,
    })
    console.log('[createScrollSmoother] ScrollSmoother created:', smootherInstance)
    console.log('[createScrollSmoother] smoother.wrapper():', smootherInstance?.wrapper())
    console.log('[createScrollSmoother] smoother.content():', smootherInstance?.content())
  } catch (error) {
    console.error('[createScrollSmoother] ERROR:', error)
    throw error
  }

  return smootherInstance
}

/**
 * Get current ScrollSmoother instance
 */
export function getScrollSmoother(): ScrollSmoother | null {
  return smootherInstance
}

/**
 * Kill ScrollSmoother and clean up
 */
export function killScrollSmoother(): void {
  if (smootherInstance) {
    smootherInstance.kill()
    smootherInstance = null
  }
}

/**
 * Chapter scroll regions as percentages of total scroll height
 * From design docs: Scroll-Telling Maps
 */
export const chapterScrollRegions = {
  1: { start: 0, end: 0.11 },
  2: { start: 0.11, end: 0.20 },
  3: { start: 0.20, end: 0.27 },
  4: { start: 0.27, end: 0.38 },
  5: { start: 0.38, end: 0.47 },
  6: { start: 0.47, end: 0.62 },  // L3 - Hero beat
  7: { start: 0.62, end: 0.74 },  // L3 - Heat & Tide
  8: { start: 0.74, end: 0.88 },
  9: { start: 0.88, end: 1.0 },
} as const

export type ChapterNumber = keyof typeof chapterScrollRegions

/**
 * Get chapter from scroll progress (0-1)
 */
export function getChapterFromProgress(progress: number): ChapterNumber {
  for (const [chapter, region] of Object.entries(chapterScrollRegions)) {
    if (progress >= region.start && progress < region.end) {
      return parseInt(chapter) as ChapterNumber
    }
  }
  return 9 // Default to last chapter
}

/**
 * Get scroll progress within a specific chapter (0-1)
 */
export function getProgressWithinChapter(
  globalProgress: number,
  chapter: ChapterNumber
): number {
  const region = chapterScrollRegions[chapter]
  const chapterLength = region.end - region.start
  const progressInChapter = (globalProgress - region.start) / chapterLength
  return Math.max(0, Math.min(1, progressInChapter))
}

/**
 * Create ScrollTrigger for a chapter
 */
export function createChapterTrigger(
  chapter: ChapterNumber,
  trigger: string | HTMLElement,
  callbacks?: {
    onEnter?: () => void
    onLeave?: () => void
    onEnterBack?: () => void
    onLeaveBack?: () => void
    onUpdate?: (self: ScrollTrigger) => void
  }
): ScrollTrigger {
  const region = chapterScrollRegions[chapter]

  return ScrollTrigger.create({
    trigger,
    start: `top+=${region.start * 100}% top`,
    end: `top+=${region.end * 100}% top`,
    ...callbacks,
  })
}

/**
 * Refresh all ScrollTriggers
 * Call after layout changes
 */
export function refreshScrollTriggers(): void {
  ScrollTrigger.refresh()
}

/**
 * Kill all ScrollTriggers
 */
export function killAllScrollTriggers(): void {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
}

/**
 * Set scroll position by progress (0-1)
 */
export function scrollToProgress(progress: number, duration = 0): void {
  if (smootherInstance) {
    // Use ScrollTrigger.maxScroll() static method with window as scroller
    const maxScroll = ScrollTrigger.maxScroll(window)
    gsap.to(smootherInstance, {
      scrollTop: maxScroll * progress,
      duration,
      ease: 'power2.inOut',
    })
  }
}

/**
 * Set scroll position to chapter start
 */
export function scrollToChapter(chapter: ChapterNumber, duration = 0.5): void {
  const region = chapterScrollRegions[chapter]
  scrollToProgress(region.start, duration)
}
