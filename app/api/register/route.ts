import { NextResponse } from "next/server"
import { createUser } from "@/lib/users-storage"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, cpf, password } = body

    // Validação básica
    if (!name || !email || !phone || !cpf || !password) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    // Criar usuário
    const result = await createUser({ name, email, phone, cpf, password })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(
      {
        message: "Usuário criado com sucesso",
        user: {
          id: result.user!.id,
          name: result.user!.name,
          email: result.user!.email,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
  }
}
