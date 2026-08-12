/**
 * Static DNA-of-code backdrop for reduced-motion / no-WebGL visitors:
 * two sinusoidal strands of code glyphs with base-pair rungs, matching the
 * palette and concept of the live 3D scene.
 */
const GLYPHS = '{}</>;=()[]#$&*+-:._|~'

interface Row {
  y: number
  xA: number
  xB: number
  glyphA: string
  glyphB: string
  front: boolean
  rung: boolean
}

const ROWS: Row[] = []
const CX = 880
const AMP = 190
const STEP = 30
for (let i = 0; i * STEP <= 900; i++) {
  const y = 20 + i * STEP
  const phase = y * 0.017
  ROWS.push({
    y,
    xA: CX + AMP * Math.sin(phase),
    xB: CX + AMP * Math.sin(phase + Math.PI),
    glyphA: GLYPHS[(i * 7) % GLYPHS.length]!,
    glyphB: GLYPHS[(i * 11 + 3) % GLYPHS.length]!,
    front: Math.cos(phase) >= 0,
    rung: i % 3 === 1,
  })
}

const KEYWORDS: Array<{ x: number; y: number; text: string; color: string }> = [
  { x: 560, y: 150, text: 'terraform', color: '#38bdf8' },
  { x: 1180, y: 300, text: 'aws', color: '#818cf8' },
  { x: 600, y: 490, text: 'kafka', color: '#5eead4' },
  { x: 1150, y: 640, text: 'sre', color: '#38bdf8' },
  { x: 620, y: 800, text: 'docker', color: '#818cf8' },
]

export function HelixFallback() {
  return (
    <div className="bg3d-fallback" aria-hidden="true">
      <svg viewBox="0 0 1280 920" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="hx-glow" cx="66%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
            <stop offset="55%" stopColor="#818cf8" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#060a13" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1280" height="920" fill="url(#hx-glow)" />

        <g stroke="#38bdf8" strokeOpacity="0.12" strokeWidth="1">
          {ROWS.filter((r) => r.rung).map((r) => (
            <line key={`rung-${r.y}`} x1={r.xA} y1={r.y} x2={r.xB} y2={r.y} />
          ))}
        </g>

        <g fontFamily="'JetBrains Mono', ui-monospace, monospace" fontSize="17" textAnchor="middle">
          {ROWS.map((r) => (
            <g key={`row-${r.y}`}>
              <text x={r.xA} y={r.y} fill="#38bdf8" opacity={r.front ? 0.55 : 0.2}>
                {r.glyphA}
              </text>
              <text x={r.xB} y={r.y} fill="#818cf8" opacity={r.front ? 0.2 : 0.55}>
                {r.glyphB}
              </text>
            </g>
          ))}
        </g>

        <g fontFamily="'JetBrains Mono', ui-monospace, monospace" fontSize="15">
          {KEYWORDS.map((k) => (
            <text key={k.text} x={k.x} y={k.y} fill={k.color} opacity="0.3">
              {k.text}
            </text>
          ))}
        </g>
      </svg>
    </div>
  )
}
