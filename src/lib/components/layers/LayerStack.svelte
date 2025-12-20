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
</script>

<div class="layer-stack {className}">
  {#each sortedLayers as layer (layer.src)}
    {#if layer.type === 'bg'}
      <BackgroundLayer
        src={layer.src}
        parallax={layer.parallax ?? 0.8}
        zIndex={layer.zIndex ?? 0}
      />
    {:else}
      <ForegroundLayer
        src={layer.src}
        zIndex={layer.zIndex ?? 1}
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
