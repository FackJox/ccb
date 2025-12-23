/**
 * Derived Scroll Regions
 *
 * Calculates chapter scroll regions from content (reading times, transitions).
 * Separated from timing.ts to avoid circular dependency with scroll.ts.
 */

import type { FrameDefinition, ChapterDefinition } from '$data/chapter-definitions'
import type { SceneTextBlock } from '$data/scenes'
import { chapterDefinitions } from '$data/chapter-definitions'
import { sceneConfigs } from '$data/scenes'

// ============== BRAND DURATION TOKENS (duplicated to avoid circular import) ==============
// These match the values in timing.ts
const BRAND_DURATIONS = {
  microFast: 140,
  micro: 230,
  section: 550,
  sectionHeld: 825,
  signature: 1050,
} as const

// ============== READING TIME FORMULA ==============
const READING_BASE_MS = 500
const READING_MS_PER_WORD = 200

function calculateReadingTime(text: string): number {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  return READING_BASE_MS + wordCount * READING_MS_PER_WORD
}

// ============== TEXT OVERLAP ==============
// How much before previous text ends does next text start (ms)
// Must match the value used in chapter timelines
const TEXT_OVERLAP_MS = 800

// ============== DURATION CALCULATION ==============

/**
 * Calculate frame duration from its text content
 *
 * Uses sequential-with-overlap timing to match chapter timelines:
 * - Each text lifecycle is added to a cursor
 * - Subsequent texts start TEXT_OVERLAP_MS before previous text ends
 * - Frame duration = final cursor position + layer transition + hold
 */
function calculateFrameDuration(
  frame: FrameDefinition,
  textBlocks: SceneTextBlock[]
): number {
  let cursor = 0
  let isFirstText = true

  for (const textNum of frame.texts) {
    const block = textBlocks.find((t) => t.num === textNum)
    if (!block) continue

    const appearDur = BRAND_DURATIONS.section
    const visibleDur = block.visibleDurationMs ?? calculateReadingTime(block.content)
    const fadeDur = block.bridgesTo ? 0 : BRAND_DURATIONS.micro
    const textLifecycle = appearDur + visibleDur + fadeDur

    if (isFirstText) {
      // First text starts at cursor
      cursor += textLifecycle
      isFirstText = false
    } else {
      // Subsequent texts overlap with previous
      const textStart = cursor - TEXT_OVERLAP_MS
      const textEnd = textStart + textLifecycle
      cursor = textEnd
    }
  }

  const layerDur = frame.layerTransition ? BRAND_DURATIONS[frame.layerTransition] : 0

  return cursor + layerDur + (frame.holdAfter ?? 0)
}

/**
 * Calculate total chapter duration from frames
 *
 * Includes:
 * - Transition in from previous chapter
 * - Initial breath before content
 * - Frame durations (with sequential-with-overlap texts)
 * - Transition pauses between frames
 * - Held breath before signature moments (beat text)
 * - Transition out to next chapter
 */
function calculateChapterDuration(
  chapter: ChapterDefinition,
  textBlocks: SceneTextBlock[]
): number {
  const transIn = BRAND_DURATIONS[chapter.transitionIn]
  const transOut = BRAND_DURATIONS[chapter.transitionOut]

  // Initial breath before content starts
  let duration = transIn + BRAND_DURATIONS.section

  // Add each frame with transition pauses between
  const frameDurations = chapter.frames.map((f) => calculateFrameDuration(f, textBlocks))

  frameDurations.forEach((frameDur, i) => {
    duration += frameDur

    // Add transition pause between frames (not after last frame)
    if (i < frameDurations.length - 1) {
      duration += BRAND_DURATIONS.section
    }
  })

  // Check if chapter has beat text (signature moment) - add held breath
  const hasBeatText = textBlocks.some((t) => t.type === 'beat')
  if (hasBeatText) {
    duration += BRAND_DURATIONS.sectionHeld // held breath before beat
    duration += BRAND_DURATIONS.sectionHeld // drift after beat
  }

  // Final hold before chapter transition
  duration += BRAND_DURATIONS.section + transOut

  return duration
}

// ============== DERIVED SCROLL REGIONS ==============

/**
 * Derive scroll regions from chapter content
 * Returns regions as proportions (0-1) of total scroll
 */
export function deriveScrollRegions(): Record<number, { start: number; end: number }> {
  // Calculate all chapter durations in ms
  const durationsMs = chapterDefinitions.map((ch) =>
    calculateChapterDuration(ch, sceneConfigs[ch.id]?.textBlocks ?? [])
  )

  const totalMs = durationsMs.reduce((a, b) => a + b, 0)

  // Convert to proportions
  const regions: Record<number, { start: number; end: number }> = {}
  let cursor = 0

  durationsMs.forEach((dur, i) => {
    const proportion = dur / totalMs
    const chapterId = chapterDefinitions[i].id
    regions[chapterId] = { start: cursor, end: cursor + proportion }
    cursor += proportion
  })

  return regions
}

/**
 * Get derived total experience duration from content
 * @returns Duration in seconds
 */
export function calculateTotalDuration(): number {
  const durationsMs = chapterDefinitions.map((ch) =>
    calculateChapterDuration(ch, sceneConfigs[ch.id]?.textBlocks ?? [])
  )
  return durationsMs.reduce((a, b) => a + b, 0) / 1000
}
