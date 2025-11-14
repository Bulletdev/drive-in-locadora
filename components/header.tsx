"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/frota", label: "Frota" },
    { href: "/reservas", label: "Reservas" },
    { href: "/sobre", label: "Sobre" },
    { href: "/contato", label: "Contato" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logodrivein.png" alt="Drive-In Locadora" width={50} height={50} className="w-12 h-12" />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg text-foreground">DRIVE-IN</span>
              <span className="text-xs text-muted-foreground">LOCADORA</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {status === "authenticated" ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/area-cliente">
                    <User className="w-4 h-4 mr-2" />
                    {session?.user?.name || session?.user?.email || "Minha Conta"}
                  </Link>
                </Button>
                <Button size="sm" onClick={() => signOut({ callbackUrl: "/" })}>Sair</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/cadastro">Cadastre-se</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t">
                {status === "authenticated" ? (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/area-cliente" onClick={() => setIsMobileMenuOpen(false)}>
                        <User className="w-4 h-4 mr-2" />
                        {session?.user?.name || session?.user?.email || "Minha Conta"}
                      </Link>
                    </Button>
                    <Button size="sm" onClick={() => { setIsMobileMenuOpen(false); signOut({ callbackUrl: "/" }) }}>Sair</Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <User className="w-4 h-4 mr-2" />
                        Login
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/cadastro" onClick={() => setIsMobileMenuOpen(false)}>Cadastre-se</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
