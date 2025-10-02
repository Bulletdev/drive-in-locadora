import { ReservationForm } from "@/components/reservations/reservation-form"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Reservas | Drive-In Locadora",
  description: "Faça sua reserva de forma rápida e segura",
}

export default function ReservationsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <Badge className="mb-4" variant="outline">
            Reservas
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Faça sua <span className="text-primary">Reserva</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Preencha os dados abaixo e garanta seu veículo
          </p>
        </div>

        {/* Reservation Form */}
        <div className="max-w-4xl mx-auto">
          <ReservationForm />
        </div>
      </div>
    </div>
  )
}
