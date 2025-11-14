"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Car, User, LogOut, Clock, MapPin, FileText } from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { EditProfileDialog } from "./edit-profile-dialog"
import { useSearchParams } from "next/navigation"

import { apiGetMyReservations, apiGetVehicle } from "@/lib/api-client"

interface ClientDashboardProps {
  user: {
    id: string
    name: string
    email: string
    phone: string
    cpf: string
    createdAt: string
  }
  accessToken: string
}

const statusConfig = {
  active: { label: "Ativa", variant: "default" as const, color: "bg-green-500" },
  completed: { label: "Concluída", variant: "secondary" as const, color: "bg-blue-500" },
  cancelled: { label: "Cancelada", variant: "outline" as const, color: "bg-gray-500" },
}

export function ClientDashboard({ user, accessToken }: ClientDashboardProps) {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [displayReservations, setDisplayReservations] = useState<Array<{
    id: string
    car: string
    status: "active" | "completed" | "cancelled"
    pickupDate: string
    returnDate: string
    pickupLocation: string
    total?: number
  }>>([])
  const searchParams = useSearchParams()
  const cancelledId = searchParams.get("cancelled")

  // Carregar reservas reais da API (MySQL) com accessToken
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await apiGetMyReservations(accessToken)
        if (!res.success || !res.data) return
        const reservationsRaw = res.data
        const out: Array<{
          id: string
          car: string
          status: "active" | "completed" | "cancelled"
          pickupDate: string
          returnDate: string
          pickupLocation: string
          total?: number
        }> = []
        for (const r of reservationsRaw) {
          // Buscar detalhes do veículo para nome
          let carName = r.carId
          try {
            const v = await apiGetVehicle(r.carId)
            if (v.success && v.data) {
              carName = `${v.data.name} ${v.data.year}`
            }
          } catch {}
          // Derivar status por data
          const today = new Date()
          const end = r.returnDate ? new Date(r.returnDate) : today
          const start = r.pickupDate ? new Date(r.pickupDate) : today
          let status: "active" | "completed" | "cancelled" = "active"
          if (end < today) status = "completed"
          out.push({
            id: r.id,
            car: carName,
            status,
            pickupDate: start.toLocaleDateString("pt-BR"),
            returnDate: end.toLocaleDateString("pt-BR"),
            pickupLocation: r.pickupLocation,
          })
        }
        if (mounted) setDisplayReservations(out)
      } catch (e) {
        // Sem fallback/mocks
      }
    })()
    return () => { mounted = false }
  }, [accessToken])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Olá, <span className="text-primary">{user.name.split(" ")[0]}</span>
            </h1>
            <p className="text-muted-foreground">Gerencie suas reservas e informações</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Aviso de cancelamento */}
        {cancelledId && (
          <Card className="border-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Reserva {cancelledId} cancelada com sucesso.</p>
                  <p className="text-sm text-muted-foreground">Se precisar, você pode criar uma nova reserva abaixo.</p>
                </div>
                <Badge variant="secondary">Cancelada</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Content */}
        <Tabs defaultValue="reservations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="reservations">
              <Calendar className="w-4 h-4 mr-2" />
              Minhas Reservas
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Meu Perfil
            </TabsTrigger>
          </TabsList>

          {/* Reservations Tab */}
          <TabsContent value="reservations" className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Car className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{displayReservations.filter((r) => r.status === "active").length}</p>
                      <p className="text-sm text-muted-foreground">Reservas Ativas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {displayReservations.filter((r) => r.status === "completed").length}
                      </p>
                      <p className="text-sm text-muted-foreground">Reservas Concluídas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Button asChild className="w-full">
                    <Link href="/reservas">
                      <Car className="w-4 h-4 mr-2" />
                      Nova Reserva
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Reservations List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Histórico de Reservas</h2>
              {displayReservations.map((reservation) => (
                <Card key={reservation.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold">{reservation.car}</h3>
                          <Badge variant={statusConfig[reservation.status].variant}>
                            {statusConfig[reservation.status].label}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {reservation.pickupDate} - {reservation.returnDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{reservation.pickupLocation}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Código:</span>
                          <span className="font-mono font-semibold">{reservation.id}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Código</p>
                          <p className="text-2xl font-bold text-primary">{reservation.id}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/area-cliente/reserva/${reservation.id}`}>
                            Ver Detalhes
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nome Completo</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">CPF</p>
                    <p className="font-semibold">{user.cpf}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">E-mail</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Telefone</p>
                    <p className="font-semibold">{user.phone}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsEditProfileOpen(true)}>
                    Editar Informações
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Senha</p>
                  <p className="font-semibold">••••••••</p>
                </div>
                <Button variant="outline">Alterar Senha</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Profile Dialog */}
        <EditProfileDialog user={user} accessToken={accessToken} open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen} />
      </div>
    </div>
  )
}
