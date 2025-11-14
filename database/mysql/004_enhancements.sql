-- Enhancements for full-scale operations: suppliers, purchases, financing, branches,
-- advanced reporting, indexes, column adjustments, photos/documents, and extra triggers.
-- Apply after 001_init.sql, 002_erp.sql, and before/after 003_seeds.sql as needed.

-- 1) Suppliers & Purchases (vehicle acquisition)
CREATE TABLE IF NOT EXISTS suppliers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  cnpj CHAR(18) NOT NULL, -- 00.000.000/0000-00
  contact_email VARCHAR(190) NULL,
  contact_phone VARCHAR(32) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_suppliers_cnpj (cnpj)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS purchases (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  supplier_id BIGINT UNSIGNED NOT NULL,
  vehicle_id BIGINT UNSIGNED NOT NULL,
  purchase_date DATE NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  status ENUM('pendente','concluida','cancelada') NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_purchases_supplier (supplier_id),
  KEY idx_purchases_vehicle (vehicle_id),
  CONSTRAINT fk_purchases_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_purchases_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER $$
CREATE TRIGGER trg_purchases_after_insert
AFTER INSERT ON purchases FOR EACH ROW
BEGIN
  IF NEW.status = 'concluida' THEN
    UPDATE vehicles SET entry_date = NEW.purchase_date, cost = NEW.cost WHERE id = NEW.vehicle_id;
  END IF;
  INSERT INTO audit_logs(table_name, action, record_id, changes)
  VALUES ('purchases', 'INSERT', CAST(NEW.id AS CHAR), JSON_OBJECT('status', NEW.status, 'vehicle_id', NEW.vehicle_id));
END$$
DELIMITER ;

-- 2) Financing plans (details for financed payments)
CREATE TABLE IF NOT EXISTS financing_plans (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  sale_id BIGINT UNSIGNED NOT NULL,
  bank_name VARCHAR(100) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  installments INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_financing_sale (sale_id),
  CONSTRAINT fk_financing_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3) Advanced reporting (views)
CREATE OR REPLACE VIEW vw_monthly_sales AS
SELECT YEAR(sale_date) AS ano, MONTH(sale_date) AS mes, COUNT(*) AS vendas, SUM(total_price) AS receita
FROM sales WHERE status = 'concluida'
GROUP BY ano, mes;

-- 4) Security & Users (fine-grained permissions)
CREATE TABLE IF NOT EXISTS permissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_permissions_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Map permissions to roles available in users.role
CREATE TABLE IF NOT EXISTS roles_permissions (
  role ENUM('cliente','vendedor','gerente','admin') NOT NULL,
  permission_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (role, permission_id),
  KEY idx_roles_permissions_permission (permission_id),
  CONSTRAINT fk_roles_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Users: last_login and active flag
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS last_login DATETIME NULL,
  ADD COLUMN IF NOT EXISTS active TINYINT(1) NOT NULL DEFAULT 1;

-- 5) Vehicles: mileage type adjustment for high values
ALTER TABLE vehicles
  MODIFY COLUMN mileage BIGINT DEFAULT 0;

-- 6) Invoices: tax breakdown
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS icms_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS ipi_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- 7) Multi-branches support
CREATE TABLE IF NOT EXISTS branches (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  city VARCHAR(120) NOT NULL,
  state CHAR(2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_branches_name (name),
  KEY idx_branches_city_state (city, state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS branch_id BIGINT UNSIGNED NULL,
  ADD KEY idx_vehicles_branch (branch_id),
  ADD CONSTRAINT fk_vehicles_branch FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE sales
  ADD COLUMN IF NOT EXISTS branch_id BIGINT UNSIGNED NULL,
  ADD KEY idx_sales_branch (branch_id),
  ADD CONSTRAINT fk_sales_branch FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- 8) Vehicle photos & documents
CREATE TABLE IF NOT EXISTS vehicle_photos (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  vehicle_id BIGINT UNSIGNED NOT NULL,
  url VARCHAR(255) NOT NULL,
  is_primary TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_vehicle_photos_url (vehicle_id, url),
  KEY idx_vehicle_photos_vehicle (vehicle_id),
  CONSTRAINT fk_vehicle_photos_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS vehicle_documents (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  vehicle_id BIGINT UNSIGNED NOT NULL,
  doc_type ENUM('nota_fiscal','recibo','manual','outro') NOT NULL,
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_vehicle_documents_url (vehicle_id, url),
  KEY idx_vehicle_documents_vehicle (vehicle_id),
  CONSTRAINT fk_vehicle_docs_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9) Extra triggers for services and invoices
DELIMITER $$
CREATE TRIGGER trg_services_after_insert
AFTER INSERT ON services FOR EACH ROW
BEGIN
  UPDATE vehicles SET status = 'manutencao' WHERE id = NEW.vehicle_id;
  INSERT INTO audit_logs(table_name, action, record_id, changes)
  VALUES ('services', 'INSERT', CAST(NEW.id AS CHAR), JSON_OBJECT('vehicle_id', NEW.vehicle_id, 'cost', NEW.cost));
END$$

CREATE TRIGGER trg_services_after_delete
AFTER DELETE ON services FOR EACH ROW
BEGIN
  -- Restore to disponivel if no more service records for the vehicle
  IF (SELECT COUNT(*) FROM services WHERE vehicle_id = OLD.vehicle_id) = 0 THEN
    UPDATE vehicles SET status = 'disponivel' WHERE id = OLD.vehicle_id AND status = 'manutencao';
  END IF;
  INSERT INTO audit_logs(table_name, action, record_id, changes)
  VALUES ('services', 'DELETE', CAST(OLD.id AS CHAR), JSON_OBJECT('vehicle_id', OLD.vehicle_id));
END$$

CREATE TRIGGER trg_invoices_after_insert
AFTER INSERT ON invoices FOR EACH ROW
BEGIN
  INSERT INTO audit_logs(table_name, action, record_id, changes)
  VALUES ('invoices', 'INSERT', CAST(NEW.id AS CHAR), JSON_OBJECT('sefaz_status', NEW.sefaz_status, 'tax_amount', NEW.tax_amount));
END$$

CREATE TRIGGER trg_invoices_after_update
AFTER UPDATE ON invoices FOR EACH ROW
BEGIN
  INSERT INTO audit_logs(table_name, action, record_id, changes)
  VALUES ('invoices', 'UPDATE', CAST(NEW.id AS CHAR), JSON_OBJECT('old_status', OLD.sefaz_status, 'new_status', NEW.sefaz_status));
END$$
DELIMITER ;

-- 10) Indexes for temporal/reporting queries
ALTER TABLE sales ADD INDEX idx_sales_sale_date (sale_date);
ALTER TABLE payments ADD INDEX idx_payments_payment_date (payment_date);

-- 11) Audit logs: actor who performed action (nullable, app should populate)
ALTER TABLE audit_logs
  ADD COLUMN IF NOT EXISTS actor_user_id BIGINT UNSIGNED NULL,
  ADD KEY idx_audit_logs_actor (actor_user_id),
  ADD CONSTRAINT fk_audit_logs_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- Notes:
-- - Some ALTER ... IF NOT EXISTS options require MySQL 8.0+.
-- - Ensure triggers do not conflict with existing ones; order of application matters.
-- - Branch fields are nullable to avoid breaking existing seeds; set them later via app logic.
-- - Permissions schema is minimal; app should enforce checks using users.role joined to roles_permissions.