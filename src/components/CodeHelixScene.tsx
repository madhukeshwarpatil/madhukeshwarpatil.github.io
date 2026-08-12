import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { isConstrainedDevice } from '../lib/webgl'

const CYAN = new THREE.Color('#38bdf8')
const INDIGO = new THREE.Color('#818cf8')
const TEAL = new THREE.Color('#5eead4')

/** 25 code glyphs → 5×5 texture atlas cells. */
const GLYPHS = ['{', '}', '<', '>', '/', ';', '=', '(', ')', '[', ']', '#', '$', '&', '*', '+', '-', ':', '.', '_', '|', '~', '0', '1', 'λ']
const ATLAS_GRID = 5

const KEYWORDS = ['terraform', 'aws', 'k8s', 'docker', 'kafka', 'sre', 'ci/cd', 'python', 'grafana', 'lambda', 'ansible', 'pagerduty']

/** Helix dimensions (world units). */
const HELIX_HEIGHT = 44
const HELIX_RADIUS = 1.7
const TWIST = (Math.PI * 2) / 7.5 // radians of twist per world unit of height
const CAMERA_Z = 7.5
const FOV = 50
// Vertical distance the helix travels across full scroll (half height minus visible half-height).
const TRAVEL = HELIX_HEIGHT / 2 - Math.tan((FOV / 2) * (Math.PI / 180)) * CAMERA_Z

function mulberry(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeGlyphAtlas(): THREE.CanvasTexture {
  const cell = 128
  const canvas = document.createElement('canvas')
  canvas.width = cell * ATLAS_GRID
  canvas.height = cell * ATLAS_GRID
  const ctx = canvas.getContext('2d')!
  ctx.font = `500 ${cell * 0.68}px "JetBrains Mono", ui-monospace, monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#ffffff'
  GLYPHS.forEach((glyph, i) => {
    const x = ((i % ATLAS_GRID) + 0.5) * cell
    const y = (Math.floor(i / ATLAS_GRID) + 0.5) * cell
    ctx.fillText(glyph, x, y)
  })
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function makeKeywordTexture(word: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 320
  canvas.height = 80
  const ctx = canvas.getContext('2d')!
  ctx.font = '500 34px "JetBrains Mono", ui-monospace, monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = color
  ctx.fillText(word, 160, 42)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

interface HelixGeometry {
  positions: Float32Array
  colors: Float32Array
  sizes: Float32Array
  cells: Float32Array
  rungPositions: Float32Array
}

/**
 * Two glyph strands wind around the Y axis; rungs (base pairs) bridge them
 * with small "0/1" glyph dots plus a faint connecting line.
 */
function buildHelix(constrained: boolean): HelixGeometry {
  const rand = mulberry(42)
  const step = constrained ? 0.3 : 0.22
  const rungEvery = constrained ? 1.4 : 1.1
  const dotsPerRung = constrained ? 3 : 4

  const pos: number[] = []
  const col: number[] = []
  const size: number[] = []
  const cell: number[] = []
  const rungs: number[] = []

  const color = new THREE.Color()

  for (let y = -HELIX_HEIGHT / 2; y <= HELIX_HEIGHT / 2; y += step) {
    const angle = y * TWIST
    for (let strand = 0; strand < 2; strand++) {
      const a = angle + strand * Math.PI
      pos.push(Math.cos(a) * HELIX_RADIUS, y, Math.sin(a) * HELIX_RADIUS)
      color.copy(strand === 0 ? CYAN : INDIGO).lerp(TEAL, rand() * 0.25)
      col.push(color.r, color.g, color.b)
      size.push(0.26 + rand() * 0.14)
      cell.push(Math.floor(rand() * 22)) // skip the 0/1/λ cells for strands
    }
  }

  for (let y = -HELIX_HEIGHT / 2 + rungEvery / 2; y <= HELIX_HEIGHT / 2; y += rungEvery) {
    const angle = y * TWIST
    const ax = Math.cos(angle) * HELIX_RADIUS
    const az = Math.sin(angle) * HELIX_RADIUS
    rungs.push(ax, y, az, -ax, y, -az)
    for (let d = 1; d <= dotsPerRung; d++) {
      const t = d / (dotsPerRung + 1)
      pos.push(THREE.MathUtils.lerp(ax, -ax, t), y, THREE.MathUtils.lerp(az, -az, t))
      color.copy(TEAL).lerp(CYAN, rand() * 0.5)
      col.push(color.r, color.g, color.b)
      size.push(0.13 + rand() * 0.06)
      cell.push(22 + Math.floor(rand() * 2)) // '0' or '1' — binary base pairs
    }
  }

  return {
    positions: new Float32Array(pos),
    colors: new Float32Array(col),
    sizes: new Float32Array(size),
    cells: new Float32Array(cell),
    rungPositions: new Float32Array(rungs),
  }
}

const glyphVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aCell;
  attribute vec3 aColor;
  uniform float uPxScale;
  varying vec3 vColor;
  varying float vCell;
  varying float vFade;
  void main() {
    vColor = aColor;
    vCell = aCell;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPxScale / -mv.z;
    // Depth cue: glyphs on the far side of the helix dim out.
    vFade = smoothstep(-13.0, -5.0, mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

const glyphFragmentShader = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vCell;
  varying float vFade;
  void main() {
    float grid = ${ATLAS_GRID}.0;
    float c = floor(vCell + 0.5);
    vec2 cellUv = vec2(mod(c, grid), floor(c / grid));
    vec2 uv = vec2(
      (cellUv.x + gl_PointCoord.x) / grid,
      1.0 - (cellUv.y + gl_PointCoord.y) / grid
    );
    float a = texture2D(uAtlas, uv).a * uOpacity * (0.25 + 0.75 * vFade);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
  }
`

function KeywordLabels({ constrained }: { constrained: boolean }) {
  const words = useMemo(() => {
    const rand = mulberry(7)
    const picked = constrained ? KEYWORDS.slice(0, 6) : KEYWORDS
    const palette = ['#38bdf8', '#818cf8', '#5eead4']
    return picked.map((word, i) => {
      const y = -HELIX_HEIGHT / 2 + ((i + 0.5) / picked.length) * HELIX_HEIGHT
      const angle = y * TWIST + Math.PI / 2 + (rand() - 0.5) * 1.2
      const radius = 2.7 + rand() * 0.9
      return {
        word,
        texture: makeKeywordTexture(word, palette[i % palette.length]!),
        position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius] as [number, number, number],
        opacity: 0.22 + rand() * 0.14,
      }
    })
  }, [constrained])

  useEffect(() => () => words.forEach((w) => w.texture.dispose()), [words])

  return (
    <>
      {words.map((w) => (
        <Billboard key={w.word} position={w.position}>
          <mesh>
            <planeGeometry args={[2.1, 0.525]} />
            <meshBasicMaterial
              map={w.texture}
              transparent
              opacity={w.opacity}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </Billboard>
      ))}
    </>
  )
}

function Helix({ constrained, scrollRef }: { constrained: boolean; scrollRef: RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const smoothScroll = useRef(0)

  const geometry = useMemo(() => buildHelix(constrained), [constrained])
  const atlas = useMemo(() => makeGlyphAtlas(), [])
  const uniforms = useMemo(
    () => ({
      uAtlas: { value: atlas },
      uOpacity: { value: 0.8 },
      uPxScale: { value: 1000 },
    }),
    [atlas],
  )

  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group) return
    const t = state.clock.elapsedTime

    // Damped scroll progress drives both vertical travel and extra twist.
    const k = Math.min(1, delta * 3.5)
    smoothScroll.current += (scrollRef.current - smoothScroll.current) * k
    const p = smoothScroll.current

    group.position.y = THREE.MathUtils.lerp(-TRAVEL, TRAVEL, p)
    group.rotation.y = t * 0.12 + p * Math.PI * 3

    // Gentle pointer parallax.
    const cam = state.camera
    cam.position.x += (state.pointer.x * 0.35 - cam.position.x) * Math.min(1, delta * 2)
    cam.lookAt(0, 0, 0)

    if (materialRef.current) {
      const fovRad = (FOV / 2) * (Math.PI / 180)
      materialRef.current.uniforms.uPxScale!.value =
        (state.size.height * state.viewport.dpr) / (2 * Math.tan(fovRad))
    }
  })

  return (
    <group ref={groupRef} position={[constrained ? 0 : 1.35, -TRAVEL, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[geometry.positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[geometry.colors, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[geometry.sizes, 1]} />
          <bufferAttribute attach="attributes-aCell" args={[geometry.cells, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={glyphVertexShader}
          fragmentShader={glyphFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[geometry.rungPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={CYAN}
          transparent
          opacity={0.09}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      <KeywordLabels constrained={constrained} />
    </group>
  )
}

export default function CodeHelixScene({ active }: { active: boolean }) {
  const constrained = useMemo(() => isConstrainedDevice(), [])
  const scrollRef = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollRef.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, constrained ? 1.5 : 2]}
      camera={{ position: [0, 0, CAMERA_Z], fov: FOV }}
      gl={{ antialias: !constrained, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
      eventSource={document.body}
    >
      <Helix constrained={constrained} scrollRef={scrollRef} />
    </Canvas>
  )
}
