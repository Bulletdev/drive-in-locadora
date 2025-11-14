# Backend Java 21 (Spring Boot)

API simples para autenticação, veículos e reservas, compatível com o front desacoplado.

## Pré-requisitos
- Java 21 (JDK 21)
- Maven 3.9+

## Como rodar
1. Ajuste o `.env.local` do front com:
   - `API_BASE_URL=http://localhost:8888/api`
   - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8888/api`
   - `AUTH_SECRET=<qualquer valor>`
2. Na pasta `backend-java`, rode:
   ```bash
   mvn spring-boot:run
   ```
   A API sobe em `http://localhost:8888`.

## Endpoints
- `POST /api/auth/login` — body: `{ email, password }` → `{ accessToken, user }`
- `POST /api/auth/register` — body: `User` (name, email, phone, cpf, password)
- `GET /api/auth/me` — header: `Authorization: Bearer <token>`
- `GET /api/vehicles` — lista veículos (query `category` opcional)
- `GET /api/vehicles/{id}` — detalhe de veículo
- `POST /api/reservations` — cria reserva; se enviado `Authorization: Bearer`, associa ao usuário
- `GET /api/reservations/me` — reservas do usuário logado

## Estrutura inicial
- Armazenamento em memória (`InMemoryStore`) com seed de veículos.
- Modelos: `User`, `Vehicle`, `Reservation`.
- Controllers: `AuthController`, `VehicleController`, `ReservationController`.

## Próximos passos (MySQL)
- Adotar Spring Data JPA e migrar `InMemoryStore` para repositórios.
- Modelo de dados:
  - `users(id, name, email, phone, cpf, password_hash, created_at)`
  - `vehicles(id, name, category, year, price_per_day, transmission, passengers, fuel, available, ... )`
  - `reservations(id, user_id, car_id, pickup_date, return_date, pickup_location, return_location, created_at)`
  - `reservation_extras(reservation_id, name, price)`
- Configurar `application.properties` com datasource (`spring.datasource.url`, `username`, `password`) e `spring.jpa.hibernate.ddl-auto=update`.

## Conexão com TiDB Cloud (schema `test`)
Para usar TiDB Cloud com SSL, há um profile dedicado `tidb`:

1. Defina variáveis de ambiente com suas credenciais TiDB Cloud:
   - `DB_USERNAME=3R8Nmd1ZJ9CUpNn.root`
   - `DB_PASSWORD=SLD7kW4tp4dQ9Sa8`
   - `DB_CA_PATH=<CA_PATH>`  (caminho do certificado CA fornecido pelo TiDB Cloud)
   - Opcional: `JPA_DDL_AUTO=none`

2. Execute o Spring Boot com o profile `tidb`:
   ```bash
   SPRING_PROFILES_ACTIVE=tidb mvn spring-boot:run
   ```

3. O profile `tidb` usa o JDBC:
   ```
   jdbc:mysql://gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?sslMode=VERIFY_IDENTITY&enabledTLSProtocols=TLSv1.2,TLSv1.3&serverSslCert=${DB_CA_PATH}
   ```

Notas:
- Não commit os segredos no repositório; use variáveis de ambiente.
- O dialeto JPA permanece `MySQLDialect`. `ddl-auto` recomendado: `none` ou `validate`.
- Se preferir apontar via `DB_URL`, você pode rodar com `SPRING_PROFILES_ACTIVE=mysql` e:
  ```
  DB_URL="jdbc:mysql://gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?sslMode=VERIFY_IDENTITY&enabledTLSProtocols=TLSv1.2,TLSv1.3&serverSslCert=<CA_PATH>" \
  DB_USERNAME="3R8Nmd1ZJ9CUpNn.root" \
  DB_PASSWORD="SLD7kW4tp4dQ9Sa8" \
  mvn spring-boot:run
  ```

### Exemplo Node.js (mysql2) — se quiser consultar direto do front
```ts
// lib/db.ts
import mysql from 'mysql2/promise'
import fs from 'fs'

export const pool = mysql.createPool({
  host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: process.env.TIDB_USER || '3R8Nmd1ZJ9CUpNn.root',
  password: process.env.TIDB_PASS || 'SLD7kW4tp4dQ9Sa8',
  database: 'test',
  ssl: { ca: fs.readFileSync(process.env.TIDB_CA_PATH || '<CA_PATH>') },
  connectionLimit: 5,
})
```