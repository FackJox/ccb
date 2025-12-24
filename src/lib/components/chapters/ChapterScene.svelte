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
  // Uses CSS custom properties so CSS can apply safe margins via max()
  function getTextBlockStyle(block: SceneTextBlock): string {
    if (!block.position) return ''
    const styles: string[] = []

    if (block.position.top) styles.push(`--text-top: ${block.position.top}`)

    // Center positioning is handled entirely by CSS
    if (block.position.center) {
      // No left/right needed - CSS handles centering via left:50% + translateX(-50%)
    } else if (block.position.left) {
      // Pass position as CSS variable for safe margin clamping
      styles.push(`--text-left: ${block.position.left}`)
      // For positioned beats, clear the opposite side (beats have left:0, right:0 by default)
      if (block.type === 'beat' || block.type === 'consent') {
        styles.push('right: auto')
      }
    } else if (block.position.right) {
      // Pass position as CSS variable for safe margin clamping
      styles.push(`--text-right: ${block.position.right}`)
      // For positioned beats, clear the opposite side
      if (block.type === 'beat' || block.type === 'consent') {
        styles.push('left: auto')
      }
    }
    // For positioned beats, prevent line wrapping
    if (block.type === 'beat' || block.type === 'consent') {
      styles.push('white-space: nowrap')
    }
    return styles.join('; ')
  }

  // Helper to determine anchor side for CSS positioning
  function getTextBlockAnchor(block: SceneTextBlock): 'left' | 'right' | 'center' | null {
    if (!block.position) return null
    if (block.position.center) return 'center'
    if (block.position.left) return 'left'
    if (block.position.right) return 'right'
    return null
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
      styles.push(`bottom: ${layer.position.bottomOffset || '0'}`)
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
          data-initial-opacity={layer.initialOpacity ?? 0}
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
            <!-- Beat/consent text - dramatic typographic moment (full-width default, or positioned) -->
            <div
              class="text-block beat"
              class:beat-positioned={!!block.position}
              data-text-block={block.num}
              data-beat={block.type === 'beat' ? '' : undefined}
              data-consent={block.type === 'consent' ? '' : undefined}
              data-anchor={getTextBlockAnchor(block)}
              style={block.position ? getTextBlockStyle(block) : ''}
            >
              <TypographyBeat
                content={block.content}
                size="large"
                variant={block.type === 'consent' ? 'consent' : 'beat'}
              />
            </div>
          {:else}
            <!-- Fragment text - parchment or transparent -->
            <div
              class="text-block"
              class:transparent={block.style === 'transparent'}
              class:emphasis={block.emphasis}
              data-text-block={block.num}
              data-anchor={getTextBlockAnchor(block)}
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

    /* Scale to fit viewport - --scale is set by ScrollContainer */
    transform: scale(var(--scale, 1));
    transform-origin: center center;
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

  /*
   * Safe Text Positioning System
   *
   * Uses CSS custom properties with max() to enforce minimum safe margins.
   * This ensures text never clips viewport edges on any device/aspect ratio.
   *
   * Pattern: Position values are passed as --text-left, --text-right, --text-top
   * CSS applies max(value, SAFE_MARGIN) to enforce minimum distance from edges.
   */

  /* Base text block - parchment style (default) */
  /* Position is set via CSS custom properties + data-anchor attribute */
  .text-block {
    position: absolute;
    max-width: 300px;
    padding: 16px 20px;
    background: #F4E3C9; /* bakeryParchment */
    color: #0B0508; /* velvetSoot */
    font-family: 'Spectral', Georgia, serif;
    font-size: 0.875rem;
    line-height: 1.5;
    pointer-events: auto;
    will-change: transform, opacity;

    /* Position using CSS custom properties with safe margin clamping */
    /* max() ensures minimum 5% distance from edges */
    top: max(var(--text-top, 25%), 3%);

    /* Realistic torn paper effect using SVG clip-path */
    clip-path: url(#torn-paper-clip);

    /* Subtle paper shadow for depth */
    filter: drop-shadow(0 2px 4px rgba(11, 5, 8, 0.15));

    /* GSAP controls - starts invisible */
    opacity: 0;
  }

  /* Anchor-based positioning with safe margins via max() */
  .text-block[data-anchor="right"] {
    /* Enforce minimum 5% from right edge */
    right: max(var(--text-right, 0%), 5%);
    left: auto;
  }

  .text-block[data-anchor="left"] {
    /* Enforce minimum 5% from left edge */
    left: max(var(--text-left, 0%), 5%);
    right: auto;
  }

  .text-block[data-anchor="center"] {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
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

  /* Beat text - dramatic full-width typographic moment (default: centered at top) */
  .text-block.beat {
    /* Default: full-width centered with safe horizontal margins */
    top: max(var(--text-top, 8%), 3%);
    left: 5%;
    right: 5%;
    transform: none;
    width: auto;
    max-width: 90%; /* Constrain width to leave safe margins */

    /* Reset parchment styles */
    background: transparent;
    padding: 0;
    clip-path: none;
    filter: none;

    /* Let TypographyBeat handle all styling */
  }

  /* Positioned beat - when position is specified, use individual positioning */
  .text-block.beat.beat-positioned {
    width: auto;
    max-width: none;
    right: auto;  /* Clear full-width defaults */
  }

  /* Positioned beat anchored right - with safe margin */
  .text-block.beat.beat-positioned[data-anchor="right"] {
    right: max(var(--text-right, 0%), 5%);
    left: auto;
  }

  /* Positioned beat anchored left - with safe margin */
  .text-block.beat.beat-positioned[data-anchor="left"] {
    left: max(var(--text-left, 0%), 5%);
    right: auto;
  }

  /* Centered positioned beat */
  .text-block.beat.beat-positioned[data-anchor="center"] {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
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
