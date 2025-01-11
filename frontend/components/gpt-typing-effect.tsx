'use client'

import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'

interface GPTTypingEffectProps {
  text: string
  typingSpeed?: number
  className?: string
}

const GPTTypingEffect: React.FC<GPTTypingEffectProps> = ({ text, typingSpeed = 20, className }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, typingSpeed)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, text, typingSpeed])

  return <p className={cn('', className)}>{displayedText}</p>
}

export default GPTTypingEffect
