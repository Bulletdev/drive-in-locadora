import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { getAllVehicles } from "@/lib/vehicles-data"

interface SimilarCarsProps {
  currentCarId: string
  category: string
}

export function SimilarCars({ currentCarId, category }: SimilarCarsProps) {
  const allVehicles = getAllVehicles()

  // Filtrar veículos da mesma categoria, excluindo o atual
  let similarCars = allVehicles
    .filter((car) => car.category === category && car.id !== currentCarId)
    .slice(0, 3)

  // Se não houver veículos suficientes da mesma categoria, pegar outros disponíveis
  if (similarCars.length < 3) {
    const remainingCars = allVehicles
      .filter((car) => car.id !== currentCarId && !similarCars.find(sc => sc.id === car.id))
      .slice(0, 3 - similarCars.length)
    similarCars = [...similarCars, ...remainingCars]
  }

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
                <Link href={`/frota/${car.id}`}>
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
