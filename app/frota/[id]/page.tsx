import { CarGallery } from "@/components/car-details/car-gallery"
import { CarSpecifications } from "@/components/car-details/car-specifications"
import { CarReservationForm } from "@/components/car-details/car-reservation-form"
import { SimilarCars } from "@/components/car-details/similar-cars"
import { notFound } from "next/navigation"

// Mock data - in production this would come from a database
const cars = {
  "1": {
    id: "1",
    name: "Toyota Corolla",
    category: "Sedan",
    year: 2024,
    images: [
      "/cars/toyota-corolla/toyota-corolla-1.jpg",
      "/cars/toyota-corolla/toyota-corolla-2.jpg",
      "/cars/toyota-corolla/toyota-corolla-3.jpg",
      "/cars/toyota-corolla/toyota-corolla-4.jpg",
    ],
    pricePerDay: 180,
    transmission: "Automático",
    passengers: 5,
    fuel: "Flex",
    doors: 4,
    airConditioning: true,
    available: true,
    description:
      "O Toyota Corolla 2024 é um sedan confiável e sofisticado, perfeito para viagens longas ou uso executivo. Destaca-se pelo design moderno com nova grade frontal em preto piano, faróis full LED com assistência automática de facho alto e tecnologia avançada com central multimídia de 12,3 polegadas.",
    features: [
      "Ar-condicionado automático dual zone",
      "Direção elétrica progressiva",
      "Vidros elétricos com one touch",
      "Travas elétricas com travamento automático",
      "Central multimídia 12,3\" com Android Auto e Apple CarPlay",
      "Cluster digital TFT 12,3\"",
      "Bluetooth e USB",
      "Câmera de ré com visão 360°",
      "Sensor de estacionamento frontal e traseiro",
      "8 Airbags",
      "ABS com EBD",
      "Controle de estabilidade e tração",
      "Faróis full LED com DRL",
      "Rodas de liga leve 17\"",
      "Bancos em couro",
      "Piloto automático adaptativo",
    ],
  },
  "2": {
    id: "2",
    name: "Honda HR-V",
    category: "SUV",
    year: 2024,
    images: [
      "/cars/honda-hrv/honda-hrv-1.jpg",
      "/cars/honda-hrv/honda-hrv-2.jpg",
      "/cars/honda-hrv/honda-hrv-3.jpg",
      "/cars/honda-hrv/honda-hrv-4.jpg",
    ],
    pricePerDay: 250,
    transmission: "Automático",
    passengers: 5,
    fuel: "Flex",
    doors: 4,
    airConditioning: true,
    available: true,
    description:
      "O Honda HR-V 2024 combina design arrojado com tecnologia de ponta. SUV compacto com visual de cupê, oferece amplo espaço interno graças ao sistema de bancos Magic Seat, faróis full LED e central multimídia moderna. Ideal para quem busca versatilidade e conforto.",
    features: [
      "Ar-condicionado automático digital",
      "Direção elétrica",
      "Vidros elétricos",
      "Travas elétricas",
      "Central multimídia touchscreen 8\"",
      "Android Auto e Apple CarPlay sem fio",
      "Painel digital 7\"",
      "Bluetooth",
      "Câmera de ré multi-ângulo",
      "Sensor de estacionamento traseiro",
      "6 Airbags",
      "ABS com EBD",
      "Controle de estabilidade VSA",
      "Assistente de partida em rampa",
      "Faróis full LED",
      "Rodas de liga leve 17\"",
      "Banco do motorista com ajuste elétrico",
      "Sistema Magic Seat (bancos reconfiguráveis)",
    ],
  },
  "3": {
    id: "3",
    name: "Chevrolet Onix",
    category: "Hatchback",
    year: 2024,
    images: [
      "/cars/chevrolet-onix/chevrolet-onix-1.jpg",
      "/cars/chevrolet-onix/chevrolet-onix-2.jpg",
      "/cars/chevrolet-onix/chevrolet-onix-3.jpg",
      "/cars/chevrolet-onix/chevrolet-onix-4.jpg",
    ],
    pricePerDay: 120,
    transmission: "Manual",
    passengers: 5,
    fuel: "Flex",
    doors: 4,
    airConditioning: true,
    available: true,
    description:
      "O Chevrolet Onix 2024 é o hatchback mais vendido do Brasil. Com design moderno e grade frontal unificada aos faróis, oferece excelente custo-benefício. Motor 1.0 econômico, ideal para uso urbano e viagens curtas com baixo consumo de combustível.",
    features: [
      "Ar-condicionado",
      "Direção elétrica",
      "Vidros elétricos dianteiros",
      "Travas elétricas",
      "Central multimídia MyLink 8\" touchscreen",
      "Android Auto e Apple CarPlay",
      "Bluetooth",
      "Câmera de ré",
      "Computador de bordo",
      "2 Airbags",
      "ABS com EBD",
      "Controle de estabilidade e tração",
      "Faróis com máscara negra",
      "Rodas de aço 15\" com calotas",
      "Volante multifuncional",
      "Alarme",
    ],
  },
  "4": {
    id: "4",
    name: "Volkswagen T-Cross",
    category: "SUV",
    year: 2024,
    images: [
      "/cars/volkswagen-tcross/volkswagen-tcross-1.jpg",
      "/cars/volkswagen-tcross/volkswagen-tcross-2.jpg",
      "/cars/volkswagen-tcross/volkswagen-tcross-3.jpg",
      "/cars/volkswagen-tcross/volkswagen-tcross-4.jpg",
    ],
    pricePerDay: 280,
    transmission: "Automático",
    passengers: 5,
    fuel: "Flex",
    doors: 4,
    airConditioning: true,
    available: true,
    description:
      "O Volkswagen T-Cross 2024 é um SUV compacto sofisticado com barra LED conectando os faróis, dashboard redesenhado com materiais premium e tecnologia de ponta. Motor 1.4 TSI turbo oferece desempenho esportivo com eficiência. Perfeito para quem busca estilo e potência.",
    features: [
      "Ar-condicionado automático Climatronic",
      "Direção elétrica progressiva",
      "Vidros elétricos com one touch",
      "Travas elétricas",
      "Central multimídia VW Play 10,1\" touchscreen",
      "Painel digital Active Info Display 10,25\"",
      "Android Auto e Apple CarPlay sem fio",
      "Bluetooth",
      "Câmera de ré",
      "Sensor de estacionamento traseiro",
      "6 Airbags",
      "ABS com EBD",
      "Controle de estabilidade ESC",
      "Assistente de partida em rampa",
      "Faróis full LED com assinatura VW",
      "Rodas de liga leve 17\"",
      "Volante multifuncional em couro",
      "Carregador de celular por indução",
    ],
  },
  "5": {
    id: "5",
    name: "Hyundai HB20",
    category: "Hatchback",
    year: 2023,
    images: [
      "/cars/hyundai-hb20/hyundai-hb20-1.jpg",
      "/cars/hyundai-hb20/hyundai-hb20-2.jpg",
      "/cars/hyundai-hb20/hyundai-hb20-3.jpg",
      "/cars/hyundai-hb20/hyundai-hb20-4.jpg",
    ],
    pricePerDay: 130,
    transmission: "Manual",
    passengers: 5,
    fuel: "Flex",
    doors: 4,
    airConditioning: true,
    available: true,
    description:
      "O Hyundai HB20 2023 renovado traz design mais moderno com faróis finos integrados à grade frontal e lanternas traseiras redesenhadas inspiradas no Tucson. Hatchback compacto econômico, ideal para uso diário na cidade com boa dirigibilidade e conforto.",
    features: [
      "Ar-condicionado",
      "Direção elétrica",
      "Vidros elétricos dianteiros",
      "Travas elétricas",
      "Central multimídia Bluelink 8\" touchscreen",
      "Android Auto e Apple CarPlay",
      "Bluetooth",
      "Câmera de ré",
      "Computador de bordo",
      "2 Airbags",
      "ABS com EBD",
      "Controle de estabilidade ESC",
      "Faróis com projetor",
      "Lanternas em LED",
      "Rodas de aço 15\" com calotas",
      "Volante multifuncional",
    ],
  },
  "6": {
    id: "6",
    name: "Jeep Compass",
    category: "SUV",
    year: 2024,
    images: [
      "/cars/jeep-compass/jeep-compass-1.jpg",
      "/cars/jeep-compass/jeep-compass-2.jpg",
      "/cars/jeep-compass/jeep-compass-3.jpg",
      "/cars/jeep-compass/jeep-compass-4.jpg",
    ],
    pricePerDay: 320,
    transmission: "Automático",
    passengers: 5,
    fuel: "Flex",
    doors: 4,
    airConditioning: true,
    available: false,
    description:
      "O Jeep Compass 2024 é o SUV médio mais tecnológico do segmento. Com design icônico, grade de sete fendas, faróis full LED e interior premium. Disponível com motor turbo flex ou turbodiesel. Oferece capacidade off-road com tração 4x4 e sistema Selec-Terrain para diferentes tipos de terreno.",
    features: [
      "Ar-condicionado automático dual zone",
      "Direção elétrica",
      "Vidros elétricos com one touch",
      "Travas elétricas",
      "Central multimídia Uconnect 10,1\" touchscreen",
      "Painel digital customizável 10,25\"",
      "Android Auto e Apple CarPlay sem fio",
      "Carregamento wireless",
      "Bluetooth",
      "Câmera de ré com park assist",
      "Sensores de estacionamento 360°",
      "7 Airbags",
      "ABS com EBD",
      "Controle de estabilidade e tração",
      "Sistema Selec-Terrain (tração 4x4)",
      "Faróis full LED bi-xenon",
      "Rodas de liga leve 18\"",
      "Teto solar panorâmico",
      "Bancos em couro",
      "Controle de cruzeiro adaptativo",
    ],
  },
  "7": {
    id: "7",
    name: "Fiat Argo",
    category: "Hatchback",
    year: 2023,
    images: [
      "/cars/fiat-argo/fiat-argo-1.jpg",
      "/cars/fiat-argo/fiat-argo-2.jpg",
      "/cars/fiat-argo/fiat-argo-3.jpg",
      "/cars/fiat-argo/fiat-argo-4.jpg",
    ],
    pricePerDay: 110,
    transmission: "Manual",
    passengers: 5,
    fuel: "Flex",
    doors: 4,
    airConditioning: true,
    available: true,
    description:
      "O Fiat Argo 2023 atualizado apresenta design mais robusto com para-choque renovado e grade unificada aos faróis. Hatchback econômico e ágil, com motor 1.0 Firefly eficiente. Excelente opção para quem busca baixo custo de manutenção e consumo reduzido no dia a dia.",
    features: [
      "Ar-condicionado",
      "Direção elétrica",
      "Vidros elétricos dianteiros",
      "Travas elétricas",
      "Central multimídia Uconnect 7\" touchscreen",
      "Android Auto e Apple CarPlay",
      "Bluetooth",
      "Computador de bordo",
      "2 Airbags",
      "ABS com EBD",
      "Controle de estabilidade ESC",
      "Faróis com máscara negra",
      "Rodas de aço 14\" com calotas",
      "Volante com regulagem de altura",
      "Retrovisores elétricos",
    ],
  },
  "8": {
    id: "8",
    name: "Nissan Kicks",
    category: "SUV",
    year: 2024,
    images: [
      "/cars/nissan-kicks/nissan-kicks-1.jpg",
      "/cars/nissan-kicks/nissan-kicks-2.jpg",
      "/cars/nissan-kicks/nissan-kicks-3.jpg",
      "/cars/nissan-kicks/nissan-kicks-4.jpg",
    ],
    pricePerDay: 260,
    transmission: "Automático",
    passengers: 5,
    fuel: "Flex",
    doors: 4,
    airConditioning: true,
    available: true,
    description:
      "O Nissan Kicks 2024 é um SUV compacto inovador com design diferenciado e lanternas em formato boomerang. Destaca-se pelo amplo porta-malas, tecnologia Nissan Safety Shield com assistentes de condução e interior espaçoso. Motor 1.6 flex com câmbio CVT garante boa economia e conforto.",
    features: [
      "Ar-condicionado automático digital",
      "Direção elétrica",
      "Vidros elétricos com one touch",
      "Travas elétricas",
      "Central multimídia 8\" touchscreen",
      "Painel digital 7\" customizável",
      "Android Auto e Apple CarPlay",
      "Bluetooth",
      "Câmera de ré 360°",
      "Sensor de estacionamento traseiro",
      "6 Airbags",
      "ABS com EBD",
      "Controle de estabilidade VDC",
      "Assistente de partida em rampa",
      "Faróis full LED com DRL",
      "Lanternas LED em formato boomerang",
      "Rodas de liga leve 17\"",
      "Volante multifuncional em couro",
      "Sistema Nissan Safety Shield",
    ],
  },
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const car = cars[params.id as keyof typeof cars]
  if (!car) return { title: "Carro não encontrado" }

  return {
    title: `${car.name} ${car.year} | Drive-In Locadora`,
    description: car.description,
  }
}

export default function CarDetailsPage({ params }: { params: { id: string } }) {
  const car = cars[params.id as keyof typeof cars]

  if (!car) {
    notFound()
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <a href="/" className="hover:text-primary">
            Home
          </a>
          {" / "}
          <a href="/frota" className="hover:text-primary">
            Frota
          </a>
          {" / "}
          <span className="text-foreground">{car.name}</span>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left Column - Gallery and Specs */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {car.name} <span className="text-primary">{car.year}</span>
              </h1>
              <p className="text-muted-foreground mb-6">{car.category}</p>
            </div>

            <CarGallery images={car.images} name={car.name} />

            <div>
              <h2 className="text-2xl font-bold mb-4">Sobre este veículo</h2>
              <p className="text-muted-foreground leading-relaxed">{car.description}</p>
            </div>

            <CarSpecifications car={car} />
          </div>

          {/* Right Column - Reservation Form */}
          <div className="lg:col-span-1">
            <CarReservationForm car={car} />
          </div>
        </div>

        {/* Similar Cars */}
        <SimilarCars currentCarId={car.id} category={car.category} />
      </div>
    </div>
  )
}
