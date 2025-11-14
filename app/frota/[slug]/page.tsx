import { CarGallery } from "@/components/car-details/car-gallery"
import { CarSpecifications } from "@/components/car-details/car-specifications"
import { CarReservationForm } from "@/components/car-details/car-reservation-form"
import { SimilarCars } from "@/components/car-details/similar-cars"
import { notFound } from "next/navigation"
import { apiGetVehicle } from "@/lib/api-client"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const result = await apiGetVehicle(slug)
  const car = result.success ? result.data : null
  if (!car) return { title: "Carro não encontrado" }

  return {
    title: `${car.name} ${car.year} | Drive-In Locadora`,
    description: (car as any).description || "Detalhes do veículo",
  }
}

export default async function CarDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const result = await apiGetVehicle(slug)
  const car = result.success ? result.data : null

  if (!car) {
    notFound()
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <a href="/" className="hover:text-primary">
            Home
          </a>
          {" / "}
          <a href="/frota" className="hover:text-primary">
            Frota
          </a>
          {" / "}
          <span className="text-foreground">{car.name}</span>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left Column - Gallery and Specs */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {car.name} <span className="text-primary">{car.year}</span>
              </h1>
              <p className="text-muted-foreground mb-6">{car.category}</p>
            </div>

            <CarGallery images={car.images} name={car.name} />

            <div>
              <h2 className="text-2xl font-bold mb-4">Sobre este veículo</h2>
              <p className="text-muted-foreground leading-relaxed">{(car as any).description || "Descrição não disponível."}</p>
            </div>

            <CarSpecifications car={{
              passengers: car.passengers,
              transmission: car.transmission,
              fuel: car.fuel,
              doors: car.doors ?? 4,
              airConditioning: car.airConditioning ?? false,
              features: car.features ?? []
            }} />
          </div>

          {/* Right Column - Reservation Form */}
          <div className="lg:col-span-1">
            <CarReservationForm car={car as any} />
          </div>
        </div>

        {/* Similar Cars */}
        <SimilarCars currentCarId={(car as any).id} category={(car as any).category} />
      </div>
    </div>
  )
}
