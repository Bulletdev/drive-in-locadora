import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Calendar, MapPin, Car, User, Mail, Phone } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Confirmação de Reserva | Drive-In Locadora",
  description: "Sua reserva foi confirmada com sucesso",
}

export default function ReservationConfirmationPage() {
  // In production, this would come from URL params or database
  const reservation = {
    id: "RES-2024-001",
    car: "Toyota Corolla 2024",
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
    customer: {
      name: "João Silva",
      email: "joao@email.com",
      phone: "(11) 98765-4321",
    },
  }

  const extrasTotal = reservation.extras.reduce((sum, extra) => sum + extra.price, 0)
  const subtotal = reservation.days * reservation.pricePerDay
  const total = subtotal + extrasTotal * reservation.days

  return (
    <div className="min-h-screen pt-24 pb-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Success Message */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Reserva Confirmada!</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sua reserva foi realizada com sucesso. Enviamos um e-mail de confirmação com todos os detalhes.
          </p>
          <Badge className="mt-4" variant="outline">
            Código da Reserva: {reservation.id}
          </Badge>
        </div>

        {/* Reservation Details */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" />
                  Veículo Reservado
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

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Dados do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <p>{reservation.customer.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <p>{reservation.customer.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <p>{reservation.customer.phone}</p>
                </div>
              </CardContent>
            </Card>
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

                <div className="pt-4 space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/area-cliente">Acessar Área do Cliente</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/">Voltar ao Início</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
