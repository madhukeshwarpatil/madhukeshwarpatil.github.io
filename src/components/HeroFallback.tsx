/**
 * Static hero art for reduced-motion / no-WebGL visitors:
 * an SVG rendition of the node network sharing the same palette.
 */
export function HeroFallback() {
  const nodes: Array<[number, number, number]> = [
    [720, 160, 5], [830, 240, 4], [640, 300, 6], [900, 340, 3.5], [760, 420, 5],
    [580, 200, 3.5], [980, 220, 4.5], [860, 500, 4], [660, 520, 3.5], [1020, 420, 5],
    [560, 400, 4], [940, 130, 3], [1080, 300, 3.5], [500, 300, 3],
  ]
  const links: Array<[number, number]> = [
    [0, 1], [0, 2], [0, 5], [1, 3], [1, 6], [2, 4], [2, 10], [3, 9], [3, 6],
    [4, 7], [4, 8], [5, 13], [6, 11], [7, 9], [8, 10], [9, 12], [6, 12],
  ]

  return (
    <div className="hero-fallback" aria-hidden="true">
      <svg viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="hf-glow" cx="60%" cy="42%" r="55%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.14" />
            <stop offset="55%" stopColor="#818cf8" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#060a13" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hf-node" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        <rect width="1280" height="720" fill="url(#hf-glow)" />
        <g stroke="#38bdf8" strokeOpacity="0.16" strokeWidth="1">
          {links.map(([a, b], i) => {
            const na = nodes[a]
            const nb = nodes[b]
            if (!na || !nb) return null
            return <line key={i} x1={na[0]} y1={na[1]} x2={nb[0]} y2={nb[1]} />
          })}
        </g>
        <g>
          {nodes.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="url(#hf-node)" opacity={0.85} />
          ))}
        </g>
        <g fill="#5eead4" opacity="0.9">
          <circle cx="775" cy="200" r="2.5" />
          <circle cx="700" cy="360" r="2.5" />
          <circle cx="930" cy="290" r="2.5" />
          <circle cx="610" cy="460" r="2.5" />
        </g>
      </svg>
    </div>
  )
}
