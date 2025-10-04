import { ClientDashboard } from "@/components/client-area/client-dashboard"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserByEmail } from "@/lib/users-storage"

export const metadata = {
  title: "Área do Cliente | Drive-In Locadora",
  description: "Gerencie suas reservas e informações",
}

export default async function ClientAreaPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = getUserByEmail(session.user.email)

  if (!user) {
    redirect("/login")
  }

  return <ClientDashboard user={user} />
}
