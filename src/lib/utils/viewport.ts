/**
 * Viewport Utilities
 *
 * Functions for viewport detection, scaling, and orientation.
 */

// Reference viewport dimensions (iPhone 14/15 Pro landscape)
export const REFERENCE_WIDTH = 852
export const REFERENCE_HEIGHT = 393
export const REFERENCE_ASPECT = REFERENCE_WIDTH / REFERENCE_HEIGHT

/**
 * Check if viewport is in landscape orientation
 */
export function isLandscape(): boolean {
  if (typeof window === 'undefined') return true
  return window.innerWidth > window.innerHeight
}

/**
 * Check if viewport is in portrait orientation
 */
export function isPortrait(): boolean {
  return !isLandscape()
}

/**
 * Calculate scale factor to fit reference viewport in current viewport
 */
export function calculateScale(): number {
  if (typeof window === 'undefined') return 1

  const scaleX = window.innerWidth / REFERENCE_WIDTH
  const scaleY = window.innerHeight / REFERENCE_HEIGHT

  // Use minimum to ensure content fits
  return Math.min(scaleX, scaleY)
}

/**
 * Get current viewport dimensions
 */
export function getViewportSize(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: REFERENCE_WIDTH, height: REFERENCE_HEIGHT }
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

/**
 * Get current viewport aspect ratio
 */
export function getViewportAspect(): number {
  const { width, height } = getViewportSize()
  return width / height
}

/**
 * Check if device is mobile (touch-capable)
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * Check if device is iOS
 */
export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

/**
 * Check if device is Android
 */
export function isAndroid(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android/.test(navigator.userAgent)
}

/**
 * Attempt to lock screen orientation to landscape
 * Returns true if successful, false if not supported
 */
export async function lockLandscape(): Promise<boolean> {
  if (typeof screen === 'undefined' || !screen.orientation) {
    return false
  }

  try {
    // @ts-expect-error - lock method may not be in types
    await screen.orientation.lock('landscape')
    return true
  } catch {
    // Orientation lock not supported or permission denied
    return false
  }
}

/**
 * Unlock screen orientation
 */
export function unlockOrientation(): void {
  if (typeof screen === 'undefined' || !screen.orientation) {
    return
  }

  try {
    screen.orientation.unlock()
  } catch {
    // Ignore unlock errors
  }
}

/**
 * Subscribe to orientation changes
 */
export function onOrientationChange(callback: (isLandscape: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {}

  const handler = () => callback(isLandscape())

  window.addEventListener('resize', handler)
  window.addEventListener('orientationchange', handler)

  return () => {
    window.removeEventListener('resize', handler)
    window.removeEventListener('orientationchange', handler)
  }
}

/**
 * Subscribe to viewport size changes
 */
export function onViewportResize(
  callback: (size: { width: number; height: number; scale: number }) => void
): () => void {
  if (typeof window === 'undefined') return () => {}

  const handler = () => {
    callback({
      ...getViewportSize(),
      scale: calculateScale(),
    })
  }

  window.addEventListener('resize', handler)

  return () => {
    window.removeEventListener('resize', handler)
  }
}
