/**
 * Curtain State Store
 *
 * Controls the theatre curtain open/close state.
 * Based on scroll progress - closes near end, reopens when scrolling back.
 */

// Threshold: curtain closes when scroll progress >= this value
// This corresponds to when "New as dawn." appears in Chapter 9
const CLOSE_THRESHOLD = 0.97

let scrollProgress = $state(0)

export function setCurtainScrollProgress(progress: number) {
  scrollProgress = progress
}

export function createCurtainState() {
  return {
    get shouldClose() {
      return scrollProgress >= CLOSE_THRESHOLD
    },
    get progress() {
      return scrollProgress
    },
  }
}
