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
    
    // Subtle apple movement - reduced for performance with 100 apples
    if (applesRef.current && showApples) {
      applesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
    }
  })

  // Generate apple positions with better distribution for 100 apples
  const applePositions = useMemo(() => {
    const positions = []
    if (showApples) {
      const appleCount = 100
      
      // Create multiple layers for better distribution
      const layers = 5
      const applesPerLayer = appleCount / layers
      
      for (let layer = 0; layer < layers; layer++) {
        const layerProgress = layer / (layers - 1) // 0 to 1
        const layerHeight = 0.2 + layerProgress * 0.6 // Distribute from 20% to 80% of canopy height
        
        for (let i = 0; i < applesPerLayer; i++) {
          // Spiral distribution for even spacing
          const angle = (i / applesPerLayer) * Math.PI * 2 + layer * 0.5
          const radiusBase = 0.5 + layerProgress * 0.5 // Inner layers have smaller radius
          
          // Add randomness to avoid perfect patterns
          const radius = canopySize * radiusBase * (0.8 + Math.random() * 0.4)
          const heightOffset = (Math.random() - 0.5) * 0.3
          
          const x = radius * Math.cos(angle) + (Math.random() - 0.5) * 0.3
          const y = trunkHeight + canopySize * layerHeight + heightOffset
          const z = radius * Math.sin(angle) + (Math.random() - 0.5) * 0.3
          
          // Only add if within canopy bounds
          const distFromCenter = Math.sqrt(x * x + (y - (trunkHeight + canopySize * 0.5)) ** 2 + z * z)
          if (distFromCenter < canopySize * 1.1) {
            positions.push({
              position: [x, y, z],
              size: 0.08 + Math.random() * 0.04, // Smaller apples for better performance
              color: Math.random() < 0.7 ? "#DC143C" : Math.random() < 0.5 ? "#FF6347" : "#B22222"
            })
          }
        }
      }
    }
    return positions
  }, [showApples, canopySize, trunkHeight])

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
          {/* Additional branches for fuller tree */}
          <mesh position={[0, trunkHeight * 0.75, 0.5]} rotation={[0.5, 0, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.08, 0.7, 6]} />
            <meshStandardMaterial color="#654321" roughness={0.8} />
          </mesh>
          <mesh position={[0, trunkHeight * 0.85, -0.5]} rotation={[-0.5, 0, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.08, 0.9, 6]} />
            <meshStandardMaterial color="#654321" roughness={0.8} />
          </mesh>
          {/* Extra branches to support visual weight of 100 apples */}
          <mesh position={[0.3, trunkHeight * 0.6, 0.3]} rotation={[0.3, 0.5, -0.3]} castShadow>
            <cylinderGeometry args={[0.03, 0.06, 0.6, 6]} />
            <meshStandardMaterial color="#654321" roughness={0.8} />
          </mesh>
          <mesh position={[-0.3, trunkHeight * 0.65, -0.3]} rotation={[-0.3, -0.5, 0.3]} castShadow>
            <cylinderGeometry args={[0.03, 0.06, 0.6, 6]} />
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
          <mesh position={[0, -canopySize * 0.3, canopySize * 0.5]} castShadow>
            <sphereGeometry args={[canopySize * 0.6, 12, 12]} />
            <meshStandardMaterial color="#2E8B57" roughness={0.6} />
          </mesh>
        </group>
      )}

      {/* Apples - 100 total */}
      {showApples && (
        <group ref={applesRef}>
          {applePositions.map((apple, index) => (
            <mesh 
              key={index} 
              position={apple.position as [number, number, number]}
              castShadow
            >
              <sphereGeometry args={[apple.size, 6, 6]} />
              <meshStandardMaterial 
                color={apple.color} 
                roughness={0.3} 
              />
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
      
      {/* Ground surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#90EE90" roughness={0.8} />
      </mesh>
      
      {/* Deep soil layer */}
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[20, 4, 20]} />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>
      
      {/* Soil layers for visual depth */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[20, 1, 20]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>
      
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[20, 1, 20]} />
        <meshStandardMaterial color="#704214" roughness={0.9} />
      </mesh>
      
      <mesh position={[0, -3, 0]}>
        <boxGeometry args={[20, 2, 20]} />
        <meshStandardMaterial color="#5C4033" roughness={0.9} />
      </mesh>
      
      {/* Additional ground details around tree */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0, 2, 32]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>
    </>
  )
}
