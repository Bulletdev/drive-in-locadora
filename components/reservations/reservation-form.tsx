"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Car, Shield, Navigation, Baby, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const cars = [
  { id: "1", name: "Toyota Corolla 2024", category: "Sedan", pricePerDay: 180 },
  { id: "2", name: "Honda Civic 2024", category: "Sedan", pricePerDay: 190 },
  { id: "3", name: "Jeep Compass 2024", category: "SUV", pricePerDay: 250 },
  { id: "4", name: "Chevrolet Onix 2024", category: "Hatchback", pricePerDay: 120 },
]

const locations = [
  "Aeroporto de Guarulhos",
  "Aeroporto de Congonhas",
  "Centro - São Paulo",
  "Av. Paulista",
  "Shopping Morumbi",
]

const extras = [
  { id: "insurance", name: "Seguro Total", price: 50, icon: Shield },
  { id: "gps", name: "GPS", price: 20, icon: Navigation },
  { id: "childSeat", name: "Cadeirinha Infantil", price: 15, icon: Baby },
]

export function ReservationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    carId: "",
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
    returnLocation: "",
    name: "",
    email: "",
    phone: "",
    cpf: "",
    selectedExtras: [] as string[],
  })

  const selectedCar = cars.find((car) => car.id === formData.carId)
  const days =
    formData.pickupDate && formData.returnDate
      ? Math.ceil(
          (new Date(formData.returnDate).getTime() - new Date(formData.pickupDate).getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0

  const subtotal = selectedCar ? selectedCar.pricePerDay * days : 0
  const extrasTotal = formData.selectedExtras.reduce((sum, extraId) => {
    const extra = extras.find((e) => e.id === extraId)
    return sum + (extra ? extra.price * days : 0)
  }, 0)
  const total = subtotal + extrasTotal

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("[v0] Reservation submitted:", formData)
    router.push("/reservas/confirmacao")
  }

  const handleExtraToggle = (extraId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedExtras: prev.selectedExtras.includes(extraId)
        ? prev.selectedExtras.filter((id) => id !== extraId)
        : [...prev.selectedExtras, extraId],
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                Escolha o Veículo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="car">Veículo *</Label>
              <Select
                value={formData.carId}
                onValueChange={(value) => setFormData({ ...formData, carId: value })}
                required
              >
                <SelectTrigger id="car">
                  <SelectValue placeholder="Selecione um veículo" />
                </SelectTrigger>
                <SelectContent>
                  {cars.map((car) => (
                    <SelectItem key={car.id} value={car.id}>
                      {car.name} - R$ {car.pricePerDay}/dia
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  <Label htmlFor="pickupDate">Data de Retirada *</Label>
                  <Input
                    id="pickupDate"
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="returnDate">Data de Devolução *</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    required
                    min={formData.pickupDate || new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickupLocation">Local de Retirada *</Label>
                  <Select
                    value={formData.pickupLocation}
                    onValueChange={(value) => setFormData({ ...formData, pickupLocation: value })}
                    required
                  >
                    <SelectTrigger id="pickupLocation">
                      <SelectValue placeholder="Selecione o local" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="returnLocation">Local de Devolução *</Label>
                  <Select
                    value={formData.returnLocation}
                    onValueChange={(value) => setFormData({ ...formData, returnLocation: value })}
                    required
                  >
                    <SelectTrigger id="returnLocation">
                      <SelectValue placeholder="Selecione o local" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Extras */}
          <Card>
            <CardHeader>
              <CardTitle>Extras Opcionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {extras.map((extra) => (
                <div key={extra.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                  <Checkbox
                    id={extra.id}
                    checked={formData.selectedExtras.includes(extra.id)}
                    onCheckedChange={() => handleExtraToggle(extra.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={extra.id} className="flex items-center gap-2 cursor-pointer">
                      <extra.icon className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{extra.name}</span>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">R$ {extra.price}/dia</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  required
                  placeholder="000.000.000-00"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedCar && days > 0 ? (
                <>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">{selectedCar.name}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Diária ({days}x)</span>
                      <span>R$ {selectedCar.pricePerDay.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Subtotal</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {formData.selectedExtras.length > 0 && (
                    <div className="border-t pt-4 space-y-2">
                      <p className="text-sm font-semibold">Extras</p>
                      {formData.selectedExtras.map((extraId) => {
                        const extra = extras.find((e) => e.id === extraId)
                        if (!extra) return null
                        return (
                          <div key={extraId} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {extra.name} ({days}x)
                            </span>
                            <span>R$ {(extra.price * days).toFixed(2)}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">R$ {total.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Selecione um veículo e as datas para ver o resumo
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting || !selectedCar || days <= 0}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Confirmar Reserva"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
