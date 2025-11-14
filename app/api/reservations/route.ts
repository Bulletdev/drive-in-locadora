import { NextRequest } from "next/server"
import { addReservation, type Reservation } from "@/lib/reservations-store"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const id = `r-${Date.now()}`
    const nowIso = new Date().toISOString()
    const reservation: Reservation = {
      id,
      carId: String(body?.carId || ""),
      pickupDate: String(body?.pickupDate || nowIso),
      returnDate: String(body?.returnDate || nowIso),
      pickupLocation: String(body?.pickupLocation || ""),
      returnLocation: String(body?.returnLocation || ""),
      customer: body?.name || body?.email || body?.phone
        ? { name: body?.name, email: body?.email, phone: body?.phone }
        : undefined,
      createdAt: nowIso,
    }
    addReservation(reservation)
    return Response.json({ id }, { status: 201 })
  } catch (e: any) {
    return Response.json({ error: e?.message || "Bad Request" }, { status: 400 })
  }
}