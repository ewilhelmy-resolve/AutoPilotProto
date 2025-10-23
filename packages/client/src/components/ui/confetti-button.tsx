/**
 * ConfettiButton - Button wrapper that creates small confetti burst on click
 */

import React, { useState, useRef } from 'react'
import { Button } from './button'

interface ConfettiParticle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  velocityX: number
  velocityY: number
}

interface ConfettiButtonProps extends React.ComponentProps<typeof Button> {
  onClickWithConfetti?: (e: React.MouseEvent<HTMLButtonElement>) => void
  confettiColors?: string[]
}

export function ConfettiButton({
  onClickWithConfetti,
  onClick,
  children,
  confettiColors = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444'],
  ...props
}: ConfettiButtonProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([])
  const buttonRef = useRef<HTMLButtonElement>(null)

  const createConfetti = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current
    if (!button) return

    // Use viewport coordinates for fixed positioning
    const originX = e.clientX
    const originY = e.clientY

    console.log('🎉 Creating confetti at:', originX, originY)

    // Create 15 particles (more visible)
    const newParticles: ConfettiParticle[] = Array.from({ length: 15 }, (_, i) => {
      const angle = (i / 15) * Math.PI * 2
      const velocity = 3 + Math.random() * 3 // Increased velocity

      return {
        id: Date.now() + i,
        x: originX,
        y: originY,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        velocityX: Math.cos(angle) * velocity,
        velocityY: Math.sin(angle) * velocity,
      }
    })

    console.log('🎉 Particles created:', newParticles.length)
    setParticles(newParticles)

    // Clean up after animation
    setTimeout(() => {
      console.log('🎉 Cleaning up confetti')
      setParticles([])
    }, 1000) // Increased to 1 second

    // Call the original handlers
    if (onClickWithConfetti) {
      onClickWithConfetti(e)
    }
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={createConfetti}
        {...props}
      >
        {children}
      </Button>

      {/* Confetti particles - rendered at document level with fixed positioning */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="fixed pointer-events-none animate-confetti z-[9999]"
          style={
            {
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              '--velocity-x': `${particle.velocityX * 50}px`,
              '--velocity-y': `${particle.velocityY * 50}px`,
              '--rotation': `${particle.rotation}deg`,
            } as React.CSSProperties
          }
        >
          <div
            className="w-3 h-3 rounded-sm"
            style={{
              backgroundColor: particle.color,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          />
        </div>
      ))}
    </>
  )
}
