"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Car, User, LogOut, Clock, MapPin, FileText } from "lucide-react"
import Link from "next/link"

// Mock data - in production this would come from a database
const user = {
  name: "João Silva",
  email: "joao@email.com",
  phone: "(11) 98765-4321",
  cpf: "123.456.789-00",
}

const reservations = [
  {
    id: "RES-2024-001",
    car: "Toyota Corolla 2024",
    status: "active",
    pickupDate: "15/02/2024",
    returnDate: "20/02/2024",
    pickupLocation: "Aeroporto de Guarulhos",
    total: 1150,
  },
  {
    id: "RES-2024-002",
    car: "Jeep Compass 2024",
    status: "completed",
    pickupDate: "01/01/2024",
    returnDate: "05/01/2024",
    pickupLocation: "Centro - São Paulo",
    total: 1250,
  },
  {
    id: "RES-2024-003",
    car: "Honda Civic 2024",
    status: "cancelled",
    pickupDate: "10/01/2024",
    returnDate: "12/01/2024",
    pickupLocation: "Av. Paulista",
    total: 380,
  },
]

const statusConfig = {
  active: { label: "Ativa", variant: "default" as const, color: "bg-green-500" },
  completed: { label: "Concluída", variant: "secondary" as const, color: "bg-blue-500" },
  cancelled: { label: "Cancelada", variant: "outline" as const, color: "bg-gray-500" },
}

export function ClientDashboard() {
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
          <Button variant="outline" asChild>
            <Link href="/login">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Link>
          </Button>
        </div>

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
                      <p className="text-2xl font-bold">{reservations.filter((r) => r.status === "active").length}</p>
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
                        {reservations.filter((r) => r.status === "completed").length}
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
              {reservations.map((reservation) => (
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
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-2xl font-bold text-primary">R$ {reservation.total.toFixed(2)}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver Detalhes
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
                  <Button variant="outline">Editar Informações</Button>
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
      </div>
    </div>
  )
}
