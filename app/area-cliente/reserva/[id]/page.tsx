import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Car, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CancelReservationButton } from "@/components/client-area/cancel-reservation-button"
import { auth } from "@/lib/auth"
import { apiGetMyReservations, apiGetVehicle } from "@/lib/api-client"

const statusConfig = {
  active: { label: "Ativa", variant: "default" as const },
  completed: { label: "Concluída", variant: "secondary" as const },
  cancelled: { label: "Cancelada", variant: "outline" as const },
}
export default async function ReservationDetailsPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const accessToken = (session as any)?.accessToken as string | undefined
  if (!accessToken) {
    notFound()
  }

  // Buscar reservas do usuário (backend) e localizar pelo ID
  const my = await apiGetMyReservations(accessToken)
  if (!my.success || !my.data) {
    notFound()
  }
  const r = my.data.find((x) => x.id === params.id)
  if (!r) {
    notFound()
  }

  // Buscar veículo para exibir nome/ano e preço, se disponível
  let carTitle = r.carId
  let pricePerDay: number | undefined
  try {
    const v = await apiGetVehicle(r.carId)
    if (v.success && v.data) {
      carTitle = `${v.data.name} ${v.data.year}`
      pricePerDay = v.data.pricePerDay
    }
  } catch {}

  const start = r.pickupDate ? new Date(r.pickupDate) : undefined
  const end = r.returnDate ? new Date(r.returnDate) : undefined
  const status: "active" | "completed" | "cancelled" = end && end < new Date() ? "completed" : "active"

  // Formatação estável de datas para evitar diferenças de timezone/locale na hidratação
  const formatDateBR = (d?: Date) => {
    if (!d) return "-"
    // Normaliza para UTC e gera DD/MM/YYYY estável
    const year = d.getUTCFullYear()
    const month = String(d.getUTCMonth() + 1).padStart(2, "0")
    const day = String(d.getUTCDate()).padStart(2, "0")
    return `${day}/${month}/${year}`
  }

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
              <p className="text-muted-foreground">Código: {r.id}</p>
            </div>
            <Badge variant={statusConfig[status].variant}>
              {statusConfig[status].label}
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
                <p className="text-2xl font-bold">{carTitle}</p>
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
                    <p className="font-semibold">{formatDateBR(start)}</p>
                    <div className="flex items-start gap-2 mt-2">
                      <MapPin className="w-4 h-4 text-primary mt-0.5" />
                      <p className="text-sm">{r.pickupLocation}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Devolução</p>
                    <p className="font-semibold">{formatDateBR(end)}</p>
                    <div className="flex items-start gap-2 mt-2">
                      <MapPin className="w-4 h-4 text-primary mt-0.5" />
                      <p className="text-sm">{r.returnLocation}</p>
                    </div>
                  </div>
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
                {pricePerDay && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Diária</span>
                      <span>R$ {pricePerDay.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {status === "active" && (
                  <div className="pt-4 space-y-2">
                    <CancelReservationButton id={r.id} accessToken={accessToken} />
                    <p className="text-xs text-muted-foreground text-center">Cancelamento depende do suporte da API</p>
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
