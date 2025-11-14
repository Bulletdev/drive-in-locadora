-- Seed alinhado ao modelo ERP (001_init.sql + 002_erp.sql)
-- Removidos CREATEs duplicados; inserts idempotentes e compatíveis com chaves únicas/enum

-- Fabricantes (usa UNIQUE em manufacturers.name)
INSERT INTO `manufacturers` (`name`)
VALUES ('Toyota'),('Honda'),('Chevrolet'),('Jeep'),('Hyundai'),('Nissan'),('Audi')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Modelos (idempotente pelo par manufacturer_id+name+year)
INSERT INTO `vehicle_models` (`manufacturer_id`, `name`, `year`)
SELECT m.`id`, v.`name`, v.`year`
FROM (
  SELECT 'Toyota' AS `manufacturer`, 'Corolla' AS `name`, 2022 AS `year`
  UNION ALL SELECT 'Honda','HR-V',2021
  UNION ALL SELECT 'Chevrolet','Onix',2023
  UNION ALL SELECT 'Jeep','Compass',2022
  UNION ALL SELECT 'Hyundai','HB20',2023
  UNION ALL SELECT 'Nissan','Kicks',2022
  UNION ALL SELECT 'Audi','A5',2020
) v
JOIN `manufacturers` m ON m.`name` = v.`manufacturer`
WHERE NOT EXISTS (
  SELECT 1 FROM `vehicle_models` vm
  WHERE vm.`manufacturer_id` = m.`id` AND vm.`name` = v.`name` AND vm.`year` = v.`year`
);

-- Veículos (usa UNIQUE em vehicles.vin)
INSERT INTO `vehicles` (`model_id`,`vin`,`color`,`mileage`,`price`,`cost`,`status`,`entry_date`,`features_json`)
SELECT vm.`id`, v.`vin`, v.`color`, v.`mileage`, v.`price`, v.`cost`, 'disponivel', CURDATE(),
       JSON_OBJECT('transmissao', v.`trans`, 'combustivel', v.`fuel`)
FROM (
  SELECT 'Corolla' AS `model`, 'JTDBR32E820000001' AS `vin`, 'Prata' AS `color`, 12000 AS `mileage`, 120000.00 AS `price`, 95000.00 AS `cost`, 'Automática' AS `trans`, 'Flex' AS `fuel`
  UNION ALL SELECT 'HR-V','3HGCM56457G000002','Preto',8000,135000.00,105000.00,'Automática','Gasolina'
  UNION ALL SELECT 'Onix','9BG1234567K000003','Branco',5000,78000.00,60000.00,'Manual','Flex'
  UNION ALL SELECT 'Compass','1J4GL48K54W000004','Cinza',15000,168000.00,140000.00,'Automática','Diesel'
  UNION ALL SELECT 'HB20','KMHCU41CBEU000005','Azul',3000,85000.00,65000.00,'Manual','Flex'
  UNION ALL SELECT 'Kicks','3N1CP5CU1KL000006','Vermelho',7000,110000.00,90000.00,'Automática','Gasolina'
  UNION ALL SELECT 'A5','WAUNF78K49A000007','Prata',22000,230000.00,190000.00,'Automática','Gasolina'
) v
JOIN `vehicle_models` vm ON vm.`name` = v.`model`
ON DUPLICATE KEY UPDATE `color`=VALUES(`color`), `mileage`=VALUES(`mileage`), `price`=VALUES(`price`), `cost`=VALUES(`cost`);

-- Usuários (001_init.sql + coluna role adicionada em 002_erp.sql)
INSERT INTO `users` (`name`,`email`,`phone`,`cpf`,`password_hash`,`birth_date`,`role`)
VALUES
  ('Vendedor Demo','vendedor@drivein.local','(11) 90000-0000','111.111.111-11','123456','1985-05-10','vendedor'),
  ('Cliente Demo','cliente@drivein.local','(11) 91111-1111','222.222.222-22','123456','1992-08-20','cliente')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`),`phone`=VALUES(`phone`),`birth_date`=VALUES(`birth_date`),`role`=VALUES(`role`),`password_hash`=VALUES(`password_hash`);

-- Endereços (addresses existe em 001_init.sql)
INSERT INTO `addresses` (`user_id`,`street`,`number`,`complement`,`neighborhood`,`city`,`state`,`cep`)
SELECT u.`id`, a.`street`, a.`number`, a.`complement`, a.`neighborhood`, a.`city`, a.`state`, a.`cep`
FROM (
  SELECT 'vendedor@drivein.local' AS email, 'Rua das Vendas' AS street, '100' AS number, NULL AS complement, 'Centro' AS neighborhood, 'São Paulo' AS city, 'SP' AS state, '01000-000' AS cep
  UNION ALL
  SELECT 'cliente@drivein.local','Av. dos Clientes','200','Ap 12','Jardins','São Paulo','SP','01400-000'
) a
JOIN `users` u ON u.`email` = a.`email`
ON DUPLICATE KEY UPDATE `street`=VALUES(`street`),`number`=VALUES(`number`),`complement`=VALUES(`complement`),`neighborhood`=VALUES(`neighborhood`),`city`=VALUES(`city`),`state`=VALUES(`state`),`cep`=VALUES(`cep`);

-- CNH (driver_licenses existe em 001_init.sql)
INSERT INTO `driver_licenses` (`user_id`,`cnh_number`,`cnh_expiry`,`cnh_category`)
SELECT u.`id`, d.`cnh_number`, d.`cnh_expiry`, d.`cnh_category`
FROM (
  SELECT 'vendedor@drivein.local' AS email, 'SP1234567' AS cnh_number, DATE_ADD(CURDATE(), INTERVAL 365 DAY) AS cnh_expiry, 'B' AS cnh_category
  UNION ALL
  SELECT 'cliente@drivein.local','SP7654321',DATE_ADD(CURDATE(), INTERVAL 540 DAY),'B'
) d
JOIN `users` u ON u.`email` = d.`email`
ON DUPLICATE KEY UPDATE `cnh_expiry`=VALUES(`cnh_expiry`),`cnh_category`=VALUES(`cnh_category`);

-- Test drive (idempotente por combinação usuário+veículo)
INSERT INTO `test_drives` (`user_id`,`vehicle_id`,`scheduled_at`,`status`,`notes`)
SELECT u.`id`, v.`id`, DATE_ADD(NOW(), INTERVAL 2 DAY), 'agendado', 'Teste de demonstração'
FROM `users` u
JOIN `vehicles` v ON v.`vin` = 'JTDBR32E820000001'
WHERE u.`email` = 'cliente@drivein.local'
AND NOT EXISTS (
  SELECT 1 FROM `test_drives` td WHERE td.`user_id`=u.`id` AND td.`vehicle_id`=v.`id` AND td.`scheduled_at`=DATE_ADD(NOW(), INTERVAL 2 DAY)
);

-- Venda (idempotente por user+vehicle+sale_date)
INSERT INTO `sales` (`user_id`,`vehicle_id`,`seller_id`,`sale_date`,`total_price`,`payment_method`,`status`)
SELECT c.`id`, v.`id`, s.`id`, CURDATE(), v.`price`, 'a_vista', 'pendente'
FROM `users` c
JOIN `users` s ON s.`email` = 'vendedor@drivein.local'
JOIN `vehicles` v ON v.`vin` = '3HGCM56457G000002'
WHERE c.`email` = 'cliente@drivein.local'
AND NOT EXISTS (
  SELECT 1 FROM `sales` sl WHERE sl.`user_id`=c.`id` AND sl.`vehicle_id`=v.`id` AND sl.`sale_date`=CURDATE()
);

-- Pagamento (idempotente por sale_id)
INSERT INTO `payments` (`sale_id`,`amount`,`payment_date`,`method`)
SELECT sl.`id`, sl.`total_price`, CURDATE(), 'a_vista'
FROM `sales` sl
JOIN `users` c ON c.`id` = sl.`user_id` AND c.`email` = 'cliente@drivein.local'
JOIN `vehicles` v ON v.`id` = sl.`vehicle_id` AND v.`vin` = '3HGCM56457G000002'
WHERE NOT EXISTS (
  SELECT 1 FROM `payments` p WHERE p.`sale_id`=sl.`id`
);

-- Comissão (idempotente por sale_id+seller_id)
INSERT INTO `commissions` (`sale_id`,`seller_id`,`percentage`,`amount`)
SELECT sl.`id`, sl.`seller_id`, 2.50, ROUND(sl.`total_price` * 0.025, 2)
FROM `sales` sl
JOIN `users` s ON s.`id` = sl.`seller_id` AND s.`email` = 'vendedor@drivein.local'
WHERE NOT EXISTS (
  SELECT 1 FROM `commissions` c WHERE c.`sale_id`=sl.`id` AND c.`seller_id`=sl.`seller_id`
);

-- Nota fiscal (usa tabela de 002_erp.sql e é idempotente por sale_id)
INSERT INTO `invoices` (`sale_id`,`invoice_number`,`issue_date`,`tax_amount`,`sefaz_key`,`sefaz_status`)
SELECT sl.`id`, CONCAT('INV-', sl.`id`), CURDATE(), ROUND(sl.`total_price` * 0.12, 2), NULL, 'emitida'
FROM `sales` sl
JOIN `users` c ON c.`id` = sl.`user_id` AND c.`email` = 'cliente@drivein.local'
WHERE NOT EXISTS (
  SELECT 1 FROM `invoices` i WHERE i.`sale_id`=sl.`id`
);

-- Opções e vínculo veículo<->opção (tabelas definidas em 002_erp.sql)
INSERT INTO `options` (`name`) VALUES ('Ar condicionado'),('Airbag'),('ABS'),('Bluetooth'),('Câmera de ré')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Vincula algumas opções ao Corolla (idempotente pela PK composta)
INSERT INTO `vehicle_options` (`vehicle_id`,`option_id`)
SELECT v.`id`, o.`id`
FROM `vehicles` v
JOIN `options` o ON o.`name` IN ('Ar condicionado','Airbag','ABS')
WHERE v.`vin` = 'JTDBR32E820000001'
AND NOT EXISTS (
  SELECT 1 FROM `vehicle_options` vo WHERE vo.`vehicle_id`=v.`id` AND vo.`option_id`=o.`id`
);

