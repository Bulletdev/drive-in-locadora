import { LoginForm } from "@/components/auth/login-form"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Login | Drive-In Locadora",
  description: "Acesse sua conta",
}

export default async function LoginPage() {
  const session = await auth()

  if (session?.user) {
    redirect("/area-cliente")
  }

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <Badge className="mb-4" variant="outline">
              Área do Cliente
            </Badge>
            <h1 className="text-4xl font-bold mb-2">
              Bem-vindo de <span className="text-primary">volta</span>
            </h1>
            <p className="text-muted-foreground">Entre com suas credenciais para acessar sua conta</p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-muted-foreground mt-6">
            Não tem uma conta?{" "}
            <Link href="/cadastro" className="text-primary hover:underline font-semibold">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
