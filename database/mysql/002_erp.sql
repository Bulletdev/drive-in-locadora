-- ERP-like schema (inventory, sales, services, finance)
-- Engine: InnoDB, default charset utf8mb4

-- 1) Vehicles & Inventory
CREATE TABLE IF NOT EXISTS manufacturers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_manufacturers_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS vehicle_models (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  manufacturer_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  year YEAR NOT NULL,
  PRIMARY KEY (id),
  KEY idx_vehicle_models_manufacturer (manufacturer_id),
  CONSTRAINT fk_vehicle_models_manufacturer
    FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS vehicles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  model_id BIGINT UNSIGNED NOT NULL,
  vin VARCHAR(17) NOT NULL,
  color VARCHAR(50) NOT NULL,
  mileage INT DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  status ENUM('disponivel','vendido','reservado','manutencao') NOT NULL DEFAULT 'disponivel',
  entry_date DATE NOT NULL,
  features_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_vehicles_vin (vin),
  KEY idx_vehicles_model (model_id),
  KEY idx_vehicles_status (status),
  KEY idx_vehicles_price (price),
  KEY idx_vehicles_mileage (mileage),
  CONSTRAINT fk_vehicles_model
    FOREIGN KEY (model_id) REFERENCES vehicle_models(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional normalized vehicle options (if not using JSON)
CREATE TABLE IF NOT EXISTS options (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_options_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS vehicle_options (
  vehicle_id BIGINT UNSIGNED NOT NULL,
  option_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (vehicle_id, option_id),
  CONSTRAINT fk_vehicle_options_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  CONSTRAINT fk_vehicle_options_option FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2) Sales & Orders
-- Extend users with role differentiation
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role ENUM('cliente','vendedor','gerente','admin') NOT NULL DEFAULT 'cliente';

CREATE TABLE IF NOT EXISTS sales (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  vehicle_id BIGINT UNSIGNED NOT NULL,
  seller_id BIGINT UNSIGNED NULL,
  sale_date DATE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  payment_method ENUM('a_vista','financiado','cartao','boleto') NOT NULL,
  status ENUM('pendente','concluida','cancelada') NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_sales_user (user_id),
  KEY idx_sales_vehicle (vehicle_id),
  KEY idx_sales_seller (seller_id),
  CONSTRAINT fk_sales_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_sales_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_sales_seller FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  sale_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  method ENUM('a_vista','financiado','cartao','boleto') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_payments_sale (sale_id),
  CONSTRAINT fk_payments_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Commissions for sellers
CREATE TABLE IF NOT EXISTS commissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  sale_id BIGINT UNSIGNED NOT NULL,
  seller_id BIGINT UNSIGNED NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_commissions_sale (sale_id),
  KEY idx_commissions_seller (seller_id),
  CONSTRAINT fk_commissions_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  CONSTRAINT fk_commissions_seller FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3) Maintenance & Services
CREATE TABLE IF NOT EXISTS services (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  vehicle_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  description TEXT NOT NULL,
  service_date DATE NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_services_vehicle (vehicle_id),
  KEY idx_services_user (user_id),
  CONSTRAINT fk_services_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_services_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4) Finance & Reporting
CREATE TABLE IF NOT EXISTS invoices (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  sale_id BIGINT UNSIGNED NOT NULL,
  invoice_number VARCHAR(50) NOT NULL,
  issue_date DATE NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL,
  sefaz_key VARCHAR(64) NULL,
  sefaz_status ENUM('emitida','cancelada','contingencia','erro') NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_invoices_number (invoice_number),
  KEY idx_invoices_sale (sale_id),
  CONSTRAINT fk_invoices_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5) Test Drives
CREATE TABLE IF NOT EXISTS test_drives (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  vehicle_id BIGINT UNSIGNED NOT NULL,
  scheduled_at DATETIME NOT NULL,
  status ENUM('agendado','realizado','cancelado') NOT NULL DEFAULT 'agendado',
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_test_drives_user (user_id),
  KEY idx_test_drives_vehicle (vehicle_id),
  CONSTRAINT fk_test_drives_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_test_drives_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6) Auditing
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  table_name VARCHAR(100) NOT NULL,
  action ENUM('INSERT','UPDATE','DELETE') NOT NULL,
  record_id VARCHAR(64) NOT NULL,
  changes JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_logs_table_action (table_name, action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Triggers: vehicle status changes and audit samples
DELIMITER $$

-- When a sale is inserted, mark vehicle as 'reservado'
CREATE TRIGGER trg_sales_after_insert
AFTER INSERT ON sales FOR EACH ROW
BEGIN
  UPDATE vehicles SET status = 'reservado' WHERE id = NEW.vehicle_id;
  INSERT INTO audit_logs(table_name, action, record_id, changes)
  VALUES ('sales', 'INSERT', CAST(NEW.id AS CHAR), JSON_OBJECT('status', NEW.status, 'vehicle_id', NEW.vehicle_id));
END$$

-- When a sale status becomes 'concluida', mark vehicle as 'vendido'
CREATE TRIGGER trg_sales_after_update
AFTER UPDATE ON sales FOR EACH ROW
BEGIN
  IF NEW.status = 'concluida' AND OLD.status <> 'concluida' THEN
    UPDATE vehicles SET status = 'vendido' WHERE id = NEW.vehicle_id;
  END IF;
  INSERT INTO audit_logs(table_name, action, record_id, changes)
  VALUES ('sales', 'UPDATE', CAST(NEW.id AS CHAR), JSON_OBJECT('old_status', OLD.status, 'new_status', NEW.status));
END$$

-- When a sale is deleted, restore vehicle to 'disponivel' if it was reserved
CREATE TRIGGER trg_sales_after_delete
AFTER DELETE ON sales FOR EACH ROW
BEGIN
  UPDATE vehicles SET status = 'disponivel' WHERE id = OLD.vehicle_id AND status = 'reservado';
  INSERT INTO audit_logs(table_name, action, record_id, changes)
  VALUES ('sales', 'DELETE', CAST(OLD.id AS CHAR), JSON_OBJECT('vehicle_id', OLD.vehicle_id));
END$$

-- Simple audit trigger for vehicles updates
CREATE TRIGGER trg_vehicles_after_update
AFTER UPDATE ON vehicles FOR EACH ROW
BEGIN
  INSERT INTO audit_logs(table_name, action, record_id, changes)
  VALUES ('vehicles', 'UPDATE', CAST(NEW.id AS CHAR), JSON_OBJECT('old_status', OLD.status, 'new_status', NEW.status, 'old_price', OLD.price, 'new_price', NEW.price));
END$$

DELIMITER ;

