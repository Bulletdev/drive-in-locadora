import { NextRequest } from "next/server"
import { getVehicle, getVehicleBySlug } from "@/lib/vehicles-data"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const idOrSlug = params.id
  // Try by numeric/id first, then fallback to slug
  const byId = getVehicle(idOrSlug)
  const vehicle = byId || getVehicleBySlug(idOrSlug)

  if (!vehicle) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  return Response.json({
    id: vehicle.id,
    name: vehicle.name,
    category: vehicle.category,
    year: vehicle.year,
    images: vehicle.images,
    pricePerDay: vehicle.pricePerDay,
    transmission: vehicle.transmission,
    passengers: vehicle.passengers,
    fuel: vehicle.fuel,
    available: vehicle.available,
    doors: vehicle.doors,
    airConditioning: vehicle.airConditioning,
    features: vehicle.features,
  })
}