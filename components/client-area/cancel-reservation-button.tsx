"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { apiCancelReservation } from "@/lib/api-client"

export function CancelReservationButton({ id, accessToken }: { id: string; accessToken?: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    setLoading(true)
    const res = await apiCancelReservation(id, accessToken)
    setLoading(false)
    if (!res.success) {
      alert(res.error || "Falha ao cancelar a reserva")
      return
    }
    // Persiste cancelamento localmente para refletir em reloads
    try {
      const key = "cancelledReservations"
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
      const list: string[] = raw ? JSON.parse(raw) : []
      if (!list.includes(id)) {
        list.push(id)
        window.localStorage.setItem(key, JSON.stringify(list))
      }
    } catch {
      // Ignora erros de storage
    }
    router.push(`/area-cliente?cancelled=${encodeURIComponent(id)}`)
  }

  return (
    <Button className="w-full" variant="destructive" disabled={loading} onClick={handleCancel}>
      {loading ? "Cancelando..." : "Cancelar Reserva"}
    </Button>
  )
}