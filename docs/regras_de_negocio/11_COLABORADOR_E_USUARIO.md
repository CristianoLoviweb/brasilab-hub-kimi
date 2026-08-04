# 11 — COLABORADOR E USUÁRIO

Status: Decisão arquitetural oficial
Data: Agosto de 2026
Origem: Refinamento Final da Sprint 02

---

# OBJETIVO

Registrar oficialmente a separação entre **Colaborador** (pessoa física) e
**Usuário** (conta de acesso ao sistema).

Esta decisão passa a fazer parte da arquitetura oficial da Brasilab Intranet Lab.

---

# COLABORADOR

Representa a pessoa física.

Pertence ao futuro módulo de RH.

Armazenará todos os dados pessoais e trabalhistas.

Exemplos:

- CPF
- RG
- Endereço
- Cargo
- Salário
- Benefícios
- Dependentes
- Jornada
- Banco
- PIX
- Documentos
- Férias
- Advertências
- Exames
- Histórico trabalhista

Esses dados NÃO pertencem ao módulo Administração.

---

# USUÁRIO

Representa apenas uma conta de acesso ao sistema.

Pertence ao módulo Administração.

Armazena somente informações de autenticação e autorização.

Exemplos:

- Login
- Senha
- MFA
- Grupo
- Perfil
- Permissões
- Sessões
- Tokens
- Último acesso
- Histórico de login

Nunca armazenará dados trabalhistas.

---

# RELACIONAMENTO

```text
Colaborador
     |
    0..1
     |
  Usuário
```

Um colaborador poderá existir sem possuir acesso.

Um usuário poderá existir sem possuir colaborador.

Exemplos de usuários sem colaborador:

- consultores;
- fornecedores;
- auditores;
- empresas terceirizadas;
- suporte externo.

---

# REGRAS OFICIAIS

- o cadastro do Colaborador independe do Usuário;
- criar Usuário é opcional;
- um Colaborador poderá possuir apenas um Usuário;
- excluir um Usuário nunca excluirá o Colaborador;
- desligar um Colaborador poderá bloquear automaticamente seu Usuário;
- permissões pertencem ao Usuário;
- dados trabalhistas pertencem ao Colaborador.

---

# FUTURO MÓDULO RH

O cadastro de Colaborador deverá possuir uma opção semelhante a:

Deseja criar um usuário para este colaborador?

( ) Não
( ) Sim

Caso a resposta seja NÃO: cadastrar apenas o colaborador.

Caso a resposta seja SIM: após salvar o colaborador, abrir a configuração da
conta de acesso.

Exemplos de campos da conta de acesso:

- login
- e-mail
- grupo
- perfil
- permissões especiais
- exigir troca de senha
- enviar convite
- status inicial

---

# MÓDULO ADMINISTRAÇÃO

## Criar usuário vinculado

Selecionar um colaborador existente e criar sua conta de acesso.

## Criar usuário independente

Criar uma conta sem vínculo com colaborador.

Exemplos:

- fornecedor;
- consultor;
- auditor;
- suporte técnico;
- terceiros.

---

# OBSERVAÇÃO SOBRE A IMPLEMENTAÇÃO ATUAL

Na Sprint 02 o módulo Administração implementa somente a entidade **Usuário**
(conta de acesso), com dados simulados.

Nenhuma funcionalidade de Colaborador ou do módulo RH foi iniciada.
