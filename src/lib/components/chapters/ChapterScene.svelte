<script lang="ts">
  /**
   * ChapterScene - Generic scene renderer for all chapters
   *
   * Renders layers and text blocks based on scene configuration data.
   * GSAP timelines control opacity/transforms via data-* attributes.
   *
   * Usage:
   *   <ChapterScene chapterId={1} />
   */
  import { getSceneConfig } from '$data/scenes'
  import type { SceneLayer, SceneTextBlock } from '$data/scenes'
  import TypographyBeat from '$components/text/TypographyBeat.svelte'

  interface Props {
    chapterId: number
    class?: string
  }

  let { chapterId, class: className = '' }: Props = $props()

  // Get scene configuration for this chapter
  const config = $derived(getSceneConfig(chapterId))

  // Helper to generate text block positioning styles
  function getTextBlockStyle(block: SceneTextBlock): string {
    if (!block.position) return ''
    const styles: string[] = []
    if (block.position.top) styles.push(`top: ${block.position.top}`)
    if (block.position.right) styles.push(`right: ${block.position.right}`)
    if (block.position.left) styles.push(`left: ${block.position.left}`)
    return styles.join('; ')
  }

  // Helper to generate layer positioning styles
  function getLayerStyle(layer: SceneLayer): string {
    const styles: string[] = []

    // Position
    if (layer.position.anchor === 'left') {
      styles.push(`left: ${layer.position.offset || '0'}`)
    } else if (layer.position.anchor === 'right') {
      styles.push(`right: ${layer.position.offset || '0'}`)
    } else {
      styles.push('left: 50%')
      styles.push('transform: translateX(-50%)')
    }

    if (layer.position.bottom) {
      styles.push('bottom: 0')
    } else {
      styles.push('top: 0')
    }

    // Size
    if (layer.size.height) {
      styles.push(`height: ${layer.size.height}`)
    }
    if (layer.size.width) {
      styles.push(`width: ${layer.size.width}`)
    } else {
      styles.push('width: auto')
    }

    // Z-index
    styles.push(`z-index: ${layer.zIndex}`)

    // Initial opacity
    styles.push(`opacity: ${layer.initialOpacity ?? 0}`)

    // Initial scale
    if (layer.initialScale && layer.initialScale !== 1) {
      styles.push(`transform: scale(${layer.initialScale})`)
    }

    return styles.join('; ')
  }
</script>

{#if config}
  <div
    class="chapter-scene {className}"
  >
    <!-- Layer Stack -->
    <div class="layer-container">
      {#each config.layers as layer (layer.id)}
        <img
          src={layer.src}
          alt={layer.alt}
          class="scene-layer {layer.type}"
          class:bg-layer={layer.type === 'bg'}
          class:fg-layer={layer.type === 'fg'}
          data-layer={layer.id}
          style={getLayerStyle(layer)}
          draggable="false"
        />
      {/each}
    </div>

    <!-- Text Container -->
    {#if config.textBlocks.length > 0}
      <div class="text-container" data-text-container>
        {#each config.textBlocks as block (block.num)}
          {#if block.type === 'beat' || block.type === 'consent'}
            <!-- Beat/consent text - special centered styling -->
            <div
              class="text-block beat"
              data-text-block={block.num}
              data-beat={block.type === 'beat' ? '' : undefined}
              data-consent={block.type === 'consent' ? '' : undefined}
              style={getTextBlockStyle(block)}
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
              style={getTextBlockStyle(block)}
            >
              <p>{block.content}</p>
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
{:else}
  <div class="chapter-scene {className}" data-chapter={chapterId}>
    <p class="error">No scene configuration for Chapter {chapterId}</p>
  </div>
{/if}

<style>
  .chapter-scene {
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

  /* Base layer styling */
  .scene-layer {
    position: absolute;
    object-fit: contain;
    user-select: none;
    -webkit-user-drag: none;
  }

  /* Background layers fill the frame */
  .bg-layer {
    object-fit: cover;
  }

  /* Foreground layers have will-change for animations */
  .fg-layer {
    will-change: opacity, transform;
  }

  /* Text Container - full width, children position themselves */
  .text-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
    /* No flex - children are absolutely positioned to overlap */
  }

  /* Base text block - parchment style (default) */
  /* Position is set via inline styles from scene config, defaults here as fallback */
  .text-block {
    position: absolute;
    top: 25%;    /* Fallback - overridden by inline style */
    right: 0;    /* Fallback - overridden by inline style */
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

  /* Transparent style for later frame texts */
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
    /* Override base positioning - center in frame */
    top: 50%;
    left: 50%;
    right: auto;
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

  .error {
    color: #F4E3C9;
    text-align: center;
    padding: 2rem;
  }
</style>
