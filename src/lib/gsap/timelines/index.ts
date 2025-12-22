/**
 * Chapter Timelines Index
 *
 * Export all chapter timeline factories.
 * Each chapter contributes its animations to the master timeline.
 */

// Chapter 1: The Held Breath
export {
  createChapter1Timeline,
  CHAPTER_1_DURATION,
  CHAPTER_1_START,
  CHAPTER_1_SNAP_POINTS,
  getChapter1GlobalSnapPoints,
} from './chapter1'

// Chapter 2: The Offer
export {
  createChapter2Timeline,
  CHAPTER_2_DURATION,
  CHAPTER_2_START,
} from './chapter2'

// Chapter 3: Consent as Choreography
export {
  createChapter3Timeline,
  CHAPTER_3_DURATION,
  CHAPTER_3_START,
} from './chapter3'

// Chapter 4: The Crack
export {
  createChapter4Timeline,
  CHAPTER_4_DURATION,
  CHAPTER_4_START,
} from './chapter4'

// Chapter 5: Authority Enters
export {
  createChapter5Timeline,
  CHAPTER_5_DURATION,
  CHAPTER_5_START,
} from './chapter5'

// Chapter 6: Violet Window (L3 Hero)
export {
  createChapter6Timeline,
  CHAPTER_6_DURATION,
  CHAPTER_6_START,
} from './chapter6'

// Chapter 7: Heat & Tide (L3)
export {
  createChapter7Timeline,
  CHAPTER_7_DURATION,
  CHAPTER_7_START,
} from './chapter7'

// Chapter 8: Release (L2)
export {
  createChapter8Timeline,
  CHAPTER_8_DURATION,
  CHAPTER_8_START,
} from './chapter8'

// Placeholder exports for future chapters

export function createChapter9Timeline(_container: HTMLElement): gsap.core.Timeline {
  // TODO: Implement Chapter 9 - Residue & Dawn
  return gsap.timeline()
}

// Import gsap for placeholder timelines
import { gsap } from '../register'
