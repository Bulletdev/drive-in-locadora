import { CarGallery } from "@/components/car-details/car-gallery"
import { CarSpecifications } from "@/components/car-details/car-specifications"
import { CarReservationForm } from "@/components/car-details/car-reservation-form"
import { SimilarCars } from "@/components/car-details/similar-cars"
import { notFound } from "next/navigation"

// Mock data - in production this would come from a database
const cars = {
  "1": {
    id: "1",
    name: "Toyota Corolla",
    category: "Sedan",
    year: 2024,
    images: [
      "/toyota-corolla-sedan.png",
      "/toyota-corolla-interior.png",
      "/toyota-corolla-side.png",
      "/toyota-corolla-back.png",
    ],
    pricePerDay: 180,
    transmission: "Automático",
    passengers: 5,
    fuel: "Flex",
    doors: 4,
    airConditioning: true,
    available: true,
    description:
      "O Toyota Corolla é um sedan confiável e confortável, perfeito para viagens longas ou uso diário. Equipado com ar-condicionado, direção elétrica e sistema multimídia completo.",
    features: [
      "Ar-condicionado",
      "Direção elétrica",
      "Vidros elétricos",
      "Travas elétricas",
      "Sistema multimídia",
      "Bluetooth",
      "Câmera de ré",
      "Sensor de estacionamento",
      "Airbags",
      "ABS",
      "Controle de estabilidade",
      "Controle de tração",
    ],
  },
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const car = cars[params.id as keyof typeof cars]
  if (!car) return { title: "Carro não encontrado" }

  return {
    title: `${car.name} ${car.year} | Drive-In Locadora`,
    description: car.description,
  }
}

export default function CarDetailsPage({ params }: { params: { id: string } }) {
  const car = cars[params.id as keyof typeof cars]

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
              <p className="text-muted-foreground leading-relaxed">{car.description}</p>
            </div>

            <CarSpecifications car={car} />
          </div>

          {/* Right Column - Reservation Form */}
          <div className="lg:col-span-1">
            <CarReservationForm car={car} />
          </div>
        </div>

        {/* Similar Cars */}
        <SimilarCars currentCarId={car.id} category={car.category} />
      </div>
    </div>
  )
}
