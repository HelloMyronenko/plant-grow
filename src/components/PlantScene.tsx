import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PlantSceneProps {
  growthProgress: number
}

function AppleTree({ growthProgress }: { growthProgress: number }) {
  const trunkRef = useRef<THREE.Mesh>(null)
  const leavesRef = useRef<THREE.Group>(null)
  const applesRef = useRef<THREE.Group>(null)

  // Calculate growth parameters
  const trunkHeight = (growthProgress / 100) * 4
  const trunkRadius = 0.2 + (growthProgress / 100) * 0.3
  const canopySize = (growthProgress / 100) * 3
  const showLeaves = growthProgress > 40
  const showApples = growthProgress > 80

  // Animate gentle swaying
  useFrame((state) => {
    if (leavesRef.current && growthProgress > 40) {
      leavesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
      leavesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.01
    }
  })

  // Generate apple positions
  const applePositions = useMemo(() => {
    const positions = []
    if (showApples) {
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2
        const radius = 1.5 + Math.random() * 1
        const height = 3 + Math.random() * 1.5
        positions.push([
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ])
      }
    }
    return positions
  }, [showApples])

  return (
    <group>
      {/* Trunk */}
      <mesh ref={trunkRef} position={[0, trunkHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[trunkRadius * 0.8, trunkRadius, trunkHeight, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Branches (visible after sapling stage) */}
      {growthProgress > 30 && (
        <group>
          <mesh position={[0.5, trunkHeight * 0.7, 0]} rotation={[0, 0, -0.5]} castShadow>
            <cylinderGeometry args={[0.05, 0.1, 1, 6]} />
            <meshStandardMaterial color="#654321" roughness={0.8} />
          </mesh>
          <mesh position={[-0.5, trunkHeight * 0.8, 0]} rotation={[0, 0, 0.5]} castShadow>
            <cylinderGeometry args={[0.05, 0.1, 0.8, 6]} />
            <meshStandardMaterial color="#654321" roughness={0.8} />
          </mesh>
        </group>
      )}

      {/* Leaves/Canopy */}
      {showLeaves && (
        <group ref={leavesRef} position={[0, trunkHeight + canopySize * 0.5, 0]}>
          {/* Main canopy */}
          <mesh castShadow>
            <sphereGeometry args={[canopySize, 16, 16]} />
            <meshStandardMaterial color="#228B22" roughness={0.6} />
          </mesh>
          
          {/* Additional foliage for fuller look */}
          <mesh position={[canopySize * 0.5, -canopySize * 0.3, 0]} castShadow>
            <sphereGeometry args={[canopySize * 0.7, 12, 12]} />
            <meshStandardMaterial color="#32CD32" roughness={0.6} />
          </mesh>
          <mesh position={[-canopySize * 0.5, -canopySize * 0.3, 0]} castShadow>
            <sphereGeometry args={[canopySize * 0.7, 12, 12]} />
            <meshStandardMaterial color="#228B22" roughness={0.6} />
          </mesh>
        </group>
      )}

      {/* Apples */}
      {showApples && (
        <group ref={applesRef}>
          {applePositions.map((position, index) => (
            <mesh key={index} position={position as [number, number, number]} castShadow>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color="#DC143C" roughness={0.3} />
            </mesh>
          ))}
        </group>
      )}

      {/* Roots (visible in early stages) */}
      {growthProgress > 10 && growthProgress < 60 && (
        <group>
          <mesh position={[0.2, -0.3, 0]} rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.05, 0.02, 0.6, 6]} />
            <meshStandardMaterial color="#654321" roughness={0.9} />
          </mesh>
          <mesh position={[-0.2, -0.3, 0]} rotation={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.05, 0.02, 0.6, 6]} />
            <meshStandardMaterial color="#654321" roughness={0.9} />
          </mesh>
        </group>
      )}
    </group>
  )
}

export default function PlantScene({ growthProgress }: PlantSceneProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      <AppleTree growthProgress={growthProgress} />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#90EE90" roughness={0.8} />
      </mesh>
      
      {/* Additional ground details */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0, 2, 32]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>
    </>
  )
}
