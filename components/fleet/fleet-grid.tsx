"use client"

import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Gauge, Fuel } from "lucide-react"

const cars = [
  {
    id: "1",
    name: "Toyota Corolla",
    category: "Sedan",
    year: 2024,
    image: "/cars/toyota-corolla-1.jpg",
    pricePerDay: 180,
    transmission: "Automático",
    passengers: 5,
    fuel: "Flex",
    available: true,
  },
  {
    id: "2",
    name: "Honda HR-V",
    category: "SUV",
    year: 2024,
    image: "/cars/honda-hrv-1.jpg",
    pricePerDay: 250,
    transmission: "Automático",
    passengers: 5,
    fuel: "Flex",
    available: true,
  },
  {
    id: "3",
    name: "Chevrolet Onix",
    category: "Hatchback",
    year: 2024,
    image: "/cars/chevrolet-onix-1.jpg",
    pricePerDay: 120,
    transmission: "Manual",
    passengers: 5,
    fuel: "Flex",
    available: true,
  },
  {
    id: "4",
    name: "Volkswagen T-Cross",
    category: "SUV",
    year: 2024,
    image: "/cars/volkswagen-tcross-1.jpg",
    pricePerDay: 280,
    transmission: "Automático",
    passengers: 5,
    fuel: "Flex",
    available: true,
  },
  {
    id: "5",
    name: "Hyundai HB20",
    category: "Hatchback",
    year: 2023,
    image: "/cars/hyundai-hb20-1.jpg",
    pricePerDay: 130,
    transmission: "Manual",
    passengers: 5,
    fuel: "Flex",
    available: true,
  },
  {
    id: "6",
    name: "Jeep Compass",
    category: "SUV",
    year: 2024,
    image: "/cars/jeep-compass-1.jpg",
    pricePerDay: 320,
    transmission: "Automático",
    passengers: 5,
    fuel: "Flex",
    available: false,
  },
  {
    id: "7",
    name: "Fiat Argo",
    category: "Hatchback",
    year: 2023,
    image: "/cars/fiat-argo-1.jpg",
    pricePerDay: 110,
    transmission: "Manual",
    passengers: 5,
    fuel: "Flex",
    available: true,
  },
  {
    id: "8",
    name: "Nissan Kicks",
    category: "SUV",
    year: 2024,
    image: "/cars/nissan-kicks-1.jpg",
    pricePerDay: 260,
    transmission: "Automático",
    passengers: 5,
    fuel: "Flex",
    available: true,
  },
]

export function FleetGrid() {
  const searchParams = useSearchParams()

  // Aplicar filtros
  const filteredCars = cars.filter((car) => {
    const categorias = searchParams.get("categorias")?.split(",") || []
    const transmissoes = searchParams.get("transmissoes")?.split(",") || []
    const anos = searchParams.get("anos")?.split(",") || []
    const minPreco = parseInt(searchParams.get("minPreco") || "0")
    const maxPreco = parseInt(searchParams.get("maxPreco") || "999999")

    // Filtrar por categoria
    if (categorias.length > 0 && !categorias.includes(car.category)) {
      return false
    }

    // Filtrar por transmissão
    if (transmissoes.length > 0 && !transmissoes.includes(car.transmission)) {
      return false
    }

    // Filtrar por ano
    if (anos.length > 0 && !anos.includes(car.year.toString())) {
      return false
    }

    // Filtrar por preço
    if (car.pricePerDay < minPreco || car.pricePerDay > maxPreco) {
      return false
    }

    return true
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">{filteredCars.length}</span> veículos encontrados
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <Card key={car.id} className="overflow-hidden group hover:shadow-xl transition-all">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={car.image || "/placeholder.svg"}
                alt={car.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <Badge className="absolute top-3 right-3" variant={car.available ? "default" : "secondary"}>
                {car.available ? "Disponível" : "Em manutenção"}
              </Badge>
            </div>
            <CardContent className="p-6">
              <div className="mb-4">
                <Badge variant="outline" className="mb-2">
                  {car.category}
                </Badge>
                <h3 className="text-xl font-bold mb-1">{car.name}</h3>
                <p className="text-sm text-muted-foreground">{car.year}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{car.passengers}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Gauge className="w-4 h-4" />
                  <span className="text-xs">{car.transmission}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Fuel className="w-4 h-4" />
                  <span>{car.fuel}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-primary">R$ {car.pricePerDay}</p>
                  <p className="text-xs text-muted-foreground">por dia</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href={`/frota/${car.id}`}>Ver detalhes</Link>
                </Button>
                <Button className="flex-1" disabled={!car.available} asChild={car.available}>
                  {car.available ? <Link href={`/reservas?car=${car.id}`}>Reservar</Link> : <span>Indisponível</span>}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
