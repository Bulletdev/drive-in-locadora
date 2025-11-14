-- Drive-In Locadora — Consultas de Demonstração (10 exemplos)
-- Cada consulta traz: enunciado, SQL e observações sobre resultado esperado
-- Pré-requisito: executar 001_init.sql, 002_erp.sql, 003_seeds.sql e 004_enhancements.sql (opcionalmente 005_seeds_min.sql)

/* 1) Total de veículos por status (GROUP BY) */
-- Enunciado: Quantos veículos temos por status?
SELECT status, COUNT(*) AS total
FROM vehicles
GROUP BY status
ORDER BY total DESC;
-- Resultado esperado: linhas por status (disponivel, reservado, manutencao, vendido)

/* 2) Veículos por fabricante com JOIN */
-- Enunciado: Traga modelo, fabricante e ano de todos os veículos
SELECT v.id, vm.name AS modelo, mf.name AS fabricante, vm.year
FROM vehicles v
JOIN vehicle_models vm ON vm.id = v.model_id
JOIN manufacturers mf ON mf.id = vm.manufacturer_id
ORDER BY fabricante, modelo, vm.year;

/* 3) Busca com LIKE */
-- Enunciado: Liste veículos cujo modelo contenha 'corolla' (case-insensitive)
SELECT v.id, vm.name AS modelo, v.vin, vm.year
FROM vehicles v
JOIN vehicle_models vm ON vm.id = v.model_id
WHERE LOWER(vm.name) LIKE '%corolla%'
ORDER BY vm.year DESC;

/* 4) Filtro por preço BETWEEN */
-- Enunciado: Veículos com preço entre 100.000 e 300.000
SELECT v.id, vm.name AS modelo, v.price
FROM vehicles v
JOIN vehicle_models vm ON vm.id = v.model_id
WHERE v.price BETWEEN 100000 AND 300000
ORDER BY v.price ASC;

