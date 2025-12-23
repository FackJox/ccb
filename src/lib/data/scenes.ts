/**
 * Scene Definitions
 *
 * Data-driven configuration for each chapter's scene composition.
 * Defines layers, text blocks, and positions - timelines handle animation timing.
 */

import { chapterAssets, sharedAssets, assetDescriptions } from './assets';

/**
 * Layer definition for scene composition
 */
export interface SceneLayer {
	id: string; // GSAP target: data-layer="id"
	src: string; // Image source path
	alt: string; // Accessibility description
	type: 'bg' | 'fg'; // Layer type
	position: {
		// CSS positioning
		anchor: 'left' | 'right' | 'center';
		bottom?: boolean; // Align to bottom (for characters)
		bottomOffset?: string; // CSS offset from bottom (e.g., '5%', '20px')
		offset?: string; // CSS offset from anchor (e.g., '5%')
	};
	size: {
		height?: string; // CSS height (e.g., '65%', '100%')
		width?: string; // CSS width (e.g., 'auto', '100%')
	};
	zIndex: number;
	initialOpacity?: number; // Default 0 for fg, 1 for bg
	initialScale?: number; // For subtle scale animations
}

/**
 * Bridge reference for cross-chapter text persistence
 */
export interface TextBridgeRef {
	chapter: number;
	textNum: number;
}

/**
 * Text block definition
 */
export interface SceneTextBlock {
	num: number; // GSAP target: data-text-block="num"
	content: string;
	type: 'fragment' | 'beat' | 'consent';
	style: 'parchment' | 'transparent' | 'beat';
	emphasis?: boolean; // Bold styling
	position?: {
		top?: string; // e.g., '15%', '35%'
		right?: string; // e.g., '0', '5%'
		left?: string; // Alternative to right
	};
	/** Optional: override calculated reading time (in ms) */
	visibleDurationMs?: number;
	/**
	 * Cross-chapter persistence: this text continues into another chapter.
	 * The target chapter must have a matching text with `bridgesFrom`.
	 * Timeline: this text should NOT fade out (holds to chapter end).
	 */
	bridgesTo?: TextBridgeRef;
	/**
	 * Cross-chapter persistence: this text continues from another chapter.
	 * The source chapter must have a matching text with `bridgesTo`.
	 * Timeline: this text starts visible (opacity: 1) and fades out later.
	 * Content and position MUST match the source text exactly.
	 */
	bridgesFrom?: TextBridgeRef;
}

/**
 * Complete scene configuration for a chapter
 */
export interface SceneConfig {
	chapterId: number;
	layers: SceneLayer[];
	textBlocks: SceneTextBlock[];
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
				initialOpacity: 1
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
				initialScale: 1.02
			},
			{
				id: 'jack',
				src: chapterAssets.C1.fg2,
				alt: assetDescriptions[chapterAssets.C1.fg2],
				type: 'fg',
				position: { anchor: 'right', bottom: true, offset: '8%' },
				size: { height: '60%' },
				zIndex: 2,
				initialOpacity: 0
			}
		],
		textBlocks: [
			// Frame A texts (parchment style) - staggered down the right side
			{
				num: 1,
				content:
					'The violin faltered once, a heartbeat snag, as Ceci dared the room to breathe with her.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '12%', right: '30%' }
			},
			{
				num: 2,
				content:
					'In the lamplight, flour still ghosted her wrists from the bakery below, and lilac silk clung damp at the hem.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '32%', right: '25%' }
			},
			{
				num: 3,
				content:
					'She lifted her chin—three-count nested in the pause—and the people lining the confiscated hôtel hallway forgot to blink.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '52%', right: '30%' }
			},
			// Frame B texts - center-right area
			{
				num: 4,
				content:
					"From the corner, where a restless lantern cluster hissed, Jack recognized the rhythm she'd been humming through the market streets.",
				type: 'fragment',
				style: 'parchment',
				position: { top: '22%', right: '25%' }
			},
			{
				num: 5,
				content: 'He knew it before he knew her name.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '48%', right: '40%' }
			},
			{
				num: 6,
				content: 'He knew it the way a city knows rain.',
				type: 'fragment',
				style: 'parchment',
				emphasis: true,
				position: { top: '58%', right: '35%' }
			},
			// Frame C texts - mixed positions
			{
				num: 7,
				content:
					'They were supposed to be alone, "rehearsing," though that word had become a lie. Neighbours gathered at the edges of the square.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '18%', right: '30%' }
			},
			{
				num: 8,
				content: 'Windows bare to the square—too exposed, too dangerous—but Ceci had said softly.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '45%', right: '25%' }
			},
			// Beat text - centered via .beat class, no position needed
			{
				num: 9,
				content: 'Let them look. Let the city breathe again.',
				type: 'beat',
				style: 'beat',
				position: { top: '5%', right: '0%' }
			}
		]
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
				initialOpacity: 1
			},
			{
				id: 'couple',
				src: chapterAssets.C2.fg1,
				alt: assetDescriptions[chapterAssets.C2.fg1],
				type: 'fg',
				position: { anchor: 'right', bottom: true, offset: '8%' },
				size: { height: '75%' },
				zIndex: 1,
				initialOpacity: 0
			},
			{
				id: 'coupleCloseup',
				src: sharedAssets.fg.coupleCloseup,
				alt: assetDescriptions[sharedAssets.fg.coupleCloseup],
				type: 'fg',
				position: { anchor: 'left', bottom: true, offset: '0' },
				size: { height: '100%' },
				zIndex: 2,
				initialOpacity: 0
			}
		],
		textBlocks: [
			// Frame A texts (parchment style) - staggered down the left side
			{
				num: 1,
				content:
					'Jack set it down, unwound twine, revealed sheets scored thick with ink. "I wrote a pivot," he said. "A melody that asks for a different lead."',
				type: 'fragment',
				style: 'parchment',
				position: { top: '8%', left: '4%' }
			},
			{
				num: 2,
				content:
					'Ceci studied the marks as if the music could bruise. Jack watched her read. When she looked up, the room changed temperature.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '32%', left: '8%' }
			},
			{
				num: 8,
				content: '"Will you follow?" he asked.',
				type: 'consent',
				style: 'beat'
			},
			// Frame B texts (parchment style) - positioned on right side over couple-closeup
			{
				num: 3,
				content: 'Consent lives in small sentences.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '8%', right: '0' }
			},
			{
				num: 4,
				content:
					"She tipped her head, that chin-lift she didn't know she'd made in a hundred lives, and he answered by holding out his embrace.",
				type: 'fragment',
				style: 'parchment',
				position: { top: '18%', right: '5%' }
			},
			{
				num: 5,
				content:
					'Her palm hovered near his wrist without touching. She matched his tempo. She nodded once—permission, acknowledgment, desire braided quiet.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '32%', right: '5%' }
			},
			{
				num: 6,
				content: 'Not control.',
				type: 'fragment',
				style: 'parchment',
				emphasis: true,
				position: { top: '42%', right: '15%' }
			},
			{
				num: 7,
				content: 'Permission.',
				type: 'fragment',
				style: 'parchment',
				emphasis: true,
				position: { top: '55%', right: '10%' }
			}
		]
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
				initialOpacity: 0 // Fades in AFTER FG (dramatic reveal from black)
			},
			{
				id: 'coupleDip',
				src: chapterAssets.C3.fg,
				alt: assetDescriptions[chapterAssets.C3.fg],
				type: 'fg',
				position: { anchor: 'right', bottom: true, offset: '0' },
				size: { height: '95%' },
				zIndex: 1,
				initialOpacity: 0 // Fades in FIRST from black
			}
		],
		textBlocks: [
			// Frame A texts (parchment style) - staggered down the left side
			{
				num: 1,
				content: 'They began again. Her weight forward, his back; his lead, her follow.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '12%', left: '4%' }
			},
			{
				num: 2,
				content: 'A pattern older than their names.',
				type: 'fragment',
				style: 'parchment',
				emphasis: true,
				position: { top: '35%', left: '8%' }
			},
			// Frame B text - mirror crash introduction (bridges to Chapter 4)
			{
				num: 3,
				content:
					"When the mirror on the far wall slipped its wire and crashed, the silence struck like a held breath—but Ceci didn't flinch.",
				type: 'fragment',
				style: 'parchment',
				position: { top: '38%', left: '4%' },
				bridgesTo: { chapter: 4, textNum: 1 }
			}
		]
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
				initialOpacity: 1
			},
			{
				id: 'mirrorIntact',
				src: sharedAssets.fg.mirrorIntact,
				alt: assetDescriptions[sharedAssets.fg.mirrorIntact],
				type: 'fg',
				position: { anchor: 'right', bottom: true, bottomOffset: '10%', offset: '25%' },
				size: { height: '70%' },
				zIndex: 2,
				initialOpacity: 1 // Starts visible (continues from Frame A)
			},
			{
				id: 'mirrorBroken',
				src: sharedAssets.fg.mirrorBroken,
				alt: assetDescriptions[sharedAssets.fg.mirrorBroken],
				type: 'fg',
				position: { anchor: 'right', bottom: true, bottomOffset: '10%', offset: '25%' },
				size: { height: '70%' },
				zIndex: 2,
				initialOpacity: 0 // Hidden until swap
			},
			{
				id: 'coupleStanding',
				src: sharedAssets.fg.coupleStanding,
				alt: assetDescriptions[sharedAssets.fg.coupleStanding],
				type: 'fg',
				position: { anchor: 'left', bottom: true, offset: '25%' },
				size: { height: '85%' },
				zIndex: 1,
				initialOpacity: 0 // Hidden until reveal
			}
		],
		textBlocks: [
			// Frame A text - same as Chapter 3B (persists across chapter transition)
			{
				num: 1,
				content:
					"When the mirror on the far wall slipped its wire and crashed, the silence struck like a held breath—but Ceci didn't flinch.",
				type: 'fragment',
				style: 'parchment',
				position: { top: '38%', left: '4%' },
				bridgesFrom: { chapter: 3, textNum: 3 }
			},
			// Frame B - Sequential beat: "Un. Deux. Trois." - staggered horizontally
			{
				num: 2,
				content: '"Un."',
				type: 'beat',
				style: 'beat',
				position: { top: '20%', left: '25%' }
			},
			{
				num: 3,
				content: '"Deux."',
				type: 'beat',
				style: 'beat',
				position: { top: '25%', left: '42%' }
			},
			{
				num: 4,
				content: '"Trois."',
				type: 'beat',
				style: 'beat',
				position: { top: '30%', left: '60%' }
			},
			// Frame B - Narrative text
			{
				num: 5,
				content: 'Her voice carried out the open windows and pulled the square into rhythm.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '25%', right: '0' }
			}
		]
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
				initialOpacity: 1
			},
			{
				id: 'boots',
				src: chapterAssets.C5.fg1,
				alt: assetDescriptions[chapterAssets.C5.fg1],
				type: 'fg',
				position: { anchor: 'left', offset: '0' },
				size: { height: '100%' },
				zIndex: 1,
				initialOpacity: 0
			},
			{
				id: 'bg2',
				src: chapterAssets.C5.bg2,
				alt: assetDescriptions[chapterAssets.C5.bg2],
				type: 'bg',
				position: { anchor: 'center' },
				size: { width: '100%', height: '100%' },
				zIndex: 0,
				initialOpacity: 0
			}
		],
		textBlocks: [
			// Frame A texts
			{
				num: 1,
				content: 'Boots entered the square below—sharp, official, unwelcome.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '32%', right: '0' }
			},
			{
				num: 2,
				content: "A street patrol. Jack caught the shift in Ceci's posture: not fear. Calculation.",
				type: 'fragment',
				style: 'parchment',
				position: { top: '48%', right: '0' }
			},
			// Frame B text (5B)
			{
				num: 3,
				content: "A street patrol. Jack caught the shift in Ceci's posture: not fear. Calculation.",
				type: 'fragment',
				style: 'parchment',
				position: { top: '22%', right: '0' }
			},
			// Frame C text (5C)
			{
				num: 4,
				content: "'End this!' a captain barked. 'Curtains closed. Lights out.'",
				type: 'fragment',
				style: 'parchment',
				position: { top: '8%', right: '15%' }
			},
			// Frame D text (5D) - persists into Chapter 6A
			{
				num: 5,
				content:
					"Ceci's chin lifted by a fraction—recognition, defiance, maybe destiny. Ceci moved first.",
				type: 'fragment',
				style: 'parchment',
				position: { top: '8%', right: '5%' },
				bridgesTo: { chapter: 6, textNum: 1 }
			}
		]
	},

	6: {
		chapterId: 6,
		layers: [
			{
				id: 'bg',
				src: chapterAssets.C4.bg, // Reuses C4 bg (ballroom corner)
				alt: assetDescriptions[chapterAssets.C4.bg],
				type: 'bg',
				position: { anchor: 'center' },
				size: { width: '100%', height: '100%' },
				zIndex: 0,
				initialOpacity: 1
			},
			{
				id: 'bgExterior',
				src: sharedAssets.bg.exteriorWindowsSilhouette, // Hero shot - exterior windows
				alt: assetDescriptions[sharedAssets.bg.exteriorWindowsSilhouette],
				type: 'bg',
				position: { anchor: 'center' },
				size: { width: '100%', height: '100%' },
				zIndex: 0,
				initialOpacity: 0 // Hidden initially, fades in during Frame C
			},
			{
				id: 'coupleStanding',
				src: sharedAssets.fg.coupleStanding,
				alt: assetDescriptions[sharedAssets.fg.coupleStanding],
				type: 'fg',
				position: { anchor: 'left', bottom: true, offset: '5%' },
				size: { height: '85%' },
				zIndex: 1,
				initialOpacity: 1 // Visible (continues from Ch4/5)
			},
			{
				id: 'mirrorBroken',
				src: sharedAssets.fg.mirrorBroken,
				alt: assetDescriptions[sharedAssets.fg.mirrorBroken],
				type: 'fg',
				position: { anchor: 'right', bottom: true, offset: '5%' },
				size: { height: '70%' },
				zIndex: 2,
				initialOpacity: 1 // Visible (continues from Ch4/5)
			},
			// Frame D layers - intimate closeup scene
			{
				id: 'bgC2',
				src: chapterAssets.C2.bg,
				alt: assetDescriptions[chapterAssets.C2.bg],
				type: 'bg',
				position: { anchor: 'center' },
				size: { width: '100%', height: '100%' },
				zIndex: 0,
				initialOpacity: 0 // Hidden initially, fades in during Frame D
			},
			{
				id: 'coupleCloseup',
				src: sharedAssets.fg.coupleCloseup,
				alt: assetDescriptions[sharedAssets.fg.coupleCloseup],
				type: 'fg',
				position: { anchor: 'left', bottom: true, offset: '0' },
				size: { height: '100%' },
				zIndex: 3,
				initialOpacity: 0 // Hidden initially, fades in during Frame D
			}
		],
		textBlocks: [
			// Frame A text - same as Chapter 5D (persists across chapter transition)
			{
				num: 1,
				content:
					"Ceci's chin lifted by a fraction—recognition, defiance, maybe destiny. Ceci moved first.",
				type: 'fragment',
				style: 'parchment',
				position: { top: '8%', right: '5%' },
				bridgesFrom: { chapter: 5, textNum: 5 }
			},
			// Frame B texts - appear after persistent text fades
			{
				num: 2,
				content:
					'She killed the main lanterns; the room dropped into dark velvet. Then she sent the violet spill surging into the windows.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '5%', right: '5%' }
			},
			{
				num: 3,
				content: 'The glass flared like a phantom stage.',
				type: 'fragment',
				style: 'parchment',
				emphasis: true,
				position: { top: '32%', right: '10%' }
			},
			{
				num: 4,
				content: 'Their bodies became silhouettes—tall, fused, impossible to parse.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '55%', right: '10%' }
			},
			// Frame C texts - appear after BG transition to exterior
			{
				num: 5,
				content: 'A gasp rose from the square. Hundreds of faces turned upward.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '40%', right: '5%' }
			},
			{
				num: 6,
				content: 'Only shadows remained: Ceci and Jack, framed in violet fire.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '65%', right: '5%' }
			},
			// Frame D texts - intimate consent moment
			{
				num: 7,
				content:
					'She stepped into him, closer than the dance required, her breath warm at his jaw. "Follow me," she whispered—not as command, but invitation.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '15%', right: '5%' }
			},
			{
				num: 8,
				content: '"Always," he answered, the word leaving him before he could stop it.',
				type: 'fragment',
				style: 'parchment',
				emphasis: true,
				position: { top: '45%', right: '5%' }
			},
			// Frame E texts - return to exterior, crowd response
			{
				num: 9,
				content:
					'They waltzed, framed by darkness, her lead molten and sure. Her lilac sash—caught by the violet—looked like a wound or a promise.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '5%', left: '5%' }
			},
			{
				num: 10,
				content:
					'She pressed her palm to his chest for a beat too long, and the square below felt the shift; murmurs turned into rhythm, rhythm into movement.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '40%', right: '5%' }
			},
			{
				num: 11,
				content:
					'Someone clapped on the count. Another joined. Soon the crowd swayed like a single creature.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '65%', left: '5%' },
				bridgesTo: { chapter: 7, textNum: 1 }
			}
		]
	},

	7: {
		chapterId: 7,
		layers: [
			{
				id: 'bg',
				src: chapterAssets.C7.bg,
				alt: assetDescriptions[chapterAssets.C7.bg],
				type: 'bg',
				position: { anchor: 'right' },
				size: { height: '100%' },
				zIndex: 0,
				initialOpacity: 0, // Crossfade from Ch6's exterior-windows-silhouette
				initialScale: 0.99 // For subtle breathing pulse
			},
			{
				id: 'bgExterior',
				src: sharedAssets.bg.exteriorWindowsSilhouette,
				alt: assetDescriptions[sharedAssets.bg.exteriorWindowsSilhouette],
				type: 'bg',
				position: { anchor: 'center' },
				size: { width: '100%', height: '100%' },
				zIndex: 0,
				initialOpacity: 0 // Hidden until Frame B
			},
			{
				id: 'bg2',
				src: chapterAssets.C7.bg2,
				alt: assetDescriptions[chapterAssets.C7.bg2],
				type: 'bg',
				position: { anchor: 'center' },
				size: { width: '100%', height: '100%' },
				zIndex: 0,
				initialOpacity: 0 // Hidden until Frame C
			}
		],
		textBlocks: [
			// Frame A texts - crowd scene
			// Text 1 persists from Chapter 6 - MUST match Chapter 6 text 11 position exactly
			{
				num: 1,
				content:
					'Someone clapped on the count. Another joined. Soon the crowd swayed like a single creature.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '65%', left: '5%' }, // Same as Ch6 text 11 for seamless transition
				bridgesFrom: { chapter: 6, textNum: 11 }
			},
			{
				num: 2,
				content:
					"The patrol tried to push through, but the crowd moved shoulder to shoulder, too entranced to part. Any force would have meant striking civilians. The soldiers cursed, stuck in the tide they'd meant to control.",
				type: 'fragment',
				style: 'parchment',
				position: { top: '45%', right: '0' }
			},
			// Frame B texts - exterior windows silhouette
			{
				num: 3,
				content: 'Heat traveled through him like memory.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '12%', right: '5%' }
			},
			{
				num: 4,
				content:
					"Ceci slid her fingers to Jack's forearm—firm, claiming—guiding him to turn her against the light. The move pressed her body to his, her mouth grazing his cheek as she whispered the next step.",
				type: 'fragment',
				style: 'parchment',
				position: { top: '55%', left: '3%' }
			},
			// Frame C texts - C7BG2 interior
			{
				num: 5,
				content:
					'Heat gathered and traveled. Not spectacle; agreement. She felt his choice and answered with one of her own: her hand rose to the back of his neck, gentle, deliberate.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '8%', left: '3%' }
			},
			{
				num: 6,
				content: 'A question. A vow. A lifetime rethreading itself.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '65%', right: '5%' }
			},
			// Frame D text - final intimate moment
			{
				num: 7,
				content: 'Jack exhaled her name—"Ceci..."—more confession than breath.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '12%', right: '15%' }
			}
		]
	},

	// ============== CHAPTER 8: Release ==============
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
				initialOpacity: 1
			},
			{
				id: 'bg2',
				src: chapterAssets.C8.bg2,
				alt: assetDescriptions[chapterAssets.C8.bg2],
				type: 'bg',
				position: { anchor: 'center' },
				size: { width: '100%', height: '100%' },
				zIndex: 1, // Above bg for crossfade
				initialOpacity: 0 // Hidden until Frame 8D transition
			},
			{
				id: 'bg3',
				src: chapterAssets.C8.bg3,
				alt: assetDescriptions[chapterAssets.C8.bg3],
				type: 'bg',
				position: { anchor: 'center' },
				size: { width: '100%', height: '100%' },
				zIndex: 2, // Above bg2 for Frame 8E crossfade
				initialOpacity: 0 // Hidden until Frame 8E transition
			}
		],
		textBlocks: [
			// Frame 8A texts (C8BG - street scene with soldiers retreating)
			{
				num: 1,
				content:
					'From the street, they looked untouchable. The soldiers, now surrounded by motion and music, began to retreat step by step. Not ordered; inevitable.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '8%', left: '3%' }
			},
			{
				num: 2,
				content: 'The rhythm swallowed their authority. One fell back, then another followed.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '55%', right: '5%' }
			},
			// Frame 8D text (C8BG2 - dancing crowd triumph)
			{
				num: 3,
				content:
					'The tide of dancers took the space they vacated until the patrol dissolved into the edges of the square, retreating beneath the swell of applause and violet glow.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '8%', left: '3%' }
			},
			// Frame 8E texts (C8BG3 - night interior, final breath)
			{
				num: 4,
				content:
					'When the final note faded, the city exhaled with them. The violet lights guttered out.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '8%', left: '3%' }
			},
			{
				num: 5,
				content:
					'In the dark, Ceci rested her forehead against his for a heartbeat too long to be innocent. His hands stayed at her waist, not trapping—just holding the moment still.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '55%', right: '5%' }
			}
		]
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
				initialOpacity: 0 // Fades in AFTER FG
			},
			{
				id: 'bg2',
				src: chapterAssets.C9.bg2,
				alt: assetDescriptions[chapterAssets.C9.bg2],
				type: 'bg',
				position: { anchor: 'center' },
				size: { width: '100%', height: '100%' },
				zIndex: 0,
				initialOpacity: 0 // Crossfades in for Frame C
			},
			{
				id: 'bg3',
				src: chapterAssets.C9.bg3,
				alt: assetDescriptions[chapterAssets.C9.bg3],
				type: 'bg',
				position: { anchor: 'center' },
				size: { width: '100%', height: '100%' },
				zIndex: 0,
				initialOpacity: 0 // Crossfades in for Frame D
			},
			{
				id: 'couple',
				src: chapterAssets.C9.fg,
				alt: assetDescriptions[chapterAssets.C9.fg],
				type: 'fg',
				position: { anchor: 'left', bottom: true, offset: '0' },
				size: { height: '95%' },
				zIndex: 1,
				initialOpacity: 0 // GSAP controls positioning via x transform
			}
		],
		textBlocks: [
			// Frame A
			{
				num: 1,
				content:
					'At dawn, they broomed glass from the ballroom floor together. Below, the square was quiet again: crates, crumbs, a soft memory of defiance.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '8%', left: '3%' }
			},
			// Frame B
			{
				num: 2,
				content: 'For a long time, the smell of tobacco and mist hung in the air.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '40%', right: '3%' }
			},
			// Frame C - CJ Door
			{
				num: 3,
				content:
					'On the backstage door, someone had chalked a bright C/J with a streak of flour—no one claiming it; everyone knowing.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '55%', right: '3%' }
			},
			// Frame D - Stacked Poem
			{
				num: 4,
				content: 'Upstairs, their brooms stopped;',
				type: 'fragment',
				style: 'parchment',
				position: { top: '8%', right: '3%' }
			},
			{
				num: 5,
				content: 'their feet met.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '20%', right: '3%' }
			},
			{
				num: 6,
				content: 'A hold.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '32%', right: '3%' }
			},
			{
				num: 7,
				content: 'Her breath met his.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '44%', right: '3%' }
			},
			{
				num: 8,
				content: 'Old as anything.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '56%', right: '3%' }
			},
			{
				num: 9,
				content: 'New as dawn.',
				type: 'fragment',
				style: 'parchment',
				position: { top: '68%', right: '3%' }
			}
		]
	}
};

/**
 * Get scene configuration for a chapter
 */
export function getSceneConfig(chapterId: number): SceneConfig | undefined {
	return sceneConfigs[chapterId];
}
