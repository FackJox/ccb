/**
 * Frame Definitions
 *
 * All 31 frames with layer composition and text content.
 */

import { sharedAssets, chapterAssets } from './assets'

export interface Layer {
  src: string
  type: 'bg' | 'fg'
  parallax?: number  // 0.8 for BG, 1.0 for FG (default)
  zIndex?: number
}

export interface TextBlock {
  content: string
  type: 'fragment' | 'beat' | 'consent'
  position?: 'left' | 'right' | 'center' | 'bottom'
}

export interface Frame {
  id: string
  chapter: number
  layers: Layer[]
  text: TextBlock[]
  // Scroll position within chapter (0-1)
  startPosition?: number
  endPosition?: number
}

export const frames: Frame[] = [
  // ============== CHAPTER 1: The Held Breath ==============
  {
    id: '1A',
    chapter: 1,
    layers: [
      { src: chapterAssets.C1.bg, type: 'bg', parallax: 0.8, zIndex: 0 },
      { src: chapterAssets.C1.fg1, type: 'fg', zIndex: 1 },
    ],
    text: [
      { content: 'The violin faltered once, a heartbeat snag, as Ceci dared the room to breathe with her.', type: 'fragment', position: 'left' },
      { content: 'In the lamplight, flour still ghosted her wrists from the bakery below, and lilac silk clung damp at the hem.', type: 'fragment', position: 'left' },
      { content: 'She lifted her chin—three-count nested in the pause—and the people lining the confiscated hôtel hallway forgot to blink.', type: 'fragment', position: 'left' },
    ],
  },
  {
    id: '1B',
    chapter: 1,
    layers: [
      { src: chapterAssets.C1.bg, type: 'bg', parallax: 0.8, zIndex: 0 },
      { src: chapterAssets.C1.fg1, type: 'fg', zIndex: 1 },
      { src: chapterAssets.C1.fg2, type: 'fg', zIndex: 2 },
    ],
    text: [
      { content: "From the corner, where a restless lantern cluster hissed, Jack recognized the rhythm she'd been humming through the market streets.", type: 'fragment', position: 'right' },
      { content: 'He knew it before he knew her name. He knew it the way a city knows rain.', type: 'fragment', position: 'right' },
    ],
  },
  {
    id: '1C',
    chapter: 1,
    layers: [
      { src: chapterAssets.C1.bg, type: 'bg', parallax: 0.8, zIndex: 0 },
      { src: chapterAssets.C1.fg1, type: 'fg', zIndex: 1 },
      { src: chapterAssets.C1.fg2, type: 'fg', zIndex: 2 },
    ],
    text: [
      { content: 'They were supposed to be alone, "rehearsing," though that word had become a lie.', type: 'fragment', position: 'left' },
      { content: 'Neighbors gathered at the edges of the hall. Windows faced the square—too exposed, too dangerous—', type: 'fragment', position: 'left' },
      { content: 'Let them look. Let the city breathe again.', type: 'beat', position: 'center' },
    ],
  },

  // ============== CHAPTER 2: The Offer ==============
  {
    id: '2A',
    chapter: 2,
    layers: [
      { src: chapterAssets.C2.bg, type: 'bg', parallax: 0.8, zIndex: 0 },
      { src: chapterAssets.C2.fg1, type: 'fg', zIndex: 1 },
    ],
    text: [
      { content: 'Jack set it down, unwound twine, revealed sheets scored thick with ink. "I wrote a pivot," he said. "A melody that asks for a different lead."', type: 'fragment', position: 'right' },
      { content: 'Ceci studied the marks as if the music could bruise. Jack watched her read. When she looked up, the room changed temperature.', type: 'fragment', position: 'right' },
    ],
  },
  {
    id: '2B',
    chapter: 2,
    layers: [
      { src: chapterAssets.C2.bg, type: 'bg', parallax: 0.8, zIndex: 0 },
      { src: sharedAssets.fg.coupleCloseup, type: 'fg', zIndex: 1 },
    ],
    text: [
      { content: "Consent lives in small sentences. She tipped her head, that chin-lift she didn't know she'd made in a hundred lives, and he answered by holding out his embrace.", type: 'fragment', position: 'left' },
      { content: '"Will you follow?" he asked.', type: 'consent', position: 'center' },
    ],
  },

  // ============== CHAPTER 3: Consent as Choreography ==============
  {
    id: '3A',
    chapter: 3,
    layers: [
      { src: chapterAssets.C3.bg, type: 'bg', parallax: 0.8, zIndex: 0 },
      { src: chapterAssets.C3.fg, type: 'fg', zIndex: 1 },
    ],
    text: [
      { content: 'They began again. Her weight forward, his back; his lead, her follow.', type: 'fragment', position: 'left' },
      { content: 'A pattern older than their names.', type: 'fragment', position: 'left' },
    ],
  },
  {
    id: '3B',
    chapter: 3,
    layers: [
      { src: chapterAssets.C3.bg, type: 'bg', parallax: 0.8, zIndex: 0 },
      { src: chapterAssets.C3.fg, type: 'fg', zIndex: 1 },
    ],
    text: [
      { content: "When the mirror on the far wall slipped its wire and crashed, the silence struck like a held breath—but Ceci didn't flinch.", type: 'fragment', position: 'center' },
    ],
  },

  // ============== CHAPTER 4: The Crack ==============
  {
    id: '4A',
    chapter: 4,
    layers: [
      { src: chapterAssets.C4.bg, type: 'bg', parallax: 0.8, zIndex: 0 },
      { src: sharedAssets.fg.mirrorIntact, type: 'fg', zIndex: 1 },
    ],
    text: [
      { content: "When the mirror on the far wall slipped its wire and crashed, the silence struck like a held breath—but Ceci didn't flinch.", type: 'fragment', position: 'center' },
    ],
  },
  {
    id: '4B',
    chapter: 4,
    layers: [
      { src: chapterAssets.C4.bg, type: 'bg', parallax: 0.8, zIndex: 0 },
      { src: sharedAssets.fg.mirrorBroken, type: 'fg', zIndex: 1 },
      { src: sharedAssets.fg.coupleStanding, type: 'fg', zIndex: 2 },
    ],
    text: [
      { content: 'Un. Deux. Trois.', type: 'beat', position: 'center' },
      { content: 'Her voice carried out the open windows and pulled the square into rhythm.', type: 'fragment', position: 'bottom' },
    ],
  },

  // ============== CHAPTER 5: Authority Enters ==============
  {
    id: '5A',
    chapter: 5,
    layers: [
      { src: chapterAssets.C5.bg, type: 'bg', parallax: 0.8, zIndex: 0 },
      { src: chapterAssets.C5.fg1, type: 'fg', zIndex: 1 },
    ],
    text: [
      { content: 'Boots entered the square below—sharp, official, unwelcome.', type: 'fragment', position: 'left' },
      { content: "A street patrol. Jack caught the shift in Ceci's posture: not fear. Calculation.", type: 'fragment', position: 'left' },
    ],
  },
  {
    id: '5B',
    chapter: 5,
    layers: [
      { src: chapterAssets.C5.bg2, type: 'bg', zIndex: 0 },
    ],
    text: [
      { content: "A street patrol. Jack caught the shift in Ceci's posture: not fear. Calculation.", type: 'fragment', position: 'right' },
    ],
  },
  {
    id: '5C',
    chapter: 5,
    layers: [
      { src: chapterAssets.C5.bg2, type: 'bg', zIndex: 0 },
    ],
    text: [
      { content: '"End this!" a captain barked. "Curtains closed. Lights out."', type: 'fragment', position: 'center' },
    ],
  },
  {
    id: '5D',
    chapter: 5,
    layers: [
      { src: chapterAssets.C5.bg2, type: 'bg', zIndex: 0 },
    ],
    text: [
      { content: "Ceci's chin lifted by a fraction—recognition, defiance, maybe destiny.", type: 'fragment', position: 'left' },
      { content: 'Ceci moved first.', type: 'beat', position: 'center' },
    ],
  },

  // ============== CHAPTER 6: Violet Window (HERO BEAT) ==============
  {
    id: '6A',
    chapter: 6,
    layers: [
      { src: chapterAssets.C4.bg, type: 'bg', parallax: 0.8, zIndex: 0 },
      { src: sharedAssets.fg.mirrorBroken, type: 'fg', zIndex: 1 },
      { src: sharedAssets.fg.coupleStanding, type: 'fg', zIndex: 2 },
    ],
    text: [
      { content: "Ceci's chin lifted by a fraction—recognition, defiance, maybe destiny. Ceci moved first.", type: 'fragment', position: 'left' },
    ],
  },
  {
    id: '6B',
    chapter: 6,
    layers: [
      { src: chapterAssets.C4.bg, type: 'bg', parallax: 0.8, zIndex: 0 },
      { src: sharedAssets.fg.mirrorBroken, type: 'fg', zIndex: 1 },
      { src: sharedAssets.fg.coupleStanding, type: 'fg', zIndex: 2 },
    ],
    text: [
      { content: 'She killed the main lanterns; the room dropped into dark velvet.', type: 'fragment', position: 'left' },
      { content: 'Then she sent the violet spill surging into the windows. The glass flared like a phantom stage.', type: 'fragment', position: 'left' },
      { content: 'Their bodies became silhouettes—tall, fused, impossible to parse.', type: 'fragment', position: 'center' },
    ],
  },
  {
    id: '6C',
    chapter: 6,
    layers: [
      { src: sharedAssets.bg.exteriorWindowsSilhouette, type: 'bg', zIndex: 0 },
    ],
    text: [
      { content: 'Their bodies became silhouettes—tall, fused, impossible to parse.', type: 'fragment', position: 'left' },
      { content: 'A gasp rose from the square. Hundreds of faces turned upward.', type: 'fragment', position: 'right' },
      { content: 'Only shadows remained: Ceci and Jack, framed in violet fire.', type: 'beat', position: 'center' },
    ],
  },
  {
    id: '6D',
    chapter: 6,
    layers: [
      { src: chapterAssets.C2.bg, type: 'bg', parallax: 0.8, zIndex: 0 },
      { src: sharedAssets.fg.coupleCloseup, type: 'fg', zIndex: 1 },
    ],
    text: [
      { content: 'She stepped into him, closer than the dance required, her breath warm at his jaw. "Follow me," she whispered—not as command, but invitation.', type: 'fragment', position: 'left' },
      { content: '"Always," he answered, the word leaving him before he could stop it.', type: 'consent', position: 'center' },
    ],
  },
  {
    id: '6E',
    chapter: 6,
    layers: [
      { src: sharedAssets.bg.exteriorWindowsSilhouette, type: 'bg', zIndex: 0 },
    ],
    text: [
      { content: 'They waltzed, framed by darkness, her lead molten and sure.', type: 'fragment', position: 'left' },
      { content: 'She pressed her palm to his chest for a beat too long, and the square below felt the shift; murmurs turned into rhythm, rhythm into movement.', type: 'fragment', position: 'right' },
      { content: 'Someone clapped on the count. Another joined. Soon the crowd swayed like a single creature.', type: 'fragment', position: 'center' },
    ],
  },

  // ============== CHAPTER 7: Heat & Tide ==============
  {
    id: '7A',
    chapter: 7,
    layers: [
      { src: chapterAssets.C7.bg, type: 'bg', zIndex: 0 },
    ],
    text: [
      { content: 'Someone clapped on the count. Another joined. Soon the crowd swayed like a single creature.', type: 'fragment', position: 'left' },
      { content: 'The patrol tried to push through, but the crowd moved shoulder to shoulder, too entranced to part.', type: 'fragment', position: 'right' },
    ],
  },
  {
    id: '7B',
    chapter: 7,
    layers: [
      { src: sharedAssets.bg.exteriorWindowsSilhouette, type: 'bg', zIndex: 0 },
    ],
    text: [
      { content: 'Heat traveled through him like memory.', type: 'fragment', position: 'left' },
      { content: "Ceci slid her fingers to Jack's forearm—firm, claiming—guiding him to turn her against the light.", type: 'fragment', position: 'right' },
    ],
  },
  {
    id: '7C',
    chapter: 7,
    layers: [
      { src: chapterAssets.C7.bg2, type: 'bg', zIndex: 0 },
    ],
    text: [
      { content: 'Heat gathered and traveled. Not spectacle; agreement. She felt his choice and answered with one of her own: her hand rose to the back of his neck, gentle, deliberate.', type: 'fragment', position: 'left' },
      { content: 'A question. A vow. A lifetime rethreading itself.', type: 'beat', position: 'center' },
    ],
  },
  {
    id: '7D',
    chapter: 7,
    layers: [
      { src: chapterAssets.C7.bg2, type: 'bg', zIndex: 0 },
    ],
    text: [
      { content: 'Jack exhaled her name—"Ceci…"—more confession than breath.', type: 'consent', position: 'center' },
    ],
  },

  // ============== CHAPTER 8: Release ==============
  {
    id: '8A',
    chapter: 8,
    layers: [
      { src: chapterAssets.C8.bg, type: 'bg', zIndex: 0 },
    ],
    text: [
      { content: 'From the street, they looked untouchable.', type: 'fragment', position: 'left' },
      { content: 'The soldiers, now surrounded by motion and music, began to retreat step by step. Not ordered; inevitable. The rhythm swallowed their authority.', type: 'fragment', position: 'right' },
    ],
  },
  {
    id: '8B',
    chapter: 8,
    layers: [
      { src: chapterAssets.C8.bg2, type: 'bg', zIndex: 0 },
    ],
    text: [
      { content: 'The tide of dancers took the space they vacated until the patrol dissolved into the edges of the square, retreating beneath the swell of applause and violet glow.', type: 'fragment', position: 'left' },
      { content: 'From the street, they looked untouchable.', type: 'fragment', position: 'right' },
    ],
  },
  {
    id: '8C',
    chapter: 8,
    layers: [
      { src: chapterAssets.C8.bg, type: 'bg', zIndex: 0 },
    ],
    text: [
      { content: 'The rhythm swallowed their authority.', type: 'beat', position: 'center' },
    ],
  },
  {
    id: '8D',
    chapter: 8,
    layers: [
      { src: chapterAssets.C8.bg2, type: 'bg', zIndex: 0 },
    ],
    text: [
      { content: 'The tide of dancers took the space they vacated.', type: 'fragment', position: 'center' },
    ],
  },
  {
    id: '8E',
    chapter: 8,
    layers: [
      { src: chapterAssets.C8.bg3, type: 'bg', zIndex: 0 },
    ],
    text: [
      { content: 'When the final note faded, the city exhaled with them. The violet lights guttered out.', type: 'fragment', position: 'left' },
      { content: 'In the dark, Ceci rested her forehead against his for a heartbeat too long to be innocent. His hands stayed at her waist, not trapping—just holding the moment still.', type: 'fragment', position: 'right' },
    ],
  },

  // ============== CHAPTER 9: Residue & Dawn ==============
  {
    id: '9A',
    chapter: 9,
    layers: [
      { src: chapterAssets.C9.bg, type: 'bg', parallax: 0.8, zIndex: 0 },
      { src: chapterAssets.C9.fg, type: 'fg', zIndex: 1 },
    ],
    text: [
      { content: 'At dawn, they broomed glass from the ballroom floor together.', type: 'fragment', position: 'center' },
    ],
  },
  {
    id: '9B',
    chapter: 9,
    layers: [
      { src: chapterAssets.C9.bg, type: 'bg', parallax: 0.8, zIndex: 0 },
      { src: chapterAssets.C9.fg, type: 'fg', zIndex: 1 },
    ],
    text: [
      { content: 'Below, the square was quiet again: crates, crumbs, a soft memory of defiance. For a long time, the smell of tobacco and mist hung in the air.', type: 'fragment', position: 'center' },
    ],
  },
  {
    id: '9C',
    chapter: 9,
    layers: [
      { src: chapterAssets.C9.bg2, type: 'bg', zIndex: 0 },
    ],
    text: [
      { content: 'On the backstage door, someone had chalked a bright C/J beside a streak of flour—no one claiming it; everyone knowing.', type: 'fragment', position: 'center' },
    ],
  },
  {
    id: '9D',
    chapter: 9,
    layers: [
      { src: chapterAssets.C9.bg3, type: 'bg', zIndex: 0 },
    ],
    text: [
      { content: 'Upstairs, their brooms stopped; their feet met.', type: 'fragment', position: 'left' },
      { content: 'A hold.', type: 'beat', position: 'center' },
      { content: 'Her breath met his.', type: 'beat', position: 'center' },
      { content: 'Old as anything.', type: 'beat', position: 'center' },
      { content: 'New as dawn.', type: 'beat', position: 'center' },
    ],
  },
]

/**
 * Get frame by ID
 */
export function getFrame(id: string): Frame | undefined {
  return frames.find(f => f.id === id)
}

/**
 * Get frames for a chapter
 */
export function getFramesForChapter(chapterNumber: number): Frame[] {
  return frames.filter(f => f.chapter === chapterNumber)
}

/**
 * Get all unique layer sources for preloading
 */
export function getAllLayerSources(): string[] {
  const sources = new Set<string>()
  frames.forEach(frame => {
    frame.layers.forEach(layer => {
      sources.add(layer.src)
    })
  })
  return Array.from(sources)
}

/**
 * Total frame count
 */
export const TOTAL_FRAMES = frames.length
