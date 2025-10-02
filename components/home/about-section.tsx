import Image from "next/image"
import { Handshake } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Image Side */}
          <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
            <Image src="/luxury-car-interior.png" alt="Interior de carro luxuoso" fill className="object-cover" />
          </div>

          {/* Content Side */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-primary">QUEM SOMOS</span>
            </h2>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Handshake className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Somos um grupo de associados que buscamos maior conforto e segurança dos nossos clientes, garantindo uma
                boa experiência quando o assunto é confiança!
              </p>
            </div>
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <p className="text-foreground">Frota nova e moderna</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <p className="text-foreground">Manutenção preventiva constante</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <p className="text-foreground">Atendimento 24/7</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <p className="text-foreground">Seguro completo incluso</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <p className="text-foreground">Sem taxas ocultas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
