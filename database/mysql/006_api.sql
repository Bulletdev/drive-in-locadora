-- API tables for vehicles and reservations (frontend shape)

CREATE TABLE IF NOT EXISTS test.api_vehicles (
  id VARCHAR(160) NOT NULL,
  name VARCHAR(160) NOT NULL,
  category VARCHAR(60) NOT NULL,
  year INT NOT NULL,
  images_json TEXT NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  transmission VARCHAR(60) NOT NULL,
  passengers INT NOT NULL,
  fuel VARCHAR(60) NOT NULL,
  available TINYINT(1) NOT NULL DEFAULT 1,
  doors INT NULL,
  air_conditioning TINYINT(1) NULL,
  description TEXT NULL,
  features_json TEXT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS test.api_reservations (
  id VARCHAR(64) NOT NULL,
  car_id VARCHAR(160) NOT NULL,
  pickup_date VARCHAR(32) NULL,
  return_date VARCHAR(32) NULL,
  pickup_location VARCHAR(160) NULL,
  return_location VARCHAR(160) NULL,
  selected_extras_json TEXT NULL,
  customer_name VARCHAR(160) NULL,
  customer_email VARCHAR(190) NULL,
  customer_phone VARCHAR(32) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_email VARCHAR(190) NULL,
  PRIMARY KEY (id),
  KEY idx_api_reservations_user (user_email),
  CONSTRAINT fk_api_reservations_vehicle FOREIGN KEY (car_id) REFERENCES test.api_vehicles(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed vehicles consistent with frontend slugs
INSERT INTO test.api_vehicles (id, name, category, year, images_json, price_per_day, transmission, passengers, fuel, available, doors, air_conditioning, description, features_json) VALUES
('toyota-corolla-2024', 'Toyota Corolla', 'Sedan', 2024, JSON_ARRAY('/cars/toyota-corolla-1.jpg','/cars/toyota-corolla-2.jpg','/cars/toyota-corolla-3.jpg','/cars/toyota-corolla-4.jpg'), 250.00, 'Automática', 5, 'Flex', 1, 4, 1, 'O Toyota Corolla 2024 oferece conforto, tecnologia e eficiência. Ideal para viagens e uso urbano.', JSON_ARRAY('Ar-condicionado','Direção elétrica','Central multimídia','Android Auto e Apple CarPlay')),
('jeep-compass-2024', 'Jeep Compass', 'SUV', 2024, JSON_ARRAY('/cars/jeep-compass-1.jpg','/cars/jeep-compass-2.jpg','/cars/jeep-compass-3.jpg','/cars/jeep-compass-4.jpg'), 320.00, 'Automática', 5, 'Diesel', 1, 4, 1, 'SUV médio tecnológico com design icônico e interior premium.', JSON_ARRAY('Ar-condicionado dual zone','Painel digital','Android Auto e Apple CarPlay sem fio')),
('chevrolet-camaro-2023', 'Chevrolet Camaro', 'Esportivo', 2023, JSON_ARRAY('/cars/chevrolet-camaro-1.jpg','/cars/chevrolet-camaro-2.jpg','/cars/chevrolet-camaro-3.jpg','/cars/chevrolet-camaro-4.jpg'), 500.00, 'Automática', 4, 'Gasolina', 1, 2, 1, 'Muscle car com motor V8 e desempenho emocionante.', JSON_ARRAY('Modo Esporte','Controle de tração','Rodas de liga 20"')),
('honda-hrv-2023', 'Honda HR-V', 'SUV', 2023, JSON_ARRAY('/cars/honda-hrv-1.jpg','/cars/honda-hrv-2.jpg','/cars/honda-hrv-3.jpg','/cars/honda-hrv-4.jpg'), 280.00, 'Automática', 5, 'Gasolina', 1, 4, 1, 'SUV compacto versátil, ideal para famílias.', JSON_ARRAY('Ar-condicionado','Direção elétrica','Central multimídia')),
('hyundai-hb20-2023', 'Hyundai HB20', 'Hatch', 2023, JSON_ARRAY('/cars/hyundai-hb20-1.jpg','/cars/hyundai-hb20-2.jpg','/cars/hyundai-hb20-3.jpg','/cars/hyundai-hb20-4.jpg'), 180.00, 'Manual', 5, 'Flex', 1, 4, 1, 'Hatch moderno e econômico para o dia a dia.', JSON_ARRAY('Ar-condicionado','Direção elétrica')),
('nissan-kicks-2022', 'Nissan Kicks', 'SUV', 2022, JSON_ARRAY('/cars/nissan-kicks-1.jpg','/cars/nissan-kicks-2.jpg','/cars/nissan-kicks-3.jpg','/cars/nissan-kicks-4.jpg'), 220.00, 'Automática', 5, 'Gasolina', 1, 4, 1, 'SUV urbano com design marcante.', JSON_ARRAY('Ar-condicionado','Controle de estabilidade')),
('chevrolet-onix-2023', 'Chevrolet Onix', 'Hatch', 2023, JSON_ARRAY('/cars/chevrolet-onix-1.jpg','/cars/chevrolet-onix-2.jpg','/cars/chevrolet-onix-3.jpg','/cars/chevrolet-onix-4.jpg'), 170.00, 'Manual', 5, 'Flex', 1, 4, 1, 'Compacto prático e eficiente.', JSON_ARRAY('Ar-condicionado','Direção elétrica')),
('audi-a5-2020', 'Audi A5', 'Coupe', 2020, JSON_ARRAY('/cars/audi-a5-1.jpg','/cars/audi-a5-2.jpg','/cars/audi-a5-3.jpg','/cars/audi-a5-4.jpg'), 450.00, 'Automática', 4, 'Gasolina', 1, 2, 1, 'Cupê de luxo com acabamento premium.', JSON_ARRAY('Interior em couro','Assistentes de condução'))
ON DUPLICATE KEY UPDATE name=VALUES(name), category=VALUES(category), year=VALUES(year), images_json=VALUES(images_json), price_per_day=VALUES(price_per_day), transmission=VALUES(transmission), passengers=VALUES(passengers), fuel=VALUES(fuel), available=VALUES(available), doors=VALUES(doors), air_conditioning=VALUES(air_conditioning), description=VALUES(description), features_json=VALUES(features_json);