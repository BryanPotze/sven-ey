"use client"

import { useState, useEffect, useRef } from "react"

interface CountingNumberProps {
  value: number
  duration?: number
}

export default function CountingNumber({ value, duration = 500 }: CountingNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const previousValue = useRef(0)
  const isInitialRender = useRef(true)

  useEffect(() => {
    let startTime: number | null = null
    const startValue = isInitialRender.current ? 0 : previousValue.current
    const endValue = value

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const currentValue = Math.round(startValue + progress * (endValue - startValue))
      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animateCount)
      } else {
        previousValue.current = endValue
        isInitialRender.current = false
      }
    }

    requestAnimationFrame(animateCount)
  }, [value, duration])

  return <span>{displayValue}</span>
}

