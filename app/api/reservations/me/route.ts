import { NextRequest } from "next/server"
import { getAllReservations } from "@/lib/reservations-store"

export async function GET(_req: NextRequest) {
  // Demo: retorna reservas mockadas do usuário atual
  const data = [
    {
      id: "RES-2025-001",
      // Usar IDs válidos do catálogo para evitar 404 ao buscar veículo
      carId: "1", // Toyota Corolla 2024
      pickupDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      returnDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      pickupLocation: "Aeroporto de Congonhas",
      returnLocation: "Aeroporto de Congonhas",
    },
    {
      id: "RES-2025-002",
      carId: "2", // Honda HR-V 2024
      pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      returnDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      pickupLocation: "Centro - São Paulo",
      returnLocation: "Centro - São Paulo",
    },
  ]
  // Acrescenta reservas criadas recentemente (store em memória)
  const created = getAllReservations().map((r) => ({
    id: r.id,
    carId: r.carId,
    pickupDate: r.pickupDate,
    returnDate: r.returnDate,
    pickupLocation: r.pickupLocation,
    returnLocation: r.returnLocation,
  }))
  return Response.json([...created, ...data])
}