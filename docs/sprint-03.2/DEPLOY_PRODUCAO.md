# Publicação em Produção — Sprint 03.2

Este documento descreve como publicar a Brasilab Intranet Lab em um servidor
online, atendendo à condicional nº 3 da aprovação: **o código é o mesmo no
ambiente local e online; somente as configurações mudam.**

---

## 1. Requisitos do servidor

| Recurso | Exigência |
| --- | --- |
| Node.js | 20 LTS, execução persistente (systemd, PM2 ou container) |
| PostgreSQL | 16 (container `postgres:16-alpine` ou instância gerenciada) |
| Docker | Docker Engine + Docker Compose (recomendado) ou equivalente |
| Armazenamento | Disco persistente para o banco (volume) e para os arquivos (volume) |
| Proxy reverso | Nginx (ou equivalente) terminando TLS |
| HTTPS | Certificado válido (Let's Encrypt ou corporativo) |
| Backup | Rotina agendada para banco + storage |

> Hospedagem compartilhada tradicional (sem Node persistente, sem PostgreSQL,
> sem volumes e sem proxy reverso) **não é suficiente**.

---

## 2. Configuração (somente variáveis de ambiente)

Copie `.env.example` para `.env` e ajuste:

```env
POSTGRES_USER=brasilab
POSTGRES_PASSWORD=<senha-forte-gerada>
POSTGRES_DB=brasilab

# No compose, o host é o nome do serviço (db). Em produção com banco
# gerenciado, aponte para o endereço do provedor.
DATABASE_URL=postgres://brasilab:<senha-forte-gerada>@db:5432/brasilab

SESSION_TTL_HOURS=8

# OBRIGATÓRIO em produção: o cookie de sessão só trafega em HTTPS.
COOKIE_SECURE=true

STORAGE_DIR=/app/storage
MAX_UPLOAD_BYTES=10485760
PORT=3000
```

Nenhuma linha de código muda entre local e produção — apenas este arquivo.

---

## 3. Subida com Docker Compose (recomendado)

```bash
docker compose up -d --build
```

O que acontece na primeira subida:

1. O serviço `db` (PostgreSQL 16) sobe com o volume `pgdata` e fica
   aguardando o healthcheck (`pg_isready`).
2. O serviço `app` aguarda o banco ficar saudável, constrói a aplicação,
   executa `scripts/migrate.mjs` (migrations pendentes — nunca apaga nem
   recria tabelas) e sobe o servidor Node na porta 3000.
3. O seed do Administrador Master, grupos, perfis e permissões é aplicado
   de forma idempotente na inicialização da aplicação.

Verificação:

```bash
docker compose ps          # os dois serviços "healthy"/"running"
docker compose logs app    # migrations aplicadas + "Listening"
```

---

## 4. Proxy reverso e HTTPS (Nginx)

Exemplo mínimo de virtual host:

```nginx
server {
    listen 443 ssl;
    server_name intranet.suaempresa.com.br;

    ssl_certificate     /etc/letsencrypt/live/intranet.suaempresa.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/intranet.suaempresa.com.br/privkey.pem;

    client_max_body_size 12m;  # upload de até 10 MB + folga do multipart

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
}

server {
    listen 80;
    server_name intranet.suaempresa.com.br;
    return 301 https://$host$request_uri;
}
```

Checklist TLS:

- [ ] `COOKIE_SECURE=true` no `.env` (impede vazamento do cookie em HTTP);
- [ ] redirecionamento 80 → 443 ativo;
- [ ] `client_max_body_size` ≥ 12 MB (o limite da aplicação é `MAX_UPLOAD_BYTES`);
- [ ] certificado com renovação automática (certbot/timer ou gerenciado).

---

## 5. Volumes e arquivos físicos

| Dado | Onde fica | Volume |
| --- | --- | --- |
| Banco PostgreSQL | `/var/lib/postgresql/data` no container `db` | `pgdata` |
| Arquivos dos Leads | `/app/storage` no container `app` | `app_storage` |

Os arquivos são gravados em `STORAGE_DIR` seguindo o padrão
`leads/<CODIGO_DO_LEAD>/arquivos/<uuid>.<ext>` — por exemplo
`leads/LD2600001/arquivos/3a291545-….pdf`. O banco registra **somente o
caminho relativo** e os metadados, portanto a aplicação pode ser
reconstruída, atualizada ou recriada sem perder nada: basta manter os dois
volumes.

Para localizar os arquivos no host:

```bash
docker volume ls | grep app_storage
docker compose exec app ls -R /app/storage
```

---

## 6. Backup e restauração

### 6.1 Backup (agendar via cron — exemplo diário às 2h)

```bash
#!/bin/sh
# /opt/brasilab/backup.sh
set -eu
DEST=/opt/brasilab/backups/$(date +%Y%m%d-%H%M%S)
mkdir -p "$DEST"

# 1) Banco: dump consistente com o banco no ar (pg_dump é transacional).
docker compose exec -T db pg_dump -U "$POSTGRES_USER" -d brasilab \
  --format=custom --file=/tmp/brasilab.dump
docker compose cp db:/tmp/brasilab.dump "$DEST/brasilab.dump"

# 2) Storage de arquivos: cópia do volume nomeado.
docker run --rm -v brasilab_app_storage:/origem:ro -v "$DEST":/destino \
  alpine tar czf /destino/storage.tar.gz -C /origem .

echo "Backup concluído em $DEST"
```

### 6.2 Restauração

```bash
# 1) Restaurar o banco (banco vazio ou recém-criado).
docker compose cp backups/<DATA>/brasilab.dump db:/tmp/brasilab.dump
docker compose exec -T db pg_restore -U "$POSTGRES_USER" -d brasilab \
  --clean --if-exists /tmp/brasilab.dump

# 2) Restaurar o storage.
docker run --rm -v brasilab_app_storage:/destino -v "$PWD/backups/<DATA>":/origem:ro \
  alpine sh -c "rm -rf /destino/* && tar xzf /origem/storage.tar.gz -C /destino"

# 3) Subir a aplicação normalmente.
docker compose up -d
```

> Banco e storage são um par: restaure sempre os dois do mesmo ponto no
> tempo para não ficar com metadados sem binário (ou vice-versa).

---

## 7. Migrations em produção

- As migrations ficam em `drizzle/*.sql` e são aplicadas por
  `node scripts/migrate.mjs` (executado automaticamente na subida do
  container, antes do servidor aceitar tráfego).
- O controle de aplicação fica na tabela `_migrations`; cada arquivo roda
  **uma única vez**, dentro de uma transação.
- As migrations **nunca apagam nem recriam tabelas** — novas versões do
  schema entram como novos arquivos `0001_*.sql`, `0002_*.sql`, …
- Para gerar uma nova migration após alterar `src/server/db/schema.ts`:
  `npm run db:generate` e revisar o SQL gerado antes de commitar.

---

## 8. Alternativa sem Docker (Node + PostgreSQL instalados no host)

1. Instale Node 20 e PostgreSQL 16 no servidor.
2. `npm install --omit=dev && npm run build` (build também no CI).
3. Configure `DATABASE_URL`, `STORAGE_DIR`, `COOKIE_SECURE=true` no ambiente.
4. `node scripts/migrate.mjs` na primeira subida e a cada deploy.
5. `node .output/server/index.mjs` sob systemd/PM2 (restart automático).
6. Backup com `pg_dump` + cópia do diretório `STORAGE_DIR`.

O comportamento é idêntico ao do container — mesmas variáveis, mesmos
scripts, mesmo código.
