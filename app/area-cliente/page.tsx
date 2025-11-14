import { ClientDashboard } from "@/components/client-area/client-dashboard"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { apiMe } from "@/lib/api-client"

export const metadata = {
  title: "Área do Cliente | Drive-In Locadora",
  description: "Gerencie suas reservas e informações",
}

export default async function ClientAreaPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }
  const accessToken = (session as any).accessToken as string | undefined
  if (!accessToken) {
    redirect("/login")
  }

  const me = await apiMe(accessToken)
  if (!me.success || !me.data) {
    redirect("/login")
  }

  return <ClientDashboard user={me.data} accessToken={accessToken} />
}
