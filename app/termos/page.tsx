export const metadata = {
  title: "Termos de Uso | Drive-In Locadora",
  description: "Termos de uso da Drive-In Locadora",
}

export default function TermosPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Termos de Uso</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground">
              Ao acessar e usar os serviços da Drive-In Locadora, você concorda em estar vinculado a estes
              Termos de Uso e a todas as leis e regulamentos aplicáveis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Uso dos Serviços</h2>
            <p className="text-muted-foreground">
              Nossos serviços de locação de veículos são destinados apenas para uso pessoal e comercial legal.
              Você concorda em não usar os veículos para atividades ilegais ou não autorizadas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Responsabilidades do Locatário</h2>
            <p className="text-muted-foreground">
              O locatário é responsável pelo veículo durante o período de locação, incluindo danos, multas
              e infrações de trânsito. É necessário possuir CNH válida e ter no mínimo 21 anos de idade.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Cancelamentos e Reembolsos</h2>
            <p className="text-muted-foreground">
              Cancelamentos feitos com mais de 48 horas de antecedência terão reembolso integral.
              Cancelamentos com menos de 48 horas terão desconto de 50% do valor da reserva.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Modificações dos Termos</h2>
            <p className="text-muted-foreground">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão
              em vigor imediatamente após a publicação no site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Contato</h2>
            <p className="text-muted-foreground">
              Para dúvidas sobre estes termos, entre em contato através da nossa página de contato ou pelo
              email contato@driveinlocadora.com.br
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
