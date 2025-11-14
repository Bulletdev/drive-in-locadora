"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/estoque", label: "Estoque" },
  { href: "/admin/vendas", label: "Vendas" },
  { href: "/admin/compras", label: "Compras" },
  { href: "/admin/servicos", label: "Serviços" },
  { href: "/admin/relatorios", label: "Relatórios" },
]

export default function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <ul className="flex gap-4 py-3">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    "text-sm px-3 py-2 rounded-md " +
                    (active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100")
                  }
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}