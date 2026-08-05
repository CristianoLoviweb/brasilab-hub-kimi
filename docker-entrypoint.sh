#!/bin/sh
# Brasilab Hub — entrypoint do container (Sprint 03.2)
#
# Comportamento:
#  1. Se DATABASE_URL NÃO estiver definida, inicializa e sobe um PostgreSQL
#     embutido no próprio container (modo all-in-one — usado no preview da
#     plataforma). Com Docker Compose, DATABASE_URL aponta para o serviço
#     `db` e o banco embutido nunca é iniciado.
#  2. Aplica as migrations pendentes (scripts/migrate.mjs — aditivas,
#     versionadas, nunca apagam tabelas).
#  3. Sobe a aplicação; o seed idempotente (grupos, perfis e Administrador
#     Master) é executado no boot do servidor (src/server.ts).
set -e

echo "[entrypoint] Brasilab Hub — inicializando..."

if [ -z "$DATABASE_URL" ]; then
  echo "[entrypoint] DATABASE_URL ausente — iniciando PostgreSQL embutido."
  export PGDATA="${PGDATA:-/var/lib/postgresql/data}"

  if [ ! -s "$PGDATA/PG_VERSION" ]; then
    mkdir -p "$PGDATA"
    chown -R postgres:postgres "$PGDATA"
    su-exec postgres initdb -D "$PGDATA" -U postgres --auth=trust --encoding=UTF8 --locale=C
    echo "[entrypoint] Cluster PostgreSQL inicializado em $PGDATA."
  fi

  chown -R postgres:postgres "$PGDATA"
  su-exec postgres pg_ctl -D "$PGDATA" -w -t 60 -l /var/lib/postgresql/pg.log start

  if ! su-exec postgres psql -h 127.0.0.1 -U postgres -tAc \
      "SELECT 1 FROM pg_database WHERE datname='brasilab'" | grep -q 1; then
    su-exec postgres createdb -h 127.0.0.1 -U postgres brasilab
    echo "[entrypoint] Banco 'brasilab' criado."
  fi

  export DATABASE_URL="postgres://postgres@127.0.0.1:5432/brasilab"
else
  echo "[entrypoint] Usando DATABASE_URL do ambiente."
fi

export STORAGE_DIR="${STORAGE_DIR:-/app/storage}"
mkdir -p "$STORAGE_DIR"

echo "[entrypoint] Aplicando migrations..."
node scripts/migrate.mjs

echo "[entrypoint] Subindo a aplicação..."
exec node .output/server/index.mjs
