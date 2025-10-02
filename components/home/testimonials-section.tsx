"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  {
    name: "Maria Silva",
    role: "Cliente desde 2023",
    content:
      "Excelente serviço! Os carros são sempre novos e bem mantidos. A equipe é muito atenciosa e o processo de locação é super rápido.",
    rating: 5,
  },
  {
    name: "João Santos",
    role: "Cliente desde 2022",
    content:
      "Já aluguei várias vezes e sempre tive uma ótima experiência. Preços justos e transparentes, sem surpresas na hora de devolver o carro.",
    rating: 5,
  },
  {
    name: "Ana Costa",
    role: "Cliente desde 2024",
    content:
      "Recomendo muito! Aluguei um SUV para uma viagem em família e foi perfeito. Carro limpo, confortável e com seguro completo.",
    rating: 5,
  },
  {
    name: "Carlos Oliveira",
    role: "Cliente desde 2023",
    content:
      "Atendimento impecável! Precisei de um carro de última hora e eles resolveram tudo rapidamente. Voltarei a alugar com certeza.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            O Que Nossos <span className="text-primary">Clientes Dizem</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Depoimentos reais de quem já confiou na Drive-In Locadora
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2">
            <CardContent className="p-8 md:p-12">
              <div className="flex gap-1 mb-6 justify-center">
                {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-xl md:text-2xl text-center mb-8 leading-relaxed text-pretty">
                "{testimonials[currentIndex].content}"
              </p>
              <div className="text-center">
                <p className="font-bold text-lg">{testimonials[currentIndex].name}</p>
                <p className="text-muted-foreground">{testimonials[currentIndex].role}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={prev} aria-label="Depoimento anterior">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-primary w-8" : "bg-muted-foreground/30"
                  }`}
                  aria-label={`Ir para depoimento ${index + 1}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next} aria-label="Próximo depoimento">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
