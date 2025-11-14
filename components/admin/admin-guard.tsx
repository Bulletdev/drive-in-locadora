"use client"
import { ReactNode, useMemo } from "react"
import { useSession, signIn } from "next-auth/react"

function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  const allowList = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
  if (allowList.length > 0) {
    return allowList.includes(email)
  }
  // Fallback para MVP: emails internos
  return email.endsWith("@drivein.local") || email === "admin@drivein.local" || email === "vendedor@drivein.local"
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const { status, data } = useSession()

  const allowed = useMemo(() => {
    const email = data?.user?.email
    return isAdminEmail(email)
  }, [data?.user?.email])

  if (status === "loading") {
    return <div className="p-6">Carregando sessão...</div>
  }

  if (status === "unauthenticated") {
    return (
      <div className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">Acesso restrito</h2>
        <p>Faça login para acessar o painel administrativo.</p>
        <button
          className="inline-flex items-center rounded-md bg-black text-white px-4 py-2 text-sm"
          onClick={() => signIn()}
        >
          Entrar
        </button>
      </div>
    )
  }

  if (!allowed) {
    return (
      <div className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">Acesso negado</h2>
        <p>Seu usuário não possui permissão para acessar este painel.</p>
      </div>
    )
  }

  return <>{children}</>
}