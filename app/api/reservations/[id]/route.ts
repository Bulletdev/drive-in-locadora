import { NextRequest } from "next/server"
import { getReservation } from "@/lib/reservations-store"

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  // Demo: aceita cancelamento e retorna sucesso imediato
  const id = params.id
  if (!id) {
    return Response.json({ error: "Missing reservation id" }, { status: 400 })
  }
  return Response.json({ success: true, id })
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  // Busca a reserva criada no store em memória
  const id = params.id
  if (!id) {
    return Response.json({ error: "Missing reservation id" }, { status: 400 })
  }
  const r = getReservation(id)
  if (!r) {
    return Response.json({ error: "Reservation not found" }, { status: 404 })
  }
  return Response.json(r)
}