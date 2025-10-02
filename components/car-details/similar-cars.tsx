import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface SimilarCarsProps {
  currentCarId: string
  category: string
}

const similarCarsData = [
  {
    id: "2",
    name: "Honda HR-V",
    category: "SUV",
    image: "/honda-hrv-suv.png",
    pricePerDay: 250,
  },
  {
    id: "4",
    name: "Volkswagen T-Cross",
    category: "SUV",
    image: "/volkswagen-tcross-suv.png",
    pricePerDay: 280,
  },
  {
    id: "8",
    name: "Nissan Kicks",
    category: "SUV",
    image: "/nissan-kicks-suv.png",
    pricePerDay: 260,
  },
]

export function SimilarCars({ currentCarId, category }: SimilarCarsProps) {
  const similarCars = similarCarsData.filter((car) => car.id !== currentCarId)

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
                src={car.image || "/placeholder.svg"}
                alt={car.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">{car.name}</h3>
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
