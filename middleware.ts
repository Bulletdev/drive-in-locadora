import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Rotas protegidas que requerem autenticação
  const protectedRoutes = ["/area-cliente"]
  const isProtectedRoute = protectedRoutes.some((route) => nextUrl.pathname.startsWith(route))

  // Redirecionar para login se não estiver autenticado e tentar acessar rota protegida
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  // Redirecionar para área do cliente se já estiver autenticado e tentar acessar login/cadastro
  if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/cadastro")) {
    return NextResponse.redirect(new URL("/area-cliente", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
