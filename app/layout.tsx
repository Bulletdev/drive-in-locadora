import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Drive-In Locadora | Aluguel de Carros",
  description: "Mais que carros, entregamos caminhos. Alugue veículos novos e bem mantidos com a Drive-In Locadora.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
