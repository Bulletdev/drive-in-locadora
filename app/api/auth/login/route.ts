import { NextResponse } from "next/server"
import { validateUser } from "@/lib/users-storage"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body || {}

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    const result = await validateUser(email, password)
    if (!result.success || !result.user) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Token simples para ambiente de desenvolvimento (não seguro para produção)
    const token = `mock-${Math.random().toString(36).slice(2)}-${Date.now()}`

    return NextResponse.json({ token, user: result.user }, { status: 200 })
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: "Erro ao autenticar" }, { status: 500 })
  }
}