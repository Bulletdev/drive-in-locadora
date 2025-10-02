import { FleetFilters } from "@/components/fleet/fleet-filters"
import { FleetGrid } from "@/components/fleet/fleet-grid"

export const metadata = {
  title: "Nossa Frota | Drive-In Locadora",
  description: "Explore nossa frota completa de veículos disponíveis para aluguel",
}

export default function FleetPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Nossa <span className="text-primary">Frota</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha entre uma ampla variedade de veículos novos e bem mantidos
          </p>
        </div>

        {/* Filters and Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <FleetFilters />
          </aside>
          <main className="lg:col-span-3">
            <FleetGrid />
          </main>
        </div>
      </div>
    </div>
  )
}
