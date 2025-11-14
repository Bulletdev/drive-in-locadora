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

/* 5) Média de preço por fabricante (AVG + GROUP BY) */
-- Enunciado: Qual o preço médio dos veículos por fabricante?
SELECT mf.name AS fabricante, ROUND(AVG(v.price), 2) AS preco_medio
FROM vehicles v
JOIN vehicle_models vm ON vm.id = v.model_id
JOIN manufacturers mf ON mf.id = vm.manufacturer_id
GROUP BY fabricante
ORDER BY preco_medio DESC;
-- Resultado esperado: uma linha por fabricante com preço médio

/* 6) Distribuição de veículos por ano (GROUP BY) */
-- Enunciado: Quantos veículos temos por ano de fabricação?
SELECT vm.year AS ano, COUNT(*) AS total
FROM vehicles v
JOIN vehicle_models vm ON vm.id = v.model_id
GROUP BY ano
ORDER BY ano DESC;
-- Resultado esperado: uma linha por ano

/* 7) Faixas de preço (CASE + GROUP BY) */
-- Enunciado: Quantos veículos em faixas de preço (baixo/médio/alto)?
SELECT CASE
         WHEN v.price < 100000 THEN 'baixo'
         WHEN v.price < 200000 THEN 'medio'
         ELSE 'alto'
       END AS faixa_preco,
       COUNT(*) AS total
FROM vehicles v
GROUP BY faixa_preco
ORDER BY faixa_preco;
-- Resultado esperado: 3 linhas (baixo, medio, alto) conforme dados

/* 8) Top 5 veículos mais caros (ORDER BY + LIMIT) */
-- Enunciado: Liste os 5 veículos mais caros com fabricante e modelo
SELECT v.id, mf.name AS fabricante, vm.name AS modelo, v.price
FROM vehicles v
JOIN vehicle_models vm ON vm.id = v.model_id
JOIN manufacturers mf ON mf.id = vm.manufacturer_id
ORDER BY v.price DESC
LIMIT 5;
-- Resultado esperado: até 5 linhas ordenadas por preço

/* 9) Quilometragem por status (AVG/MIN/MAX) */
-- Enunciado: Média, mínimo e máximo de km por status do veículo
SELECT v.status,
       ROUND(AVG(v.mileage), 1) AS km_medio,
       MIN(v.mileage) AS km_min,
       MAX(v.mileage) AS km_max
FROM vehicles v
GROUP BY v.status
ORDER BY km_medio DESC;
-- Resultado esperado: uma linha por status

/* 10) Quantidade de opções por veículo (JSON_LENGTH em features_json) */
-- Enunciado: Quantas opções (acessórios) cada veículo possui?
SELECT v.id, vm.name AS modelo,
       COALESCE(JSON_LENGTH(v.features_json), 0) AS total_opcoes
FROM vehicles v
JOIN vehicle_models vm ON vm.id = v.model_id
ORDER BY total_opcoes DESC, v.id ASC;
-- Resultado esperado: uma linha por veículo com contagem de opções (0 quando null)

