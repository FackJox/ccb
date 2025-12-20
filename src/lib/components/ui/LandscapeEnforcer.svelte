<script lang="ts">
  import { onMount } from 'svelte'
  import { isLandscape, lockLandscape, isMobile } from '$utils'

  interface Props {
    children: import('svelte').Snippet
  }

  let { children }: Props = $props()

  let isInLandscape = $state(true)
  let isMobileDevice = $state(false)

  onMount(() => {
    isMobileDevice = isMobile()
    isInLandscape = isLandscape()

    // Attempt to lock orientation on mobile
    if (isMobileDevice) {
      lockLandscape()
    }

    // Listen for orientation changes
    const handleResize = () => {
      isInLandscape = isLandscape()
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  })

  const showWarning = $derived(isMobileDevice && !isInLandscape)
</script>

{#if showWarning}
  <div class="portrait-warning" role="alert">
    <div class="warning-content">
      <div class="rotate-icon">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2">
          <!-- Phone outline -->
          <rect x="14" y="8" width="20" height="32" rx="2" />
          <!-- Screen -->
          <rect x="16" y="12" width="16" height="24" fill="currentColor" opacity="0.1" />
          <!-- Rotation arrow -->
          <path d="M38 24 C44 24 44 36 38 36 L36 36" stroke-linecap="round" />
          <polyline points="34,34 36,36 34,38" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <p class="warning-text">Please rotate your device to landscape</p>
      <p class="warning-subtext">This experience is designed for horizontal viewing</p>
    </div>
  </div>
{/if}

<div class="landscape-content" class:hidden={showWarning}>
  {@render children()}
</div>

<style>
  .portrait-warning {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0B0508;
    padding: 2rem;
  }

  .warning-content {
    text-align: center;
    color: #F4E3C9;
    max-width: 280px;
  }

  .rotate-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    color: #A248FF;
    animation: rotate-hint 2s ease-in-out infinite;
  }

  @keyframes rotate-hint {
    0%, 100% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(90deg);
    }
  }

  .warning-text {
    font-family: 'Canela Bold', Georgia, serif;
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  .warning-subtext {
    font-family: 'Spectral', Georgia, serif;
    font-size: 0.875rem;
    opacity: 0.7;
  }

  .landscape-content {
    display: contents;
  }

  .landscape-content.hidden {
    display: none;
  }
</style>
