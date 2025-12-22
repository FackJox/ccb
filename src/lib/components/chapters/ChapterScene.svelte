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
    data-chapter={chapterId}
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

  /* Transparent style for later frame texts */
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

  .error {
    color: #F4E3C9;
    text-align: center;
    padding: 2rem;
  }
</style>
