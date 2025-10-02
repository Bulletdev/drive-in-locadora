"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"
import Link from "next/link"

interface CarReservationFormProps {
  car: {
    id: string
    name: string
    pricePerDay: number
    available: boolean
  }
}

export function CarReservationForm({ car }: CarReservationFormProps) {
  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [days, setDays] = useState(0)

  const calculateDays = (pickup: string, returnD: string) => {
    if (pickup && returnD) {
      const start = new Date(pickup)
      const end = new Date(returnD)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setDays(diffDays)
    }
  }

  const handlePickupChange = (value: string) => {
    setPickupDate(value)
    calculateDays(value, returnDate)
  }

  const handleReturnChange = (value: string) => {
    setReturnDate(value)
    calculateDays(pickupDate, value)
  }

  const totalPrice = days * car.pricePerDay

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Reserve este veículo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="text-3xl font-bold text-primary mb-1">R$ {car.pricePerDay}</div>
          <p className="text-sm text-muted-foreground">por dia</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="pickup-date">Data de Retirada</Label>
            <div className="relative">
              <Input
                id="pickup-date"
                type="date"
                value={pickupDate}
                onChange={(e) => handlePickupChange(e.target.value)}
                className="pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div>
            <Label htmlFor="return-date">Data de Devolução</Label>
            <div className="relative">
              <Input
                id="return-date"
                type="date"
                value={returnDate}
                onChange={(e) => handleReturnChange(e.target.value)}
                className="pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {days > 0 && (
          <div className="p-4 bg-secondary rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                R$ {car.pricePerDay} x {days} dias
              </span>
              <span className="font-semibold">R$ {totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Seguro incluso</span>
              <span className="font-semibold text-green-600">Grátis</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-xl text-primary">R$ {totalPrice}</span>
              </div>
            </div>
          </div>
        )}

        <Button
          className="w-full"
          size="lg"
          disabled={!car.available || days === 0}
          asChild={car.available && days > 0}
        >
          {car.available && days > 0 ? (
            <Link href={`/reservas?car=${car.id}&pickup=${pickupDate}&return=${returnDate}`}>Continuar Reserva</Link>
          ) : (
            <span>{!car.available ? "Indisponível" : "Selecione as datas"}</span>
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          <p>✓ Cancelamento grátis até 24h antes</p>
          <p>✓ Seguro completo incluso</p>
          <p>✓ Sem taxas ocultas</p>
        </div>
      </CardContent>
    </Card>
  )
}
