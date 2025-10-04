import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnClientArea = nextUrl.pathname.startsWith("/area-cliente")
      const isOnAuth = nextUrl.pathname === "/login" || nextUrl.pathname === "/cadastro"

      if (isOnClientArea) {
        if (isLoggedIn) return true
        return false // Redireciona para login
      } else if (isOnAuth) {
        if (isLoggedIn) return Response.redirect(new URL("/area-cliente", nextUrl))
      }
      return true
    },
  },
  providers: [], // Adicionado na configuração principal
} satisfies NextAuthConfig
