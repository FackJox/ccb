<script lang="ts">
  import {
    ScrollContainer,
    Chapter,
    LoadingScreen,
    TheatreCurtain,
    VioletMask,
  } from '$components'
  import { ChapterScene } from '$components/chapters'
  import { chapters } from '$data'
  import { createScrollState, createVioletState, createCurtainState } from '$stores'

  let isLoading = $state(true)
  let isReady = $state(false)
  let curtainIsOpen = $state(false)
  let curtainAnimating = $state(false)

  const scrollState = createScrollState()
  const violetState = createVioletState()
  const curtainState = createCurtainState()

  // Reference to curtain component for triggering reveal
  let curtain: TheatreCurtain

  // Watch for curtain state changes (controlled by Chapter 9 timeline)
  $effect(() => {
    if (!curtain || curtainAnimating || isLoading) return

    const shouldBeClosed = curtainState.shouldClose

    if (shouldBeClosed && curtainIsOpen) {
      // Close the curtain
      curtainAnimating = true
      curtain.close().then(() => {
        curtainIsOpen = false
        curtainAnimating = false
      })
    } else if (!shouldBeClosed && !curtainIsOpen && !isLoading) {
      // Reopen the curtain (user scrolled back)
      curtainAnimating = true
      curtain.open().then(() => {
        curtainIsOpen = true
        curtainAnimating = false
      })
    }
  })

  async function handleLoadingFadeComplete() {
    // Open the theatre curtain
    await curtain.open()
    curtainIsOpen = true
    // Remove loading screen from DOM
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

<!-- ScrollContainer renders behind everything so curtains reveal Chapter 1 -->
<ScrollContainer onReady={handleScrollReady}>
  {#each chapters as chapter (chapter.id)}
    <Chapter {chapter}>
      <!-- All chapters use generic ChapterScene with data-driven configuration -->
      <ChapterScene chapterId={chapter.id} />
    </Chapter>
  {/each}
</ScrollContainer>

<!-- Theatre curtain: sits between content and loading screen -->
<TheatreCurtain bind:this={curtain} />

<!-- Final text overlay: animated by Chapter 9 timeline, positioned above curtain -->
<div class="final-text-overlay" data-final-text>
  <p class="final-text">New as dawn.</p>
</div>

<!-- Violet mask: timeline-driven, appears with C6 text 2, fades with C8 text 4 -->
<VioletMask
  active={violetState.active}
  intensity={0.6}
/>

<!-- LoadingScreen overlays on top, fades content then triggers curtain reveal -->
{#if isLoading}
  <LoadingScreen onFadeComplete={handleLoadingFadeComplete} />
{/if}

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: #0B0508;
  }

  .final-text-overlay {
    position: fixed;
    inset: 0;
    z-index: 9500; /* Above curtain (9000), below loading screen (10000) */
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    /* Initial state - GSAP will animate this */
    opacity: 0;
  }

  .final-text {
    font-family: 'Canela Bold', Georgia, serif;
    font-size: 2.5rem;
    color: #F4E3C9;
    letter-spacing: 0.05em;
    text-align: center;
    margin: 0;
  }
</style>
