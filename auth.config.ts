import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [], // Adicionado na configuração principal
} satisfies NextAuthConfig
