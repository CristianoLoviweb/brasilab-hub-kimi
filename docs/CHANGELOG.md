# CHANGELOG.md

# Brasilab Intranet Lab

Registro oficial de baselines e marcos homologados da plataforma.

Conforme `04_ARQUITETURA_DO_SISTEMA.md`, toda decisão estrutural alterada deve ser registrada neste documento.

---

## Baseline v0.3.0 — 06 de agosto de 2026

**Sprint 03.2 — Infraestrutura e Migração para Servidor Online: HOMOLOGADA.**

Registro de homologação: `docs/sprint-03.2/HOMOLOGACAO.md`.

Conteúdo da baseline:

- PostgreSQL 16 como banco exclusivo em todos os ambientes (sem SQLite);
- Camada de servidor: repositórios (Drizzle ORM), Services preservados, Server Functions com validação e autorização no servidor;
- Autenticação real: cookie HttpOnly, hash argon2id, revogação no logout, limite de tentativas;
- Persistência real de Leads, agenda, arquivos, usuários, grupos, perfis e auditoria;
- Arquivos em storage persistente no servidor (`STORAGE_DIR`), caminho relativo no banco, streaming com Range;
- Migrations SQL versionadas e seed idempotente;
- Docker Compose (aplicação + PostgreSQL + volumes persistentes);
- Documentação de produção em `docs/sprint-03.2/DEPLOY_PRODUCAO.md`.

Decisões estruturais registradas:

- Substituição do backend previsto (Supabase) por stack própria: PostgreSQL + Drizzle ORM + Server Functions (TanStack Start/Nitro) + sessão própria + storage em volume — ver `06_STACK_TECNOLOGICA.md`, seção 26;
- Confirmação do TanStack Router como roteamento oficial (em uso desde a fundação), substituindo a referência a React Router;
- Estratégia de backup definida (`pg_dump` + volume de arquivos) — ver `10_SEGURANCA_DA_INFORMACAO.md`, seção 15, e `docs/sprint-03.2/DEPLOY_PRODUCAO.md`.

Estado das Sprints nesta baseline:

| Sprint | Status |
|---|---|
| Sprint 01 — Estrutura da Plataforma | Homologada |
| Sprint 02 — Usuários | Homologada |
| Sprint 03 — Leads | Homologada |
| Sprint 03.1 — Preparação para Ambiente Real (+ Rev. 01 e 02) | Homologada |
| Sprint 03.2 — Infraestrutura e Migração para Servidor Online | **Homologada (06/08/2026)** |
| Sprint 04 — Propostas | Não iniciada |

---

## Marcos anteriores (anteriores ao registro formal de baselines)

- **Sprint 03.1 — Revisão 02:** edição e exclusão de compromissos da agenda do Lead (com confirmação, Histórico e Auditoria); visualização de imagens e PDF em modal. Homologada.
- **Sprint 03.1 — Revisão 01:** upload real de arquivos do Lead (sem Base64); Dashboard dinâmico calculado pelos Services; correção do cabeçalho dos cards (SectionCard). Homologada.
- **Sprint 03.1 — Preparação do Projeto para Ambiente Real:** remoção integral dos dados fictícios; usuário único inicial (Administrador Master); listagens e indicadores iniciando vazios. Homologada.
- **Sprint 03 — Leads:** cadastro, listagem, detalhes, histórico, agenda comercial, contatos e arquivos. Homologada.
- **Sprint 02 — Usuários:** usuários, grupos, perfis, permissões gerais e especiais, histórico e auditoria. Homologada.
- **Sprint 01 — Estrutura da Plataforma:** autenticação (estrutura), layout, navegação, Dashboard e componentes base. Homologada.

---

Fim do Documento.
