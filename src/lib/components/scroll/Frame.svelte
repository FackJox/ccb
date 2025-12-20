<script lang="ts">
  import type { Frame } from '$data'
  import LayerStack from '$components/layers/LayerStack.svelte'

  interface Props {
    frame: Frame
    active?: boolean
    class?: string
    textContent?: import('svelte').Snippet
  }

  let { frame, active = false, class: className = '', textContent }: Props = $props()
</script>

<div
  id="frame-{frame.id}"
  class="frame {className}"
  class:active
  data-frame={frame.id}
  data-chapter={frame.chapter}
>
  <LayerStack layers={frame.layers} />

  {#if frame.text.length > 0}
    <div class="frame-text">
      {#if textContent}
        {@render textContent()}
      {/if}
    </div>
  {/if}
</div>

<style>
  .frame {
    position: absolute;
    inset: 0;
    width: 852px;
    height: 393px;
    opacity: 0;
    transition: opacity 0.55s cubic-bezier(0.33, 0.0, 0.15, 1.0);
  }

  .frame.active {
    opacity: 1;
  }

  .frame-text {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 100;
  }

  .frame-text > :global(*) {
    pointer-events: auto;
  }
</style>
