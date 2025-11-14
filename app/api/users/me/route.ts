import { NextRequest } from "next/server"
import { getUserByEmail, updateUserByEmail } from "@/lib/users-storage"

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || ""
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : ""
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  // Demo: token is base64("email:demo-token")
  let email = ""
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    email = decoded.split(":")[0]
  } catch {}
  const user = email ? getUserByEmail(email) : null
  if (user) {
    return Response.json({ ...user })
  }
  // Fallback demo payload (consistente e estático para evitar hidratação variável)
  return Response.json({
    id: "u-demo",
    name: "Cliente Demo",
    email: email || "admin@drivein.local",
    phone: "+55 11 99999-9999",
    cpf: "000.000.000-00",
    createdAt: "2024-01-01T00:00:00.000Z",
  })
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || ""
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : ""
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  let email = ""
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    email = decoded.split(":")[0]
  } catch {}
  if (!email) {
    return Response.json({ error: "Invalid token" }, { status: 400 })
  }
  const body = await req.json()
  const updated = updateUserByEmail(email, {
    name: typeof body?.name === "string" ? body.name : undefined,
    phone: typeof body?.phone === "string" ? body.phone : undefined,
  })
  if (!updated) {
    return Response.json({ error: "User not found" }, { status: 404 })
  }
  return Response.json(updated)
}