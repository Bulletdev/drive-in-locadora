import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const categories = [
  {
    name: "SUV",
    image: "/modern-suv.png",
    priceFrom: "250",
  },
  {
    name: "Sedan",
    image: "/luxury-sedan.png",
    priceFrom: "180",
  },
  {
    name: "Hatchback",
    image: "/compact-hatchback-car.jpg",
    priceFrom: "120",
  },
  {
    name: "Coupe",
    image: "/sporty-coupe-car.jpg",
    priceFrom: "300",
  },
  {
    name: "Esportivo",
    image: "/sleek-red-sports-car.png",
    priceFrom: "500",
  },
]

export function CategoriesSection() {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Categorias de <span className="text-primary">Veículos</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Escolha o veículo perfeito para sua necessidade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.map((category) => (
            <Link key={category.name} href={`/frota?categoria=${category.name}`}>
              <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground mb-4">
                    A partir de <span className="text-primary font-bold text-xl">R$ {category.priceFrom}</span>/dia
                  </p>
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary bg-transparent"
                  >
                    Ver Modelos
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/frota">
              Ver Toda a Frota
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
