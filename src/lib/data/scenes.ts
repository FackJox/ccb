/**
 * Scene Definitions
 *
 * Data-driven configuration for each chapter's scene composition.
 * Defines layers, text blocks, and positions - timelines handle animation timing.
 */

import { chapterAssets, sharedAssets, assetDescriptions } from './assets'

/**
 * Layer definition for scene composition
 */
export interface SceneLayer {
  id: string           // GSAP target: data-layer="id"
  src: string          // Image source path
  alt: string          // Accessibility description
  type: 'bg' | 'fg'    // Layer type
  position: {
    // CSS positioning
    anchor: 'left' | 'right' | 'center'
    bottom?: boolean   // Align to bottom (for characters)
    offset?: string    // CSS offset from anchor (e.g., '5%')
  }
  size: {
    height?: string    // CSS height (e.g., '65%', '100%')
    width?: string     // CSS width (e.g., 'auto', '100%')
  }
  zIndex: number
  initialOpacity?: number  // Default 0 for fg, 1 for bg
  initialScale?: number    // For subtle scale animations
}

/**
 * Text block definition
 */
export interface SceneTextBlock {
  num: number          // GSAP target: data-text-block="num"
  content: string
  type: 'fragment' | 'beat' | 'consent'
  style: 'parchment' | 'transparent' | 'beat'
  emphasis?: boolean   // Bold styling
}

/**
 * Complete scene configuration for a chapter
 */
export interface SceneConfig {
  chapterId: number
  layers: SceneLayer[]
  textBlocks: SceneTextBlock[]
}

/**
 * Scene configurations for all chapters
 */
export const sceneConfigs: Record<number, SceneConfig> = {
  // ============== CHAPTER 1: The Held Breath ==============
  1: {
    chapterId: 1,
    layers: [
      {
        id: 'bg',
        src: chapterAssets.C1.bg,
        alt: assetDescriptions[chapterAssets.C1.bg],
        type: 'bg',
        position: { anchor: 'center' },
        size: { width: '100%', height: '100%' },
        zIndex: 0,
        initialOpacity: 1,
      },
      {
        id: 'ceci',
        src: chapterAssets.C1.fg1,
        alt: assetDescriptions[chapterAssets.C1.fg1],
        type: 'fg',
        position: { anchor: 'left', bottom: true, offset: '5%' },
        size: { height: '65%' },
        zIndex: 1,
        initialOpacity: 0,
        initialScale: 1.02,
      },
      {
        id: 'jack',
        src: chapterAssets.C1.fg2,
        alt: assetDescriptions[chapterAssets.C1.fg2],
        type: 'fg',
        position: { anchor: 'right', bottom: true, offset: '8%' },
        size: { height: '60%' },
        zIndex: 2,
        initialOpacity: 0,
      },
    ],
    textBlocks: [
      // Frame A texts (parchment style)
      {
        num: 1,
        content: 'The violin faltered once, a heartbeat snag, as Ceci dared the room to breathe with her.',
        type: 'fragment',
        style: 'parchment',
      },
      {
        num: 2,
        content: 'In the lamplight, flour still ghosted her wrists from the bakery below, and lilac silk clung damp at the hem.',
        type: 'fragment',
        style: 'parchment',
      },
      {
        num: 3,
        content: 'She lifted her chin—three-count nested in the pause—and the people lining the confiscated hôtel hallway forgot to blink.',
        type: 'fragment',
        style: 'parchment',
      },
      // Frame B texts (parchment style)
      {
        num: 4,
        content: "From the corner, where a restless lantern cluster hissed, Jack recognized the rhythm she'd been humming through the market streets.",
        type: 'fragment',
        style: 'parchment',
      },
      {
        num: 5,
        content: 'He knew it before he knew her name. He knew it the way a city knows rain.',
        type: 'fragment',
        style: 'parchment',
        emphasis: true,
      },
      // Frame C texts (transparent style)
      {
        num: 6,
        content: 'They were supposed to be alone, "rehearsing," though that word had become a lie.',
        type: 'fragment',
        style: 'transparent',
      },
      {
        num: 7,
        content: 'Neighbors gathered at the edges of the hall. Windows faced the square—too exposed, too dangerous—',
        type: 'fragment',
        style: 'transparent',
      },
      // Beat text
      {
        num: 8,
        content: 'Let them look. Let the city breathe again.',
        type: 'beat',
        style: 'beat',
      },
    ],
  },

  // ============== CHAPTER 2: The Offer ==============
  2: {
    chapterId: 2,
    layers: [
      {
        id: 'bg',
        src: chapterAssets.C2.bg,
        alt: assetDescriptions[chapterAssets.C2.bg],
        type: 'bg',
        position: { anchor: 'center' },
        size: { width: '100%', height: '100%' },
        zIndex: 0,
        initialOpacity: 1,
      },
      {
        id: 'couple',
        src: chapterAssets.C2.fg1,
        alt: assetDescriptions[chapterAssets.C2.fg1],
        type: 'fg',
        position: { anchor: 'center', bottom: true },
        size: { height: '70%' },
        zIndex: 1,
        initialOpacity: 0,
      },
    ],
    textBlocks: [
      {
        num: 1,
        content: 'Jack set it down, unwound twine, revealed sheets scored thick with ink. "I wrote a pivot," he said. "A melody that asks for a different lead."',
        type: 'fragment',
        style: 'parchment',
      },
      {
        num: 2,
        content: 'Ceci studied the marks as if the music could bruise. Jack watched her read. When she looked up, the room changed temperature.',
        type: 'fragment',
        style: 'parchment',
      },
      {
        num: 3,
        content: "Consent lives in small sentences. She tipped her head, that chin-lift she didn't know she'd made in a hundred lives, and he answered by holding out his embrace.",
        type: 'fragment',
        style: 'parchment',
      },
      {
        num: 4,
        content: '"Will you follow?" he asked.',
        type: 'consent',
        style: 'beat',
      },
    ],
  },

  // Placeholder configs for remaining chapters
  // These will be filled in as each chapter is implemented
  3: {
    chapterId: 3,
    layers: [
      {
        id: 'bg',
        src: chapterAssets.C3.bg,
        alt: assetDescriptions[chapterAssets.C3.bg],
        type: 'bg',
        position: { anchor: 'center' },
        size: { width: '100%', height: '100%' },
        zIndex: 0,
        initialOpacity: 1,
      },
    ],
    textBlocks: [],
  },

  4: {
    chapterId: 4,
    layers: [
      {
        id: 'bg',
        src: chapterAssets.C4.bg,
        alt: assetDescriptions[chapterAssets.C4.bg],
        type: 'bg',
        position: { anchor: 'center' },
        size: { width: '100%', height: '100%' },
        zIndex: 0,
        initialOpacity: 1,
      },
    ],
    textBlocks: [],
  },

  5: {
    chapterId: 5,
    layers: [
      {
        id: 'bg',
        src: chapterAssets.C5.bg,
        alt: assetDescriptions[chapterAssets.C5.bg],
        type: 'bg',
        position: { anchor: 'center' },
        size: { width: '100%', height: '100%' },
        zIndex: 0,
        initialOpacity: 1,
      },
    ],
    textBlocks: [],
  },

  6: {
    chapterId: 6,
    layers: [
      {
        id: 'bg',
        src: chapterAssets.C4.bg, // Reuses C4 bg
        alt: assetDescriptions[chapterAssets.C4.bg],
        type: 'bg',
        position: { anchor: 'center' },
        size: { width: '100%', height: '100%' },
        zIndex: 0,
        initialOpacity: 1,
      },
    ],
    textBlocks: [],
  },

  7: {
    chapterId: 7,
    layers: [
      {
        id: 'bg',
        src: chapterAssets.C7.bg,
        alt: assetDescriptions[chapterAssets.C7.bg],
        type: 'bg',
        position: { anchor: 'center' },
        size: { width: '100%', height: '100%' },
        zIndex: 0,
        initialOpacity: 1,
      },
    ],
    textBlocks: [],
  },

  8: {
    chapterId: 8,
    layers: [
      {
        id: 'bg',
        src: chapterAssets.C8.bg,
        alt: assetDescriptions[chapterAssets.C8.bg],
        type: 'bg',
        position: { anchor: 'center' },
        size: { width: '100%', height: '100%' },
        zIndex: 0,
        initialOpacity: 1,
      },
    ],
    textBlocks: [],
  },

  9: {
    chapterId: 9,
    layers: [
      {
        id: 'bg',
        src: chapterAssets.C9.bg,
        alt: assetDescriptions[chapterAssets.C9.bg],
        type: 'bg',
        position: { anchor: 'center' },
        size: { width: '100%', height: '100%' },
        zIndex: 0,
        initialOpacity: 1,
      },
    ],
    textBlocks: [],
  },
}

/**
 * Get scene configuration for a chapter
 */
export function getSceneConfig(chapterId: number): SceneConfig | undefined {
  return sceneConfigs[chapterId]
}
