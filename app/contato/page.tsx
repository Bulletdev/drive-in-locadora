import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Contato | Drive-In Locadora",
  description: "Entre em contato com a Drive-In Locadora",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <Badge className="mb-4" variant="outline">
            Contato
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Fale <span className="text-primary">Conosco</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Estamos prontos para atender você. Entre em contato e tire suas dúvidas!
          </p>
        </div>

        {/* Contact Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Envie uma mensagem</h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Informações de contato</h2>
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  )
}
