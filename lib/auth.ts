import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { apiLogin } from "./api-client"
import { authConfig } from "@/auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        const result = await apiLogin(credentials.email as string, credentials.password as string)

        if (!result.success || !result.data) {
          return null
        }

        const { user, token } = result.data

        // Attach accessToken so jwt callback can persist it
        return { id: user.id, name: user.name, email: user.email, accessToken: token } as any
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.accessToken = (user as any).accessToken
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      ;(session as any).accessToken = token.accessToken as string | undefined
      return session
    },
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
})
