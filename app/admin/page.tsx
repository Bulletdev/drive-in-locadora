"use client"
import { getAllVehicles } from "@/lib/vehicles-data"

export default function AdminDashboardPage() {
  const vehicles = getAllVehicles()
  const total = vehicles.length
  const available = vehicles.filter((v) => v.available).length
  const unavailable = total - available

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Painel Administrativo</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4 bg-white">
          <div className="text-sm text-gray-500">Veículos no catálogo</div>
          <div className="text-3xl font-bold">{total}</div>
        </div>
        <div className="rounded-lg border p-4 bg-white">
          <div className="text-sm text-gray-500">Disponíveis</div>
          <div className="text-3xl font-bold text-green-600">{available}</div>
        </div>
        <div className="rounded-lg border p-4 bg-white">
          <div className="text-sm text-gray-500">Indisponíveis</div>
          <div className="text-3xl font-bold text-red-600">{unavailable}</div>
        </div>
      </div>

      <section className="rounded-lg border p-4 bg-white">
        <h2 className="text-lg font-medium mb-3">Próximas ações</h2>
        <ul className="list-disc ml-5 space-y-2 text-sm">
          <li>Cadastrar fornecedores e registrar compras de veículos</li>
          <li>Configurar filiais e associar veículos a cada unidade</li>
          <li>Registrar vendas e acompanhar relatórios mensais</li>
          <li>Gerenciar serviços e documentos dos veículos</li>
        </ul>
      </section>
    </div>
  )
}