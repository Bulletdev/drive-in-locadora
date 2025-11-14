-- esquema inicial MySQL schema for Drive-In Locadora (users, addresses, CNH)
-- Engine: InnoDB, charset utf8mb4

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  cpf CHAR(14) NOT NULL, -- formatted CPF (000.000.000-00)
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  birth_date DATE NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_cpf (cpf)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Address table (one-to-one for now; can evolve to one-to-many)
CREATE TABLE IF NOT EXISTS addresses (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  street VARCHAR(160) NOT NULL,
  number VARCHAR(32) NOT NULL,
  complement VARCHAR(160) NULL,
  neighborhood VARCHAR(120) NULL,
  city VARCHAR(120) NOT NULL,
  state CHAR(2) NOT NULL,
  cep CHAR(9) NOT NULL, -- formatted CEP (00000-000)
  PRIMARY KEY (id),
  UNIQUE KEY uq_addresses_user (user_id),
  KEY idx_addresses_city_state (city, state),
  KEY idx_addresses_cep (cep),
  CONSTRAINT fk_addresses_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Driver License (CNH)
CREATE TABLE IF NOT EXISTS driver_licenses (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  cnh_number VARCHAR(20) NOT NULL,
  cnh_expiry DATE NOT NULL,
  cnh_category VARCHAR(10) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_driver_license_user (user_id),
  UNIQUE KEY uq_driver_license_number (cnh_number),
  KEY idx_driver_license_expiry (cnh_expiry),
  CONSTRAINT fk_driver_license_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
