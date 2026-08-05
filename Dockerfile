# Brasilab Hub — TanStack Start + Nitro (SSR) + PostgreSQL (Sprint 03.2)
#
# Imagem única para todos os ambientes:
#  - Docker Compose (local/homologação/produção): o serviço `db` fornece o
#    PostgreSQL e DATABASE_URL é definida — o banco embutido não é usado.
#  - Modo all-in-one (preview): sem DATABASE_URL, o entrypoint inicializa um
#    PostgreSQL real dentro do próprio container. Nunca SQLite.

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# PostgreSQL real embutido (modo all-in-one) + su-exec para rodá-lo sem root.
RUN apk add --no-cache postgresql16 postgresql16-contrib su-exec

# Dependências de produção (scripts/migrate.mjs usa o driver pg).
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY --from=build /app/.output ./.output
COPY scripts ./scripts
COPY drizzle ./drizzle
COPY docker-entrypoint.sh ./docker-entrypoint.sh

ENV PORT=3000
ENV STORAGE_DIR=/app/storage
EXPOSE 3000

# Dados persistentes: banco embutido + storage de arquivos (condicional nº 5).
VOLUME ["/var/lib/postgresql/data", "/app/storage"]

ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
