<script lang="ts">
  import { onMount } from 'svelte'

  let showPrompt = $state(false)
  let isIOS = $state(false)
  let isAndroid = $state(false)
  let isStandalone = $state(false)

  const STORAGE_KEY = 'violet-square-install-dismissed'

  onMount(() => {
    // Check platform
    const ua = navigator.userAgent
    isIOS = /iPad|iPhone|iPod/.test(ua)
    isAndroid = /Android/.test(ua)

    // Check if mobile (touch device)
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    // Check if already running as PWA (standalone mode)
    isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                   (window.navigator as any).standalone === true

    // Check if previously dismissed
    const dismissed = localStorage.getItem(STORAGE_KEY)

    // Show prompt only on mobile, not in standalone, and not dismissed
    if (isMobile && !isStandalone && !dismissed) {
      // Delay showing to not interrupt initial experience
      setTimeout(() => {
        showPrompt = true
      }, 3000)
    }
  })

  function dismiss() {
    showPrompt = false
    localStorage.setItem(STORAGE_KEY, 'true')
  }
</script>

{#if showPrompt}
  <div class="install-prompt" role="dialog" aria-labelledby="install-title">
    <button class="dismiss-btn" onclick={dismiss} aria-label="Dismiss">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>

    <div class="prompt-content">
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
    </div>
  </div>
{/if}

<style>
  .install-prompt {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    background: rgba(11, 5, 8, 0.95);
    border: 1px solid rgba(162, 72, 255, 0.3);
    border-radius: 12px;
    padding: 16px 20px;
    padding-right: 44px;
    max-width: 320px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    animation: fadeIn 0.5s cubic-bezier(0.33, 0, 0.15, 1);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  .dismiss-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    padding: 4px;
    background: transparent;
    border: none;
    color: rgba(244, 227, 201, 0.5);
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .dismiss-btn:hover {
    color: rgba(244, 227, 201, 0.8);
  }

  .dismiss-btn svg {
    width: 100%;
    height: 100%;
  }

  .prompt-content {
    text-align: center;
  }

  .prompt-title {
    font-family: 'Canela Bold', Georgia, serif;
    font-size: 1rem;
    color: #F4E3C9;
    margin: 0 0 8px 0;
  }

  .prompt-instructions {
    font-family: 'Spectral', Georgia, serif;
    font-size: 0.875rem;
    color: rgba(244, 227, 201, 0.8);
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    flex-wrap: wrap;
  }

  .prompt-instructions strong {
    color: #A248FF;
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
    color: #A248FF;
  }
</style>
