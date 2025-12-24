<script lang="ts">
  import { curtainAssets } from '$data'
  import { registerGSAP, gsap } from '$gsap'

  // Brand motion tokens
  const SIGNATURE_DURATION = 1.05
  const EASE_ENTER = 'power2.out' // ease-brand-enter

  // Element references
  let curtainLeft: HTMLImageElement
  let curtainRight: HTMLImageElement
  let curtainUpper: HTMLImageElement

  /**
   * Opens the theatre curtain with a signature reveal animation.
   * Left/right curtains slide off-screen and are hidden.
   * Upper curtain rises partially and stays visible as a valance.
   */
  export async function open(): Promise<void> {
    registerGSAP()

    const tl = gsap.timeline()

    // Open all curtains simultaneously
    tl.to(
      curtainLeft,
      {
        x: '-100%',
        duration: SIGNATURE_DURATION,
        ease: EASE_ENTER,
      },
      0
    )
      .to(
        curtainRight,
        {
          x: '100%',
          duration: SIGNATURE_DURATION,
          ease: EASE_ENTER,
        },
        0
      )
      .to(
        curtainUpper,
        {
          y: '-40%',
          duration: SIGNATURE_DURATION,
          ease: EASE_ENTER,
        },
        0
      )

    await tl.play()

    // Hide left/right after animation (upper stays visible as valance)
    curtainLeft.style.visibility = 'hidden'
    curtainRight.style.visibility = 'hidden'
  }
</script>

<div class="theatre-curtain">
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

<style>
  .theatre-curtain {
    position: fixed;
    inset: 0;
    z-index: 9000;
    pointer-events: none;
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
</style>
