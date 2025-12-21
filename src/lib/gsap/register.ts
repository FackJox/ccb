/**
 * GSAP Plugin Registration
 *
 * Registers all GSAP plugins for use in the scrollytelling experience.
 * This must be called once on the client before using any plugins.
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

let registered = false

/**
 * Register all GSAP plugins.
 * Safe to call multiple times - will only register once.
 */
export function registerGSAP(): void {
  if (registered) {
    console.log('[registerGSAP] Already registered, skipping')
    return
  }

  console.log('[registerGSAP] Registering plugins...')
  console.log('[registerGSAP] gsap:', gsap)
  console.log('[registerGSAP] ScrollTrigger:', ScrollTrigger)
  console.log('[registerGSAP] ScrollSmoother:', ScrollSmoother)

  gsap.registerPlugin(
    ScrollTrigger,
    ScrollSmoother,
    SplitText,
    DrawSVGPlugin,
    MotionPathPlugin,
    ScrollToPlugin
  )

  console.log('[registerGSAP] Plugins registered successfully')
  registered = true
}

/**
 * Check if GSAP plugins are registered
 */
export function isGSAPRegistered(): boolean {
  return registered
}

// Re-export commonly used items
export { gsap, ScrollTrigger, ScrollSmoother, SplitText }

// Brand motion tokens as GSAP-compatible values
export const brandEasing = {
  enter: 'cubic-bezier(0.33, 0.0, 0.15, 1.0)',
  exit: 'cubic-bezier(0.25, 0.0, 0.35, 1.0)',
  transform: 'cubic-bezier(0.45, 0.0, 0.15, 1.0)',
} as const

// Custom ease for GSAP (converted from cubic-bezier)
export const brandEase = {
  // These are approximations - GSAP has different easing syntax
  enter: 'power2.out',
  exit: 'power2.in',
  transform: 'power3.inOut',
} as const

export const brandDurations = {
  microFast: 0.14,
  micro: 0.23,
  section: 0.55,
  sectionHeld: 0.825,
  signature: 1.05,
  signatureLong: 1.2,
} as const
