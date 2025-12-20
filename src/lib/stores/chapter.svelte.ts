/**
 * Chapter Store
 *
 * Reactive chapter state derived from scroll position.
 */

import { chapters, getChapter, type Chapter } from '$data'

// Active chapter state
let activeChapterId = $state(1)
let previousChapterId = $state(1)

/**
 * Set active chapter by ID
 */
export function setActiveChapter(id: number): void {
  if (id !== activeChapterId && id >= 1 && id <= chapters.length) {
    previousChapterId = activeChapterId
    activeChapterId = id
  }
}

/**
 * Get active chapter
 */
export function getActiveChapter(): Chapter {
  return getChapter(activeChapterId) ?? chapters[0]
}

/**
 * Get previous chapter (for transition direction)
 */
export function getPreviousChapter(): Chapter {
  return getChapter(previousChapterId) ?? chapters[0]
}

/**
 * Get active chapter ID
 */
export function getActiveChapterId(): number {
  return activeChapterId
}

/**
 * Check if scrolling forward (to higher chapter)
 */
export function isScrollingForward(): boolean {
  return activeChapterId > previousChapterId
}

/**
 * Get transition direction
 */
export function getTransitionDirection(): 'forward' | 'backward' | 'none' {
  if (activeChapterId > previousChapterId) return 'forward'
  if (activeChapterId < previousChapterId) return 'backward'
  return 'none'
}

/**
 * Create reactive chapter state
 */
export function createChapterState() {
  return {
    get id() { return activeChapterId },
    get previousId() { return previousChapterId },
    get chapter() { return getChapter(activeChapterId) ?? chapters[0] },
    get previousChapter() { return getChapter(previousChapterId) ?? chapters[0] },
    get isFirst() { return activeChapterId === 1 },
    get isLast() { return activeChapterId === chapters.length },
    get direction() { return getTransitionDirection() },
    get totalChapters() { return chapters.length },
  }
}

/**
 * Navigate to next chapter
 */
export function nextChapter(): boolean {
  if (activeChapterId < chapters.length) {
    setActiveChapter(activeChapterId + 1)
    return true
  }
  return false
}

/**
 * Navigate to previous chapter
 */
export function prevChapter(): boolean {
  if (activeChapterId > 1) {
    setActiveChapter(activeChapterId - 1)
    return true
  }
  return false
}

/**
 * Reset to first chapter
 */
export function resetChapter(): void {
  previousChapterId = 1
  activeChapterId = 1
}
