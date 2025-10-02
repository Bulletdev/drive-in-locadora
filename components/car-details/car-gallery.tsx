"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CarGalleryProps {
  images: string[]
  name: string
}

export function CarGallery({ images, name }: CarGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-muted">
        <Image
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`${name} - Imagem ${currentIndex + 1}`}
          fill
          className="object-cover"
        />

        {/* Navigation Buttons */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
          onClick={prev}
          aria-label="Imagem anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
          onClick={next}
          aria-label="Próxima imagem"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
              index === currentIndex ? "border-primary" : "border-transparent hover:border-muted-foreground/30"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${name} - Miniatura ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
