"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { apiGetVehicles } from "@/lib/api-client"
import { getAllVehicles } from "@/lib/vehicles-data"
import { slugifyVehicle } from "@/lib/utils"

interface SimilarCarsProps {
  currentCarId: string
  category: string
}

export function SimilarCars({ currentCarId, category }: SimilarCarsProps) {
  const [similarCars, setSimilarCars] = useState<Array<{
    id: string
    name: string
    year: number
    images: string[]
    pricePerDay: number
    category: string
  }>>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const result = await apiGetVehicles()
      if (!mounted) return
      const all = result.success && result.data ? result.data : getAllVehicles()
      let sims = all.filter((car) => car.category === category && car.id !== currentCarId).slice(0, 3)
      if (sims.length < 3) {
        const remaining = all
          .filter((car) => car.id !== currentCarId && !sims.find((sc) => sc.id === car.id))
          .slice(0, 3 - sims.length)
        sims = [...sims, ...remaining]
      }
      setSimilarCars(sims)
    })()
    return () => {
      mounted = false
    }
  }, [currentCarId, category])

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">
        Veículos <span className="text-primary">Similares</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {similarCars.map((car) => (
          <Card key={car.id} className="overflow-hidden group hover:shadow-xl transition-all">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={car.images[0] || "/placeholder.svg"}
                alt={car.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">{car.name} {car.year}</h3>
              <p className="text-2xl font-bold text-primary mb-4">R$ {car.pricePerDay}/dia</p>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href={`/frota/${slugifyVehicle(car.name, car.year)}`}>
                  Ver detalhes
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
