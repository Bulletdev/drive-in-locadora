"use client"

import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Gauge, Fuel } from "lucide-react"
import { apiGetVehicles } from "@/lib/api-client"
import { getAllVehicles } from "@/lib/vehicles-data"
import { slugifyVehicle } from "@/lib/utils"

export function FleetGrid() {
  const searchParams = useSearchParams()
  const [cars, setCars] = useState<Array<{
    id: string
    name: string
    category: string
    year: number
    image: string
    pricePerDay: number
    transmission: string
    passengers: number
    fuel: string
    available: boolean
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      const categorias = searchParams.get("categorias")?.split(",") || []
      const transmissoes = searchParams.get("transmissoes")?.split(",") || []
      const anos = searchParams.get("anos")?.split(",") || []
      const minPrecoStr = searchParams.get("minPreco")
      const maxPrecoStr = searchParams.get("maxPreco")
      const pageStr = searchParams.get("page")
      const pageSizeStr = searchParams.get("pageSize")

      const result = await apiGetVehicles({
        categorias: categorias.length ? categorias : undefined,
        transmissoes: transmissoes.length ? transmissoes : undefined,
        anos: anos.length ? anos : undefined,
        minPreco: minPrecoStr ? Number(minPrecoStr) : undefined,
        maxPreco: maxPrecoStr ? Number(maxPrecoStr) : undefined,
        page: pageStr ? Number(pageStr) : undefined,
        pageSize: pageSizeStr ? Number(pageSizeStr) : undefined,
      })

      if (!mounted) return
      if (result.success && result.data) {
        setCars(
          result.data.map((v) => ({
            id: v.id,
            name: v.name,
            category: v.category,
            year: v.year,
            image: v.images?.[0] || "/placeholder.svg",
            pricePerDay: v.pricePerDay,
            transmission: v.transmission,
            passengers: v.passengers,
            fuel: v.fuel,
            available: v.available,
          })),
        )
      } else {
        const local = getAllVehicles().map((v) => ({
          id: v.id,
          name: v.name,
          category: v.category,
          year: v.year,
          image: v.images?.[0] || "/placeholder.svg",
          pricePerDay: v.pricePerDay,
          transmission: v.transmission,
          passengers: v.passengers,
          fuel: v.fuel,
          available: v.available,
        }))
        setCars(local)
      }
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [searchParams])

  // Resultado já chega filtrado/paginado do servidor
  const filteredCars = cars

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        {loading ? (
          <p className="text-muted-foreground">Carregando veículos...</p>
        ) : (
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredCars.length}</span> veículos encontrados
          </p>
        )}
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
                  <Link href={`/frota/${slugifyVehicle(car.name, car.year)}`}>Ver detalhes</Link>
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
