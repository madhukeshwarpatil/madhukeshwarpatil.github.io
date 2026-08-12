import { Suspense, lazy, useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { isWebGLAvailable } from '../lib/webgl'
import { HelixFallback } from './HelixFallback'

const CodeHelixScene = lazy(() => import('./CodeHelixScene'))

/**
 * Fixed full-viewport backdrop behind all sections: the live code-helix on
 * capable devices, the static SVG rendition otherwise. Dims once the visitor
 * scrolls past the hero so section content always wins.
 */
export function Background3D() {
  const reduced = usePrefersReducedMotion()
  const [sceneReady, setSceneReady] = useState(false)
  const [tabVisible, setTabVisible] = useState(true)
  const [dimmed, setDimmed] = useState(false)

  // Defer mounting the 3D chunk until after first paint so content wins the race.
  useEffect(() => {
    if (reduced) return
    if (!isWebGLAvailable()) return
    const id = window.requestAnimationFrame(() => setSceneReady(true))
    return () => window.cancelAnimationFrame(id)
  }, [reduced])

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    const onScroll = () => setDimmed(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const show3D = sceneReady && !reduced

  return (
    <div className={`bg3d ${dimmed ? 'bg3d-dim' : ''}`} aria-hidden="true">
      <div className="bg3d-scene">
        {show3D ? (
          <Suspense fallback={<HelixFallback />}>
            <CodeHelixScene active={tabVisible} />
          </Suspense>
        ) : (
          <HelixFallback />
        )}
      </div>
      <div className="bg3d-veil" />
    </div>
  )
}
