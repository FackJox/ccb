/**
 * Chapter Definitions
 *
 * Frame structures per chapter defining which texts appear in each frame
 * and transition timing between frames.
 */

import type { BrandDurationKey } from '$gsap/timing'

/**
 * Frame definition within a chapter
 */
export interface FrameDefinition {
	/** Frame identifier, e.g., '1A', '1B' */
	id: string
	/** Text block numbers that appear in this frame */
	texts: number[]
	/** Layer transition type (determines duration) */
	layerTransition?: BrandDurationKey
	/** Additional hold time after frame content (ms) */
	holdAfter?: number
}

/**
 * Chapter definition with frames and transitions
 */
export interface ChapterDefinition {
	id: number
	frames: FrameDefinition[]
	/** Transition type from previous chapter */
	transitionIn: BrandDurationKey
	/** Transition type to next chapter */
	transitionOut: BrandDurationKey
}

/**
 * All chapter definitions
 */
export const chapterDefinitions: ChapterDefinition[] = [
	// Chapter 1: The Held Breath
	{
		id: 1,
		frames: [
			{ id: '1A', texts: [1, 2, 3], layerTransition: 'section' },
			{ id: '1B', texts: [4, 5, 6], layerTransition: 'section' },
			{ id: '1C', texts: [7, 8, 9], holdAfter: 500 }
		],
		transitionIn: 'section',
		transitionOut: 'section'
	},

	// Chapter 2: The Offer
	{
		id: 2,
		frames: [
			{ id: '2A', texts: [1, 2], layerTransition: 'section' },
			{ id: '2B', texts: [3, 4, 5, 6, 7, 8] } // Includes consent text (8)
		],
		transitionIn: 'section',
		transitionOut: 'section'
	},

	// Chapter 3: Consent as Choreography
	{
		id: 3,
		frames: [
			{ id: '3A', texts: [1, 2] },
			{ id: '3B', texts: [3] } // Text 3 bridges to Ch4
		],
		transitionIn: 'section',
		transitionOut: 'micro' // Quick crossfade for text bridge
	},

	// Chapter 4: The Crack
	{
		id: 4,
		frames: [
			{ id: '4A', texts: [1], layerTransition: 'micro' }, // Mirror swap
			{ id: '4B', texts: [2, 3, 4, 5], holdAfter: 300 }
		],
		transitionIn: 'micro', // Crossfade from Ch3
		transitionOut: 'section'
	},

	// Chapter 5: Authority Enters (L1 - minimal)
	{
		id: 5,
		frames: [
			{ id: '5A', texts: [1, 2] },
			{ id: '5B', texts: [3] },
			{ id: '5C', texts: [4] },
			{ id: '5D', texts: [5] } // Text 5 bridges to Ch6
		],
		transitionIn: 'section',
		transitionOut: 'micro'
	},

	// Chapter 6: Violet Window (L3 - Hero)
	{
		id: 6,
		frames: [
			{ id: '6A', texts: [1] }, // Persistent from Ch5
			{ id: '6B', texts: [2, 3, 4], layerTransition: 'signature' }, // Hero transition
			{ id: '6C', texts: [5, 6], layerTransition: 'signature' },
			{ id: '6D', texts: [7, 8], layerTransition: 'section' },
			{ id: '6E', texts: [9, 10, 11] } // Text 11 bridges to Ch7
		],
		transitionIn: 'micro',
		transitionOut: 'micro'
	},

	// Chapter 7: Heat & Tide (L3)
	{
		id: 7,
		frames: [
			{ id: '7A', texts: [1, 2], layerTransition: 'section' }, // Text 1 from Ch6
			{ id: '7B', texts: [3, 4], layerTransition: 'section' },
			{ id: '7C', texts: [5, 6], layerTransition: 'section' },
			{ id: '7D', texts: [7] }
		],
		transitionIn: 'micro',
		transitionOut: 'section'
	},

	// Chapter 8: Release
	{
		id: 8,
		frames: [
			{ id: '8A', texts: [1, 2], layerTransition: 'section' },
			{ id: '8B', texts: [], layerTransition: 'section' }, // Scene change only
			{ id: '8C', texts: [], layerTransition: 'section' },
			{ id: '8D', texts: [3], layerTransition: 'section' },
			{ id: '8E', texts: [4, 5], holdAfter: 800 }
		],
		transitionIn: 'section',
		transitionOut: 'sectionHeld'
	},

	// Chapter 9: Residue & Dawn
	{
		id: 9,
		frames: [
			{ id: '9A', texts: [1] },
			{ id: '9B', texts: [2], layerTransition: 'section' },
			{ id: '9C', texts: [3], layerTransition: 'section' },
			{ id: '9D', texts: [4, 5, 6, 7, 8, 9], holdAfter: 1500 } // Final hold
		],
		transitionIn: 'sectionHeld',
		transitionOut: 'signature' // Long fade out
	}
]

/**
 * Get chapter definition by ID
 */
export function getChapterDefinition(id: number): ChapterDefinition | undefined {
	return chapterDefinitions.find((ch) => ch.id === id)
}
