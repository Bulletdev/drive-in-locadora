# Drive-In Locadora
<img src="public/images/drivein11.png" alt="Project Logo" width="1920">

Projeto completo para uma locadora de veículos
> frontend (Next.js),
 > Scripts SQL de modelo físico, seeds, consultas de demonstração, 
 > Documentação ER/Lógica &
 > API Java simples para inserção no MySQL.

## Visão Geral
- Site público com listagem de frota, reservas e área do cliente.
- Painel administrativo em `http://localhost:3337/admin` com navegação e guard de acesso.
- Banco MySQL com tabelas de fabricantes, modelos, veículos, vendas, pagamentos, notas fiscais, compras (aquisição), serviços, filiais, segurança (permissões) e auditoria.
- Seeds de dados para demonstração, consultas SQL exigidas (10 exemplos).

## Requisitos
- Node.js 18+ (recomendado 20+) e `pnpm` ou `npm`.
- MySQL 8.0+ (compatível com 5.7 com pequenas adaptações).
- Java 21+ e Maven (opcional, para a inserção via Java).
 - Docker e Docker Compose (opcional, para rodar tudo com containers).

## Banco de Dados (Modelo Físico)
Arquivos em `database/mysql/`:
- `001_init.sql` — inicialização/ajustes básicos.
- `002_erp.sql` — tabelas principais (fabricantes, modelos, veículos, vendas, pagamentos, comissões, serviços, notas fiscais, test-drives, auditoria, triggers).
- `003_seeds.sql` — dados iniciais (fabricantes, modelos, veículos, usuários, endereços, CNH, test drive, venda, pagamento, comissão, nota fiscal).
- `004_enhancements.sql` — melhorias (fornecedores, compras, planos de financiamento, filiais, segurança/roles-permissions, fotos/documentos, views de relatório e índices).
- `005_seeds_min.sql` — seeds complementares para garantir 3+ linhas nas tabelas-chave.
 - `006_quality.sql` — melhorias de qualidade: precisão DECIMAL, CHECKs de integridade,
   UNIQUE em test drives e trigger automática de comissão.

Execução recomendada (ajuste usuário/senha):
- `mysql -u root -p < database/mysql/001_init.sql`
- `mysql -u root -p drivein < database/mysql/002_erp.sql`
- `mysql -u root -p drivein < database/mysql/003_seeds.sql`
- `mysql -u root -p drivein < database/mysql/004_enhancements.sql`
- `mysql -u root -p drivein < database/mysql/005_seeds_min.sql`
 - `mysql -u root -p drivein < database/mysql/006_quality.sql`

Observações de compatibilidade:
- MySQL 8.0 recomendado (uso de `ADD COLUMN IF NOT EXISTS` em `004_enhancements.sql`).
- Para MySQL 5.7, remova/ajuste trechos não suportados ou execute comandos equivalentes manualmente.

## Consultas de Demonstração (10 exemplos)
- Arquivo: `database/mysql/queries_demo.sql`.
- Cobre: funções de agregação, `GROUP BY`, `HAVING`, `JOIN`, `LIKE`, `BETWEEN`.
- Execução rápida: `mysql -u root -p drivein < database/mysql/queries_demo.sql`.

## Docker & Compose
- Arquivos:
  - `Dockerfile` — build e execução do frontend (Next.js) na porta `3337`.
  - `docker-compose.yml` — serviços de `db` (MySQL 8.0), `adminer` e `web`.
  - `database/docker-init/00-init.sh` — aplica migrations `001`–`006` automaticamente na primeira subida.
  - `.env.example` — exemplo de variáveis de ambiente para o frontend.
- Subir tudo:
  - `docker compose up -d` (aguarde o `db` ficar saudável; as migrations rodam automaticamente)
  - Acesse `http://localhost:3337` (site) e `http://localhost:8080` (Adminer)
- Variáveis úteis:
  - O serviço `web` define `NEXT_PUBLIC_ADMIN_EMAILS="admin@drivein.local,vendedor@drivein.local"`.
  - O serviço `web` também define `API_BASE_URL` e `NEXT_PUBLIC_API_BASE_URL` vazios por padrão para evitar chamadas a APIs externas durante a apresentação.
  - O MySQL expõe `3306`, usuário `root` e senha `root` (ajuste no compose conforme necessário).
- Configuração de ambiente (automático):
  - Opcionalmente, copie `.env.example` para `.env.local` se for executar fora do Docker.
  - Em Docker, as variáveis necessárias já estão definidas pelo compose.
- Rodar somente banco + Adminer:
  - `docker compose up -d db adminer`
- Parar serviços:
  - `docker compose down` (mantém volume `db_data` com dados; use `-v` para apagar)

## Aplicação Web (Next.js)
Instalação e execução:
- `pnpm install` (ou `npm install`)
- `pnpm dev -- -p 3337` (ou `npm run dev -- -p 3337`)
- Acesse `http://localhost:3337`

Autenticação e acesso ao painel admin:
- A autenticação usa NextAuth (Credentials) conforme `lib/auth.ts` e `auth.config.ts`.
- O guard de admin permite acesso se o e-mail estiver na lista `NEXT_PUBLIC_ADMIN_EMAILS` (separado por vírgulas) ou se o domínio terminar com `@drivein.local` (MVP).
- Configure variáveis de ambiente do frontend (ex.: `.env.local`):
  - `NEXT_PUBLIC_ADMIN_EMAILS=admin@drivein.local,vendedor@drivein.local`
  - Faça login com um dos e-mails seeds para acessar `/admin`.

## Aplicação de Inserção (Java)
Arquivo: `backend-java/src/main/java/com/drivein/locadora/demo/InsertDemo.java`
- Insere um usuário e um endereço no MySQL via JDBC.
- Configure variáveis de ambiente:
  - `DB_URL=jdbc:mysql://localhost:3306/drivein?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`
  - `DB_USER=root`
  - `DB_PASS=senha`
- Execução sugerida:
  - Via IDE (IntelliJ/Eclipse/VS Code): executar a classe `InsertDemo`.
  - Via Maven (se tiver `exec-maven-plugin` configurado): `mvn -Dexec.mainClass=com.drivein.locadora.demo.InsertDemo exec:java`
  - Alternativa: empacotar e executar com classpath incluindo o MySQL Connector.

## Documentação e Slides
- Diagrama ER (Mermaid): `docs/er_diagram.mmd` — renderize no Mermaid Live Editor ou `mmdc`.
 https://www.mermaidchart.com/d/3d9e4614-62e2-43f0-b6ee-e4f524878236

- Modelo lógico (resumo): `docs/logical_model.md`.

## Painel Administrativo
- Layout e navegação: `app/admin/layout.tsx` e `components/admin/admin-nav.tsx`.
- Guard de acesso: `components/admin/admin-guard.tsx`.
- Páginas:
  - `app/admin/page.tsx` (Dashboard), `app/admin/estoque/page.tsx`, `app/admin/vendas/page.tsx`, `app/admin/compras/page.tsx`, `app/admin/servicos/page.tsx`, `app/admin/relatorios/page.tsx`.

## Entrega ao Professor
- Base de dados: enviar a pasta `database/mysql/` ou um dump (`mysqldump -u <user> -p drivein > drivein.sql`).
 - Alternativa via Docker: após `docker compose up`, gerar dump com `docker exec drivein-mysql mysqldump -uroot -proot drivein > drivein.sql`.
- Consultas: `database/mysql/queries_demo.sql` com enunciados e SQL.
- Aplicação de inserção: código em `backend-java/.../InsertDemo.java` (capturas de tela da execução ajudam).

## Observações
- Seeds usam `ON DUPLICATE KEY UPDATE` em pontos estratégicos para reexecução segura.
- Triggers ajustam `vehicles.status` conforme `services` e `sales` (manutenção vs. vendido).
- Views (ex.: `vw_monthly_sales`) já prontas para relatórios mensais.
 - `006_quality.sql` adiciona checks (não-negatividade), precisão monetária e trigger de comissão (2,5%).

