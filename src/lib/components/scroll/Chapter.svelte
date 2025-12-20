<script lang="ts">
  import type { Chapter } from '$data'

  interface Props {
    chapter: Chapter
    children: import('svelte').Snippet
    class?: string
  }

  let { chapter, children, class: className = '' }: Props = $props()

  // Calculate height based on scroll region (reactive to prop changes)
  const regionLength = $derived(chapter.scrollRegion.end - chapter.scrollRegion.start)
  const heightPercent = $derived(regionLength * 100)
</script>

<section
  id="chapter-{chapter.id}"
  class="chapter {className}"
  data-chapter={chapter.id}
  data-complexity={chapter.complexity}
  style:height="{heightPercent}vh"
>
  <div class="chapter-content">
    {@render children()}
  </div>
</section>

<style>
  .chapter {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chapter-content {
    position: sticky;
    top: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
</style>
