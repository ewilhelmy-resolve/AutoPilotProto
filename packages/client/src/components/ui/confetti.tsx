/**
 * Confetti component using Magic UI pattern
 * Based on: https://magicui.design/docs/components/confetti
 */

import { useCallback, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import type { Options as ConfettiOptions } from 'canvas-confetti'
import { Button } from './button'

interface ConfettiButtonProps extends React.ComponentProps<typeof Button> {
  options?: ConfettiOptions
  onConfettiComplete?: () => void
}

export function ConfettiButton({
  options = {},
  onConfettiComplete,
  children,
  onClick,
  ...props
}: ConfettiButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const rect = buttonRef.current?.getBoundingClientRect()
      const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5
      const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { x, y },
        colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444'],
        ...options,
      })

      if (onConfettiComplete) {
        setTimeout(onConfettiComplete, 1000)
      }

      if (onClick) {
        onClick(event)
      }
    },
    [options, onClick, onConfettiComplete]
  )

  return (
    <Button ref={buttonRef} onClick={handleClick} {...props}>
      {children}
    </Button>
  )
}
