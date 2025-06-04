import React, { useState, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { Leaf, Droplets, Sun, Wind, Apple } from 'lucide-react'
import PlantScene from './components/PlantScene'

interface GrowthStage {
  name: string
  description: string
  progress: number
}

const growthStages: GrowthStage[] = [
  { name: 'Seed', description: 'The journey begins with a tiny apple seed', progress: 0 },
  { name: 'Germination', description: 'Roots emerge and reach deep into the soil', progress: 20 },
  { name: 'Sapling', description: 'The trunk grows strong and tall', progress: 40 },
  { name: 'Branching', description: 'Branches spread to capture more sunlight', progress: 60 },
  { name: 'Leafing', description: 'Leaves unfold to photosynthesize', progress: 80 },
  { name: 'Fruiting', description: 'Beautiful apples grow on the branches', progress: 100 }
]

function App() {
  const [growthProgress, setGrowthProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number>()

  const currentStageIndex = Math.max(0, 
    growthStages.findIndex(stage => growthProgress <= stage.progress) === -1 
      ? growthStages.length - 1 
      : growthStages.findIndex(stage => growthProgress <= stage.progress)
  )

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
            <Apple className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-800">How Apple Trees Grow</h1>
            <Apple className="w-8 h-8 text-red-600 scale-x-[-1]" />
          </div>
          <p className="text-center mt-2 text-gray-600 max-w-2xl mx-auto">
            Experience the magical journey of an apple tree's life cycle in stunning 3D
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
                  <PerspectiveCamera makeDefault position={[8, 6, 8]} />
                  <OrbitControls 
                    enablePan={false}
                    minDistance={5}
                    maxDistance={15}
                    maxPolarAngle={Math.PI / 2}
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
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Apple className="w-6 h-6 text-red-600" />
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
              <h2 className="text-xl font-semibold text-gray-800 mb-4">What Apple Trees Need</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Water</h3>
                    <p className="text-sm text-gray-600">Regular watering for healthy growth</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sun className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Full Sun</h3>
                    <p className="text-sm text-gray-600">6-8 hours of direct sunlight daily</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-5 h-5 bg-amber-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Rich Soil</h3>
                    <p className="text-sm text-gray-600">Well-draining, nutrient-rich soil</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fun Facts */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Apple Tree Facts</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Apple trees can live for over 100 years!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>A single tree can produce up to 800 apples per year</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>There are over 7,500 varieties of apples worldwide</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Apples float because they're 25% air</span>
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
