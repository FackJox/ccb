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
  let showInstallPrompt = $state(false)
  let installPromptDismissed = $state(false)

  // Platform detection
  let isIOS = $state(false)
  let isAndroid = $state(false)

  // Element reference for GSAP
  let loadingContent: HTMLDivElement
  let loadingScreen: HTMLDivElement

  // Brand motion tokens
  const EASE_EXIT = 'power2.in' // ease-brand-exit
  const STORAGE_KEY = 'violet-square-install-dismissed'

  function shouldShowInstallPrompt(): boolean {
    if (typeof window === 'undefined') return false

    // Check if mobile
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (!isMobile) return false

    // Check if already running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true
    if (isStandalone) return false

    // Check if previously dismissed
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (dismissed) return false

    return true
  }

  function dismissInstallPrompt() {
    showInstallPrompt = false
    installPromptDismissed = true
    localStorage.setItem(STORAGE_KEY, 'true')
  }

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
    // Detect platform
    const ua = navigator.userAgent
    isIOS = /iPad|iPhone|iPod/.test(ua)
    isAndroid = /Android/.test(ua)

    const handleProgress = (p: PreloadProgress) => {
      progress = p.percent
    }

    // Preload all assets
    await preloadImagesBatched(allAssetPaths, 4, handleProgress)

    // Mark complete
    isComplete = true

    // Check if we need to show install prompt
    if (shouldShowInstallPrompt()) {
      showInstallPrompt = true
      // Wait for user to dismiss the prompt
      await new Promise<void>((resolve) => {
        const checkDismissed = () => {
          if (installPromptDismissed) {
            resolve()
          } else {
            requestAnimationFrame(checkDismissed)
          }
        }
        checkDismissed()
      })
    }

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

    {#if isComplete && !showInstallPrompt}
      <p class="loading-ready">Ready</p>
    {/if}

    {#if showInstallPrompt}
      <div class="install-prompt" role="dialog" aria-labelledby="install-title">
        <p id="install-title" class="prompt-title">For the full experience</p>

        {#if isIOS}
          <p class="prompt-instructions">
            Tap <span class="icon-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 3v12M12 3l4 4M12 3L8 7" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 14v5a2 2 0 002 2h12a2 2 0 002-2v-5" stroke-linecap="round"/>
              </svg>
            </span> then <strong>"Add to Home Screen"</strong>
          </p>
        {:else if isAndroid}
          <p class="prompt-instructions">
            Tap <span class="icon-badge">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2"/>
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="19" r="2"/>
              </svg>
            </span> then <strong>"Add to Home screen"</strong>
          </p>
        {:else}
          <p class="prompt-instructions">
            Use your browser menu to <strong>"Add to Home Screen"</strong>
          </p>
        {/if}

        <button class="dismiss-btn" onclick={dismissInstallPrompt}>
          Continue in browser
        </button>
      </div>
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

  /* Install prompt styles */
  .install-prompt {
    margin-top: 2rem;
    padding: 1.5rem 2rem;
    background: rgba(11, 5, 8, 0.8);
    border: 1px solid rgba(162, 72, 255, 0.3);
    border-radius: 12px;
    text-align: center;
    animation: fadeIn 0.5s cubic-bezier(0.33, 0, 0.15, 1);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .prompt-title {
    font-family: 'Canela Bold', Georgia, serif;
    font-size: 1rem;
    color: #f4e3c9;
    margin: 0 0 0.75rem 0;
  }

  .prompt-instructions {
    font-family: 'Spectral', Georgia, serif;
    font-size: 0.875rem;
    color: rgba(244, 227, 201, 0.8);
    margin: 0 0 1.25rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    flex-wrap: wrap;
  }

  .prompt-instructions strong {
    color: #a248ff;
  }

  .icon-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: rgba(162, 72, 255, 0.2);
    border-radius: 4px;
    vertical-align: middle;
  }

  .icon-badge svg {
    width: 16px;
    height: 16px;
    color: #a248ff;
  }

  .dismiss-btn {
    font-family: 'Spectral', Georgia, serif;
    font-size: 0.875rem;
    color: rgba(244, 227, 201, 0.6);
    background: transparent;
    border: 1px solid rgba(244, 227, 201, 0.2);
    border-radius: 6px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .dismiss-btn:hover {
    color: #f4e3c9;
    border-color: rgba(244, 227, 201, 0.4);
  }
</style>
