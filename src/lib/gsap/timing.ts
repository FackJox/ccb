/**
 * Time-Based Scroll Timing
 *
 * All timing defined in milliseconds matching design docs.
 * Single conversion function transforms ms → scroll proportion.
 */

// ============== EXPERIENCE DURATION ==============
// The canonical "perfect reading pace" - will be DERIVED from content later
// Initially set manually based on design estimate
export const PERFECT_DURATION_SECONDS = 90

// ============== BRAND DURATION TOKENS (from design docs) ==============
export const BRAND_DURATIONS = {
  // Micro-interactions (120-160ms fast, 200-260ms normal)
  microFast: 140,
  micro: 230,

  // Content/section transitions (450-650ms)
  section: 550,

  // Held breath moments (750-900ms)
  sectionHeld: 825,

  // Signature moments (900-1200ms)
  signature: 1050,
} as const

export type BrandDurationKey = keyof typeof BRAND_DURATIONS

// ============== READING TIME FORMULA ==============
const READING_BASE_MS = 500 // Minimum visibility for any text
const READING_MS_PER_WORD = 200 // ~300 WPM comfortable reading

/**
 * Calculate reading time for text content
 * @param text - The text content to calculate reading time for
 * @returns Duration in milliseconds
 */
export function calculateReadingTime(text: string): number {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  return READING_BASE_MS + wordCount * READING_MS_PER_WORD
}

// ============== SCROLL SPEED ==============
// Comfortable reading scroll speed (research: 50-80px/s)
const COMFORTABLE_SCROLL_SPEED = 65 // px/s

// Target scroll distance in pixels
export const TARGET_SCROLL_DISTANCE = PERFECT_DURATION_SECONDS * COMFORTABLE_SCROLL_SPEED

// ============== CORE CONVERSION ==============
/**
 * Convert milliseconds to scroll proportion (0-1)
 * @param ms - Duration in milliseconds
 * @returns Proportion of total scroll (0-1)
 */
export function timeToScroll(ms: number): number {
  return ms / 1000 / PERFECT_DURATION_SECONDS
}

/**
 * Convert scroll proportion back to milliseconds
 * @param scrollProportion - Proportion of total scroll (0-1)
 * @returns Duration in milliseconds
 */
export function scrollToTime(scrollProportion: number): number {
  return scrollProportion * PERFECT_DURATION_SECONDS * 1000
}

// ============== CHAPTER TIMING HELPERS ==============

/**
 * Temporary import - will be replaced when scroll regions become derived
 */
import { chapterScrollRegions, type ChapterNumber } from './scroll'

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
