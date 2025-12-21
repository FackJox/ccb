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
  import { createMasterTimeline } from '$gsap/master-timeline'
  import { setScrollProgress, setIsScrolling } from '$stores'
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

    console.log('[ScrollContainer] Initializing scroll system...')
    console.log('[ScrollContainer] content dimensions:', content?.offsetWidth, 'x', content?.offsetHeight)

    // Create ScrollSmoother
    const smoother = createScrollSmoother(wrapper, content)
    console.log('[ScrollContainer] ScrollSmoother created:', smoother)

    // Get the stage element - this is our pinned viewport container
    const stage = content.querySelector('#stage') as HTMLElement
    if (!stage) {
      console.error('[ScrollContainer] Stage element not found!')
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
    console.log('[ScrollContainer] Master timeline created')
    console.log('[ScrollContainer] Total ScrollTriggers:', ScrollTrigger.getAll().length)

    ScrollTrigger.refresh()
    onReady?.()
    console.log('[ScrollContainer] Scroll system ready!')
  }

  onMount(() => {
    console.log('[ScrollContainer] onMount started')

    // Register GSAP plugins first
    registerGSAP()
    console.log('[ScrollContainer] GSAP registered')

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
      console.log('[ScrollContainer] ResizeObserver: height =', height)

      if (height > 0 && !initialized) {
        // Wait for fonts before initializing
        if (document.fonts?.ready) {
          await document.fonts.ready
          console.log('[ScrollContainer] Fonts loaded')
        }
        initScrollSystem()
      }
    })
    resizeObserver.observe(content)

    // Now set isReady so children render - ResizeObserver will catch the height change
    isReady = true
    console.log('[ScrollContainer] isReady set to true')
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
    <div class="scroll-spacer"></div>
  </div>
</div>

<style>
  .scroll-wrapper {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: var(--colors-velvet-soot, #0B0508);
  }

  .scroll-content {
    will-change: transform;
  }

  .stage {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  /* Provides scroll distance - ScrollSmoother needs content taller than viewport */
  .scroll-spacer {
    height: 700vh; /* Total scroll distance for 9 chapters */
    pointer-events: none;
  }
</style>
