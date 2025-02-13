"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { createNoise3D } from "simplex-noise"

interface WavyBeerFillProps {
  width: string
  isComplete: boolean
  waveColor: string
}

interface Particle {
  x: number
  y: number
  radius: number
  speed: number
  opacity: number
}

const WavyBeerFill: React.FC<WavyBeerFillProps> = ({ width, isComplete, waveColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const noise = createNoise3D()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let nt = 0
    const particles: Particle[] = []

    const createParticle = (x: number, y: number): Particle => ({
      x,
      y,
      radius: Math.random() * 1 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: 0,
    })

    const createParticles = () => {
      const particleCount = Math.floor(canvas.width / 10)
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(Math.random() * canvas.width, canvas.height - Math.random() * 5))
      }
    }

    const drawWave = () => {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Calculate wave points
      const wavePoints: [number, number][] = []
      for (let x = 0; x <= canvas.width; x += 5) {
        const y = Math.min(noise(x / 30 - nt, nt, 0) * canvas.height * 0.4 + canvas.height * 0.3, canvas.height)
        wavePoints.push([x, y])
      }

      // Draw beer
      const beerGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      beerGradient.addColorStop(0, waveColor)
      beerGradient.addColorStop(0.8, waveColor)
      beerGradient.addColorStop(1, waveColor.replace("0.9", "0.8"))

      ctx.fillStyle = beerGradient
      ctx.beginPath()
      ctx.moveTo(0, canvas.height)
      wavePoints.forEach((point) => ctx.lineTo(point[0], point[1]))
      ctx.lineTo(canvas.width, canvas.height)
      ctx.closePath()
      ctx.fill()

      // Draw particles
      particles.forEach((particle, index) => {
        const waveY = wavePoints[Math.floor(particle.x / 5)][1]

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
        ctx.fill()

        particle.y -= particle.speed
        particle.opacity = Math.min(particle.opacity + 0.05, 0.7)

        if (particle.y <= waveY) {
          particle.opacity = Math.max(0, particle.opacity - 0.1)
        }

        // Reset particle if it's fully transparent or falls below the canvas
        if (particle.opacity <= 0 || particle.y > canvas.height) {
          particles[index] = createParticle(Math.random() * canvas.width, canvas.height - Math.random() * 5)
        }
      })

      nt += 0.005
      animationId = requestAnimationFrame(drawWave)
    }

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      createParticles()
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    drawWave()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [noise, waveColor])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ width: width }} />
}

export default WavyBeerFill

