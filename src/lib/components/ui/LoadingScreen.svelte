<script lang="ts">
  import { onMount } from 'svelte'
  import { allAssetPaths, curtainAssets } from '$data'
  import { preloadImagesBatched, type PreloadProgress } from '$utils'
  import { registerGSAP, gsap } from '$gsap'

  interface Props {
    onComplete?: () => void
  }

  let { onComplete }: Props = $props()

  let progress = $state(0)
  let isComplete = $state(false)

  // Element references for GSAP
  let loadingContent: HTMLDivElement
  let curtainLeft: HTMLImageElement
  let curtainRight: HTMLImageElement
  let curtainUpper: HTMLImageElement

  // Brand motion tokens
  const SIGNATURE_DURATION = 1.05
  const EASE_ENTER = 'power2.out' // ease-brand-enter
  const EASE_EXIT = 'power2.in' // ease-brand-exit

  async function playReveal() {
    registerGSAP()

    const tl = gsap.timeline()

    // Phase 1: Fade out loading content
    tl.to(loadingContent, {
      opacity: 0,
      duration: 0.3,
      ease: EASE_EXIT,
    })

    // Phase 2: Brief pause (heartbeat snag)
    tl.to({}, { duration: 0.15 })

    // Phase 3: Open curtains simultaneously
    tl.to(
      curtainLeft,
      {
        x: '-100%',
        duration: SIGNATURE_DURATION,
        ease: EASE_ENTER,
      },
      '<'
    )
      .to(
        curtainRight,
        {
          x: '100%',
          duration: SIGNATURE_DURATION,
          ease: EASE_ENTER,
        },
        '<'
      )
      .to(
        curtainUpper,
        {
          y: '-40%',
          duration: SIGNATURE_DURATION,
          ease: EASE_ENTER,
        },
        '<'
      )

    await tl.play()
    onComplete?.()
  }

  onMount(async () => {
    const handleProgress = (p: PreloadProgress) => {
      progress = p.percent
    }

    // Preload all assets
    await preloadImagesBatched(allAssetPaths, 4, handleProgress)

    // Mark complete
    isComplete = true

    // Short delay before reveal animation
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Play the curtain reveal
    await playReveal()
  })
</script>

<div class="loading-screen" aria-live="polite" aria-busy={!isComplete}>
  <!-- Curtain layers -->
  <div class="curtain-container">
    <img
      bind:this={curtainUpper}
      class="curtain curtain-upper"
      src={curtainAssets.upper}
      alt=""
    />
    <img
      bind:this={curtainLeft}
      class="curtain curtain-left"
      src={curtainAssets.left}
      alt=""
    />
    <img
      bind:this={curtainRight}
      class="curtain curtain-right"
      src={curtainAssets.right}
      alt=""
    />
  </div>

  <!-- Loading content (centered on top of curtains) -->
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
    background: #0b0508;
  }

  /* Curtain container */
  .curtain-container {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .curtain {
    position: absolute;
    object-fit: fill;
  }

  .curtain-upper {
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
  }

  .curtain-left,
  .curtain-right {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  /* Loading content */
  .loading-content {
    position: relative;
    z-index: 1;
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
