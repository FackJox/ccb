/**
 * GSAP Module Index
 *
 * Central export point for all GSAP-related functionality.
 */

// Registration
export {
  registerGSAP,
  isGSAPRegistered,
  gsap,
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  brandEasing,
  brandEase,
  brandDurations,
} from './register'

// Scroll management
export {
  createScrollSmoother,
  getScrollSmoother,
  killScrollSmoother,
  chapterScrollRegions,
  getChapterFromProgress,
  getProgressWithinChapter,
  createChapterTrigger,
  refreshScrollTriggers,
  killAllScrollTriggers,
  scrollToProgress,
  scrollToChapter,
  type ChapterNumber,
  type ScrollSmootherConfig,
} from './scroll'

// Animation factories
export {
  fadeIn,
  fadeOut,
  crossfade,
  slideIn,
  parallaxLayer,
  fgSwap,
  violetGlow,
  textStagger,
  typographyBeat,
  violetLensMask,
  crowdBreathe,
  consentHoverIn,
  consentHoverOut,
  createChapterTimeline,
  type ComplexityLevel,
} from './animations'
