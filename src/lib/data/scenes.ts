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
  position?: {
    top?: string       // e.g., '15%', '35%'
    right?: string     // e.g., '0', '5%'
    left?: string      // Alternative to right
  }
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
      // Frame A texts (parchment style) - staggered down the right side
      {
        num: 1,
        content: 'The violin faltered once, a heartbeat snag, as Ceci dared the room to breathe with her.',
        type: 'fragment',
        style: 'parchment',
        position: { top: '12%', right: '0' },
      },
      {
        num: 2,
        content: 'In the lamplight, flour still ghosted her wrists from the bakery below, and lilac silk clung damp at the hem.',
        type: 'fragment',
        style: 'parchment',
        position: { top: '32%', right: '5%' },
      },
      {
        num: 3,
        content: 'She lifted her chin—three-count nested in the pause—and the people lining the confiscated hôtel hallway forgot to blink.',
        type: 'fragment',
        style: 'parchment',
        position: { top: '52%', right: '0' },
      },
      // Frame B texts - center-right area
      {
        num: 4,
        content: "From the corner, where a restless lantern cluster hissed, Jack recognized the rhythm she'd been humming through the market streets.",
        type: 'fragment',
        style: 'parchment',
        position: { top: '22%', right: '0' },
      },
      {
        num: 5,
        content: 'He knew it before he knew her name.',
        type: 'fragment',
        style: 'transparent',
        position: { top: '48%', right: '5%' },
      },
      {
        num: 6,
        content: 'He knew it the way a city knows rain.',
        type: 'fragment',
        style: 'transparent',
        emphasis: true,
        position: { top: '58%', right: '5%' },
      },
      // Frame C texts - mixed positions
      {
        num: 7,
        content: 'They were supposed to be alone, "rehearsing," though that word had become a lie. Neighbours gathered at the edges of the square.',
        type: 'fragment',
        style: 'parchment',
        position: { top: '18%', right: '0' },
      },
      {
        num: 8,
        content: 'Windows bare to the square—too exposed, too dangerous—but Ceci had said softly.',
        type: 'fragment',
        style: 'transparent',
        position: { top: '45%', right: '5%' },
      },
      // Beat text - centered via .beat class, no position needed
      {
        num: 9,
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
        position: { anchor: 'right', bottom: true, offset: '8%' },
        size: { height: '75%' },
        zIndex: 1,
        initialOpacity: 0,
      },
      {
        id: 'coupleCloseup',
        src: sharedAssets.fg.coupleCloseup,
        alt: assetDescriptions[sharedAssets.fg.coupleCloseup],
        type: 'fg',
        position: { anchor: 'left', bottom: true, offset: '0' },
        size: { height: '100%' },
        zIndex: 2,
        initialOpacity: 0,
      },
    ],
    textBlocks: [
      // Frame A texts (parchment style) - staggered down the left side
      {
        num: 1,
        content: 'Jack set it down, unwound twine, revealed sheets scored thick with ink. "I wrote a pivot," he said. "A melody that asks for a different lead."',
        type: 'fragment',
        style: 'parchment',
        position: { top: '8%', left: '4%' },
      },
      {
        num: 2,
        content: 'Ceci studied the marks as if the music could bruise. Jack watched her read. When she looked up, the room changed temperature.',
        type: 'fragment',
        style: 'parchment',
        position: { top: '32%', left: '8%' },
      },
      // Frame B texts (parchment style) - positioned on right side over couple-closeup
      {
        num: 3,
        content: "Consent lives in small sentences. She tipped her head, that chin-lift she didn't know she'd made in a hundred lives, and he answered by holding out his embrace. Not control. Permission.",
        type: 'fragment',
        style: 'parchment',
        position: { top: '8%', right: '0' },
      },
      {
        num: 4,
        content: 'Her palm hovered near his wrist without touching. She matched his tempo. She nodded once—permission, acknowledgment, desire braided quiet.',
        type: 'fragment',
        style: 'parchment',
        position: { top: '38%', right: '5%' },
      },
      {
        num: 5,
        content: '"Will you follow?" he asked.',
        type: 'consent',
        style: 'beat',
      },
    ],
  },

  // Placeholder configs for remaining chapters
  // These will be filled in as each chapter is implemented
  // ============== CHAPTER 3: Consent as Choreography ==============
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
        initialOpacity: 0,  // Fades in AFTER FG (dramatic reveal from black)
      },
      {
        id: 'coupleDip',
        src: chapterAssets.C3.fg,
        alt: assetDescriptions[chapterAssets.C3.fg],
        type: 'fg',
        position: { anchor: 'right', bottom: true, offset: '0' },
        size: { height: '95%' },
        zIndex: 1,
        initialOpacity: 0,  // Fades in FIRST from black
      },
    ],
    textBlocks: [
      // Frame A texts (parchment style) - staggered down the left side
      {
        num: 1,
        content: 'They began again. Her weight forward, his back; his lead, her follow.',
        type: 'fragment',
        style: 'parchment',
        position: { top: '12%', left: '4%' },
      },
      {
        num: 2,
        content: 'A pattern older than their names.',
        type: 'fragment',
        style: 'parchment',
        emphasis: true,
        position: { top: '35%', left: '8%' },
      },
      // Frame B text - mirror crash introduction (bridges to Chapter 4)
      {
        num: 3,
        content: "When the mirror on the far wall slipped its wire and crashed, the silence struck like a held breath—but Ceci didn't flinch.",
        type: 'fragment',
        style: 'parchment',
        position: { top: '38%', left: '4%' },
      },
    ],
  },

  // ============== CHAPTER 4: The Crack ==============
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
      {
        id: 'mirrorIntact',
        src: sharedAssets.fg.mirrorIntact,
        alt: assetDescriptions[sharedAssets.fg.mirrorIntact],
        type: 'fg',
        position: { anchor: 'right', bottom: true, offset: '5%' },
        size: { height: '70%' },
        zIndex: 2,
        initialOpacity: 1,  // Starts visible (continues from Frame A)
      },
      {
        id: 'mirrorBroken',
        src: sharedAssets.fg.mirrorBroken,
        alt: assetDescriptions[sharedAssets.fg.mirrorBroken],
        type: 'fg',
        position: { anchor: 'right', bottom: true, offset: '5%' },
        size: { height: '70%' },
        zIndex: 2,
        initialOpacity: 0,  // Hidden until swap
      },
      {
        id: 'coupleStanding',
        src: sharedAssets.fg.coupleStanding,
        alt: assetDescriptions[sharedAssets.fg.coupleStanding],
        type: 'fg',
        position: { anchor: 'left', bottom: true, offset: '5%' },
        size: { height: '85%' },
        zIndex: 1,
        initialOpacity: 0,  // Hidden until reveal
      },
    ],
    textBlocks: [
      // Frame A text - same as Chapter 3B (persists across chapter transition)
      {
        num: 1,
        content: "When the mirror on the far wall slipped its wire and crashed, the silence struck like a held breath—but Ceci didn't flinch.",
        type: 'fragment',
        style: 'parchment',
        position: { top: '38%', left: '4%' },
      },
      // Frame B - Sequential beat: "Un. Deux. Trois."
      {
        num: 2,
        content: '"Un."',
        type: 'beat',
        style: 'beat',
      },
      {
        num: 3,
        content: '"Deux."',
        type: 'beat',
        style: 'beat',
      },
      {
        num: 4,
        content: '"Trois."',
        type: 'beat',
        style: 'beat',
      },
      // Frame B - Narrative text
      {
        num: 5,
        content: 'Her voice carried out the open windows and pulled the square into rhythm.',
        type: 'fragment',
        style: 'parchment',
        position: { top: '25%', right: '0' },
      },
    ],
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
      {
        id: 'boots',
        src: chapterAssets.C5.fg1,
        alt: assetDescriptions[chapterAssets.C5.fg1],
        type: 'fg',
        position: { anchor: 'left', offset: '0' },
        size: { height: '100%' },
        zIndex: 1,
        initialOpacity: 0,
      },
      {
        id: 'bg2',
        src: chapterAssets.C5.bg2,
        alt: assetDescriptions[chapterAssets.C5.bg2],
        type: 'bg',
        position: { anchor: 'center' },
        size: { width: '100%', height: '100%' },
        zIndex: 0,
        initialOpacity: 0,
      },
    ],
    textBlocks: [
      // Frame A texts
      {
        num: 1,
        content: 'Boots entered the square below—sharp, official, unwelcome.',
        type: 'fragment',
        style: 'parchment',
        position: { top: '32%', right: '0' },
      },
      {
        num: 2,
        content: "A street patrol. Jack caught the shift in Ceci's posture: not fear. Calculation.",
        type: 'fragment',
        style: 'parchment',
        position: { top: '48%', right: '0' },
      },
      // Frame B text (5B)
      {
        num: 3,
        content: "A street patrol. Jack caught the shift in Ceci's posture: not fear. Calculation.",
        type: 'fragment',
        style: 'parchment',
        position: { top: '22%', right: '0' },
      },
      // Frame C text (5C)
      {
        num: 4,
        content: "'End this!' a captain barked. 'Curtains closed. Lights out.'",
        type: 'fragment',
        style: 'parchment',
        position: { top: '8%', right: '15%' },
      },
      // Frame D text (5D)
      {
        num: 5,
        content: "Ceci's chin lifted by a fraction—recognition, defiance, maybe destiny. Ceci moved first.",
        type: 'fragment',
        style: 'parchment',
        position: { top: '18%', right: '10%' },
      },
    ],
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
    textBlocks: [
      // Frame A text - same as Chapter 5D (persists across chapter transition)
      {
        num: 1,
        content: "Ceci's chin lifted by a fraction—recognition, defiance, maybe destiny. Ceci moved first.",
        type: 'fragment',
        style: 'parchment',
        position: { top: '18%', right: '10%' },
      },
    ],
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
