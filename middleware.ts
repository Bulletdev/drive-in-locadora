import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

export default NextAuth(authConfig).auth

export const config = {
  // Apenas interceptar rotas específicas, não todas as requisições
  matcher: [
    "/area-cliente/:path*",
    "/login",
    "/cadastro",
  ],
}
