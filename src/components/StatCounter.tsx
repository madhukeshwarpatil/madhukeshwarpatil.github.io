import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import type { Stat } from '../data/profile'

function format(value: number, decimals: number): string {
  return value.toFixed(decimals)
}

export function StatCounter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const decimals = Number.isInteger(stat.value) ? 0 : 1
  const [display, setDisplay] = useState(() => format(reduced ? stat.value : 0, decimals))

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setDisplay(format(stat.value, decimals))
      return
    }
    const duration = 1400
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 4)
      setDisplay(format(stat.value * eased, decimals))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, stat.value, decimals])

  return (
    <div className="stat">
      <div className="stat-value">
        <span ref={ref}>{display}</span>
        {stat.suffix}
      </div>
      <div className="stat-label">{stat.label}</div>
    </div>
  )
}
