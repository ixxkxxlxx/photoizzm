"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface PortfolioGridProps {
  images: string[]
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function PortfolioGrid({ images: initialImages }: PortfolioGridProps) {
  const [images, setImages] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setImages(shuffleArray(initialImages))
    setMounted(true)
  }, [initialImages])

  // Use a simple skeleton during initial mount to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {initialImages.map((src, i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl bg-secondary animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.map((src, i) => (
        <div
          key={src}
          className="group relative aspect-square overflow-hidden rounded-2xl bg-secondary"
        >
          <Image
            src={src}
            alt="Portfolio Work"
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      ))}
    </div>
  )
}
