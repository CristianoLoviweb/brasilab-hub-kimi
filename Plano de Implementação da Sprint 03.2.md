# Plano de Implementação da Sprint 03.2

**Infraestrutura e migração do ambiente local para o servidor online**

| | |
|---|---|
| Projeto | Brasilab Hub |
| Sprint | 03.2 — Infraestrutura |
| Status | SPRINT HOMOLOGADA — 06/08/2026 (Baseline v0.3.0) |
| Pré-requisito | Sprint 03.1 + Revisões 01 e 02 homologadas |

---

## 1. Objetivo

Levar o Brasilab Hub do ambiente local (dados em memória, sessão simulada no navegador, arquivos no IndexedDB) para um **servidor online com persistência real, autenticação real e armazenamento real de arquivos**, **sem reescrever o sistema**: rotas, telas, componentes, Design System, permissões, regras de negócio e contratos dos Services permanecem intactos.

---

## 2. Diagnóstico — o que é local hoje

| Camada | Estado atual | Limitação |
|---|---|---|
| Dados (Leads, agenda, usuários, grupos, perfis, auditoria) | Arrays em memória nos Services | Somem a cada reinício; não compartilhados entre usuários |
| Autenticação | Sessão simulada em `localStorage`, hash SHA-256 no cliente | Sem segurança real; sem sessão multi-dispositivo |
| Arquivos do Lead | Blob no IndexedDB do navegador | Presos ao navegador/dispositivo; sem backup |
| Deploy | Dockerfile único (Nitro SSR, porta 3000) | Sem banco de dados no ambiente |

**Ponto forte da arquitetura atual (a chave da migração sem reescrita):** todos os Services já são assíncronos (`async … Promise<…>`), com paginação, filtros e tipos próprios. Nenhum componente acessa dados de forma síncrona. Trocar a fonte de dados por trás dessas assinaturas é **transparente para 100% da interface**.

---

## 3. Arquitetura adotada

```
┌────────────────────────────────────────────────────────────┐
│                     SERVIDOR ONLINE (Docker)               │
│                                                            │
│  ┌──────────────────────────┐   ┌───────────────────────┐  │
│  │  App (TanStack Start +   │   │  PostgreSQL 16        │  │
│  │  Nitro SSR)              │   │  (volume persistente) │  │
│  │                          │   └───────────────────────┘  │
│  │  Rotas/Componentes  ────►│   ┌───────────────────────┐  │
│  │  (inalterados)           │   │  Volume de arquivos   │  │
│  │                          │   │  (uploads dos Leads)  │  │
│  │  Services (mesmas        │   └───────────────────────┘  │
│  │  assinaturas) ──► Server │                              │
│  │  Functions ──► Drizzle   │                              │
│  │  ORM ──► PostgreSQL      │                              │
│  └──────────────────────────┘                              │
│           ▲ HTTPS (proxy reverso: Caddy/Nginx)             │
└───────────┼────────────────────────────────────────────────┘
            │
     Navegadores dos usuários
```

- **Um único codebase**: frontend, camada de dados e API interna vivem no mesmo projeto TanStack Start. Não haverá API REST/GraphQL separada para projetar, versionar e manter.
- **Três pontos de troca interna**, todos atrás de contratos existentes: (1) repositório de dados, (2) sessão/autenticação, (3) armazenamento de arquivos.

---

## 4. Tecnologias escolhidas e motivo

| Decisão | Escolha | Motivo da escolha |
|---|---|---|
| Banco de dados | **PostgreSQL 16** | O domínio é relacional por natureza (usuários ↔ grupos ↔ perfis ↔ permissões; leads ↔ agenda ↔ arquivos; auditoria). ACID, maduro, roda em qualquer VPS via Docker e existe como serviço gerenciado em todos os provedores. |
| ORM e migrations | **Drizzle ORM + drizzle-kit** | TypeScript-first: o schema do banco é declarado em TS e espelha os tipos já existentes do projeto (`Lead`, `LeadSchedule`, `AuditEvent`…), sem dupla manutenção. Sem codegen pesado nem runtime binário (ao contrário do Prisma, que exigiria etapa extra no Docker Alpine). Migrations versionadas em SQL, aplicadas no deploy. |
| API interna | **Server Functions do TanStack Start (`createServerFn`)** | O sistema já é full-stack (SSR via Nitro). As chamadas de dados sobem para o servidor dentro do mesmo codebase, com validação zod reaproveitada dos schemas atuais. É a decisão que viabiliza "sem reescrever": nenhuma camada nova de API é criada. |
| Autenticação | **Sessão no servidor com cookie HTTP-only + argon2id** (`@node-rs/argon2`, binários pré-compilados) | Cookie HTTP-only elimina token em `localStorage` (vulnerável a XSS); argon2id é o padrão recomendado para senhas; pacote com binários prontos evita toolchain nativa no Alpine. A tela de login, o hook `useSession` e os guards de rota mantêm o mesmo contrato — a troca é interna ao `authService`. |
| Arquivos | **Volume persistente no servidor + endpoints de streaming**; caminho preparado para S3-compatível via variável de ambiente | Metadados no PostgreSQL, binário em disco com streaming (suporte a `Range` para PDF). O modal de preview da Revisão 02 passa a apontar para a URL do servidor — **continua sem Base64**. Mantém a porta aberta para object storage sem mudar código. |
| Banco em todos os ambientes | **PostgreSQL — exclusivamente** (condicional de aprovação nº 1) | Nenhum banco alternativo (sem SQLite). Desenvolvimento local, homologação local, testes de integração, produção e preview usam PostgreSQL, eliminando diferenças de comportamento, migrations, constraints, datas, transações e consultas entre ambientes. |
| Orquestração | **Docker Compose (app + postgres)** | Mesmo artefato no notebook de desenvolvimento e no servidor online: `docker compose up` sobe o sistema inteiro. O Dockerfile atual praticamente não muda (apenas aplica migrations no boot). |
| Configuração | **Variáveis de ambiente** (`DATABASE_URL`, `SESSION_SECRET`, `STORAGE_DIR`) | Nenhum segredo no repositório; mesma imagem serve a todos os ambientes. |
| HTTPS | **Proxy reverso (Caddy ou Nginx) com TLS** | Terminação TLS, redirect 80→443 e headers de segurança fora da aplicação, sem alterar código. |

---

## 5. Como a migração ocorre sem reescrever o sistema

O princípio: **mudar a implementação, nunca o contrato**. Quatro fases, cada uma validada isoladamente e com rollback por versão:

**Fase 0 — Fundação (invisível ao usuário)**
Adicionar `docker-compose.yml`, schema Drizzle espelhando os tipos atuais, migrations, seed do Administrador Master e variáveis de ambiente. O sistema continua rodando exatamente como hoje.

**Fase 1 — Persistência real**
Reescrever **somente o interior** dos Services (`leadService`, `userService`, `groupService`, `profileService`, `permissionsService`, `auditService`, `dashboardService`) para executar no servidor via Server Functions + Drizzle. Assinaturas, tipos de retorno, paginação e filtros **idênticos**. Componentes, hooks, rotas e telas: **zero alterações**. O Dashboard dinâmico (Revisão 01) continua calculando pelos Services — agora sobre dados reais.

**Fase 2 — Autenticação real**
Troca interna do `authService`: login valida no servidor (argon2id), sessão em cookie HTTP-only, tabela de sessões com expiração e logout real. Verificação de permissões passa a ser conferida também no servidor, reutilizando o **mesmo catálogo de permissões** atual. Tela de login e fluxo do usuário inalterados.

**Fase 3 — Arquivos reais**
Upload passa a enviar o binário ao servidor (multipart); preview e download passam a usar URLs do servidor com streaming. Mudança interna mínima no `leadFileStorage` e no `LeadFilePreviewDialog` (a URL deixa de ser `createObjectURL` e passa a ser do servidor — o ciclo de revogação some junto, sem tocar na UI). Limite de 10 MB e classificação preservados.

**Fase 4 — Publicação online**
Servidor com Docker + Compose, proxy reverso com HTTPS, migrations no deploy, backup diário (`pg_dump` + volume de arquivos) e restart policy. Checklist de go-live e rollback documentados.

**Sobre os dados locais existentes:** desde a Sprint 03.1 o ambiente iniciou zerado e os dados locais vivem apenas no navegador de quem testou. A migração parte de base limpa com seed do Master — não há migração de dados legados. Se houver algo real a preservar, será feita exportação manual assistida antes do go-live.

---

## 6. O que NÃO muda

- Arquitetura de módulos por feature e organização de pastas;
- Design System, componentes, rotas e navegação;
- Schemas de formulário (zod) — reaproveitados na validação do servidor;
- Catálogo de permissões, grupos e perfis (modelo idêntico, agora persistido);
- Regras de negócio, indicadores e comportamento das telas;
- Tudo que foi homologado nas Sprints 03.1, Revisão 01 e Revisão 02.

---

## 7. Ambientes

| Ambiente | Banco | Como sobe |
|---|---|---|
| Desenvolvimento local | PostgreSQL | `docker compose up -d db` + `npm run dev` |
| Homologação local | PostgreSQL | `docker compose up -d` (stack completa) |
| Preview (esta plataforma) | PostgreSQL no próprio container | Dockerfile all-in-one (mesma imagem) |
| Produção (servidor online) | PostgreSQL | `docker compose up -d` + proxy HTTPS |

> Hospedagem compartilhada tradicional (sem Node.js persistente, PostgreSQL, Docker ou equivalente, storage persistente, proxy reverso, HTTPS, variáveis de ambiente, migrations e backup) **não é suficiente** para este sistema (condicional nº 3).

---

## 8. Segurança

- Senhas com argon2id; sessão em cookie `HttpOnly; Secure; SameSite=Lax`, com expiração e revogação;
- Toda mutation validada no servidor (zod) e autorizada pelo catálogo de permissões — nunca apenas no cliente;
- Segredos apenas em variáveis de ambiente; auditoria registra logins, logouts e operações (mesmos eventos atuais + `login`/`logout`);
- Headers de segurança no proxy; backups diários com retenção.

---

## 9. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Divergência de comportamento entre memória e banco | Mesma bateria de validação das sprints anteriores executada nas duas fontes durante a Fase 1 |
| Preview da plataforma sem Compose | PostgreSQL embutido no próprio container (mesma imagem, Postgres real — nunca SQLite); se ainda assim inviável, o preview fica indisponível sem impacto na Sprint (condicional nº 1) |
| Sessões antigas no `localStorage` | Remoção **individual e identificada pelo nome** das chaves da autenticação simulada (condicional nº 4) — nunca `localStorage.clear()` nem limpeza genérica |
| Falha no deploy online | Migrations idempotentes + rollback por imagem versionada + backup pré-migration |

---

## 10. Validação da sprint

1. `docker compose up` do zero → sistema funcional com Master seedado;
2. Login real, logout e expiração de sessão;
3. CRUD completo de Lead (dados, agenda, arquivos) com **reinício do servidor no meio** → dados intactos;
4. Dois navegadores simultâneos vendo os mesmos dados;
5. Upload/preview/download de imagem e PDF via servidor;
6. Permissões negadas no servidor (não apenas na UI);
7. Dashboard, Agenda Comercial, Histórico e Auditoria sobre dados persistidos;
8. TypeScript, ESLint, build de produção e rotas (mesmo padrão das sprints anteriores);
9. Backup e restore testados antes do go-live.

---

## 11. Observação sobre o anexo desta sprint

O arquivo recebido (`# SPRINT 03.2 — INFR.txt`) contém o texto da **Sprint 03.1 — Revisão 02** (já homologada e entregue), não o escopo da 03.2. Este plano foi elaborado a partir do briefing da sua mensagem. Havendo um documento de escopo próprio da Sprint 03.2, ele será incorporado a este plano **antes** do início da implementação.

---

---

## 12. Adendo — Aprovação condicional (condicionais incorporadas)

Este plano foi **aprovado condicionado aos ajustes abaixo**, que passam a fazer parte integral do escopo da Sprint 03.2:

1. **Banco único em todos os ambientes** — PostgreSQL exclusivamente (desenvolvimento local, homologação local, testes de integração e produção online). Nenhum SQLite ou banco alternativo. O preview interno da plataforma não é requisito da Sprint; a homologação oficial será executada localmente pelo usuário com PostgreSQL.
2. **Ambiente local** — Docker Compose contendo ao menos: aplicação, PostgreSQL, volume persistente do banco e volume/diretório persistente de arquivos. Todos os pré-requisitos documentados, inclusive Docker Desktop no Windows; não se assume Docker pré-instalado.
3. **Produção online** — destino compatível com: Node.js persistente, PostgreSQL, Docker ou equivalente, armazenamento físico persistente, proxy reverso, HTTPS, variáveis de ambiente, migrations e backup. Registrado que hospedagem compartilhada tradicional sem esses recursos não é suficiente. **O código é o mesmo no ambiente local e online; somente as configurações mudam.**
4. **Dados locais existentes** — nenhuma limpeza automática do IndexedDB ou do localStorage (proibidos `indexedDB.deleteDatabase(...)`, `localStorage.clear()` e exclusões genéricas). Fluxo obrigatório: detectar → informar o que foi encontrado → migrar quando possível → confirmar gravação no PostgreSQL/storage → somente então permitir remoção manual ou explicitamente autorizada. Chaves da autenticação simulada removidas individualmente, identificadas pelo nome, sem afetar outros dados.
5. **Arquivos** — armazenados fisicamente em diretório configurável por variável de ambiente (`STORAGE_DIR`); o banco guarda apenas **caminho relativo** e metadados (ex.: `leads/LD2600001/arquivos/<uuid>.pdf`); nunca caminho absoluto no banco. O storage sobrevive a novo build, atualização de código, reinício e recriação do container da aplicação.
6. **Migrations e seeds** — migrations nunca apagam ou recriam tabelas automaticamente; seed do Administrador Master, grupos, perfis e permissões **idempotente** (reexecutar não duplica nem sobrescreve dados reais).
7. **Implementação em fases** — mantidas as fases (Fundação → Persistência real → Autenticação real → Arquivos reais → Publicação e backup), com **testes ao final de cada fase** antes de avançar.
8. **Entrega** — pacote final contendo: arquivos alterados, migrations, seeds, `docker-compose.yml`, `.env.example`, instruções completas para Windows, instruções para subir/parar os serviços, verificação do PostgreSQL, localização dos arquivos físicos, backup e restauração, checklist de homologação e limitações conhecidas.

**Status:** SPRINT 03.2 — EM DESENVOLVIMENTO. Sprint 04 não iniciada.
