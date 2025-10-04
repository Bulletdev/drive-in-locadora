export const metadata = {
  title: "Política de Privacidade | Drive-In Locadora",
  description: "Política de privacidade da Drive-In Locadora",
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Coleta de Informações</h2>
            <p className="text-muted-foreground">
              Coletamos informações pessoais quando você se cadastra em nosso site, faz uma reserva ou
              interage com nossos serviços. Isso pode incluir nome, email, CPF, CNH, endereço e
              informações de pagamento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Uso das Informações</h2>
            <p className="text-muted-foreground">
              Utilizamos suas informações para processar reservas, melhorar nossos serviços, enviar
              comunicações relacionadas às suas locações e cumprir obrigações legais.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Proteção de Dados</h2>
            <p className="text-muted-foreground">
              Implementamos medidas de segurança para proteger suas informações pessoais contra acesso
              não autorizado, alteração, divulgação ou destruição. Seus dados são criptografados e
              armazenados em servidores seguros.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Compartilhamento de Dados</h2>
            <p className="text-muted-foreground">
              Não vendemos, trocamos ou transferimos suas informações pessoais para terceiros sem seu
              consentimento, exceto quando necessário para processar transações ou cumprir requisitos legais.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Cookies</h2>
            <p className="text-muted-foreground">
              Utilizamos cookies para melhorar sua experiência no site, lembrar suas preferências e
              analisar o tráfego. Você pode configurar seu navegador para recusar cookies, mas isso pode
              afetar algumas funcionalidades do site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Seus Direitos</h2>
            <p className="text-muted-foreground">
              De acordo com a LGPD, você tem direito de acessar, corrigir, excluir ou limitar o uso de
              suas informações pessoais. Para exercer esses direitos, entre em contato conosco.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Alterações na Política</h2>
            <p className="text-muted-foreground">
              Podemos atualizar esta política periodicamente. Notificaremos você sobre mudanças
              significativas através do email cadastrado ou por meio de aviso em nosso site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Contato</h2>
            <p className="text-muted-foreground">
              Para questões sobre esta política de privacidade ou seus dados pessoais, entre em contato
              através do email privacidade@driveinlocadora.com.br
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
