/**
 * Chapter Definitions
 *
 * Metadata and scroll regions for each chapter.
 */

import type { ComplexityLevel } from '$gsap'

export interface Chapter {
  id: number
  title: string
  subtitle: string
  frames: string[]
  scrollRegion: {
    start: number  // 0-1
    end: number    // 0-1
  }
  complexity: ComplexityLevel
}

export const chapters: Chapter[] = [
  {
    id: 1,
    title: 'The Held Breath',
    subtitle: 'Ceci claims the confiscated hôtel hallway',
    frames: ['1A', '1B', '1C'],
    scrollRegion: { start: 0, end: 0.11 },
    complexity: 'L2',
  },
  {
    id: 2,
    title: 'The Offer',
    subtitle: 'Ink, sheet music, "Will you follow?"',
    frames: ['2A', '2B'],
    scrollRegion: { start: 0.11, end: 0.20 },
    complexity: 'L2',
  },
  {
    id: 3,
    title: 'Consent as Choreography',
    subtitle: 'Hover, nod, first steps',
    frames: ['3A', '3B'],
    scrollRegion: { start: 0.20, end: 0.27 },
    complexity: 'L2',
  },
  {
    id: 4,
    title: 'The Crack',
    subtitle: 'Mirror shatter & call to the city',
    frames: ['4A', '4B'],
    scrollRegion: { start: 0.27, end: 0.38 },
    complexity: 'L2',
  },
  {
    id: 5,
    title: 'Authority Enters',
    subtitle: 'Boots in the square',
    frames: ['5A', '5B', '5C', '5D'],
    scrollRegion: { start: 0.38, end: 0.47 },
    complexity: 'L1',
  },
  {
    id: 6,
    title: 'Violet Window',
    subtitle: 'Phantom stage silhouette (Hero Beat)',
    frames: ['6A', '6B', '6C', '6D', '6E'],
    scrollRegion: { start: 0.47, end: 0.62 },
    complexity: 'L3',
  },
  {
    id: 7,
    title: 'Heat & Tide',
    subtitle: '"Follow Me," "Always," Crowd vs Patrol',
    frames: ['7A', '7B', '7C', '7D'],
    scrollRegion: { start: 0.62, end: 0.74 },
    complexity: 'L3',
  },
  {
    id: 8,
    title: 'Release',
    subtitle: 'Final note, city exhale, shared breath in the dark',
    frames: ['8A', '8B', '8C', '8D', '8E'],
    scrollRegion: { start: 0.74, end: 0.88 },
    complexity: 'L2',
  },
  {
    id: 9,
    title: 'Residue & Dawn',
    subtitle: 'Glass, ribbon, marked door, dawn hold',
    frames: ['9A', '9B', '9C', '9D'],
    scrollRegion: { start: 0.88, end: 1.0 },
    complexity: 'L2',
  },
]

/**
 * Get chapter by ID
 */
export function getChapter(id: number): Chapter | undefined {
  return chapters.find(c => c.id === id)
}

/**
 * Get chapter containing a specific frame
 */
export function getChapterForFrame(frameId: string): Chapter | undefined {
  return chapters.find(c => c.frames.includes(frameId))
}

/**
 * Get chapter from scroll progress (0-1)
 */
export function getChapterFromProgress(progress: number): Chapter {
  for (const chapter of chapters) {
    if (progress >= chapter.scrollRegion.start && progress < chapter.scrollRegion.end) {
      return chapter
    }
  }
  return chapters[chapters.length - 1]
}

/**
 * Get progress within chapter (0-1)
 */
export function getProgressInChapter(globalProgress: number, chapter: Chapter): number {
  const { start, end } = chapter.scrollRegion
  const length = end - start
  return Math.max(0, Math.min(1, (globalProgress - start) / length))
}

/**
 * Total number of chapters
 */
export const TOTAL_CHAPTERS = chapters.length

/**
 * Total number of frames across all chapters
 */
export const TOTAL_FRAMES = chapters.reduce((sum, c) => sum + c.frames.length, 0)
