<script lang="ts">
  import type { Frame } from '$data'
  import LayerStack from '$components/layers/LayerStack.svelte'
  import TextFragment from '$components/text/TextFragment.svelte'
  import TypographyBeat from '$components/text/TypographyBeat.svelte'

  interface Props {
    frame: Frame
    active?: boolean
    class?: string
  }

  let { frame, active = false, class: className = '' }: Props = $props()
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
      {#each frame.text as textBlock, i}
        {#if textBlock.type === 'beat'}
          <TypographyBeat
            content={textBlock.content}
            size="large"
          />
        {:else}
          <TextFragment
            content={textBlock.content}
            position={textBlock.position}
            offset={i * 4}
          />
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  .frame {
    /* Centered within viewport via absolute positioning */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 852px;
    height: 393px;
    /* GSAP controls layer opacity - frame container is always visible */
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
