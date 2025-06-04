import React, { useState, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { Leaf, Droplets, Sun, Wind } from 'lucide-react'
import PlantScene from './components/PlantScene'

interface GrowthStage {
  name: string
  description: string
  progress: number
}

const growthStages: GrowthStage[] = [
  { name: 'Seed', description: 'The journey begins with a tiny seed', progress: 0 },
  { name: 'Germination', description: 'Roots emerge and reach for water', progress: 20 },
  { name: 'Sprouting', description: 'First shoots break through the soil', progress: 40 },
  { name: 'Seedling', description: 'Leaves unfold to capture sunlight', progress: 60 },
  { name: 'Growing', description: 'Stem strengthens and leaves multiply', progress: 80 },
  { name: 'Mature Plant', description: 'Full grown and thriving', progress: 100 }
]

function App() {
  const [growthProgress, setGrowthProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number>()

  const currentStageIndex = growthStages.findIndex(stage => 
    growthProgress <= stage.progress
  ) || growthStages.length - 1

  const startAnimation = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setGrowthProgress(0)
    
    const animate = () => {
      setGrowthProgress(prev => {
        if (prev >= 100) {
          setIsAnimating(false)
          return 100
        }
        return prev + 0.5
      })
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()
  }

  const resetAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setGrowthProgress(0)
    setIsAnimating(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <Leaf className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">How Plants Grow</h1>
            <Leaf className="w-8 h-8 text-green-600 scale-x-[-1]" />
          </div>
          <p className="text-center mt-2 text-gray-600 max-w-2xl mx-auto">
            Experience the magical journey of a plant's life cycle in stunning 3D
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 3D Canvas Container */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="w-full h-[400px] rounded-lg overflow-hidden bg-gradient-to-b from-sky-200 to-sky-100">
                <Canvas shadows>
                  <PerspectiveCamera makeDefault position={[5, 5, 5]} />
                  <OrbitControls 
                    enablePan={false}
                    minDistance={3}
                    maxDistance={10}
                    maxPolarAngle={Math.PI / 2}
                  />
                  <ambientLight intensity={0.5} />
                  <directionalLight
                    position={[5, 8, 3]}
                    intensity={1}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                  />
                  <Suspense fallback={null}>
                    <PlantScene growthProgress={growthProgress} />
                    <Environment preset="forest" background={false} />
                  </Suspense>
                </Canvas>
              </div>
              
              {/* Controls */}
              <div className="mt-6 flex gap-4 justify-center">
                <button
                  onClick={startAnimation}
                  disabled={isAnimating}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Sun className="w-5 h-5" />
                  Start Growing
                </button>
                <button
                  onClick={resetAnimation}
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
                >
                  <Wind className="w-5 h-5" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Current Stage */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Growth Stage</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {growthStages[currentStageIndex].name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {growthStages[currentStageIndex].description}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${growthProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Growth Requirements */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">What Plants Need</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Water</h3>
                    <p className="text-sm text-gray-600">Essential for transporting nutrients</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sun className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Sunlight</h3>
                    <p className="text-sm text-gray-600">Powers photosynthesis for energy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-5 h-5 bg-amber-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Nutrients</h3>
                    <p className="text-sm text-gray-600">Minerals from soil for growth</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fun Facts */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Did You Know?</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Some bamboo species can grow up to 35 inches in a single day!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Plants can communicate with each other through their root systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>The oldest known tree is over 5,000 years old</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
