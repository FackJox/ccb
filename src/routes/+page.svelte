<script lang="ts">
  import {
    ScrollContainer,
    Chapter,
    ProgressIndicator,
    LoadingScreen,
    VioletMask,
  } from '$components'
  import { ChapterScene } from '$components/chapters'
  import { chapters } from '$data'
  import { createScrollState } from '$stores'

  let isLoading = $state(true)
  let isReady = $state(false)

  const scrollState = createScrollState()

  function handleLoadComplete() {
    isLoading = false
  }

  function handleScrollReady() {
    isReady = true
  }
</script>

<svelte:head>
  <title>Violet Square</title>
  <meta name="description" content="A cinematic waltz in ink and violet light - An immersive scrollytelling experience" />
</svelte:head>

{#if isLoading}
  <LoadingScreen onComplete={handleLoadComplete} />
{/if}

{#if !isLoading}
  <ScrollContainer onReady={handleScrollReady}>
    {#each chapters as chapter (chapter.id)}
      <Chapter {chapter}>
        <!-- All chapters use generic ChapterScene with data-driven configuration -->
        <ChapterScene chapterId={chapter.id} />
      </Chapter>
    {/each}
  </ScrollContainer>

  <ProgressIndicator />

  <!-- Violet mask for L3 chapter transitions -->
  <VioletMask
    active={scrollState.chapter.complexity === 'L3'}
    intensity={scrollState.chapterProgress * 0.6}
  />
{/if}

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: #0B0508;
  }
</style>
