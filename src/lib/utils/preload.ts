/**
 * Asset Preloading Utilities
 *
 * Functions for preloading images and tracking progress.
 */

export interface PreloadProgress {
  loaded: number
  total: number
  percent: number
  failed: string[]
}

export type ProgressCallback = (progress: PreloadProgress) => void

/**
 * Preload a single image
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load: ${src}`))
    img.src = src
  })
}

/**
 * Preload multiple images with progress tracking
 */
export async function preloadImages(
  sources: string[],
  onProgress?: ProgressCallback
): Promise<{ success: string[]; failed: string[] }> {
  const success: string[] = []
  const failed: string[] = []
  const total = sources.length
  let loaded = 0

  const report = () => {
    if (onProgress) {
      onProgress({
        loaded,
        total,
        percent: Math.round((loaded / total) * 100),
        failed,
      })
    }
  }

  // Initial progress report
  report()

  const promises = sources.map(async (src) => {
    try {
      await preloadImage(src)
      success.push(src)
    } catch {
      failed.push(src)
    } finally {
      loaded++
      report()
    }
  })

  await Promise.all(promises)

  return { success, failed }
}

/**
 * Preload images sequentially (for bandwidth-limited scenarios)
 */
export async function preloadImagesSequential(
  sources: string[],
  onProgress?: ProgressCallback
): Promise<{ success: string[]; failed: string[] }> {
  const success: string[] = []
  const failed: string[] = []
  const total = sources.length

  for (let i = 0; i < sources.length; i++) {
    const src = sources[i]

    try {
      await preloadImage(src)
      success.push(src)
    } catch {
      failed.push(src)
    }

    if (onProgress) {
      onProgress({
        loaded: i + 1,
        total,
        percent: Math.round(((i + 1) / total) * 100),
        failed,
      })
    }
  }

  return { success, failed }
}

/**
 * Preload images in batches (balance between parallel and sequential)
 */
export async function preloadImagesBatched(
  sources: string[],
  batchSize: number = 4,
  onProgress?: ProgressCallback
): Promise<{ success: string[]; failed: string[] }> {
  const success: string[] = []
  const failed: string[] = []
  const total = sources.length
  let loaded = 0

  for (let i = 0; i < sources.length; i += batchSize) {
    const batch = sources.slice(i, i + batchSize)

    const results = await Promise.allSettled(
      batch.map(src => preloadImage(src))
    )

    results.forEach((result, index) => {
      const src = batch[index]
      if (result.status === 'fulfilled') {
        success.push(src)
      } else {
        failed.push(src)
      }
      loaded++
    })

    if (onProgress) {
      onProgress({
        loaded,
        total,
        percent: Math.round((loaded / total) * 100),
        failed,
      })
    }
  }

  return { success, failed }
}

/**
 * Check if an image is already cached
 */
export function isImageCached(src: string): boolean {
  const img = new Image()
  img.src = src
  return img.complete
}

/**
 * Get images that need to be loaded (not already cached)
 */
export function getUncachedImages(sources: string[]): string[] {
  return sources.filter(src => !isImageCached(src))
}

/**
 * Preload critical images first, then the rest
 */
export async function preloadWithPriority(
  critical: string[],
  remaining: string[],
  onProgress?: ProgressCallback
): Promise<{ success: string[]; failed: string[] }> {
  const total = critical.length + remaining.length
  let loaded = 0
  const allFailed: string[] = []

  // Load critical images first (sequentially for fastest first paint)
  for (const src of critical) {
    try {
      await preloadImage(src)
    } catch {
      allFailed.push(src)
    }
    loaded++
    if (onProgress) {
      onProgress({
        loaded,
        total,
        percent: Math.round((loaded / total) * 100),
        failed: allFailed,
      })
    }
  }

  // Load remaining images in batches
  const { failed } = await preloadImagesBatched(
    remaining,
    4,
    (progress) => {
      if (onProgress) {
        onProgress({
          loaded: critical.length + progress.loaded,
          total,
          percent: Math.round(((critical.length + progress.loaded) / total) * 100),
          failed: [...allFailed, ...progress.failed],
        })
      }
    }
  )

  return {
    success: critical.concat(remaining).filter(src => !allFailed.includes(src) && !failed.includes(src)),
    failed: [...allFailed, ...failed],
  }
}
