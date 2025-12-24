/**
 * Asset Definitions
 *
 * Paths and metadata for all visual assets.
 */

const ASSET_BASE = '/assets'

/**
 * Curtain assets for intro reveal
 */
export const curtainAssets = {
  upper: `${ASSET_BASE}/curtain/upper-curtain.png`,
  left: `${ASSET_BASE}/curtain/left-curtain.png`,
  right: `${ASSET_BASE}/curtain/right-curtain.png`,
} as const

/**
 * Shared assets used across multiple chapters
 */
export const sharedAssets = {
  fg: {
    coupleCloseup: `${ASSET_BASE}/shared/fg/couple-closeup.png`,
    coupleStanding: `${ASSET_BASE}/shared/fg/couple-standing.png`,
    mirrorIntact: `${ASSET_BASE}/shared/fg/mirror-intact.png`,
    mirrorBroken: `${ASSET_BASE}/shared/fg/mirror-broken.png`,
  },
  bg: {
    exteriorWindowsSilhouette: `${ASSET_BASE}/shared/bg/exterior-windows-silhouette.png`,
  },
} as const

/**
 * Chapter-specific assets
 */
export const chapterAssets = {
  C1: {
    bg: `${ASSET_BASE}/C1/C1BG.png`,
    fg1: `${ASSET_BASE}/C1/C1FG1.png`,
    fg2: `${ASSET_BASE}/C1/C1FG2.png`,
  },
  C2: {
    bg: `${ASSET_BASE}/C2/C2BG.png`,
    fg1: `${ASSET_BASE}/C2/C2FG1.png`,
  },
  C3: {
    bg: `${ASSET_BASE}/C3/C3BG.png`,
    fg: `${ASSET_BASE}/C3/C3FG.png`,
  },
  C4: {
    bg: `${ASSET_BASE}/C4/C4BG.png`,
  },
  C5: {
    bg: `${ASSET_BASE}/C5/C5BG.png`,
    bg2: `${ASSET_BASE}/C5/C5BG2.png`,
    fg1: `${ASSET_BASE}/C5/C5FG1.png`,
  },
  C7: {
    bg: `${ASSET_BASE}/C7/C7BG.png`,
    bg2: `${ASSET_BASE}/C7/C7BG2.png`,
  },
  C8: {
    bg: `${ASSET_BASE}/C8/C8BG.png`,
    bg2: `${ASSET_BASE}/C8/C8BG2.png`,
    bg3: `${ASSET_BASE}/C8/C8BG3.png`,
  },
  C9: {
    bg: `${ASSET_BASE}/C9/C9BG.png`,
    fg: `${ASSET_BASE}/C9/C9FG.png`,
    bg2: `${ASSET_BASE}/C9/C9BG2.png`,
    bg3: `${ASSET_BASE}/C9/C9BG3.png`,
  },
} as const

/**
 * All unique asset paths for preloading
 */
export const allAssetPaths: string[] = [
  // Curtain (preload first for intro)
  curtainAssets.upper,
  curtainAssets.left,
  curtainAssets.right,
  // Shared foregrounds
  sharedAssets.fg.coupleCloseup,
  sharedAssets.fg.coupleStanding,
  sharedAssets.fg.mirrorIntact,
  sharedAssets.fg.mirrorBroken,
  // Shared backgrounds
  sharedAssets.bg.exteriorWindowsSilhouette,
  // Chapter 1
  chapterAssets.C1.bg,
  chapterAssets.C1.fg1,
  chapterAssets.C1.fg2,
  // Chapter 2
  chapterAssets.C2.bg,
  chapterAssets.C2.fg1,
  // Chapter 3
  chapterAssets.C3.bg,
  chapterAssets.C3.fg,
  // Chapter 4
  chapterAssets.C4.bg,
  // Chapter 5
  chapterAssets.C5.bg,
  chapterAssets.C5.bg2,
  chapterAssets.C5.fg1,
  // Chapter 7
  chapterAssets.C7.bg,
  chapterAssets.C7.bg2,
  // Chapter 8
  chapterAssets.C8.bg,
  chapterAssets.C8.bg2,
  chapterAssets.C8.bg3,
  // Chapter 9
  chapterAssets.C9.bg,
  chapterAssets.C9.fg,
  chapterAssets.C9.bg2,
  chapterAssets.C9.bg3,
]

/**
 * Total asset count
 */
export const TOTAL_ASSETS = allAssetPaths.length

/**
 * Get assets for a specific chapter
 */
export function getChapterAssets(chapterNumber: number): string[] {
  const key = `C${chapterNumber}` as keyof typeof chapterAssets
  const assets = chapterAssets[key]
  if (!assets) return []
  return Object.values(assets)
}

/**
 * Asset descriptions for accessibility
 */
export const assetDescriptions: Record<string, string> = {
  [sharedAssets.fg.coupleCloseup]: 'Ceci & Jack dancing embrace (closeup)',
  [sharedAssets.fg.coupleStanding]: 'Ceci & Jack standing/pointing pose',
  [sharedAssets.fg.mirrorIntact]: 'Ornate gold mirror (intact)',
  [sharedAssets.fg.mirrorBroken]: 'Ornate gold mirror (shattered)',
  [sharedAssets.bg.exteriorWindowsSilhouette]: 'Building exterior with purple windows, dancing silhouette, crowd below',
  [chapterAssets.C1.bg]: 'Room interior with large window',
  [chapterAssets.C1.fg1]: 'Ceci sitting/kneeling in purple dress',
  [chapterAssets.C1.fg2]: 'Jack standing with violin',
  [chapterAssets.C2.bg]: 'Dark room interior with arches',
  [chapterAssets.C2.fg1]: 'Couple at table with sheet music',
  [chapterAssets.C3.bg]: 'Ballroom wide view with chandelier',
  [chapterAssets.C3.fg]: 'Couple in dramatic dip pose',
  [chapterAssets.C4.bg]: 'Ballroom corner with ornate wall',
  [chapterAssets.C5.bg]: 'Square scene with arched building',
  [chapterAssets.C5.bg2]: 'Night street with market stalls',
  [chapterAssets.C5.fg1]: 'Soldier boots/legs',
  [chapterAssets.C7.bg]: 'Dancing crowd in square',
  [chapterAssets.C7.bg2]: 'Interior with windows showing crowd outside',
  [chapterAssets.C8.bg]: 'Street scene with soldiers and crowd',
  [chapterAssets.C8.bg2]: 'Dancing crowd closeup',
  [chapterAssets.C8.bg3]: 'Night interior looking out at street',
  [chapterAssets.C9.bg]: 'Dawn room interior',
  [chapterAssets.C9.fg]: 'Couple holding brooms, intimate pose',
  [chapterAssets.C9.bg2]: 'Abandoned room with CJ on door',
  [chapterAssets.C9.bg3]: 'Brooms and purple cloth on floor',
}
