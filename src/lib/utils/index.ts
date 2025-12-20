/**
 * Utils Index
 */

export {
  REFERENCE_WIDTH,
  REFERENCE_HEIGHT,
  REFERENCE_ASPECT,
  isLandscape,
  isPortrait,
  calculateScale,
  getViewportSize,
  getViewportAspect,
  isMobile,
  isIOS,
  isAndroid,
  lockLandscape,
  unlockOrientation,
  onOrientationChange,
  onViewportResize,
} from './viewport'

export {
  preloadImage,
  preloadImages,
  preloadImagesSequential,
  preloadImagesBatched,
  isImageCached,
  getUncachedImages,
  preloadWithPriority,
  type PreloadProgress,
  type ProgressCallback,
} from './preload'
