import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { isConstrainedDevice } from '../lib/webgl'

const CYAN = new THREE.Color('#38bdf8')
const INDIGO = new THREE.Color('#818cf8')
const TEAL = new THREE.Color('#5eead4')

/** Soft radial sprite so points render as glowing dots instead of squares. */
function makeDotTexture(): THREE.CanvasTexture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.35, 'rgba(255,255,255,0.7)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

interface NetworkData {
  positions: Float32Array
  colors: Float32Array
  linePositions: Float32Array
  edges: Array<[THREE.Vector3, THREE.Vector3]>
}

/** Nodes on a slightly ellipsoidal fibonacci sphere, wired to their nearest neighbors. */
function buildNetwork(nodeCount: number): NetworkData {
  const golden = Math.PI * (3 - Math.sqrt(5))
  const radius = 2.2
  const nodes: THREE.Vector3[] = []

  for (let i = 0; i < nodeCount; i++) {
    const y = 1 - (i / (nodeCount - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    const jitter = 1 + (Math.sin(i * 12.9898) * 0.5 + 0.5) * 0.14
    nodes.push(
      new THREE.Vector3(
        Math.cos(theta) * r * radius * 1.15 * jitter,
        y * radius * 0.85 * jitter,
        Math.sin(theta) * r * radius * jitter,
      ),
    )
  }

  const positions = new Float32Array(nodeCount * 3)
  const colors = new Float32Array(nodeCount * 3)
  const color = new THREE.Color()
  nodes.forEach((n, i) => {
    positions[i * 3] = n.x
    positions[i * 3 + 1] = n.y
    positions[i * 3 + 2] = n.z
    color.copy(CYAN).lerp(INDIGO, (n.y / radius + 1) / 2)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  })

  // Connect each node to its 2 nearest forward neighbors (dedup via i < j).
  const edges: Array<[THREE.Vector3, THREE.Vector3]> = []
  for (let i = 0; i < nodeCount; i++) {
    const a = nodes[i]!
    const dists: Array<{ j: number; d: number }> = []
    for (let j = i + 1; j < nodeCount; j++) {
      dists.push({ j, d: a.distanceToSquared(nodes[j]!) })
    }
    dists.sort((p, q) => p.d - q.d)
    for (const { j } of dists.slice(0, 2)) {
      edges.push([a, nodes[j]!])
    }
  }

  const linePositions = new Float32Array(edges.length * 6)
  edges.forEach(([a, b], i) => {
    linePositions[i * 6] = a.x
    linePositions[i * 6 + 1] = a.y
    linePositions[i * 6 + 2] = a.z
    linePositions[i * 6 + 3] = b.x
    linePositions[i * 6 + 4] = b.y
    linePositions[i * 6 + 5] = b.z
  })

  return { positions, colors, linePositions, edges }
}

function buildShell(count: number): Float32Array {
  const positions = new Float32Array(count * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i + 1.7
    const radius = 3.6 + Math.sin(i * 78.233) * 0.5
    positions[i * 3] = Math.cos(theta) * r * radius * 1.2
    positions[i * 3 + 1] = y * radius * 0.9
    positions[i * 3 + 2] = Math.sin(theta) * r * radius
  }
  return positions
}

interface Packet {
  edge: number
  t: number
  speed: number
}

function Network({ constrained }: { constrained: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const packetsRef = useRef<THREE.Points>(null)

  const nodeCount = constrained ? 120 : 180
  const packetCount = constrained ? 28 : 60

  const network = useMemo(() => buildNetwork(nodeCount), [nodeCount])
  const shellPositions = useMemo(() => buildShell(constrained ? 80 : 130), [constrained])
  const dotTexture = useMemo(() => makeDotTexture(), [])

  const packets = useMemo<Packet[]>(
    () =>
      Array.from({ length: packetCount }, (_, i) => ({
        edge: (i * 7919) % network.edges.length,
        t: (i * 0.37) % 1,
        speed: 0.15 + ((i * 13.7) % 1) * 0.35,
      })),
    [packetCount, network.edges.length],
  )
  const packetPositions = useMemo(() => new Float32Array(packetCount * 3), [packetCount])

  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group) return
    const t = state.clock.elapsedTime

    group.rotation.y += delta * 0.03
    group.rotation.x = Math.sin(t * 0.05) * 0.06
    const breathe = 1 + Math.sin((t * Math.PI * 2) / 8) * 0.015
    group.scale.setScalar(breathe)

    // Pointer parallax — lerped, max a few degrees.
    const cam = state.camera
    cam.position.x += (state.pointer.x * 0.45 - cam.position.x) * Math.min(delta * 2, 1)
    cam.position.y += (state.pointer.y * 0.3 - cam.position.y) * Math.min(delta * 2, 1)
    cam.lookAt(0, 0, 0)

    // Advance data packets along their edges.
    const pts = packetsRef.current
    if (pts) {
      packets.forEach((p, i) => {
        p.t += delta * p.speed
        if (p.t > 1) {
          p.t = 0
          p.edge = (p.edge + 37) % network.edges.length
        }
        const [a, b] = network.edges[p.edge]!
        packetPositions[i * 3] = a.x + (b.x - a.x) * p.t
        packetPositions[i * 3 + 1] = a.y + (b.y - a.y) * p.t
        packetPositions[i * 3 + 2] = a.z + (b.z - a.z) * p.t
      })
      pts.geometry.attributes.position!.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} position={constrained ? [0, 0.2, -1.4] : [1.1, 0.1, 0]} rotation={[0.1, 0, -0.08]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[network.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[network.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          map={dotTexture}
          vertexColors
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[network.linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={CYAN}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      <points ref={packetsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[packetPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={TEAL}
          size={0.12}
          map={dotTexture}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[shellPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={INDIGO}
          size={0.055}
          map={dotTexture}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

export default function HeroScene({ active }: { active: boolean }) {
  const constrained = useMemo(() => isConstrainedDevice(), [])

  return (
    <div className="hero-canvas" aria-hidden="true">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, constrained ? 1.5 : 2]}
        camera={{ position: [0, 0, 5.4], fov: 50 }}
        gl={{ antialias: !constrained, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
        eventSource={document.body}
      >
        <Network constrained={constrained} />
      </Canvas>
    </div>
  )
}
