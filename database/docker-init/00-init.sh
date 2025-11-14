#!/usr/bin/env sh
set -e

# Aguarda o MySQL aceitar conexões de forma robusta
echo "[init] Aguardando MySQL (até ~10 min)..."
for i in $(seq 1 300); do
  if mysqladmin -uroot -p"$MYSQL_ROOT_PASSWORD" -h localhost ping --silent >/dev/null 2>&1; then
    break
  fi
  sleep 2
done
mysqladmin -uroot -p"$MYSQL_ROOT_PASSWORD" -h localhost ping --silent >/dev/null 2>&1

echo "[init] Criando base 'drivein' se necessário" 
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS drivein;"

echo "[init] Aplicando migrations 001-006 na ordem"
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" drivein < /migrations/001_init.sql
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" drivein < /migrations/002_erp.sql
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" drivein < /migrations/003_seeds.sql
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" drivein < /migrations/004_enhancements.sql
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" drivein < /migrations/005_seeds_min.sql
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" drivein < /migrations/006_quality.sql
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" drivein < /migrations/007_api.sql

echo "[init] Migrations aplicadas com sucesso"