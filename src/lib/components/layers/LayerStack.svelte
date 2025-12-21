<script lang="ts">
  import type { Layer } from '$data'
  import BackgroundLayer from './BackgroundLayer.svelte'
  import ForegroundLayer from './ForegroundLayer.svelte'

  interface Props {
    layers: Layer[]
    class?: string
  }

  let { layers, class: className = '' }: Props = $props()

  // Sort layers by zIndex
  const sortedLayers = $derived(
    [...layers].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
  )

  /**
   * Derive layer ID from asset path for GSAP targeting
   * e.g., /assets/C1/C1BG.png → c1-bg
   *       /assets/C1/C1FG1.png → c1-fg1
   *       /assets/shared/fg/couple-closeup.png → couple-closeup
   */
  function getLayerId(src: string): string {
    const filename = src.split('/').pop()?.replace(/\.[^.]+$/, '') || ''
    // Insert hyphen between chapter prefix (C1, C2, etc.) and layer type (BG, FG, FG1, etc.)
    // C1BG → c1-bg, C1FG1 → c1-fg1
    const formatted = filename
      .replace(/^(C\d+)(BG|FG\d*)/i, '$1-$2')
      .toLowerCase()
    return formatted
  }
</script>

<div class="layer-stack {className}">
  {#each sortedLayers as layer (layer.src)}
    {#if layer.type === 'bg'}
      <BackgroundLayer
        src={layer.src}
        parallax={layer.parallax ?? 0.8}
        zIndex={layer.zIndex ?? 0}
        layerId={getLayerId(layer.src)}
      />
    {:else}
      <ForegroundLayer
        src={layer.src}
        zIndex={layer.zIndex ?? 1}
        layerId={getLayerId(layer.src)}
      />
    {/if}
  {/each}
</div>

<style>
  .layer-stack {
    position: relative;
    width: 852px;
    height: 393px;
    overflow: hidden;
  }
</style>
