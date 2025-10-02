import { ClientDashboard } from "@/components/client-area/client-dashboard"

export const metadata = {
  title: "Área do Cliente | Drive-In Locadora",
  description: "Gerencie suas reservas e informações",
}

export default function ClientAreaPage() {
  // In production, this would check authentication
  // For now, we'll show the dashboard directly
  return <ClientDashboard />
}
