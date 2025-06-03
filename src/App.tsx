import React, { useEffect, useRef, useState } from 'react'
import { Leaf, Droplets, Sun, Wind } from 'lucide-react'

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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentStage, setCurrentStage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number>()
  const progressRef = useRef(0)

  const drawPlant = (ctx: CanvasRenderingContext2D, progress: number) => {
    const canvas = ctx.canvas
    const centerX = canvas.width / 2
    const groundY = canvas.height - 50

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, groundY)
    skyGradient.addColorStop(0, '#e0f2fe')
    skyGradient.addColorStop(1, '#f0f9ff')
    ctx.fillStyle = skyGradient
    ctx.fillRect(0, 0, canvas.width, groundY)

    // Draw ground
    ctx.fillStyle = '#92400e'
    ctx.fillRect(0, groundY, canvas.width, 50)
    
    // Draw soil texture
    ctx.fillStyle = '#78350f'
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width
      const y = groundY + Math.random() * 40 + 5
      ctx.beginPath()
      ctx.arc(x, y, Math.random() * 3 + 1, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw seed/plant based on progress
    if (progress < 20) {
      // Draw seed
      const seedY = groundY - 10
      ctx.fillStyle = '#7c2d12'
      ctx.beginPath()
      ctx.ellipse(centerX, seedY, 8, 6, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    if (progress >= 20) {
      // Draw roots
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 2
      const rootDepth = Math.min((progress - 20) * 2, 40)
      
      // Main root
      ctx.beginPath()
      ctx.moveTo(centerX, groundY)
      ctx.lineTo(centerX, groundY + rootDepth)
      ctx.stroke()
      
      // Side roots
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.moveTo(centerX, groundY + rootDepth * 0.5)
        ctx.lineTo(centerX - 15 + i * 15, groundY + rootDepth * 0.8)
        ctx.stroke()
      }
    }

    if (progress >= 40) {
      // Draw stem
      const stemHeight = Math.min((progress - 40) * 3, 120)
      ctx.strokeStyle = '#16a34a'
      ctx.lineWidth = Math.min(progress / 20, 5)
      ctx.beginPath()
      ctx.moveTo(centerX, groundY)
      ctx.lineTo(centerX, groundY - stemHeight)
      ctx.stroke()

      if (progress >= 60) {
        // Draw leaves
        const leafCount = Math.floor((progress - 60) / 10)
        for (let i = 0; i < leafCount; i++) {
          const leafY = groundY - stemHeight * (0.3 + i * 0.15)
          const leafSize = 15 + i * 3
          const side = i % 2 === 0 ? -1 : 1
          
          ctx.fillStyle = '#22c55e'
          ctx.beginPath()
          ctx.ellipse(centerX + side * 20, leafY, leafSize, leafSize / 2, side * 0.3, 0, Math.PI * 2)
          ctx.fill()
          
          // Leaf vein
          ctx.strokeStyle = '#16a34a'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(centerX, leafY)
          ctx.lineTo(centerX + side * 20, leafY)
          ctx.stroke()
        }
      }

      if (progress >= 90) {
        // Draw flower
        const flowerY = groundY - stemHeight - 10
        const petalCount = 6
        const petalSize = 12
        
        // Petals
        ctx.fillStyle = '#fbbf24'
        for (let i = 0; i < petalCount; i++) {
          const angle = (i / petalCount) * Math.PI * 2
          const petalX = centerX + Math.cos(angle) * 15
          const petalY = flowerY + Math.sin(angle) * 15
          
          ctx.beginPath()
          ctx.ellipse(petalX, petalY, petalSize, petalSize / 2, angle, 0, Math.PI * 2)
          ctx.fill()
        }
        
        // Center
        ctx.fillStyle = '#f59e0b'
        ctx.beginPath()
        ctx.arc(centerX, flowerY, 8, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Draw sun
    ctx.fillStyle = '#fbbf24'
    ctx.beginPath()
    ctx.arc(canvas.width - 60, 60, 25, 0, Math.PI * 2)
    ctx.fill()
    
    // Sun rays
    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 2
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const x1 = canvas.width - 60 + Math.cos(angle) * 30
      const y1 = 60 + Math.sin(angle) * 30
      const x2 = canvas.width - 60 + Math.cos(angle) * 40
      const y2 = 60 + Math.sin(angle) * 40
      
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
  }

  const animate = () => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    progressRef.current += 0.5
    if (progressRef.current > 100) {
      progressRef.current = 100
      setIsAnimating(false)
      cancelAnimationFrame(animationRef.current!)
      return
    }

    const stageIndex = growthStages.findIndex(stage => stage.progress >= progressRef.current)
    if (stageIndex !== -1 && stageIndex !== currentStage) {
      setCurrentStage(stageIndex)
    }

    drawPlant(ctx, progressRef.current)
    animationRef.current = requestAnimationFrame(animate)
  }

  const startAnimation = () => {
    progressRef.current = 0
    setCurrentStage(0)
    setIsAnimating(true)
  }

  const resetAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    progressRef.current = 0
    setCurrentStage(0)
    setIsAnimating(false)
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) drawPlant(ctx, 0)
    }
  }

  useEffect(() => {
    if (isAnimating) {
      animate()
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      drawPlant(ctx, progressRef.current)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <Leaf className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">How Plants Grow</h1>
            <Leaf className="w-8 h-8 text-green-600 scale-x-[-1]" />
          </div>
          <p className="text-center mt-2 text-gray-600 max-w-2xl mx-auto">
            Watch the magical journey of a plant's life cycle, from a tiny seed to a beautiful flowering plant
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Canvas Container */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <canvas
                ref={canvasRef}
                className="w-full h-[400px] rounded-lg"
                style={{ imageRendering: 'crisp-edges' }}
              />
              
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
                      {growthStages[currentStage].name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {growthStages[currentStage].description}
                    </p>
                  </div>
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
