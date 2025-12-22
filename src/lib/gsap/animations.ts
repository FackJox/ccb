/**
 * Animation Factories
 *
 * Reusable animation functions following Brand Guidelines motion specifications.
 * All animations use brand easing and duration tokens.
 */

import { gsap, ScrollTrigger } from './register'
import { brandEase, brandDurations } from './register'

/**
 * Animation complexity levels per design docs
 */
export type ComplexityLevel = 'L1' | 'L2' | 'L3'

/**
 * Create a fade-in animation
 */
export function fadeIn(
  target: gsap.TweenTarget,
  options: {
    duration?: number
    delay?: number
    from?: number
    ease?: string
  } = {}
): gsap.core.Tween {
  const {
    duration = brandDurations.section,
    delay = 0,
    from = 0,
    ease = brandEase.enter,
  } = options

  return gsap.fromTo(
    target,
    { opacity: from },
    { opacity: 1, duration, delay, ease }
  )
}

/**
 * Create a fade-out animation
 */
export function fadeOut(
  target: gsap.TweenTarget,
  options: {
    duration?: number
    delay?: number
    to?: number
    ease?: string
  } = {}
): gsap.core.Tween {
  const {
    duration = brandDurations.section,
    delay = 0,
    to = 0,
    ease = brandEase.exit,
  } = options

  return gsap.to(target, { opacity: to, duration, delay, ease })
}

/**
 * Crossfade between two elements
 */
export function crossfade(
  fromTarget: gsap.TweenTarget,
  toTarget: gsap.TweenTarget,
  options: {
    duration?: number
    ease?: string
  } = {}
): gsap.core.Timeline {
  const {
    duration = brandDurations.section,
    ease = brandEase.transform,
  } = options

  const tl = gsap.timeline()

  tl.to(fromTarget, { opacity: 0, duration, ease }, 0)
  tl.fromTo(toTarget, { opacity: 0 }, { opacity: 1, duration, ease }, 0)

  return tl
}

/**
 * Slide element in from direction
 */
export function slideIn(
  target: gsap.TweenTarget,
  direction: 'left' | 'right' | 'top' | 'bottom' = 'left',
  options: {
    duration?: number
    delay?: number
    distance?: number
    ease?: string
  } = {}
): gsap.core.Tween {
  const {
    duration = brandDurations.section,
    delay = 0,
    distance = 20,
    ease = brandEase.enter,
  } = options

  const fromVars: gsap.TweenVars = { opacity: 0 }

  switch (direction) {
    case 'left':
      fromVars.x = -distance
      break
    case 'right':
      fromVars.x = distance
      break
    case 'top':
      fromVars.y = -distance
      break
    case 'bottom':
      fromVars.y = distance
      break
  }

  return gsap.from(target, {
    ...fromVars,
    duration,
    delay,
    ease,
  })
}

/**
 * Create parallax effect for layer
 * BG moves at 0.8x speed, FG at 1.0x
 */
export function parallaxLayer(
  target: gsap.TweenTarget,
  scrollTrigger: ScrollTrigger.Vars,
  options: {
    speed?: number  // 0.8 for BG, 1.0 for FG
    direction?: 'vertical' | 'horizontal'
    distance?: number
  } = {}
): gsap.core.Tween {
  const {
    speed = 0.8,
    direction = 'vertical',
    distance = 50,
  } = options

  const actualDistance = distance * (1 - speed)
  const prop = direction === 'vertical' ? 'y' : 'x'

  return gsap.to(target, {
    [prop]: -actualDistance,
    ease: 'none',
    scrollTrigger: {
      ...scrollTrigger,
      scrub: true,
    },
  })
}

/**
 * FG swap animation (e.g., mirror intact -> broken)
 * Quick crossfade with optional jitter
 */
export function fgSwap(
  fromTarget: gsap.TweenTarget,
  toTarget: gsap.TweenTarget,
  options: {
    duration?: number
    jitter?: boolean
    jitterAmount?: number
  } = {}
): gsap.core.Timeline {
  const {
    duration = 0.25,  // Quick swap per design docs (200-300ms)
    jitter = false,
    jitterAmount = 3,
  } = options

  const tl = gsap.timeline()

  if (jitter) {
    // Add 2-3px jitter for impact moments
    tl.to(fromTarget, {
      x: `+=${jitterAmount}`,
      duration: 0.05,
      yoyo: true,
      repeat: 1,
    }, 0)
  }

  tl.to(fromTarget, { opacity: 0, duration }, jitter ? 0.1 : 0)
  tl.fromTo(toTarget, { opacity: 0 }, { opacity: 1, duration }, jitter ? 0.1 : 0)

  return tl
}

/**
 * Violet glow animation (for accent elements)
 */
export function violetGlow(
  target: gsap.TweenTarget,
  options: {
    duration?: number
    intensity?: 'subtle' | 'normal' | 'strong'
  } = {}
): gsap.core.Tween {
  const {
    duration = brandDurations.signature,
    intensity = 'normal',
  } = options

  const glowStrength = {
    subtle: '0 0 10px rgba(162, 72, 255, 0.3)',
    normal: '0 0 20px rgba(162, 72, 255, 0.5)',
    strong: '0 0 40px rgba(162, 72, 255, 0.7)',
  }

  return gsap.to(target, {
    boxShadow: glowStrength[intensity],
    duration,
    ease: brandEase.enter,
  })
}

/**
 * Text stagger animation (for revealing text fragments)
 */
export function textStagger(
  targets: gsap.TweenTarget,
  options: {
    duration?: number
    stagger?: number
    from?: 'start' | 'end' | 'center' | 'edges'
  } = {}
): gsap.core.Tween {
  const {
    duration = brandDurations.section,
    stagger = 0.04,  // 40ms stagger per design docs
    from = 'start',
  } = options

  return gsap.from(targets, {
    opacity: 0,
    y: 20,
    duration,
    stagger: { each: stagger, from },
    ease: brandEase.enter,
  })
}

/**
 * Typography beat animation (for "Un. Deux. Trois." style reveals)
 */
export function typographyBeat(
  targets: gsap.TweenTarget[],
  options: {
    duration?: number
    delayBetween?: number
  } = {}
): gsap.core.Timeline {
  const {
    duration = brandDurations.section,
    delayBetween = 0.125,  // 100-150ms delay between words
  } = options

  const tl = gsap.timeline()

  targets.forEach((target, index) => {
    tl.fromTo(
      target,
      { opacity: 0, y: 0 },
      {
        opacity: 1,
        y: -10,  // Drift up
        duration,
        ease: brandEase.enter,
      },
      index * delayBetween
    )
  })

  return tl
}

/**
 * Violet lens mask animation (signature transition)
 * Soft, organic mask that expands to reveal next scene
 */
export function violetLensMask(
  maskElement: gsap.TweenTarget,
  options: {
    duration?: number
    expand?: boolean  // true = expand to reveal, false = contract to hide
  } = {}
): gsap.core.Tween {
  const {
    duration = brandDurations.signature,
    expand = true,
  } = options

  const fromScale = expand ? 0 : 2
  const toScale = expand ? 2 : 0

  return gsap.fromTo(
    maskElement,
    { scale: fromScale, opacity: expand ? 1 : 0.8 },
    {
      scale: toScale,
      opacity: expand ? 0 : 1,
      duration,
      ease: brandEase.transform,
    }
  )
}

/**
 * Crowd breathing animation (subtle scale pulse)
 * For crowd scenes in Ch7
 */
export function crowdBreathe(
  target: gsap.TweenTarget,
  options: {
    duration?: number
    intensity?: number
  } = {}
): gsap.core.Tween {
  const {
    duration = 4,  // Slow breathing cycle
    intensity = 0.01,  // 0.99 -> 1.01 scale
  } = options

  return gsap.to(target, {
    scale: 1 + intensity,
    duration: duration / 2,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
  })
}

/**
 * Consent hotspot hover effect
 * Faint echo appears behind on hover
 */
export function consentHoverIn(target: gsap.TweenTarget): gsap.core.Tween {
  return gsap.to(target, {
    textShadow: '2px 2px 0 rgba(244, 227, 201, 0.3)',
    duration: brandDurations.section,
    ease: brandEase.enter,
  })
}

export function consentHoverOut(target: gsap.TweenTarget): gsap.core.Tween {
  return gsap.to(target, {
    textShadow: 'none',
    duration: brandDurations.micro,
    ease: brandEase.exit,
  })
}

/**
 * Text block lifecycle for hybrid scroll animation
 * Pattern: appear → hold → drift → fade
 *
 * For scrubbed timelines where durations are timeline positions (0-1)
 *
 * @param tl - The timeline to add animations to
 * @param target - The text block element
 * @param options - Lifecycle configuration
 */
export function textBlockLifecycle(
  tl: gsap.core.Timeline,
  target: gsap.TweenTarget,
  options: {
    appearAt: number       // Timeline position to appear (0-1)
    fadeOutAt: number      // Timeline position to start fading (0-1)
    driftDistance?: number // How far to drift up (default -20)
  }
): void {
  const { appearAt, fadeOutAt, driftDistance = -20 } = options
  const appearDuration = 0.08  // 8% of chapter for appear animation

  // Appear: fade in + rise from below
  tl.fromTo(
    target,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: appearDuration,
      ease: brandEase.enter,
    },
    appearAt
  )

  // Drift: gentle upward movement while visible
  const driftDuration = fadeOutAt - appearAt - appearDuration - 0.05
  if (driftDuration > 0) {
    tl.to(
      target,
      {
        y: driftDistance,
        duration: driftDuration,
        ease: 'none',  // Linear drift for scrubbed feel
      },
      appearAt + appearDuration
    )
  }

  // Fade out
  tl.to(
    target,
    {
      opacity: 0,
      duration: 0.05,
      ease: brandEase.exit,
    },
    fadeOutAt
  )
}

/**
 * Create scroll-linked timeline for a chapter
 */
export function createChapterTimeline(
  chapter: number,
  trigger: string | HTMLElement
): gsap.core.Timeline {
  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      pin: true,
      anticipatePin: 1,
    },
  })
}
