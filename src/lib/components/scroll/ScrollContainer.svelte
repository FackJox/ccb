<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import {
    registerGSAP,
    gsap,
    createScrollSmoother,
    killScrollSmoother,
    killAllScrollTriggers,
    ScrollTrigger,
  } from '$gsap'
  import { SCROLL_DISTANCE_VH } from '$gsap/timing-constants'
  import { createMasterTimeline } from '$gsap/master-timeline'
  import { setScrollProgress, setIsScrolling, resetVioletState } from '$stores'
  import { calculateScale } from '$utils'

  interface Props {
    children: import('svelte').Snippet
    onReady?: () => void
  }

  let { children, onReady }: Props = $props()

  let wrapper: HTMLElement
  let content: HTMLElement
  let scale = $state(1)
  let isReady = $state(false)
  let masterCtx: gsap.Context | null = null

  // Track cleanup functions
  let resizeObserver: ResizeObserver | null = null
  let scrollingDelayedCall: gsap.core.Tween | null = null
  let initialized = false
  let cleanupResize: (() => void) | null = null

  /**
   * Initialize the scroll system once content has dimensions
   */
  function initScrollSystem() {
    if (initialized) return
    initialized = true

    // Create ScrollSmoother
    createScrollSmoother(wrapper, content)

    // Get the stage element - this is our pinned viewport container
    const stage = content.querySelector('#stage') as HTMLElement
    if (!stage) {
      return
    }

    // Create master timeline with the stage - it handles pinning and animation
    masterCtx = createMasterTimeline(stage, {
      onUpdate: (progress) => {
        setScrollProgress(progress)
        setIsScrolling(true)

        // Use GSAP's delayedCall instead of setTimeout
        scrollingDelayedCall?.kill()
        scrollingDelayedCall = gsap.delayedCall(0.15, () => {
          setIsScrolling(false)
        })
      },
    })

    ScrollTrigger.refresh()
    onReady?.()
  }

  onMount(() => {
    // Force scroll to top to prevent browser restoring previous position
    window.scrollTo(0, 0)

    // Reset state (important for hot reload)
    resetVioletState()

    // Register GSAP plugins first
    registerGSAP()

    // Calculate initial scale
    scale = calculateScale()

    // Handle window resize
    const handleResize = () => {
      scale = calculateScale()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', handleResize)
    cleanupResize = () => window.removeEventListener('resize', handleResize)

    // Set up ResizeObserver FIRST - it will fire when content gets height
    // This is the proper pattern: observe early, react when ready
    resizeObserver = new ResizeObserver(async (entries) => {
      const entry = entries[0]
      if (!entry) return

      const { height } = entry.contentRect

      if (height > 0 && !initialized) {
        // Wait for fonts before initializing
        if (document.fonts?.ready) {
          await document.fonts.ready
        }
        initScrollSystem()
      }
    })
    resizeObserver.observe(content)

    // Now set isReady so children render - ResizeObserver will catch the height change
    isReady = true
  })

  onDestroy(() => {
    // Clean up everything
    cleanupResize?.()
    resizeObserver?.disconnect()
    scrollingDelayedCall?.kill()

    if (masterCtx) {
      masterCtx.revert()
    }
    killAllScrollTriggers()
    killScrollSmoother()
    resetVioletState()
  })
</script>

<div
  id="smooth-wrapper"
  bind:this={wrapper}
  class="scroll-wrapper"
>
  <div
    id="smooth-content"
    bind:this={content}
    class="scroll-content"
    style:--scale={scale}
  >
    <!-- Pinned stage: fills viewport, GSAP controls what's visible -->
    <div id="stage" class="stage">
      {#if isReady}
        {@render children()}
      {/if}
    </div>
    <!-- Scroll spacer: provides scroll distance for timeline scrubbing -->
    <div class="scroll-spacer" style="height: {SCROLL_DISTANCE_VH}vh"></div>
  </div>
</div>

<style>
  .scroll-wrapper {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: var(--colors-velvet-soot, #0B0508);
    /* Safe area insets for notched devices (iPhone) */
    padding: env(safe-area-inset-top, 0) env(safe-area-inset-right, 0) env(safe-area-inset-bottom, 0) env(safe-area-inset-left, 0);
    box-sizing: border-box;
  }

  .scroll-content {
    will-change: transform;
  }

  .stage {
    position: relative;
    width: 100%;
    height: 100vh; /* Fallback for older browsers */
    height: 100svh; /* Small viewport height - accounts for mobile toolbar */
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  /* Provides scroll distance - ScrollSmoother needs content taller than viewport */
  .scroll-spacer {
    pointer-events: none;
  }
</style>
