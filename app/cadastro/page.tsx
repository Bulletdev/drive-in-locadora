import { RegisterForm } from "@/components/auth/register-form"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export const metadata = {
  title: "Cadastro | Drive-In Locadora",
  description: "Crie sua conta",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <Badge className="mb-4" variant="outline">
              Criar Conta
            </Badge>
            <h1 className="text-4xl font-bold mb-2">
              Junte-se a <span className="text-primary">nós</span>
            </h1>
            <p className="text-muted-foreground">Crie sua conta e comece a reservar veículos</p>
          </div>

          <RegisterForm />

          <p className="text-center text-sm text-muted-foreground mt-6">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
