/**
 * Scroll Progress Store
 *
 * Reactive scroll state using Svelte 5 runes.
 */

import { getChapterFromProgress, type Chapter } from '$data'

// Global scroll state
let scrollProgress = $state(0)
let scrollVelocity = $state(0)
let isScrolling = $state(false)

/**
 * Update scroll progress (0-1)
 */
export function setScrollProgress(progress: number): void {
  const clamped = Math.max(0, Math.min(1, progress))
  scrollVelocity = clamped - scrollProgress
  scrollProgress = clamped
}

/**
 * Set scrolling state
 */
export function setIsScrolling(value: boolean): void {
  isScrolling = value
}

/**
 * Get current scroll progress (0-1)
 */
export function getScrollProgress(): number {
  return scrollProgress
}

/**
 * Get scroll velocity (change per frame)
 */
export function getScrollVelocity(): number {
  return scrollVelocity
}

/**
 * Check if currently scrolling
 */
export function getIsScrolling(): boolean {
  return isScrolling
}

/**
 * Get current chapter based on scroll position
 */
export function getCurrentChapter(): Chapter {
  return getChapterFromProgress(scrollProgress)
}

/**
 * Create a reactive scroll state object
 * Use this in components for reactive updates
 */
export function createScrollState() {
  return {
    get progress() { return scrollProgress },
    get velocity() { return scrollVelocity },
    get isScrolling() { return isScrolling },
    get chapter() { return getChapterFromProgress(scrollProgress) },
    get chapterProgress() {
      const chapter = getChapterFromProgress(scrollProgress)
      const { start, end } = chapter.scrollRegion
      return (scrollProgress - start) / (end - start)
    },
  }
}

/**
 * Reset scroll state
 */
export function resetScrollState(): void {
  scrollProgress = 0
  scrollVelocity = 0
  isScrolling = false
}
