<script lang="ts">
  import { onMount } from 'svelte'
  import type { Chapter } from '$data'

  interface Props {
    chapter: Chapter
    children: import('svelte').Snippet
    class?: string
  }

  let { chapter, children, class: className = '' }: Props = $props()

  let containerEl: HTMLElement

  onMount(() => {
    console.log(`[Chapter ${chapter.id}] Mounted, complexity=${chapter.complexity}`)
  })
</script>

<!--
  Chapter container: All chapters stack at the same position (absolute).
  GSAP controls visibility via opacity on child frames.
  Chapters don't scroll - the master timeline scrubs animations as user scrolls.
-->
<div
  bind:this={containerEl}
  id="chapter-{chapter.id}"
  class="chapter {className}"
  data-chapter={chapter.id}
  data-complexity={chapter.complexity}
>
  {@render children()}
</div>

<style>
  .chapter {
    /* All chapters stack at the same position within the pinned stage */
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
