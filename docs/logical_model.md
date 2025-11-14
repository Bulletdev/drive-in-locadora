# Drive-In Locadora — Modelo Lógico (Resumo)

Este documento descreve as principais entidades, chaves e relacionamentos do banco de dados da locadora, conforme scripts 

`002_erp.sql` e `004_enhancements.sql`.

## Entidades e Chaves
- `manufacturers (id PK)`: nome, país
- `models (id PK, manufacturer_id FK)`: nome, ano, categoria
- `vehicles (id PK, model_id FK)`: `vin UNIQUE`, ano, preço, `mileage BIGINT`, status, `branch_id FK`, custo, data entrada
- `users (id PK)`: `email UNIQUE`, `cpf UNIQUE`, nome, senha, `role`, ativo, `last_login`
- `addresses (id PK, user_id FK)`: endereço completo
- `driver_licenses (id PK, user_id FK)`: `license_number UNIQUE`, categoria, emissão, validade
- `sales (id PK, vehicle_id FK, buyer_id FK, seller_id FK)`: data, total, status, `financing_plan_id FK`
- `payments (id PK, sale_id FK)`: data, valor, método, status
- `commissions (id PK, sale_id FK, seller_id FK)`: valor, data
- `invoices (id PK, sale_id FK)`: emissão, subtotal, impostos (ICMS, PIS, COFINS), total, status
- `suppliers (id PK)`: `cnpj UNIQUE`, contato
- `purchases (id PK, supplier_id FK)`: data, custo total, observações
- `services (id PK, vehicle_id FK)`: data, descrição, custo, status
- `branches (id PK)`: dados de filial
- `vehicle_photos (id PK, vehicle_id FK)`: URL, legenda
- `vehicle_documents (id PK, vehicle_id FK)`: URL, tipo
- `permissions (id PK)`: `code UNIQUE`, descrição
- `roles_permissions (id PK, user_id FK, permission_id FK)`: mapeamento usuário→permissão
- `audit_logs (id PK, actor_user_id FK)`: ação, entidade, `entity_id`, data, detalhes (JSON)

## Relacionamentos
- Fabricante 1—N Modelos; Modelo 1—N Veículos
- Usuário 1—N Endereços; Usuário 1—N CNHs
- Veículo 1—N Vendas; Venda 1—N Pagamentos; Venda 1—N Comissões; Venda 1—N Notas Fiscais
- Fornecedor 1—N Compras; Compra pode referenciar veículos adquiridos (via atualizações)
- Veículo 1—N Serviços; Filial 1—N Veículos
- Usuário 1—N (como ator) Logs de auditoria
- Usuário N—N Permissões (via tabela de junção)

## Regras e Triggers (principais)
- `services` open/close ajusta `vehicles.status` para `maintenance`/`available`
- `sales.status` concluída define `vehicles.status` para `sold` (vendido)
- `purchases` podem ajustar `vehicles.cost`/`entry_date` quando vinculados

## Índices recomendados
- `vehicles (vin UNIQUE)`, `vehicles (status)`, `vehicles (branch_id)`
- `sales (sale_date)`, `payments (payment_date)`
- `users (email UNIQUE)`, `users (cpf UNIQUE)`

## Vistas (views)
- `vw_monthly_sales`: ano, mês, valor total de vendas/pagamentos
