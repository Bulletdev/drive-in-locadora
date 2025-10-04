import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { validateUser } from "./users-storage"

export const { handlers, signIn, signOut, auth } = NextAuth({
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

        const result = await validateUser(credentials.email as string, credentials.password as string)

        if (!result.success || !result.user) {
          return null
        }

        return {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
})
