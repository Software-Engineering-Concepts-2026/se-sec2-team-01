# Lab 10 — Local Compose Stack

`docker-compose.yml` describes a local static web container, PostgreSQL, and Redis. It is an isolated Lab 10 environment; the current Good Night application continues to use its existing Supabase configuration and does not connect its browser frontend directly to PostgreSQL or Redis.

## Start locally

1. Copy `.env.example` to `.env` and replace both password placeholders with different local-only values.
2. Start the services:

   ```powershell
   docker compose up -d
   ```

3. Open `http://localhost:4173` (or the `WEB_PORT` set in `.env`). PostgreSQL and Redis are bound to loopback on ports 5433 and 6380 by default.
4. Stop the stack and preserve local data with `docker compose down`. To also delete the local database/cache volumes, use `docker compose down --volumes`.

`.env` is ignored by Git. Do not commit it or put production credentials in this local file. The values in `.env.example` are placeholders, not secrets. Production credentials belong in the deployment platform's secret manager. The database and cache containers are demonstrations and do not migrate, read, or modify the Supabase project or schema.
