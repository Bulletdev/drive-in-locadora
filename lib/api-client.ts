import { getAllVehicles, getVehicle } from "@/lib/vehicles-data"

const getBaseUrl = () => {
  // On server-side prefer server-only var; on client use public var
  if (typeof window === "undefined") {
    return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || ""
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || ""
}

export type ApiResult<T> = { success: boolean; data?: T; error?: string }

async function request<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string,
): Promise<ApiResult<T>> {
  const baseRaw = getBaseUrl()
  const base = baseRaw.replace(/\/+$/, "")
  // Apenas rotas de auth internas devem bypassar o backend Java
  const isInternalDemo = path.startsWith("/api/auth")
  const normalizedPath = (() => {
    if (!base) return path
    if (base.endsWith("/api") && path.startsWith("/api")) {
      return path.replace(/^\/api/, "")
    }
    return path
  })()
  const url = isInternalDemo ? path : `${base}${normalizedPath}`

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  }
  if (accessToken) {
    ;(headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`
  }

  try {
    // Timeout curto para ambiente de desenvolvimento a fim de reduzir latência de fallback
    const timeoutMs = 900
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch(url, { ...options, headers, signal: controller.signal })
    clearTimeout(timer)
    const isJson = res.headers.get("content-type")?.includes("application/json")
    const body = isJson ? await res.json() : undefined
    if (!res.ok) {
      return { success: false, error: (body && (body.error || body.message)) || res.statusText }
    }
    return { success: true, data: body as T }
  } catch (e: any) {
    return { success: false, error: e?.message || "Network error" }
  }
}

// Auth
export async function apiLogin(email: string, password: string) {
  const res = await request<any>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
  )
  if (res.success && res.data) {
    const token = res.data.token || res.data.accessToken
    return { success: true, data: { token, user: res.data.user } }
  }
  return { success: false, error: res.error || "Login failed" }
}

export async function apiRegister(payload: {
  name: string
  email: string
  phone: string
  cpf: string
  password: string
  // Address
  addressStreet: string
  addressNumber: string
  addressComplement?: string
  addressNeighborhood?: string
  addressCity: string
  addressState: string
  addressCep: string
  // CNH
  birthDate: string // YYYY-MM-DD
  cnhNumber: string
  cnhExpiry: string // YYYY-MM-DD
  cnhCategory?: string
}) {
  return request<{ accessToken: string; user: { id: string; name: string; email: string } }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function apiMe(accessToken: string) {
  const backend = await request<{
    id: string
    name: string
    email: string
    phone: string
    cpf: string
    createdAt: string
  }>("/api/auth/me", { method: "GET" }, accessToken)
  return backend
}

// Vehicles
export async function apiGetVehicles(params?: {
  category?: string
  categorias?: string[]
  transmissoes?: string[]
  anos?: string[]
  minPreco?: number
  maxPreco?: number
  page?: number
  pageSize?: number
}) {
  const forceMocks = (process.env.NEXT_PUBLIC_USE_MOCKS === "true") || (process.env.USE_MOCKS === "true")
  const qs = new URLSearchParams()
  if (params?.category) qs.set("category", params.category)
  if (params?.categorias && params.categorias.length > 0) qs.set("categorias", params.categorias.join(","))
  if (params?.transmissoes && params.transmissoes.length > 0) qs.set("transmissoes", params.transmissoes.join(","))
  if (params?.anos && params.anos.length > 0) qs.set("anos", params.anos.join(","))
  if (typeof params?.minPreco === "number") qs.set("minPreco", String(params.minPreco))
  if (typeof params?.maxPreco === "number") qs.set("maxPreco", String(params.maxPreco))
  if (typeof params?.page === "number") qs.set("page", String(params.page))
  if (typeof params?.pageSize === "number") qs.set("pageSize", String(params.pageSize))

  const path = qs.toString() ? `/api/vehicles?${qs.toString()}` : "/api/vehicles"
  const res = await request<Array<{
    id: string
    name: string
    category: string
    year: number
    images: string[]
    pricePerDay: number
    transmission: string
    passengers: number
    fuel: string
    available: boolean
  }>>(path, { method: "GET" })
  if (res.success && res.data && !forceMocks) return res

  // Fallback para mocks (ou quando flag forçada)
  const all = getAllVehicles()
  const filtered = all.filter((v) => {
    if (params?.category && v.category !== params.category) return false
    if (params?.minPreco && v.pricePerDay < params.minPreco) return false
    if (params?.maxPreco && v.pricePerDay > params.maxPreco) return false
    return true
  })
  const data = filtered.map(v => ({
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
  return { success: true, data }
}

export async function apiGetVehicle(id: string) {
  const forceMocks = (process.env.NEXT_PUBLIC_USE_MOCKS === "true") || (process.env.USE_MOCKS === "true")
  const res = await request<{
    id: string
    name: string
    category: string
    year: number
    images: string[]
    pricePerDay: number
    transmission: string
    passengers: number
    fuel: string
    available: boolean
    doors?: number
    airConditioning?: boolean
    features?: string[]
  }>(`/api/vehicles/${id}`, { method: "GET" })
  if (res.success && res.data && !forceMocks) return res

  const v = getVehicle(id)
  if (!v) return { success: false, error: "Veículo não encontrado" }
  const data = {
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
    doors: v.doors,
    airConditioning: v.airConditioning,
    features: v.features,
  }
  return { success: true, data }
}

// Reservations
export async function apiCreateReservation(payload: {
  carId: string
  pickupDate: string
  returnDate: string
  pickupLocation: string
  returnLocation: string
  selectedExtras: Array<{ id: string; name: string; price: number }>
  customer: { name: string; email: string; phone: string }
}, accessToken?: string) {
  return request<{ id: string }>("/api/reservations", {
    method: "POST",
    body: JSON.stringify(payload),
  }, accessToken)
}

export async function apiGetMyReservations(accessToken: string) {
  return request<Array<{ id: string; carId: string; pickupDate: string; returnDate: string; pickupLocation: string; returnLocation: string }>>(
    "/api/reservations/me",
    { method: "GET" },
    accessToken,
  )
}

export async function apiCancelReservation(id: string, accessToken?: string) {
  const res = await request<{ success: boolean }>(`/api/reservations/${id}`, { method: "DELETE" }, accessToken)
  return res
}

// Nota: backend Java ainda não expõe GET /api/reservations/{id};
// utilize apiGetMyReservations e filtre pelo id no cliente.