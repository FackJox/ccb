<script lang="ts">
  import { onMount } from 'svelte'
  import { allAssetPaths } from '$data'
  import { preloadImagesBatched, type PreloadProgress } from '$utils'
  import { registerGSAP, gsap } from '$gsap'

  interface Props {
    onFadeComplete?: () => void
  }

  let { onFadeComplete }: Props = $props()

  let progress = $state(0)
  let isComplete = $state(false)

  // Element reference for GSAP
  let loadingContent: HTMLDivElement
  let loadingScreen: HTMLDivElement

  // Brand motion tokens
  const EASE_EXIT = 'power2.in' // ease-brand-exit

  async function fadeOutContent() {
    registerGSAP()

    // First fade out the content
    await gsap.to(loadingContent, {
      opacity: 0,
      duration: 0.3,
      ease: EASE_EXIT,
    })

    // Brief pause (heartbeat snag)
    await new Promise((resolve) => setTimeout(resolve, 150))

    // Notify parent to open curtains
    onFadeComplete?.()
  }

  onMount(async () => {
    const handleProgress = (p: PreloadProgress) => {
      progress = p.percent
    }

    // Preload all assets
    await preloadImagesBatched(allAssetPaths, 4, handleProgress)

    // Mark complete
    isComplete = true

    // Short delay before fade animation
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Fade out content and notify parent
    await fadeOutContent()
  })
</script>

<div
  bind:this={loadingScreen}
  class="loading-screen"
  aria-live="polite"
  aria-busy={!isComplete}
>
  <div bind:this={loadingContent} class="loading-content">
    <h1 class="loading-title">Violet Square</h1>
    <p class="loading-subtitle">A cinematic waltz in ink and violet light</p>

    <div class="loading-progress">
      <div class="loading-bar">
        <div class="loading-fill" style:width="{progress}%"></div>
      </div>
      <span class="loading-percent">{progress}%</span>
    </div>

    {#if isComplete}
      <p class="loading-ready">Ready</p>
    {/if}
  </div>
</div>

<style>
  .loading-screen {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    /* Transparent so curtain behind is visible */
    background: transparent;
    pointer-events: none;
  }

  .loading-content {
    text-align: center;
    color: #f4e3c9;
  }

  .loading-title {
    font-family: 'Canela Bold', Georgia, serif;
    font-size: 2.5rem;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
  }

  .loading-subtitle {
    font-family: 'Spectral', Georgia, serif;
    font-size: 1rem;
    opacity: 0.7;
    font-style: italic;
    margin-bottom: 2rem;
  }

  .loading-progress {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .loading-bar {
    width: 200px;
    height: 2px;
    background: rgba(162, 72, 255, 0.2);
    border-radius: 1px;
    overflow: hidden;
  }

  .loading-fill {
    height: 100%;
    background: #a248ff;
    transition: width 0.2s ease-out;
  }

  .loading-percent {
    font-family: 'Spectral', Georgia, serif;
    font-size: 0.75rem;
    color: #a248ff;
    width: 3ch;
    text-align: right;
  }

  .loading-ready {
    margin-top: 1.5rem;
    font-family: 'Canela Bold', Georgia, serif;
    font-size: 0.875rem;
    color: #a248ff;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
