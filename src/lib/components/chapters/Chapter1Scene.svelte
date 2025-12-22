<script lang="ts">
  /**
   * Chapter 1: The Held Breath - Scene Component
   *
   * Single continuous scene with layered animations:
   * - Frame A (0-30%): BG + Ceci, texts 1-3
   * - Frame B (30-65%): + Jack, texts 4-5
   * - Frame C (65-100%): texts 6-7 (transparent), beat text
   *
   * GSAP controls all opacity/transform via data-* attributes
   */
  import { chapterAssets } from '$data'
  import TypographyBeat from '$components/text/TypographyBeat.svelte'

  interface Props {
    class?: string
  }

  let { class: className = '' }: Props = $props()

  // Text blocks with style metadata for GSAP targeting
  // Block numbers match data-text-block attributes (1-8)
  const textBlocks = [
    // Frame A texts (parchment style)
    {
      num: 1,
      content: 'The violin faltered once, a heartbeat snag, as Ceci dared the room to breathe with her.',
      type: 'fragment' as const,
      style: 'parchment' as const,
    },
    {
      num: 2,
      content: 'In the lamplight, flour still ghosted her wrists from the bakery below, and lilac silk clung damp at the hem.',
      type: 'fragment' as const,
      style: 'parchment' as const,
    },
    {
      num: 3,
      content: 'She lifted her chin—three-count nested in the pause—and the people lining the confiscated hôtel hallway forgot to blink.',
      type: 'fragment' as const,
      style: 'parchment' as const,
    },
    // Frame B texts (parchment style)
    {
      num: 4,
      content: "From the corner, where a restless lantern cluster hissed, Jack recognized the rhythm she'd been humming through the market streets.",
      type: 'fragment' as const,
      style: 'parchment' as const,
    },
    {
      num: 5,
      content: 'He knew it before he knew her name. He knew it the way a city knows rain.',
      type: 'fragment' as const,
      style: 'parchment' as const,
      emphasis: true, // Bold emphasis on second sentence
    },
    // Frame C texts (transparent style)
    {
      num: 6,
      content: 'They were supposed to be alone, "rehearsing," though that word had become a lie.',
      type: 'fragment' as const,
      style: 'transparent' as const,
    },
    {
      num: 7,
      content: 'Neighbors gathered at the edges of the hall. Windows faced the square—too exposed, too dangerous—',
      type: 'fragment' as const,
      style: 'transparent' as const,
    },
    // Beat text (special centered styling)
    {
      num: 8,
      content: 'Let them look. Let the city breathe again.',
      type: 'beat' as const,
      style: 'beat' as const,
    },
  ]
</script>

<!--
  Chapter 1 Scene Container
  Single continuous scene - GSAP controls all layer/text opacity via data-* attrs
-->
<div
  class="chapter1-scene {className}"
  data-chapter="1"
>
  <!-- Layer Stack -->
  <div class="layer-container">
    <!-- Background - always visible, z-index 0 -->
    <img
      src={chapterAssets.C1.bg}
      alt="Room interior with large window"
      class="bg-layer"
      data-layer="bg"
      draggable="false"
    />

    <!-- Ceci (FG1) - fades in at 3%, z-index 1 -->
    <img
      src={chapterAssets.C1.fg1}
      alt="Ceci in purple dress"
      class="fg-ceci"
      data-layer="ceci"
      draggable="false"
    />

    <!-- Jack (FG2) - fades in at 28%, z-index 2 -->
    <img
      src={chapterAssets.C1.fg2}
      alt="Jack with violin"
      class="fg-jack"
      data-layer="jack"
      draggable="false"
    />
  </div>

  <!-- Text Container - positioned center-right -->
  <div class="text-container" data-text-container>
    {#each textBlocks as block (block.num)}
      {#if block.type === 'beat'}
        <!-- Beat text - special centered styling -->
        <div
          class="text-block beat"
          data-text-block={block.num}
          data-beat
        >
          <TypographyBeat content={block.content} size="large" />
        </div>
      {:else}
        <!-- Fragment text - parchment or transparent -->
        <div
          class="text-block"
          class:transparent={block.style === 'transparent'}
          class:emphasis={block.emphasis}
          data-text-block={block.num}
        >
          <p>{block.content}</p>
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .chapter1-scene {
    position: relative;
    width: 852px;
    height: 393px;
    overflow: hidden;
    background: #0B0508; /* velvetSoot fallback */
  }

  .layer-container {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  /* Background - fills entire frame, z-index 0 */
  .bg-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    user-select: none;
    -webkit-user-drag: none;
  }

  /* Ceci - lower left, sitting/kneeling, z-index 1 */
  .fg-ceci {
    position: absolute;
    left: 5%;
    bottom: 0;
    height: 65%;
    width: auto;
    object-fit: contain;
    z-index: 1;
    user-select: none;
    -webkit-user-drag: none;
    will-change: opacity, transform;
    /* GSAP controls opacity - starts invisible, scale 1.02 */
    opacity: 0;
    transform: scale(1.02);
  }

  /* Jack - lower right, standing with violin, z-index 2 */
  .fg-jack {
    position: absolute;
    right: 8%;
    bottom: 0;
    height: 60%;
    width: auto;
    object-fit: contain;
    z-index: 2;
    user-select: none;
    -webkit-user-drag: none;
    will-change: opacity;
    /* GSAP controls opacity - starts invisible */
    opacity: 0;
  }

  /* Text Container - positioned center-right per storyboard */
  .text-container {
    position: absolute;
    top: 0;
    right: 10%;
    width: 45%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    padding: 16px 20px;
    gap: 12px;
  }

  /* Base text block - parchment style (default) */
  .text-block {
    max-width: 300px;
    padding: 12px 16px;
    background: #F4E3C9; /* bakeryParchment */
    color: #0B0508; /* velvetSoot */
    font-family: 'Spectral', Georgia, serif;
    font-size: 0.875rem;
    line-height: 1.5;
    pointer-events: auto;
    will-change: transform, opacity;
    align-self: flex-end;

    /* Torn flyer effect */
    clip-path: polygon(
      2px 0,
      100% 1px,
      calc(100% - 1px) 100%,
      0 calc(100% - 2px)
    );

    /* GSAP controls - starts invisible */
    opacity: 0;
  }

  .text-block p {
    margin: 0;
  }

  /* Transparent style for Frame C texts (6, 7) */
  .text-block.transparent {
    background: transparent;
    color: #F4E3C9; /* bakeryParchment */
    clip-path: none;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }

  /* Emphasis style for bold lines */
  .text-block.emphasis p {
    font-weight: 600;
  }

  /* Beat text - special centered styling */
  .text-block.beat {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    max-width: 90%;
    width: auto;
    background: transparent;
    color: #F4E3C9; /* bakeryParchment */
    text-align: center;
    padding: 16px 24px;
    clip-path: none;
    font-family: 'Canela Bold', Georgia, serif;
    font-size: 1.25rem;
    letter-spacing: 0.05em;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
    align-self: center;
  }
</style>
