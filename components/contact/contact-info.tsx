import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

const contactDetails = [
  {
    icon: Phone,
    title: "Telefone",
    content: "(75) 99139-7733",
    link: "tel:+5575991397733",
  },
  {
    icon: Mail,
    title: "E-mail",
    content: "contato@driveinlocadora.com.br",
    link: "mailto:contato@driveinlocadora.com.br",
  },
  {
    icon: MapPin,
    title: "Endereço",
    content: "AV Fraga Maia, Feira de santana, BA",
    link: "https://maps.google.com",
  },
  {
    icon: Clock,
    title: "Horário de Atendimento",
    content: "Seg - Sex: 8h às 18h | Sáb: 9h às 13h",
    link: null,
  },
]

export function ContactInfo() {
  return (
    <div className="space-y-4">
      {contactDetails.map((detail, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <detail.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{detail.title}</h3>
                {detail.link ? (
                  <a
                    href={detail.link}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target={detail.link.startsWith("http") ? "_blank" : undefined}
                    rel={detail.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {detail.content}
                  </a>
                ) : (
                  <p className="text-muted-foreground">{detail.content}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Map */}
      <Card>
        <CardContent className="p-0">
          <div className="w-full h-[300px] bg-muted rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975359204254!2d-46.656692!3d-23.561414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
