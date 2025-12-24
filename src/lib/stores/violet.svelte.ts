/**
 * Violet Light Store
 *
 * Timeline-driven state for the violet overlay effect.
 * Chapter timelines call setVioletActive() to control when the effect appears.
 *
 * The violet light represents the "phantom stage" lighting described in the narrative:
 * - Activates with Chapter 6 text 2: "Then she sent the violet spill surging into the windows"
 * - Deactivates with Chapter 8 text 4: "The violet lights guttered out"
 */

// Svelte 5 rune-based state
let violetActive = $state(false)
let violetIntensity = $state(0)

/**
 * Set violet light active state
 * Called by chapter timelines at specific narrative moments
 */
export function setVioletActive(active: boolean): void {
  violetActive = active
}

/**
 * Set violet light intensity (0-1)
 * For finer control during transitions
 */
export function setVioletIntensity(intensity: number): void {
  violetIntensity = Math.max(0, Math.min(1, intensity))
}

/**
 * Get current violet active state
 */
export function getVioletActive(): boolean {
  return violetActive
}

/**
 * Get current violet intensity
 */
export function getVioletIntensity(): number {
  return violetIntensity
}

/**
 * Create a reactive violet state object
 * Use this in components for reactive updates
 */
export function createVioletState() {
  return {
    get active() { return violetActive },
    get intensity() { return violetIntensity },
  }
}

/**
 * Reset violet state (for cleanup/reload)
 */
export function resetVioletState(): void {
  violetActive = false
  violetIntensity = 0
}
