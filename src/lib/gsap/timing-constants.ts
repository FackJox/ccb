/**
 * Timing Constants
 *
 * Brand duration tokens and conversion utilities.
 * Base module with no dependencies on scroll or chapter regions.
 */

// ============== EXPERIENCE DURATION ==============
// Derived from actual content (reading times + transitions)
// This keeps timeToScroll() in sync with derive-regions proportions
import { calculateTotalDuration } from './derive-regions'
export const PERFECT_DURATION_SECONDS = calculateTotalDuration()

// ============== SCROLL SPEED MULTIPLIER ==============
// Controls how much scrolling is needed. Higher = slower scroll experience.
// 1 = baseline, 4 = 4x more scrolling required
const SCROLL_MULTIPLIER = 4

// ============== SCROLL DISTANCE ==============
// Base: 90 seconds of content = 700vh at natural pace
const BASE_VH_PER_SECOND = 700 / 90 // ≈ 7.78
export const SCROLL_DISTANCE_VH = Math.round(PERFECT_DURATION_SECONDS * BASE_VH_PER_SECOND * SCROLL_MULTIPLIER)

// DEBUG
console.log('[TimingConstants] PERFECT_DURATION_SECONDS:', PERFECT_DURATION_SECONDS)
console.log('[TimingConstants] SCROLL_MULTIPLIER:', SCROLL_MULTIPLIER)
console.log('[TimingConstants] SCROLL_DISTANCE_VH:', SCROLL_DISTANCE_VH)

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
const READING_BASE_MS = 1000 // Minimum visibility (higher = short texts stay longer)
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
