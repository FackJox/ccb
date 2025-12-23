/**
 * Time-Based Scroll Timing
 *
 * Chapter timing helpers that depend on scroll regions.
 * Base constants are in timing-constants.ts to avoid circular deps.
 */

import { gsap, brandEase } from './register'
import { chapterScrollRegions, type ChapterNumber } from './scroll'

// Re-export base values from timing-constants
export {
  BRAND_DURATIONS,
  type BrandDurationKey,
  calculateReadingTime,
  TARGET_SCROLL_DISTANCE,
} from './timing-constants'

import { BRAND_DURATIONS } from './timing-constants'

// Re-export from derive-regions
export { deriveScrollRegions, calculateTotalDuration } from './derive-regions'

import { calculateTotalDuration } from './derive-regions'

// ============== DERIVED EXPERIENCE DURATION ==============
// Computed from actual content, memoized for performance
let _derivedDurationSeconds: number | null = null

/**
 * Get the total experience duration in seconds, derived from content
 * Memoized to avoid recalculation
 */
export function getDerivedDurationSeconds(): number {
  if (_derivedDurationSeconds === null) {
    _derivedDurationSeconds = calculateTotalDuration()
    console.log('[timing] Derived total duration:', _derivedDurationSeconds, 'seconds')
  }
  return _derivedDurationSeconds
}

// For backwards compatibility - this is now derived from content
export const PERFECT_DURATION_SECONDS = 90 // Legacy value, use getDerivedDurationSeconds() instead

// ============== CORE CONVERSION (using derived duration) ==============
/**
 * Convert milliseconds to scroll proportion (0-1)
 * Uses the derived total duration from content
 * @param ms - Duration in milliseconds
 * @returns Proportion of total scroll (0-1)
 */
export function timeToScroll(ms: number): number {
  return ms / 1000 / getDerivedDurationSeconds()
}

/**
 * Convert scroll proportion back to milliseconds
 * Uses the derived total duration from content
 * @param scrollProportion - Proportion of total scroll (0-1)
 * @returns Duration in milliseconds
 */
export function scrollToTime(scrollProportion: number): number {
  return scrollProportion * getDerivedDurationSeconds() * 1000
}

// ============== CHAPTER TIMING HELPERS ==============

export interface ChapterTimingHelpers {
  /** Convert ms to chapter-relative scroll proportion */
  dur: (ms: number) => number
  /** Convert cumulative ms to chapter-relative position (0-1) */
  pos: (cumulativeMs: number) => number
  /** The chapter's scroll span as proportion of total */
  chapterScrollSpan: number
}

/**
 * Create timing helpers for a specific chapter
 * Converts milliseconds to chapter-relative scroll proportions
 *
 * @param chapterId - The chapter number (1-9)
 * @returns Timing helper functions
 */
export function createChapterTimingHelpers(chapterId: ChapterNumber): ChapterTimingHelpers {
  const region = chapterScrollRegions[chapterId]
  const chapterScrollSpan = region.end - region.start

  const dur = (ms: number): number => {
    const globalProportion = timeToScroll(ms)
    return globalProportion / chapterScrollSpan
  }

  const pos = (cumulativeMs: number): number => {
    return timeToScroll(cumulativeMs) / chapterScrollSpan
  }

  return { dur, pos, chapterScrollSpan }
}

// ============== TEXT LIFECYCLE ==============

export interface TextLifecycleOptions {
  /** Cumulative ms from chapter start when text appears */
  appearAtMs: number
  /** Duration of appear animation in ms (default: BRAND_DURATIONS.section) */
  appearDurMs?: number
  /** Duration text stays visible in ms (from reading time or override) */
  visibleDurMs: number
  /** Duration of fade out in ms (default: BRAND_DURATIONS.micro) */
  fadeDurMs?: number
  /** Vertical drift in pixels while visible */
  drift: number
  /** Skip fade out (for bridging texts that persist to next chapter) */
  skipFade?: boolean
}

/**
 * Add text lifecycle animation (appear → drift → fade)
 *
 * Supports two positioning modes:
 * 1. Time-based (ms): Uses opts.appearAtMs with helpers to convert to proportions
 * 2. Proportion-based: Uses positionOverride/durationOverride for direct control
 *
 * @param tl - The GSAP timeline to add animations to
 * @param target - The DOM element to animate
 * @param opts - Lifecycle options
 * @param helpers - Chapter timing helpers
 * @param positionOverride - Optional: chapter-relative position (0-1) to start appear
 * @param durationOverride - Optional: chapter-relative duration (0-1) for visibility
 * @returns End time in ms for sequencing next element (only valid for time-based mode)
 */
export function addTextLifecycle(
  tl: gsap.core.Timeline,
  target: Element,
  opts: TextLifecycleOptions,
  helpers: ChapterTimingHelpers,
  positionOverride?: number,
  durationOverride?: number
): number {
  const { dur, pos } = helpers

  const appearDur = opts.appearDurMs ?? BRAND_DURATIONS.section
  const fadeDur = opts.skipFade ? 0 : (opts.fadeDurMs ?? BRAND_DURATIONS.micro)

  // Determine positioning mode
  const useProportions = positionOverride !== undefined

  // Calculate positions - either from ms or from direct proportions
  const appearPos = useProportions ? positionOverride : pos(opts.appearAtMs)
  const appearDurProp = useProportions ? 0.03 : dur(appearDur) // 3% of chapter for appear
  const visibleDurProp = durationOverride ?? dur(opts.visibleDurMs)
  const fadeDurProp = opts.skipFade ? 0 : (useProportions ? 0.02 : dur(fadeDur))

  // Appear
  tl.fromTo(
    target,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: appearDurProp, ease: brandEase.enter },
    appearPos
  )

  // Drift while visible
  if (visibleDurProp > 0) {
    tl.to(
      target,
      {
        y: opts.drift,
        duration: visibleDurProp,
        ease: 'none',
      },
      appearPos + appearDurProp
    )
  }

  // Fade out (unless bridging)
  if (!opts.skipFade) {
    tl.to(
      target,
      {
        opacity: 0,
        duration: fadeDurProp,
        ease: brandEase.exit,
      },
      appearPos + appearDurProp + visibleDurProp
    )
  }

  return opts.appearAtMs + appearDur + opts.visibleDurMs + fadeDur
}
