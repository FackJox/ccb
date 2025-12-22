/**
 * Data Module Index
 *
 * Central export for all story data.
 */

// Chapters
export {
  chapters,
  getChapter,
  getChapterForFrame,
  getChapterFromProgress,
  getProgressInChapter,
  TOTAL_CHAPTERS,
  type Chapter,
} from './chapters'

// Frames
export {
  frames,
  getFrame,
  getFramesForChapter,
  getAllLayerSources,
  TOTAL_FRAMES,
  type Frame,
  type Layer,
  type TextBlock,
} from './frames'

// Assets
export {
  sharedAssets,
  chapterAssets,
  allAssetPaths,
  getChapterAssets,
  assetDescriptions,
  TOTAL_ASSETS,
} from './assets'

// Scenes (data-driven scene configurations)
export {
  sceneConfigs,
  getSceneConfig,
  type SceneLayer,
  type SceneTextBlock,
  type SceneConfig,
} from './scenes'
