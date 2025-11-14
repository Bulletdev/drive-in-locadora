"use client"
import { getAllVehicles } from "@/lib/vehicles-data"

export default function AdminEstoquePage() {
  const vehicles = getAllVehicles()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Estoque</h1>
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Nome</th>
              <th className="text-left p-3">Categoria</th>
              <th className="text-left p-3">Ano</th>
              <th className="text-left p-3">Preço/dia</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-3">{v.name}</td>
                <td className="p-3">{v.category}</td>
                <td className="p-3">{v.year}</td>
                <td className="p-3">R$ {v.pricePerDay.toFixed(2)}</td>
                <td className="p-3">
                  <span
                    className={
                      "inline-flex items-center rounded-md px-2 py-1 " +
                      (v.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")
                    }
                  >
                    {v.available ? "Disponível" : "Indisponível"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}