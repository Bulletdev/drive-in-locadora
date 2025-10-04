import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnClientArea = nextUrl.pathname.startsWith("/area-cliente")

      // Apenas proteger área do cliente
      if (isOnClientArea && !isLoggedIn) {
        return false // Redireciona para login
      }

      return true
    },
  },
  providers: [], // Adicionado na configuração principal
} satisfies NextAuthConfig
