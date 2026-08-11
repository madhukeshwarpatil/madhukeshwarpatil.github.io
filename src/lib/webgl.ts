let cached: boolean | null = null

export function isWebGLAvailable(): boolean {
  if (cached !== null) return cached
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    cached = gl !== null
  } catch {
    cached = false
  }
  return cached
}

/** Heuristic for devices where the full particle budget is not worth it. */
export function isConstrainedDevice(): boolean {
  const smallScreen = window.matchMedia('(max-width: 640px)').matches
  const lowConcurrency = (navigator.hardwareConcurrency ?? 8) <= 4
  return smallScreen || lowConcurrency
}
