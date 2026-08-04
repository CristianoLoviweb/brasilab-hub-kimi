# Brasilab Hub

Sistema Corporativo da **Brasilab Engenharia de Laboratórios**.

O **Brasilab Hub** é uma plataforma de gestão empresarial desenvolvida para centralizar todos os processos internos da empresa em um único ambiente, proporcionando organização, produtividade, rastreabilidade e segurança das informações.

Este projeto foi concebido para crescer de forma modular, acompanhando a evolução da empresa e permitindo a expansão contínua de novas funcionalidades.

---

# Sobre o Projeto

O Brasilab Hub não é apenas uma intranet.

É uma plataforma corporativa que integra todos os departamentos da empresa, desde o primeiro contato com o cliente até a entrega final do projeto, incluindo acompanhamento operacional, financeiro e administrativo.

Entre os principais objetivos estão:

- Centralizar as informações da empresa;
- Padronizar processos internos;
- Aumentar a produtividade das equipes;
- Reduzir retrabalho;
- Garantir rastreabilidade das operações;
- Facilitar a tomada de decisão através de indicadores e dashboards.

---

# Arquitetura Tecnológica

O projeto foi desenvolvido utilizando tecnologias modernas, priorizando organização, desempenho e escalabilidade.

## Frontend

- React 19
- TypeScript
- TanStack Router
- TanStack Query
- Vite
- Tailwind CSS

## Estrutura

A aplicação segue arquitetura modular, onde cada módulo possui sua própria organização interna contendo:

- Components
- Services
- Types
- Schemas
- Hooks
- Data
- Utils
- Config

Essa abordagem facilita a manutenção, reutilização de código e evolução contínua do sistema.

---

# Estrutura do Projeto

```text
docs/
    Documentação oficial do projeto

public/
    Arquivos públicos

src/

    assets/
        Logos, imagens e recursos gráficos

    components/
        Componentes reutilizáveis

    config/
        Configurações globais

    features/
        Módulos do sistema

    hooks/
        Hooks compartilhados

    lib/
        Utilidades e infraestrutura

    routes/
        Rotas da aplicação
```

---

# Documentação

Toda a documentação oficial encontra-se na pasta:

```text
/docs
```

A documentação é considerada a **fonte oficial da verdade**.

Antes de implementar qualquer funcionalidade, consulte sempre a documentação correspondente.

---

# Roadmap

A evolução do projeto segue rigorosamente o roadmap oficial disponível em:

```text
docs/ROADMAP.md
```

Funcionalidades futuras não devem ser antecipadas sem planejamento.

---

# Desenvolvimento

## Clonar o projeto

```bash
git clone <url-do-repositorio>
```

## Acessar a pasta

```bash
cd brasilab-hub
```

## Instalar dependências

```bash
npm install
```

## Executar ambiente de desenvolvimento

```bash
npm run dev
```

## Gerar build de produção

```bash
npm run build
```

---

# Padrões de Desenvolvimento

Todo desenvolvimento deve seguir os documentos presentes em:

```text
docs/
```

Especialmente:

- Arquitetura do Sistema
- Stack Tecnológica
- Design System
- Regras de Negócio
- Segurança da Informação
- Roadmap

Sempre priorize:

- reutilização de componentes;
- arquitetura modular;
- código limpo;
- tipagem forte;
- baixo acoplamento;
- alta coesão;
- padronização visual;
- documentação antes da implementação.

---

# Módulos

A plataforma foi projetada para ser composta por diversos módulos independentes.

Entre eles:

- Dashboard
- Administração
- Comercial
- CRM
- Leads
- Propostas
- Pedidos
- Produção
- Compras
- Estoque
- Financeiro
- Recursos Humanos
- Engenharia
- Qualidade
- Documentos
- Configurações

Novos módulos poderão ser incorporados futuramente conforme a evolução da empresa.

---

# Status Atual

Atualmente o projeto possui implementados:

- Sistema de autenticação (simulado)
- Layout principal da aplicação
- Dashboard
- Administração
  - Usuários
  - Grupos
  - Perfis
  - Permissões
  - Auditoria
- Comercial
  - Dashboard Comercial
  - Leads
  - Agenda Comercial

Os próximos módulos serão desenvolvidos conforme o roadmap oficial.

---

# Segurança

A plataforma foi projetada considerando princípios de segurança desde sua arquitetura.

Entre eles:

- Controle de acesso por grupos;
- Perfis e permissões;
- Isolamento entre módulos;
- Auditoria de ações;
- Proteção de informações sensíveis;
- Evolução preparada para autenticação real e backend seguro.

---

# Filosofia do Projeto

Antes de qualquer implementação, sempre responda às seguintes perguntas:

- A documentação já define essa funcionalidade?
- Existe alguma regra de negócio relacionada?
- Existe algum componente reutilizável?
- A arquitetura será preservada?
- A implementação está alinhada ao roadmap?

Caso qualquer resposta seja negativa, a implementação deve ser interrompida até que a documentação seja revisada.

---

# Licença

Projeto proprietário da **Brasilab Engenharia de Laboratórios**.

Uso interno e confidencial.

Todos os direitos reservados.