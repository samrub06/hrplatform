"use client"

import { useEffect, useRef } from "react"

interface ConfettiProps {
  duration?: number
  particleCount?: number
}

export function Confetti({ duration = 5000, particleCount = 150 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full window size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Confetti particles
    const particles: Particle[] = []

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      color: string
      velocity: { x: number; y: number }
      rotation: number
      rotationSpeed: number
      shape: "circle" | "square" | "triangle"

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = -20 - Math.random() * 100
        this.size = Math.random() * 10 + 5
        this.color = `hsl(${Math.random() * 360}, 80%, 60%)`
        this.velocity = {
          x: Math.random() * 3 - 1.5,
          y: Math.random() * 3 + 1.5,
        }
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = Math.random() * 0.2 - 0.1

        // Random shape
        const shapes: ("circle" | "square" | "triangle")[] = ["circle", "square", "triangle"]
        this.shape = shapes[Math.floor(Math.random() * shapes.length)]
      }

      update() {
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.rotation += this.rotationSpeed

        // Add some gravity and wind
        this.velocity.y += 0.03
        this.velocity.x += Math.random() * 0.05 - 0.025

        // Add some wobble
        this.velocity.x += Math.sin(this.y * 0.01) * 0.1
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.fillStyle = this.color

        switch (this.shape) {
          case "circle":
            ctx.beginPath()
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2)
            ctx.fill()
            break
          case "square":
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
            break
          case "triangle":
            ctx.beginPath()
            ctx.moveTo(0, -this.size / 2)
            ctx.lineTo(-this.size / 2, this.size / 2)
            ctx.lineTo(this.size / 2, this.size / 2)
            ctx.closePath()
            ctx.fill()
            break
        }

        ctx.restore()
      }
    }

    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        particles.push(new Particle())
      }, Math.random() * 2000) // Stagger the creation for a more natural effect
    }

    // Animation loop
    let animationId: number
    const startTime = Date.now()

    function animate() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update()
        particles[i].draw(ctx)

        // Remove particles that are off screen
        if (particles[i].y > canvas.height + 50 || particles[i].x < -50 || particles[i].x > canvas.width + 50) {
          particles.splice(i, 1)
        }
      }

      // Add new particles occasionally
      if (particles.length < particleCount && Date.now() - startTime < duration) {
        if (Math.random() < 0.1) {
          particles.push(new Particle())
        }
      }

      // Continue animation if there are particles or we're within duration
      if (particles.length > 0 || Date.now() - startTime < duration) {
        animationId = requestAnimationFrame(animate)
      }
    }

    // Start animation
    animate()

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [particleCount, duration])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ position: "fixed", top: 0, left: 0 }}
    />
  )
}
