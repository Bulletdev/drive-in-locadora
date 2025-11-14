import { NextRequest } from "next/server"
import { vehicles } from "@/lib/vehicles-data"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const categorias = (searchParams.get("categorias") || "").split(",").filter(Boolean)
  const transmissoes = (searchParams.get("transmissoes") || "").split(",").filter(Boolean)
  const anos = (searchParams.get("anos") || "").split(",").filter(Boolean)
  const minPreco = searchParams.get("minPreco")
  const maxPreco = searchParams.get("maxPreco")

  const data = Object.values(vehicles).filter((v) => {
    if (category && v.category !== category) return false
    if (categorias.length > 0 && !categorias.includes(v.category)) return false
    if (transmissoes.length > 0 && !transmissoes.includes(v.transmission)) return false
    if (anos.length > 0 && !anos.includes(String(v.year))) return false
    if (minPreco && v.pricePerDay < Number(minPreco)) return false
    if (maxPreco && v.pricePerDay > Number(maxPreco)) return false
    return true
  }).map((v) => ({
    id: v.id,
    name: v.name,
    category: v.category,
    year: v.year,
    images: v.images,
    pricePerDay: v.pricePerDay,
    transmission: v.transmission,
    passengers: v.passengers,
    fuel: v.fuel,
    available: v.available,
  }))

  return Response.json(data)
}