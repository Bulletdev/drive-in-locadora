import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Car, FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock data - em produção viria do banco de dados
const reservations = {
  "RES-2024-001": {
    id: "RES-2024-001",
    car: "Toyota Corolla 2024",
    status: "active",
    pickupDate: "15/02/2024",
    returnDate: "20/02/2024",
    pickupLocation: "Aeroporto de Guarulhos",
    returnLocation: "Aeroporto de Guarulhos",
    days: 5,
    pricePerDay: 180,
    extras: [
      { name: "Seguro Total", price: 50 },
      { name: "GPS", price: 20 },
    ],
  },
  "RES-2024-002": {
    id: "RES-2024-002",
    car: "Jeep Compass 2024",
    status: "completed",
    pickupDate: "01/01/2024",
    returnDate: "05/01/2024",
    pickupLocation: "Centro - São Paulo",
    returnLocation: "Centro - São Paulo",
    days: 4,
    pricePerDay: 320,
    extras: [],
  },
  "RES-2024-003": {
    id: "RES-2024-003",
    car: "Honda Civic 2024",
    status: "cancelled",
    pickupDate: "10/01/2024",
    returnDate: "12/01/2024",
    pickupLocation: "Av. Paulista",
    returnLocation: "Av. Paulista",
    days: 2,
    pricePerDay: 190,
    extras: [],
  },
}

const statusConfig = {
  active: { label: "Ativa", variant: "default" as const },
  completed: { label: "Concluída", variant: "secondary" as const },
  cancelled: { label: "Cancelada", variant: "outline" as const },
}

export default function ReservationDetailsPage({ params }: { params: { id: string } }) {
  const reservation = reservations[params.id as keyof typeof reservations]

  if (!reservation) {
    notFound()
  }

  const extrasTotal = reservation.extras.reduce((sum, extra) => sum + extra.price, 0)
  const subtotal = reservation.days * reservation.pricePerDay
  const total = subtotal + extrasTotal * reservation.days

  return (
    <div className="min-h-screen pt-24 pb-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/area-cliente">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Área do Cliente
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Detalhes da Reserva</h1>
              <p className="text-muted-foreground">Código: {reservation.id}</p>
            </div>
            <Badge variant={statusConfig[reservation.status].variant}>
              {statusConfig[reservation.status].label}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" />
                  Veículo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{reservation.car}</p>
              </CardContent>
            </Card>

            {/* Dates and Locations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Datas e Locais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Retirada</p>
                    <p className="font-semibold">{reservation.pickupDate}</p>
                    <div className="flex items-start gap-2 mt-2">
                      <MapPin className="w-4 h-4 text-primary mt-0.5" />
                      <p className="text-sm">{reservation.pickupLocation}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Devolução</p>
                    <p className="font-semibold">{reservation.returnDate}</p>
                    <div className="flex items-start gap-2 mt-2">
                      <MapPin className="w-4 h-4 text-primary mt-0.5" />
                      <p className="text-sm">{reservation.returnLocation}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Total de dias: <span className="font-semibold text-foreground">{reservation.days} dias</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Extras */}
            {reservation.extras.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Extras Contratados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reservation.extras.map((extra, index) => (
                      <div key={index} className="flex justify-between py-2 border-b last:border-0">
                        <span>{extra.name}</span>
                        <span className="font-semibold">R$ {extra.price}/dia</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Diária ({reservation.days}x)</span>
                    <span>R$ {reservation.pricePerDay.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                </div>

                {reservation.extras.length > 0 && (
                  <>
                    <div className="border-t pt-4 space-y-2">
                      <p className="text-sm font-semibold mb-2">Extras</p>
                      {reservation.extras.map((extra, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {extra.name} ({reservation.days}x)
                          </span>
                          <span>R$ {(extra.price * reservation.days).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                {reservation.status === "active" && (
                  <div className="pt-4 space-y-2">
                    <Button className="w-full" variant="destructive">
                      Cancelar Reserva
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Cancelamento grátis até 24h antes da retirada
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
