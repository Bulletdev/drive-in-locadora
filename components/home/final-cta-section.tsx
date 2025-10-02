import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FinalCTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-foreground to-foreground/90 text-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
          Pronto para sua próxima <span className="text-primary">aventura?</span>
        </h2>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-background/80 text-pretty">
          Reserve agora e comece sua jornada com segurança e conforto
        </p>
        <Button size="lg" asChild className="text-lg px-8">
          <Link href="/reservas">
            RESERVE SEU CARRO AGORA
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
