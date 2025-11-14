import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserByEmail } from "@/lib/users-storage"

export async function GET() {
  try {
    const session = await auth()
    const email = session?.user?.email
    if (!email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }
    const user = getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }
    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error("Erro ao obter perfil:", error)
    return NextResponse.json({ error: "Erro ao obter perfil" }, { status: 500 })
  }
}