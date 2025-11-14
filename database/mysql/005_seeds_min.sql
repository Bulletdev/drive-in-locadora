-- Drive-In Locadora — Seeds mínimos complementares
-- Objetivo: garantir pelo menos 3 linhas nas principais tabelas para fins didáticos
-- Este script pressupõe que 001_init.sql, 002_erp.sql, 003_seeds.sql e 004_enhancements.sql já foram executados.

START TRANSACTION;

/* Branches (filiais) */
INSERT INTO branches (name, city, state)
VALUES
('Matriz Centro', 'São Paulo', 'SP'),
('Filial Sul', 'São Paulo', 'SP'),
('Filial Norte', 'São Paulo', 'SP')
ON DUPLICATE KEY UPDATE city = VALUES(city), state = VALUES(state);

/* Usuários adicionais (admin e cliente) */
INSERT INTO users (name, email, password_hash, role, cpf, phone, created_at, active)
VALUES
('Admin Demo', 'admin@drivein.local', '123456', 'admin', '333.333.333-33', '+55 11 90000-0003', NOW(), 1),
('Cliente Dois', 'cliente2@drivein.local', '123456', 'cliente', '444.444.444-44', '+55 11 90000-0004', NOW(), 1),
('Funcionario Demo', 'funcionario@drivein.local', '123456', 'vendedor', '555.555.555-55', '+55 11 90000-0005', NOW(), 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), active = VALUES(active), password_hash = VALUES(password_hash);

/* Endereços para os novos usuários */
INSERT INTO addresses (user_id, street, number, complement, district, city, state, zip_code)
SELECT u.id, 'Rua do Admin', '10', NULL, 'Centro', 'São Paulo', 'SP', '01000-100'
FROM users u WHERE u.email = 'admin@drivein.local'
ON DUPLICATE KEY UPDATE street = VALUES(street);

INSERT INTO addresses (user_id, street, number, complement, district, city, state, zip_code)
SELECT u.id, 'Rua do Cliente 2', '20', 'Ap 2', 'Vila', 'São Paulo', 'SP', '02000-200'
FROM users u WHERE u.email = 'cliente2@drivein.local'
ON DUPLICATE KEY UPDATE street = VALUES(street);

INSERT INTO addresses (user_id, street, number, complement, district, city, state, zip_code)
SELECT u.id, 'Rua do Funcionario', '30', NULL, 'Bairro', 'São Paulo', 'SP', '03000-300'
FROM users u WHERE u.email = 'funcionario@drivein.local'
ON DUPLICATE KEY UPDATE street = VALUES(street);

/* CNH para os novos usuários */
INSERT INTO driver_licenses (user_id, license_number, category, issue_date, expiry_date)
SELECT u.id, 'SP0000001', 'B', DATE('2018-01-01'), DATE('2028-01-01')
FROM users u WHERE u.email = 'admin@drivein.local'
ON DUPLICATE KEY UPDATE license_number = VALUES(license_number);

INSERT INTO driver_licenses (user_id, license_number, category, issue_date, expiry_date)
SELECT u.id, 'SP0000002', 'B', DATE('2019-02-02'), DATE('2029-02-02')
FROM users u WHERE u.email = 'cliente2@drivein.local'
ON DUPLICATE KEY UPDATE license_number = VALUES(license_number);

INSERT INTO driver_licenses (user_id, license_number, category, issue_date, expiry_date)
SELECT u.id, 'SP0000003', 'B', DATE('2020-03-03'), DATE('2030-03-03')
FROM users u WHERE u.email = 'funcionario@drivein.local'
ON DUPLICATE KEY UPDATE license_number = VALUES(license_number);

/* Fornecedores */
INSERT INTO suppliers (name, cnpj, contact_email, contact_phone)
VALUES
('Toyota Brasil', '12.345.678/0001-10', 'forn.toyota@exemplo.com', '+55 11 4000-0001'),
('Jeep Brasil', '23.456.789/0001-20', 'forn.jeep@exemplo.com', '+55 11 4000-0002'),
('Audi Brasil', '34.567.890/0001-30', 'forn.audi@exemplo.com', '+55 11 4000-0003')
ON DUPLICATE KEY UPDATE contact_email = VALUES(contact_email), contact_phone = VALUES(contact_phone);

/* Compras (aquisição de veículos) */
-- Vincula alguns veículos a compras de fornecedores
INSERT INTO purchases (supplier_id, vehicle_id, purchase_date, cost, status)
SELECT s.id, v.id, DATE('2023-05-10'), 80000.00, 'concluida'
FROM suppliers s JOIN vehicles v ON v.vin = '9BG1234567K000003'
WHERE s.name = 'Toyota Brasil'
ON DUPLICATE KEY UPDATE cost = VALUES(cost), status = VALUES(status);

INSERT INTO purchases (supplier_id, vehicle_id, purchase_date, cost, status)
SELECT s.id, v.id, DATE('2023-06-15'), 140000.00, 'concluida'
FROM suppliers s JOIN vehicles v ON v.vin = '3HGCM56457G000002'
WHERE s.name = 'Jeep Brasil'
ON DUPLICATE KEY UPDATE cost = VALUES(cost), status = VALUES(status);

INSERT INTO purchases (supplier_id, vehicle_id, purchase_date, cost, status)
SELECT s.id, v.id, DATE('2023-07-20'), 230000.00, 'concluida'
FROM suppliers s JOIN vehicles v ON v.vin = 'WAUNF78K49A000007'
WHERE s.name = 'Audi Brasil'
ON DUPLICATE KEY UPDATE cost = VALUES(cost), status = VALUES(status);

/* Atualiza alguns veículos com branch e cost */
UPDATE vehicles SET branch_id = (SELECT id FROM branches WHERE name = 'Matriz Centro'), cost = 75000.00
WHERE vin = '9BG1234567K000003'; -- Onix

UPDATE vehicles SET branch_id = (SELECT id FROM branches WHERE name = 'Filial Sul'), cost = 140000.00
WHERE vin = '3HGCM56457G000002'; -- HR-V

UPDATE vehicles SET branch_id = (SELECT id FROM branches WHERE name = 'Filial Norte'), cost = 230000.00
WHERE vin = 'WAUNF78K49A000007'; -- A5

/* Serviços (manutenção) em 2 veículos */
INSERT INTO services (vehicle_id, user_id, service_date, description, cost)
SELECT v.id, (SELECT id FROM users WHERE email = 'funcionario@drivein.local'), DATE('2024-02-01'), 'Troca de óleo', 250.00 FROM vehicles v WHERE v.vin = '9BG1234567K000003'
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO services (vehicle_id, user_id, service_date, description, cost)
SELECT v.id, (SELECT id FROM users WHERE email = 'funcionario@drivein.local'), DATE('2024-03-10'), 'Revisão geral', 1200.00 FROM vehicles v WHERE v.vin = 'WAUNF78K49A000007'
ON DUPLICATE KEY UPDATE description = VALUES(description);

/* Vendas adicionais para atingir 3 linhas em sales e payments */
-- Venda 2: cliente2 compra Onix
INSERT INTO sales (user_id, vehicle_id, seller_id, sale_date, total_price, payment_method, status)
SELECT (SELECT id FROM users WHERE email = 'cliente2@drivein.local'),
       v.id,
       (SELECT id FROM users WHERE email = 'funcionario@drivein.local'),
       DATE('2024-04-05'), 85000.00, 'a_vista', 'pendente'
FROM vehicles v WHERE v.vin = '9BG1234567K000003'
ON DUPLICATE KEY UPDATE total_price = VALUES(total_price), status = VALUES(status);

-- Pagamento da Venda 2
INSERT INTO payments (sale_id, amount, payment_date, method)
SELECT s.id, 85000.00, DATE('2024-04-06'), 'a_vista'
FROM sales s
JOIN vehicles v ON v.id = s.vehicle_id
WHERE v.vin = '9BG1234567K000003'
ON DUPLICATE KEY UPDATE amount = VALUES(amount), method = VALUES(method);

-- Venda 3: cliente demo compra Audi A5
INSERT INTO sales (user_id, vehicle_id, seller_id, sale_date, total_price, payment_method, status)
SELECT (SELECT id FROM users WHERE email = 'cliente@drivein.local'),
       v.id,
       (SELECT id FROM users WHERE email = 'vendedor@drivein.local'),
       DATE('2024-04-10'), 260000.00, 'a_vista', 'pendente'
FROM vehicles v WHERE v.vin = 'WAUNF78K49A000007'
ON DUPLICATE KEY UPDATE total_price = VALUES(total_price), status = VALUES(status);

-- Pagamento da Venda 3
INSERT INTO payments (sale_id, amount, payment_date, method)
SELECT s.id, 260000.00, DATE('2024-04-11'), 'a_vista'
FROM sales s
JOIN vehicles v ON v.id = s.vehicle_id
WHERE v.vin = 'WAUNF78K49A000007'
ON DUPLICATE KEY UPDATE amount = VALUES(amount), method = VALUES(method);

-- Atualiza vendas 2 e 3 para concluídas (dispara trigger de status do veículo)
UPDATE sales s
JOIN vehicles v ON v.id = s.vehicle_id
SET s.status = 'concluida'
WHERE v.vin IN ('9BG1234567K000003','WAUNF78K49A000007');

COMMIT;