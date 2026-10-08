import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, Line, OrbitControls, Sparkles, Text } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, type PropsWithChildren } from 'react'
import * as THREE from 'three'
import type { Group, Mesh } from 'three'
import type { ComponentKey } from '../../data/syllabus'

export type TransformerMode = 'step-up' | 'step-down'

export interface TransformerSceneProps {
  exploded: boolean
  xray: boolean
  animate: boolean
  mode: TransformerMode
  resetSignal: number
  selected?: ComponentKey | null
  onSelect: (component: ComponentKey) => void
  onHover: (component: ComponentKey | null) => void
}

interface PartProps {
  component: ComponentKey
  selected?: ComponentKey | null
  onSelect: (component: ComponentKey) => void
  onHover: (component: ComponentKey | null) => void
}

function SelectableGroup({ component, selected, onSelect, onHover, children }: PropsWithChildren<PartProps>) {
  return (
    <group
      onClick={(event) => { event.stopPropagation(); onSelect(component) }}
      onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; onHover(component) }}
      onPointerOut={() => { document.body.style.cursor = 'default'; onHover(null) }}
    >
      {children}
      {selected === component && <pointLight color="#a8f7ff" intensity={3.2} distance={3.3} />}
    </group>
  )
}

function SmoothGroup({ target, children }: { target: THREE.Vector3Tuple, children: React.ReactNode }) {
  const ref = useRef<Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.position.lerp(new THREE.Vector3(...target), 1 - Math.exp(-4 * delta))
  })
  return <group ref={ref}>{children}</group>
}

function Coil({
  side, turns, exploded, colour, component, selected, onSelect, onHover,
}: {
  side: 'primary' | 'secondary'
  turns: number
  exploded: boolean
  colour: string
} & PartProps) {
  const x = side === 'primary' ? -1.55 : 1.55
  const shift = exploded ? (side === 'primary' ? -1.15 : 1.15) : 0
  const yPositions = useMemo(() => Array.from({ length: turns }, (_, index) => {
    if (turns === 1) return 0
    return -0.59 + (index * 1.18) / (turns - 1)
  }), [turns])
  const hot = selected === component
  return (
    <SmoothGroup target={[x + shift, 0, 0]}>
      <SelectableGroup component={component} selected={selected} onSelect={onSelect} onHover={onHover}>
        {yPositions.map((y, index) => (
          <mesh key={`${side}-${turns}-${index}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <torusGeometry args={[0.57, 0.058, 10, 32]} />
            <meshStandardMaterial
              color={hot ? '#fff1a8' : colour}
              metalness={0.82}
              roughness={0.2}
              emissive={hot ? colour : '#000000'}
              emissiveIntensity={hot ? 0.65 : 0}
            />
          </mesh>
        ))}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 1.38, 24, 1, true]} />
          <meshStandardMaterial color={colour} transparent opacity={0.08} side={THREE.DoubleSide} />
        </mesh>
        <Text position={[0, 1.08, 0]} fontSize={0.16} color={colour} anchorX="center" outlineWidth={0.006} outlineColor="#071014">
          {side === 'primary' ? 'PRIMARY' : 'SECONDARY'}
        </Text>
      </SelectableGroup>
    </SmoothGroup>
  )
}

function Core({ exploded, xray, selected, onSelect, onHover }: Omit<TransformerSceneProps, 'mode' | 'animate' | 'resetSignal'>) {
  const opacity = xray ? 0.23 : 0.94
  const hot = selected === 'core'
  const material = (
    <meshStandardMaterial
      color={hot ? '#e7f9ff' : '#9aa9ad'}
      metalness={0.62}
      roughness={0.36}
      transparent={xray}
      opacity={opacity}
      emissive={hot ? '#76dbff' : '#121a1b'}
      emissiveIntensity={hot ? 0.55 : 0.12}
    />
  )
  return (
    <SelectableGroup component="core" selected={selected} onSelect={onSelect} onHover={onHover}>
      <SmoothGroup target={[0, exploded ? 0.56 : 0, 0]}>
        <mesh position={[0, 1.04, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.35, 0.38, 0.72]} />
          {material}
        </mesh>
        <mesh position={[0, -1.04, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.35, 0.38, 0.72]} />
          {material}
        </mesh>
        <mesh position={[-1.55, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 2.22, 0.72]} />
          {material}
        </mesh>
        <mesh position={[1.55, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 2.22, 0.72]} />
          {material}
        </mesh>
      </SmoothGroup>
    </SelectableGroup>
  )
}

function Terminals({ side, exploded, selected, onSelect, onHover }: { side: 'input' | 'output', exploded: boolean } & Omit<PartProps, 'component'>) {
  const isInput = side === 'input'
  const x = isInput ? -2.62 : 2.62
  const shift = exploded ? (isInput ? -0.85 : 0.85) : 0
  const colour = isInput ? '#55dfff' : '#ffd35a'
  const linkedX = isInput ? -1.55 : 1.55
  const hot = selected === side
  return (
    <SmoothGroup target={[x + shift, 0, 0]}>
      <SelectableGroup component={side} selected={selected} onSelect={onSelect} onHover={onHover}>
        {[-0.48, 0.48].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.13, 0.13, 0.32, 20]} />
            <meshStandardMaterial color={hot ? '#ffffff' : '#d4aa35'} metalness={0.8} roughness={0.25} emissive={hot ? colour : '#221800'} emissiveIntensity={hot ? 0.8 : 0.2} />
          </mesh>
        ))}
        <Line points={[[0, -0.48, 0], [isInput ? 0.36 : -0.36, -0.48, 0], [linkedX - (x + shift), -0.72, 0]]} color={colour} lineWidth={2.2} />
        <Line points={[[0, 0.48, 0], [isInput ? 0.36 : -0.36, 0.48, 0], [linkedX - (x + shift), 0.72, 0]]} color={colour} lineWidth={2.2} />
        <Text position={[0, 0.88, 0]} fontSize={0.14} color={colour} anchorX="center" outlineWidth={0.006} outlineColor="#071014">
          {isInput ? 'AC INPUT' : 'AC OUTPUT'}
        </Text>
      </SelectableGroup>
    </SmoothGroup>
  )
}

function EnergyParticles({ animate }: { animate: boolean }) {
  const primaryParticles = useRef<Group>(null)
  const secondaryParticles = useRef<Group>(null)
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    if (!animate) return
    primaryParticles.current?.children.forEach((child, index) => {
      const angle = time * 3.5 + index * 2.1
      child.position.set(-1.55 + 0.69 * Math.cos(angle), 0.28 * Math.sin(angle * 1.6), 0.69 * Math.sin(angle))
    })
    secondaryParticles.current?.children.forEach((child, index) => {
      const angle = -time * 3.5 + index * 2.1
      child.position.set(1.55 + 0.69 * Math.cos(angle), 0.28 * Math.sin(angle * 1.6), 0.69 * Math.sin(angle))
    })
  })
  return (
    <>
      <group ref={primaryParticles}>{[0, 1, 2].map((n) => <mesh key={n}><sphereGeometry args={[0.075, 16, 16]} /><meshBasicMaterial color="#62e7ff" /></mesh>)}</group>
      <group ref={secondaryParticles}>{[0, 1, 2].map((n) => <mesh key={n}><sphereGeometry args={[0.065, 16, 16]} /><meshBasicMaterial color="#ffe16d" /></mesh>)}</group>
    </>
  )
}

function MagneticField({ animate, selected, onSelect, onHover }: Pick<TransformerSceneProps, 'animate' | 'selected' | 'onSelect' | 'onHover'>) {
  const particles = useRef<Group>(null)
  const pulse = useRef<Group>(null)
  const points: THREE.Vector3Tuple[] = [[-1.55, 0.75, 0.02], [1.55, 0.75, 0.02], [1.55, -0.75, 0.02], [-1.55, -0.75, 0.02], [-1.55, 0.75, 0.02]]
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    const alternating = Math.sin(time * 3.2)
    if (pulse.current) pulse.current.scale.setScalar(1 + 0.09 * alternating)
    particles.current?.children.forEach((child, index) => {
      const travel = ((time * 0.32 * Math.sign(alternating || 1)) + index / 6 + 2) % 1
      const segment = Math.floor(travel * 4)
      const local = travel * 4 - segment
      const a = new THREE.Vector3(...points[segment])
      const b = new THREE.Vector3(...points[segment + 1])
      child.position.lerpVectors(a, b, local)
      child.visible = animate
    })
  })
  return (
    <SelectableGroup component="field" selected={selected} onSelect={onSelect} onHover={onHover}>
      <group ref={pulse}>
        <Line points={points} color="#b687ff" lineWidth={2.4} transparent opacity={animate ? 0.92 : 0.2} />
        <Line points={points.map(([x, y, z]) => [x, y, z + 0.28] as THREE.Vector3Tuple)} color="#7b5db5" lineWidth={1.2} transparent opacity={animate ? 0.45 : 0.08} />
      </group>
      <group ref={particles}>{Array.from({ length: 6 }, (_, n) => <mesh key={n} visible={false}><sphereGeometry args={[0.055, 12, 12]} /><meshBasicMaterial color="#e1c6ff" /></mesh>)}</group>
      <Text position={[0, -1.43, 0]} fontSize={0.14} color="#cba8ff" anchorX="center" outlineWidth={0.006} outlineColor="#071014">
        {animate ? 'CHANGING MAGNETIC FIELD' : 'MAGNETIC FIELD'}
      </Text>
    </SelectableGroup>
  )
}

function TransformerModel(props: Omit<TransformerSceneProps, 'resetSignal'>) {
  const primaryTurns = props.mode === 'step-up' ? 6 : 12
  const secondaryTurns = props.mode === 'step-up' ? 12 : 6
  return (
    <group position={[0, 0.06, 0]} rotation={[0, -0.16, 0]}>
      <Core exploded={props.exploded} xray={props.xray} selected={props.selected} onSelect={props.onSelect} onHover={props.onHover} />
      <Coil side="primary" turns={primaryTurns} exploded={props.exploded} colour="#31b9e8" component="primary" selected={props.selected} onSelect={props.onSelect} onHover={props.onHover} />
      <Coil side="secondary" turns={secondaryTurns} exploded={props.exploded} colour="#eea93e" component="secondary" selected={props.selected} onSelect={props.onSelect} onHover={props.onHover} />
      <Terminals side="input" exploded={props.exploded} selected={props.selected} onSelect={props.onSelect} onHover={props.onHover} />
      <Terminals side="output" exploded={props.exploded} selected={props.selected} onSelect={props.onSelect} onHover={props.onHover} />
      <MagneticField animate={props.animate} selected={props.selected} onSelect={props.onSelect} onHover={props.onHover} />
      <EnergyParticles animate={props.animate} />
      <mesh position={[0, -1.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[5.75, 0.22, 2.15]} />
        <meshStandardMaterial color="#182a30" metalness={0.55} roughness={0.35} transparent opacity={props.xray ? 0.32 : 1} />
      </mesh>
      <mesh position={[0, -1.33, 0]} receiveShadow>
        <cylinderGeometry args={[2.25, 2.5, 0.13, 64]} />
        <meshStandardMaterial color="#0d191d" metalness={0.65} roughness={0.28} />
      </mesh>
    </group>
  )
}

function CameraReset({ resetSignal }: { resetSignal: number }) {
  const { camera, controls } = useThree()
  useEffect(() => {
    camera.position.set(6.7, 4.4, 7.6)
    camera.lookAt(0, 0, 0)
    const orbit = controls as unknown as { target?: THREE.Vector3, update?: () => void } | null
    orbit?.target?.set(0, -0.05, 0)
    orbit?.update?.()
  }, [camera, controls, resetSignal])
  return null
}

function Scene(props: TransformerSceneProps) {
  return (
    <>
      <color attach="background" args={['#071014']} />
      <fog attach="fog" args={['#071014', 9, 20]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.9} color="#d8f9ff" castShadow />
      <pointLight position={[-4, 1.4, 3]} intensity={22} distance={6} color="#0c9ed5" />
      <pointLight position={[4, 1.1, 1]} intensity={15} distance={5} color="#e5a33c" />
      <spotLight position={[0, 7, -3]} intensity={20} angle={0.45} penumbra={1} color="#a179ff" />
      <TransformerModel {...props} />
      <Sparkles count={55} scale={[9, 6, 7]} size={1.3} speed={0.18} opacity={0.28} color="#a7eaff" />
      <gridHelper args={[18, 30, '#193b43', '#10242a']} position={[0, -1.62, 0]} />
      <OrbitControls makeDefault enablePan enableDamping dampingFactor={0.08} minDistance={4.6} maxDistance={13} maxPolarAngle={Math.PI / 2.05} />
      <CameraReset resetSignal={props.resetSignal} />
    </>
  )
}

export default function Transformer({ className, ...props }: TransformerSceneProps & { className?: string }) {
  return (
    <div className={className ?? 'transformer-canvas'} aria-label="Interactive 3D transformer model">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [6.7, 4.4, 7.6], fov: 42 }} gl={{ antialias: true }}>
        <Suspense fallback={<Html center><div className="scene-loader">Building transformer…</div></Html>}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </div>
  )
}
