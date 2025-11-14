"use client"
import AdminNav from "@/components/admin/admin-nav"
import { AdminGuard } from "@/components/admin/admin-guard"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminNav />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </AdminGuard>
  )
}