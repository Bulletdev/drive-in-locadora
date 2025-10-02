import { Car, Wrench, Sparkles, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const offers = [
  {
    number: "1",
    title: "ALUGUÉIS DE CARROS",
    description: "Uma gigante variedade de veículos que vão atender às suas expectativas!",
    icon: Car,
  },
  {
    number: "2",
    title: "MANUTENÇÃO ATUALIZADA",
    description: "Garantimos manutenção inclusa e revisada rotineiramente em cada um dos nossos itens.",
    icon: Wrench,
  },
  {
    number: "3",
    title: "VEÍCULOS NOVOS À SUA ESPERA",
    description: "Veículos novinhos te esperando para realizarem suas requisições de forma autêntica!",
    icon: Sparkles,
  },
  {
    number: "4",
    title: "SISTEMA DE CADASTRO PONTUAL",
    description:
      "Garantimos que seus dados sejam tratados de forma segura e suas pendências não sejam usadas de modo desvantajoso!",
    icon: Shield,
  },
]

export function OffersSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-center">
            <span className="text-primary">O QUE OFERECEMOS</span>
          </h2>
          <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center">
            <span className="text-background text-2xl">i</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {offers.map((offer) => (
            <Card key={offer.number} className="border-2 hover:border-primary transition-colors group">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <offer.icon className="w-8 h-8" />
                    </div>
                  </div>
                  <div>
                    <div className="text-primary text-5xl font-bold mb-2">{offer.number}</div>
                    <h3 className="text-xl font-bold mb-3">{offer.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{offer.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
