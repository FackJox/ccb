<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import {
    registerGSAP,
    createScrollSmoother,
    killScrollSmoother,
    killAllScrollTriggers,
    ScrollTrigger,
  } from '$gsap'
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

  onMount(() => {
    // Register GSAP plugins
    registerGSAP()

    // Calculate initial scale
    scale = calculateScale()

    // Create ScrollSmoother
    createScrollSmoother(wrapper, content)

    // Track scroll progress and scrolling state
    let scrollTimeout: number
    ScrollTrigger.create({
      trigger: content,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        setScrollProgress(self.progress)
        // Track scrolling state
        setIsScrolling(true)
        clearTimeout(scrollTimeout)
        scrollTimeout = window.setTimeout(() => {
          setIsScrolling(false)
        }, 150)
      },
    })

    // Handle resize
    const handleResize = () => {
      scale = calculateScale()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', handleResize)

    isReady = true
    onReady?.()

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(scrollTimeout)
    }
  })

  onDestroy(() => {
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
    {#if isReady}
      {@render children()}
    {/if}
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
</style>
