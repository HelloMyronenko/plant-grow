import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface PlantSceneProps {
  growthProgress: number
}

function Soil() {
  return (
    <mesh position={[0, -0.5, 0]} receiveShadow>
      <boxGeometry args={[8, 1, 8]} />
      <meshStandardMaterial color="#78350f" roughness={0.9} />
    </mesh>
  )
}

function Seed({ visible }: { visible: boolean }) {
  if (!visible) return null
  
  return (
    <mesh position={[0, 0.1, 0]} castShadow>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color="#7c2d12" roughness={0.8} />
    </mesh>
  )
}

function Roots({ progress }: { progress: number }) {
  const rootDepth = Math.min(progress * 0.02, 0.8)
  
  if (progress < 20) return null
  
  return (
    <group>
      {/* Main root */}
      <mesh position={[0, -rootDepth / 2, 0]}>
        <cylinderGeometry args={[0.02, 0.04, rootDepth, 8]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.7} />
      </mesh>
      
      {/* Side roots */}
      {[...Array(3)].map((_, i) => (
        <mesh 
          key={i}
          position={[
            (i - 1) * 0.3, 
            -rootDepth * 0.7, 
            0
          ]}
          rotation={[0, 0, (i - 1) * 0.3]}
        >
          <cylinderGeometry args={[0.01, 0.02, rootDepth * 0.5, 6]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function Stem({ height }: { height: number }) {
  if (height <= 0) return null
  
  return (
    <mesh position={[0, height / 2, 0]} castShadow>
      <cylinderGeometry args={[0.05, 0.08, height, 8]} />
      <meshStandardMaterial color="#16a34a" roughness={0.6} />
    </mesh>
  )
}

function Leaves({ progress, stemHeight }: { progress: number; stemHeight: number }) {
  const leafCount = Math.floor((progress - 60) / 10)
  
  if (progress < 60 || leafCount <= 0) return null
  
  return (
    <group>
      {[...Array(Math.min(leafCount, 4))].map((_, i) => {
        const angle = (i % 2 === 0 ? 1 : -1) * Math.PI / 4
        const height = stemHeight * (0.3 + i * 0.15)
        const scale = 0.3 + i * 0.1
        
        return (
          <group key={i} position={[0, height, 0]} rotation={[0, angle, 0]}>
            <mesh position={[0.3, 0, 0]} rotation={[0, 0, -0.3]} castShadow>
              <sphereGeometry args={[scale, 8, 6]} />
              <meshStandardMaterial color="#22c55e" roughness={0.5} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function Flower({ visible, stemHeight }: { visible: boolean; stemHeight: number }) {
  const flowerRef = useRef<THREE.Group>(null)
  
  // Always calculate petalPositions to maintain consistent hooks
  const petalCount = 6
  const petalPositions = useMemo(() => {
    return [...Array(petalCount)].map((_, i) => {
      const angle = (i / petalCount) * Math.PI * 2
      return {
        x: Math.cos(angle) * 0.3,
        z: Math.sin(angle) * 0.3,
        rotation: angle
      }
    })
  }, [])
  
  // Always call useFrame, but conditionally execute logic inside
  useFrame((state) => {
    if (flowerRef.current && visible) {
      flowerRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })
  
  if (!visible) return null
  
  return (
    <group ref={flowerRef} position={[0, stemHeight + 0.3, 0]}>
      {/* Petals */}
      {petalPositions.map((pos, i) => (
        <mesh 
          key={i}
          position={[pos.x, 0, pos.z]}
          rotation={[0, pos.rotation, 0]}
          castShadow
        >
          <sphereGeometry args={[0.15, 8, 6]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.4} />
        </mesh>
      ))}
      
      {/* Center */}
      <mesh castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.5} />
      </mesh>
    </group>
  )
}

export default function PlantScene({ growthProgress }: PlantSceneProps) {
  const stemHeight = growthProgress >= 40 ? Math.min((growthProgress - 40) * 0.03, 1.8) : 0
  
  return (
    <>
      <Soil />
      <Seed visible={growthProgress < 20} />
      <Roots progress={growthProgress} />
      <Stem height={stemHeight} />
      <Leaves progress={growthProgress} stemHeight={stemHeight} />
      <Flower visible={growthProgress >= 90} stemHeight={stemHeight} />
      
      {/* Ground plane for shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </>
  )
}
