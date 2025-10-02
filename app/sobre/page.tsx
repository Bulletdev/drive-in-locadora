import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Award, Heart } from "lucide-react"
import Image from "next/image"

export const metadata = {
  title: "Sobre Nós | Drive-In Locadora",
  description: "Conheça a Drive-In Locadora e nossa equipe dedicada",
}

const team = [
  {
    name: "Michael Douglas",
    role: "Developer",
    image: "/placeholder-user.jpg",
    description: "Responsável pela tecnologia e inovação da plataforma",
  },
  {
    name: "Eduardo Queiroz",
    role: "Automotive Specialist",
    image: "/placeholder-user.jpg",
    description: "Especialista em veículos e manutenção da frota",
  },
  {
    name: "Alef Freitas",
    role: "Gold Investor Partner",
    image: "/placeholder-user.jpg",
    description: "Sócio investidor e estrategista de negócios",
  },
  {
    name: "Kalian Ferreira",
    role: "Marketing & Design",
    image: "/placeholder-user.jpg",
    description: "Responsável pela identidade visual e marketing",
  },
]

const values = [
  {
    icon: Target,
    title: "Missão",
    description:
      "Proporcionar experiências de mobilidade excepcionais, oferecendo veículos de qualidade e atendimento personalizado.",
  },
  {
    icon: Award,
    title: "Excelência",
    description: "Mantemos os mais altos padrões de qualidade em nossa frota e serviços, garantindo sua satisfação.",
  },
  {
    icon: Heart,
    title: "Compromisso",
    description: "Estamos comprometidos com a segurança, conforto e confiança de nossos clientes em cada jornada.",
  },
  {
    icon: Users,
    title: "Parceria",
    description: "Construímos relacionamentos duradouros baseados em confiança, transparência e respeito mútuo.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <Badge className="mb-4" variant="outline">
            Sobre Nós
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Quem <span className="text-primary">Somos</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Somos um grupo de associados que buscamos maior conforto e segurança dos nossos clientes, garantindo uma boa
            experiência quando o assunto é confiança!
          </p>
        </div>

        {/* Image Section */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image src="/images/drivein2.png" alt="Drive-In Locadora" fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="text-3xl font-bold">
              Mais que carros, entregamos <span className="text-primary">caminhos</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Na Drive-In Locadora, acreditamos que cada viagem é uma oportunidade para criar memórias inesquecíveis.
              Por isso, oferecemos uma frota moderna e bem mantida, com veículos que atendem às suas necessidades e
              superam suas expectativas.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nossa equipe está sempre pronta para oferecer o melhor atendimento, garantindo que sua experiência seja
              tranquila do início ao fim.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nossos <span className="text-primary">Valores</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">
            Nossa <span className="text-primary">Equipe</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mb-4 relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
