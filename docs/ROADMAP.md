# ROADMAP.md

# Brasilab Intranet Lab

Versão: 1.0
Status: Em Planejamento
Data: Julho de 2026

---

# 1. OBJETIVO

Este documento estabelece o Roadmap Oficial de Desenvolvimento da Brasilab Intranet Lab.

Seu objetivo é organizar toda a evolução da plataforma em Fases e Sprints independentes, permitindo que cada etapa implemente apenas o conjunto de funcionalidades previsto.

Cada Sprint deverá possuir um objetivo claramente definido.

Nenhuma Sprint deverá implementar funcionalidades pertencentes a etapas futuras.

A evolução da plataforma deverá respeitar obrigatoriamente este Roadmap.

---

# 2. FILOSOFIA DE DESENVOLVIMENTO

A Brasilab Intranet Lab será construída de forma incremental.

Cada Sprint deverá produzir uma versão funcional da plataforma.

Durante cada Sprint deverão ser respeitados os seguintes princípios:

- desenvolver apenas o escopo previsto;
- evitar funcionalidades extras;
- evitar antecipação de módulos;
- preservar a arquitetura existente;
- respeitar toda a documentação oficial;
- respeitar todas as regras de negócio.

Uma Sprint somente será considerada concluída quando todas as funcionalidades previstas estiverem implementadas e funcionando corretamente.

---

# 3. ORGANIZAÇÃO DO PROJETO

O desenvolvimento será dividido em Fases.

Cada Fase será composta por uma ou mais Sprints.

Cada Sprint possuirá um Prompt próprio durante sua implementação.

---

# FASE 01 — FUNDAÇÃO

Objetivo:

Construir toda a infraestrutura da plataforma.

Ao final desta fase o usuário deverá conseguir utilizar uma Intranet completamente funcional, mesmo que os módulos de negócio ainda não estejam implementados.

---

## Sprint 01 — Estrutura da Plataforma

### Objetivo

Construir toda a base visual, arquitetural e de navegação da plataforma.

---

### Escopo

#### Autenticação

- Login
- Logout
- Estrutura para recuperação de senha
- Controle de sessão

---

#### Layout

- Sidebar
- Header
- Footer
- Breadcrumb
- Layout responsivo
- Sistema de navegação

---

#### Dashboard

Construir o Dashboard principal da plataforma.

Nesta Sprint todos os dados deverão ser simulados (Mock Data).

O objetivo é construir apenas a interface.

O Dashboard deverá possuir:

- saudação ao usuário;
- cards de indicadores;
- atividades recentes;
- agenda do dia;
- pendências;
- atalhos rápidos;
- notificações;
- avisos;
- gráficos ilustrativos;
- painel de ações rápidas.

Nenhuma informação deverá vir do banco de dados nesta Sprint.

---

#### Componentes Base

Criar todos os componentes reutilizáveis da plataforma.

Exemplos:

- Botões
- Cards
- Inputs
- Selects
- Modais
- Drawers
- Tabelas
- Badges
- Alertas
- Toasts
- Skeleton Loading
- Empty States
- Paginação
- Campo de Pesquisa

Todos os módulos futuros deverão reutilizar esses componentes.

---

#### Navegação

Todos os módulos deverão aparecer na Sidebar.

Mesmo que ainda não estejam implementados.

Ao acessar um módulo não desenvolvido deverá ser exibida uma página informando:

```text
Este módulo será desenvolvido em uma Sprint futura.
```

---

### Não desenvolver nesta Sprint

- Leads
- Clientes
- Propostas
- Pedidos
- Produção
- Compras
- Produtos
- Financeiro
- Relatórios

---

### Resultado Esperado

Ao final desta Sprint deverá existir uma Intranet moderna, elegante e totalmente navegável.

---

## Sprint 02 — Usuários

Objetivo:

Implementar o gerenciamento de usuários.

Escopo:

- Cadastro
- Edição
- Exclusão
- Perfis
- Grupos
- Permissões Gerais
- Permissões Especiais
- Alteração de senha
- Histórico
- Auditoria

---

# FASE 02 — COMERCIAL

Objetivo:

Implementar todo o processo comercial da empresa.

---

## Sprint 03 — Leads

Escopo:

- Cadastro
- Listagem
- Detalhes
- Histórico
- Agenda Comercial
- Contatos
- Arquivos
- Conversão em Proposta

---

## Sprint 03.1 — Preparação do Projeto para Ambiente Real

Status: concluída.

Escopo entregue:

- Remoção integral dos dados fictícios utilizados nas Sprints 01–03 (usuários, leads, dashboard, auditoria)
- Usuário único inicial: Administrador Master (Grupo Administração, Perfil Master, todas as permissões)
- Autenticação simulada por e-mail e senha, exclusiva do usuário master, com senha armazenada como hash
- Remoção do seletor de desenvolvimento (DevGroupSwitcher)
- Dashboard funcional com indicadores zerados e componentes de estado vazio
- Módulos funcionais com listagens vazias ("Nenhum registro encontrado.")
- Manutenção de Grupos, Perfis, Permissões, Matriz de permissões, rotas, componentes, layout, arquitetura e Design System

Revisão 01 — correções de homologação:

- Upload real de arquivos do Lead (IndexedDB, sem localStorage e sem Base64): anexar, visualizar, abrir, baixar e excluir, com registro no Histórico e na Auditoria
- Dashboard dinâmico: todos os indicadores calculados pelos Services a cada montagem dos Widgets
- Correção do cabeçalho dos cards no componente reutilizável (SectionCard), aplicada a todas as telas

Revisão 02 — ajustes finais do módulo de Leads:

- Edição e exclusão de compromissos da agenda do Lead, com confirmação de exclusão e registro no Histórico (dados anteriores e novos) e na Auditoria
- Visualização de imagens (JPG, JPEG, PNG, WEBP, GIF) e PDF em modal dentro da aplicação, com download e liberação das URLs temporárias; demais formatos seguem abrindo em nova aba

---

## Sprint 03.2 — Infraestrutura e Migração para Servidor Online

Status: concluída (homologação local com PostgreSQL).

Escopo entregue:

- PostgreSQL 16 como banco exclusivo da aplicação (desenvolvimento, homologação, testes de integração e produção) — sem SQLite
- Camada de servidor completa: repositórios (Drizzle ORM), Services com a mesma lógica homologada das Sprints anteriores, Server Functions com validação e autorização no servidor
- Autenticação real: sessão em cookie HttpOnly, senha com hash argon2id, revogação no logout e limite de tentativas de login
- Persistência real de Leads (agregado transacional), usuários, grupos, perfis e auditoria
- Arquivos reais: upload multipart, storage físico configurável por variável de ambiente, caminho relativo no banco (leads/<código>/arquivos/<uuid>.<ext>), streaming com suporte a Range
- Tratamento dos dados locais legados: detecção e aviso ao usuário, sem exclusão automática; remoção individual e nomeada das chaves da autenticação simulada
- Migrations SQL versionadas (nunca apagam nem recriam tabelas) e seed idempotente (Administrador Master, grupos, perfis e permissões)
- Docker Compose com aplicação + PostgreSQL + volumes persistentes (banco e storage)
- Documentação de publicação em produção (proxy reverso, HTTPS, variáveis de ambiente, backup e restauração) em docs/sprint-03.2/DEPLOY_PRODUCAO.md

---

## Sprint 04 — Propostas

Escopo:

- Propostas Manuais
- Propostas Automáticas
- Revisões
- Histórico
- Arquivos
- Agenda
- Aprovação
- Conversão em Pedido

---

## Sprint 05 — Pedidos

Escopo:

- Cadastro
- Detalhes
- Abas
- Arquivos
- Histórico
- Informações Comerciais
- Informações Técnicas
- Geração de Ordens de Produção

---

# FASE 03 — OPERAÇÃO

Objetivo:

Implementar os módulos responsáveis pela execução operacional da empresa.

---

## Sprint 06 — Ordens de Produção

Escopo:

- Cadastro
- Planejamento
- Prioridades
- Responsáveis
- Produção
- Arquivos
- Histórico
- Status

---

## Sprint 07 — Compras

Escopo:

- Solicitações
- Cotações
- Fornecedores
- Compras
- Recebimentos
- Arquivos
- Histórico

---

## Sprint 08 — Clientes

Escopo:

- Pessoa Física
- Pessoa Jurídica
- Contatos
- Endereços
- Histórico
- Arquivos

---

## Sprint 09 — Produtos

Escopo:

- Cadastro
- Categorias
- Especificações
- Imagens
- Arquivos
- Relacionamentos

---

## Sprint 10 — Fornecedores

Escopo:

- Cadastro
- Contatos
- Documentos
- Histórico
- Arquivos

---

# FASE 04 — GESTÃO

Objetivo:

Implementar os módulos gerenciais da plataforma.

---

## Sprint 11 — Financeiro

Escopo:

- Contas a Receber
- Contas a Pagar
- Fluxo de Caixa
- Boletos
- Pagamentos
- Recebimentos
- Conciliação
- Histórico

---

## Sprint 12 — Dashboards

Escopo:

- Dashboard Executivo
- Dashboard Comercial
- Dashboard Produção
- Dashboard Financeiro
- Indicadores
- KPIs
- Gráficos

---

## Sprint 13 — Relatórios

Escopo:

- Relatórios Comerciais
- Relatórios Operacionais
- Relatórios Financeiros
- Exportações
- Impressões

---

## Sprint 14 — Configurações

Escopo:

- Empresas
- Numeração
- Categorias
- Parâmetros
- Preferências
- Integrações
- Segurança

---

# FASE 05 — REFINAMENTO

Objetivo:

Transformar a plataforma em um sistema corporativo de alta qualidade.

---

## Sprint 15 — Refinamento Geral

Escopo:

- UX
- UI
- Performance
- Componentização
- Acessibilidade
- Responsividade
- Otimizações
- Revisão completa da plataforma

---

# 4. REGRAS GERAIS

Durante qualquer Sprint deverão ser respeitados obrigatoriamente:

- PROJECT_CHARTER.md
- 00_PROJETO.md
- Documentação oficial
- Regras de Negócio
- Design System
- Arquitetura da Plataforma
- Stack Tecnológica
- Diretrizes para IA

Nenhuma Sprint poderá contrariar esses documentos.

---

# 5. CRITÉRIOS DE CONCLUSÃO

Uma Sprint somente será considerada concluída quando:

- todas as funcionalidades previstas estiverem implementadas;
- não existirem erros conhecidos;
- os componentes estiverem reutilizáveis;
- a interface seguir o Design System;
- as regras de negócio forem respeitadas;
- a documentação permanecer compatível.

Somente após essa validação deverá ser iniciada a Sprint seguinte.

---

# 6. EVOLUÇÃO

Este Roadmap poderá evoluir durante o desenvolvimento da plataforma.

Novas Fases e novas Sprints poderão ser adicionadas.

Entretanto:

- deverão respeitar a arquitetura existente;
- deverão possuir documentação;
- deverão ser aprovadas antes da implementação.

---

# 7. CONSIDERAÇÕES FINAIS

O Roadmap representa o plano oficial de desenvolvimento da Brasilab Intranet Lab.

Toda implementação deverá seguir rigorosamente a sequência estabelecida neste documento, garantindo que a plataforma evolua de forma organizada, consistente e sustentável.

Cada Sprint deverá entregar uma plataforma mais completa que a anterior, preservando a qualidade do código, a arquitetura do sistema, as regras de negócio e a experiência do usuário.

Fim do Documento.
