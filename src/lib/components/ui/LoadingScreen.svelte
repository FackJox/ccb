<script lang="ts">
  import { onMount } from 'svelte'
  import { allAssetPaths } from '$data'
  import { preloadImagesBatched, type PreloadProgress } from '$utils'

  interface Props {
    onComplete?: () => void
  }

  let { onComplete }: Props = $props()

  let progress = $state(0)
  let isComplete = $state(false)
  let isExiting = $state(false)

  onMount(async () => {
    const handleProgress = (p: PreloadProgress) => {
      progress = p.percent
    }

    // Preload all assets
    await preloadImagesBatched(allAssetPaths, 4, handleProgress)

    // Mark complete and start exit animation
    isComplete = true

    // Short delay before exit animation
    await new Promise(resolve => setTimeout(resolve, 300))
    isExiting = true

    // Wait for exit animation
    await new Promise(resolve => setTimeout(resolve, 600))
    onComplete?.()
  })
</script>

<div
  class="loading-screen"
  class:exiting={isExiting}
  aria-live="polite"
  aria-busy={!isComplete}
>
  <div class="loading-content">
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
    background: #0B0508;
    transition: opacity 0.6s cubic-bezier(0.33, 0.0, 0.15, 1.0);
  }

  .loading-screen.exiting {
    opacity: 0;
    pointer-events: none;
  }

  .loading-content {
    text-align: center;
    color: #F4E3C9;
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
    background: #A248FF;
    transition: width 0.2s ease-out;
  }

  .loading-percent {
    font-family: 'Spectral', Georgia, serif;
    font-size: 0.75rem;
    color: #A248FF;
    width: 3ch;
    text-align: right;
  }

  .loading-ready {
    margin-top: 1.5rem;
    font-family: 'Canela Bold', Georgia, serif;
    font-size: 0.875rem;
    color: #A248FF;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
</style>
