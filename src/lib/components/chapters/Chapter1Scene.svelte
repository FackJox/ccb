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

  <!-- Text Containers - grouped by frame for proper positioning -->
  <div class="text-container" data-text-container>
    <!-- Frame A texts (1-3): Upper-right area -->
    <div class="frame-group frame-a" data-frame="a">
      {#each textBlocks.filter(b => b.num <= 3) as block (block.num)}
        <div
          class="text-block"
          data-text-block={block.num}
        >
          <p>{block.content}</p>
        </div>
      {/each}
    </div>

    <!-- Frame B texts (4-5): Center-right area -->
    <div class="frame-group frame-b" data-frame="b">
      {#each textBlocks.filter(b => b.num >= 4 && b.num <= 5) as block (block.num)}
        <div
          class="text-block"
          class:emphasis={block.emphasis}
          data-text-block={block.num}
        >
          <p>{block.content}</p>
        </div>
      {/each}
    </div>

    <!-- Frame C texts (6-7): Center-right area, transparent style -->
    <div class="frame-group frame-c" data-frame="c">
      {#each textBlocks.filter(b => b.num >= 6 && b.num <= 7) as block (block.num)}
        <div
          class="text-block transparent"
          data-text-block={block.num}
        >
          <p>{block.content}</p>
        </div>
      {/each}
    </div>

    <!-- Beat text - special centered styling (absolute within container) -->
    <div
      class="text-block beat"
      data-text-block="8"
      data-beat
    >
      <TypographyBeat content={textBlocks[7].content} size="large" />
    </div>
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
    right: 0;
    width: 55%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
  }

  /* Frame groups - each positioned absolutely at their storyboard location */
  .frame-group {
    position: absolute;
    right: 10%;
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
  }

  /* Frame A (texts 1-3): Upper-right, starts ~15% from top */
  .frame-a {
    top: 10%;
  }

  /* Frame B (texts 4-5): Center-right, starts ~28% from top */
  .frame-b {
    top: 28%;
  }

  /* Frame C (texts 6-7): Center-right, similar to B */
  .frame-c {
    top: 28%;
  }

  /* Base text block - parchment style (default) */
  .text-block {
    position: relative;
    max-width: 300px;
    padding: 16px 20px;
    background: #F4E3C9; /* bakeryParchment */
    color: #0B0508; /* velvetSoot */
    font-family: 'Spectral', Georgia, serif;
    font-size: 0.875rem;
    line-height: 1.5;
    pointer-events: auto;
    will-change: transform, opacity;

    /* Realistic torn paper effect using SVG clip-path */
    clip-path: url(#torn-paper-clip);

    /* Subtle paper shadow for depth */
    filter: drop-shadow(0 2px 4px rgba(11, 5, 8, 0.15));

    /* GSAP controls - starts invisible */
    opacity: 0;
  }

  /*
   * Torn edge highlight - simulates the lighter fiber edge of torn paper
   */
  .text-block::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.1) 8%,
      transparent 12%,
      transparent 88%,
      rgba(255, 255, 255, 0.1) 92%,
      rgba(255, 255, 255, 0.35) 100%
    );
    pointer-events: none;
    clip-path: url(#torn-paper-clip);
  }

  .text-block p {
    margin: 0;
    position: relative; /* Above the ::before */
  }

  /* Transparent style for Frame C texts (6, 7) */
  .text-block.transparent {
    background: transparent;
    color: #F4E3C9; /* bakeryParchment */
    clip-path: none;
    filter: none;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }

  .text-block.transparent::before {
    display: none;
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
    filter: none;
    font-family: 'Canela Bold', Georgia, serif;
    font-size: 1.25rem;
    letter-spacing: 0.05em;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  }

  .text-block.beat::before {
    display: none;
  }
</style>
