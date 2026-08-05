# HOMOLOGACAO.md — Sprint 03.2

# Brasilab Intranet Lab

## Termo de Homologação — Sprint 03.2

| | |
|---|---|
| Projeto | Brasilab Hub (Brasilab Intranet Lab) |
| Sprint | 03.2 — Infraestrutura e Migração para Servidor Online |
| Pré-requisito | Sprint 03.1 + Revisões 01 e 02 homologadas |
| Data de homologação | 06 de agosto de 2026 |
| Forma de homologação | Homologação local com PostgreSQL (Docker Compose) |
| Baseline registrada | **v0.3.0** (ver `docs/CHANGELOG.md`) |
| Documento de deploy | `docs/sprint-03.2/DEPLOY_PRODUCAO.md` |

---

## 1. Status

**SPRINT 03.2 — HOMOLOGADA.**

Sprint 04 (Propostas): **não iniciada** — pré-requisito liberado por esta homologação.

---

## 2. Escopo homologado

- PostgreSQL 16 como banco exclusivo da aplicação (desenvolvimento, homologação, testes de integração e produção) — sem SQLite;
- Camada de servidor completa: repositórios (Drizzle ORM), Services com a mesma lógica homologada das Sprints anteriores e Server Functions com validação (Zod) e autorização no servidor;
- Autenticação real: sessão em cookie HttpOnly, senha com hash argon2id, revogação no logout e limite de tentativas de login;
- Persistência real de Leads (agregado transacional), agenda, usuários, grupos, perfis e auditoria;
- Arquivos reais: upload multipart, storage físico configurável por variável de ambiente (`STORAGE_DIR`), caminho relativo no banco (`leads/<código>/arquivos/<uuid>.<ext>`) e streaming com suporte a Range;
- Tratamento dos dados locais legados: detecção e aviso ao usuário, sem exclusão automática; remoção individual e nomeada das chaves da autenticação simulada;
- Migrations SQL versionadas (nunca apagam nem recriam tabelas) e seed idempotente (Administrador Master, grupos, perfis e permissões);
- Docker Compose com aplicação + PostgreSQL + volumes persistentes (banco e storage);
- Documentação de publicação em produção (proxy reverso, HTTPS, variáveis de ambiente, backup e restauração) em `docs/sprint-03.2/DEPLOY_PRODUCAO.md`.

---

## 3. Validação executada

Conforme plano aprovado da Sprint:

1. `docker compose up` do zero → sistema funcional com Administrador Master seedado;
2. Login real, logout e expiração de sessão;
3. CRUD completo de Lead (dados, agenda, arquivos) com reinício do servidor no meio → dados intactos;
4. Dois navegadores simultâneos visualizando os mesmos dados;
5. Upload, visualização em modal e download de imagem e PDF via servidor;
6. Permissões negadas no servidor (não apenas na interface);
7. Dashboard, Agenda Comercial, Histórico e Auditoria sobre dados persistidos;
8. TypeScript, ESLint e build de produção sem erros; rotas verificadas no navegador;
9. Backup e restauração testados.

---

## 4. Condicionais da aprovação — atendidas

1. Banco único em todos os ambientes: PostgreSQL exclusivamente;
2. Ambiente local via Docker Compose (aplicação, PostgreSQL, volume do banco e volume de arquivos), com pré-requisitos documentados, incluindo Docker Desktop no Windows;
3. Produção online com destino compatível (Node.js persistente, PostgreSQL, Docker ou equivalente, storage persistente, proxy reverso, HTTPS, variáveis de ambiente, migrations e backup) — mesmo código, apenas configurações diferentes;
4. Nenhuma limpeza automática de IndexedDB/localStorage; chaves da autenticação simulada removidas individualmente e identificadas pelo nome;
5. Arquivos em diretório configurável (`STORAGE_DIR`); banco guarda apenas caminho relativo e metadados; storage sobrevive a rebuild, atualização, reinício e recriação do container;
6. Migrations que nunca apagam nem recriam tabelas; seed idempotente;
7. Implementação em fases com testes ao final de cada fase;
8. Pacote de entrega completo (arquivos alterados, migrations, seeds, `docker-compose.yml`, `.env.example`, instruções, checklist de homologação e limitações conhecidas).

---

## 5. Consolidação documental (06 de agosto de 2026)

Na consolidação posterior à homologação, a documentação oficial foi atualizada para refletir fielmente o estado implementado, sem qualquer alteração de código:

- `README.md` — Status Atual, Arquitetura Tecnológica e Segurança;
- `docs/ROADMAP.md` — status das Sprints e registro da Baseline v0.3.0;
- `docs/06_STACK_TECNOLOGICA.md` — substituição das referências a Supabase e React Router pela stack homologada;
- `docs/04_ARQUITETURA_DO_SISTEMA.md` — registro da implementação homologada da camada de dados (seção 9.1);
- `docs/10_SEGURANCA_DA_INFORMACAO.md` — mecanismos de autenticação homologados e estratégia de backup definida;
- `docs/regras_de_negocio/06_ARQUIVOS.md` — implementação homologada de storage;
- `docs/09_MASTER_CONTEXT.md` — correção de referência a documento inexistente;
- `docs/CHANGELOG.md` — criação do registro oficial de baselines.

---

## 6. Próximo passo

Início da **Sprint 04 — Propostas**, conforme `docs/ROADMAP.md`, mediante autorização expressa e prompt próprio da Sprint.

---

Fim do Documento.
