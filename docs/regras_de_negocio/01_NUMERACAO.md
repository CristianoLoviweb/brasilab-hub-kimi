# 01_NUMERACAO.md

# Brasilab Intranet Lab

Versão: 1.0
Status: Em Planejamento
Data: Julho de 2026

---

# 1. OBJETIVO

Este documento estabelece o padrão oficial de numeração utilizado pela Brasilab Intranet Lab.

Seu objetivo é garantir que todas as entidades do sistema possuam códigos únicos, padronizados e facilmente identificáveis.

Toda geração de códigos deverá respeitar obrigatoriamente este documento.

Nenhum código poderá ser criado manualmente quando existir geração automática.

---

# 2. PRINCÍPIOS GERAIS

Toda numeração deverá obedecer aos seguintes princípios:

- unicidade;
- rastreabilidade;
- legibilidade;
- padronização;
- estabilidade;
- não reutilização.

Um código nunca deverá ser reaproveitado, mesmo que o registro original seja cancelado ou excluído.

---

# 3. RESPONSABILIDADE DA GERAÇÃO

Toda geração de códigos será responsabilidade exclusiva da plataforma.

O usuário nunca deverá informar manualmente um código oficial.

Sempre que uma entidade for criada, o sistema deverá gerar automaticamente seu identificador.

---

# 4. ENTIDADES COM NUMERAÇÃO PRÓPRIA

Inicialmente possuirão código próprio:

- Leads
- Clientes
- Propostas
- Revisões
- Pedidos
- Ordens de Produção
- Compras
- Fornecedores
- Produtos
- Arquivos (quando aplicável)

Novas entidades poderão possuir padrões próprios futuramente.

---

# 5. PADRÕES GERAIS

Todo código deverá:

- ser único;
- possuir formato padronizado;
- ser facilmente identificado;
- permitir rastreamento;
- permanecer imutável após sua criação.

---

# 6. CÓDIGO DOS LEADS

O padrão definitivo será definido futuramente.

Exemplo ilustrativo:

```text
LD2600001
```

A estrutura oficial será documentada antes da implementação do módulo.

---

# 7. CÓDIGO DOS CLIENTES

O padrão definitivo será definido futuramente.

Exemplo ilustrativo:

```text
CLI260001
```

---

# 8. CÓDIGO DAS PROPOSTAS

Toda Proposta deverá possuir um código único gerado automaticamente pelo sistema.

O usuário nunca poderá alterar manualmente este código.

O código identifica permanentemente a Proposta durante todo o seu ciclo de vida.

---

## Formato

```text
BL 600-01/26
```

---

## Estrutura

```text
BL 600-01/26

│  │   │   │
│  │   │   └── Ano da criação (2 dígitos)
│  │   └────── Sequencial Secundário
│  └────────── Sequencial Principal
└───────────── Prefixo da empresa
```

Onde:

**BL**

Identifica que o documento pertence à Brasilab.

---

**600**

Representa o Sequencial Principal.

Este número é incrementado somente quando o Sequencial Secundário atingir seu limite máximo.

---

**01**

Representa o Sequencial Secundário.

Este número inicia em **01** e é incrementado a cada nova Proposta.

Quando atingir **10**, o próximo cadastro deverá:

- incrementar o Sequencial Principal em 1;
- reiniciar o Sequencial Secundário para **01**.

---

**26**

Representa o ano de criação da Proposta.

São utilizados apenas os dois últimos dígitos do ano.

Exemplo:

2026 → 26

2027 → 27

---

## Exemplo de geração

```text
BL 600-01/26

BL 600-02/26

BL 600-03/26

...

BL 600-09/26

BL 600-10/26

↓

Próxima proposta

↓

BL 601-01/26

BL 601-02/26
```

---

## Algoritmo de geração

Ao criar uma nova Proposta o sistema deverá:

1. Localizar a última Proposta cadastrada.

2. Ler o Sequencial Principal.

3. Ler o Sequencial Secundário.

4. Ler o ano.

5. Caso o Sequencial Secundário seja menor que 10:

- incrementar apenas o Sequencial Secundário.

6. Caso o Sequencial Secundário seja igual a 10:

- incrementar o Sequencial Principal;
- reiniciar o Sequencial Secundário para 01.

7. Utilizar sempre o ano corrente.

8. Gerar o novo código.

---

## Cancelamentos

Caso uma Proposta seja cancelada, seu código permanecerá reservado.

Nunca deverá existir reaproveitamento de códigos.

---

## Exclusões

Mesmo que uma Proposta seja excluída, seu código nunca deverá ser reutilizado.

A sequência deverá permanecer contínua.

---

## Revisões

As Revisões não alteram o código da Proposta.

Uma mesma Proposta poderá possuir diversas Revisões.

Exemplo:

```text
BL 600-04/26

REV 0

REV 1

REV 2
```

A lógica completa das Revisões será documentada em:

```text
02_REVISOES.md
```

---

# 9. REVISÕES DA PROPOSTA

A Revisão não possuirá código próprio.

Ela utilizará o código da Proposta acompanhado do número da Revisão.

Exemplo:

```text
BL 600-01/26

REV 0

REV 1

REV 2
```

A lógica completa das Revisões será documentada em:

```text
02_REVISOES.md
```

---

# 10. CÓDIGO DOS PEDIDOS

O Pedido possuirá código próprio.

Formato atualmente adotado como referência:

```text
PIB_26001
```

Estrutura:

```text
P

↓

I

↓

B

↓

Ano

↓

Sequencial
```

Onde:

P

Pedido

I

Interno

B

Brasilab

26

Ano

001

Sequencial

Exemplo:

```text
PIB_26001

PIB_26002

PIB_26003
```

Regras:

- gerado automaticamente;
- nunca reutilizado;
- independente da Proposta;
- permanece inalterado durante toda a vida do Pedido.

---

# 11. CÓDIGO DAS ORDENS DE PRODUÇÃO

Cada Ordem possuirá código próprio.

Formato atualmente utilizado como referência:

```text
OPB_26001_01
```

Estrutura:

```text
OP

↓

Brasilab

↓

Ano

↓

Pedido

↓

Sequencial da Ordem
```

Exemplo:

```text
OPB_26001_01

OPB_26001_02

OPB_26001_03
```

Regras:

- uma Proposta poderá gerar um Pedido;
- um Pedido poderá gerar diversas Ordens;
- cada Ordem possuirá sequência própria dentro do Pedido.

---

# 12. CÓDIGO DAS COMPRAS

Formato definitivo será definido posteriormente.

Exemplo:

```text
CPB_260001
```

---

# 13. CÓDIGO DOS PRODUTOS

A definição será realizada durante o desenvolvimento do módulo de Produtos.

---

# 14. CÓDIGO DOS FORNECEDORES

A definição será realizada durante o desenvolvimento do módulo de Fornecedores.

---

# 15. CÓDIGOS DOS ARQUIVOS

Arquivos poderão possuir um identificador interno.

Este identificador não substituirá o nome original enviado pelo usuário.

O objetivo será garantir unicidade e rastreabilidade.

---

# 16. CANCELAMENTOS

O cancelamento de uma entidade não deverá liberar sua numeração.

Exemplo:

```text
PIB_26015

(cancelado)

↓

O próximo continuará sendo

PIB_26016
```

Nunca deverá existir reaproveitamento de códigos.

---

# 17. EXCLUSÕES

Mesmo quando um registro for removido, sua numeração nunca deverá ser reutilizada.

Sempre deverá existir continuidade da sequência.

---

# 18. IMPORTAÇÃO DE DADOS

Quando dados forem importados de sistemas anteriores, deverá existir estratégia específica para preservar rastreabilidade.

A política de migração será definida posteriormente.

---

# 19. EVOLUÇÃO

Novos módulos poderão definir novos padrões de numeração.

Entretanto:

- deverão permanecer compatíveis com esta política;
- deverão possuir documentação própria;
- deverão ser aprovados antes da implementação.

---

# 20. CONSIDERAÇÕES FINAIS

A numeração oficial da Brasilab Intranet Lab representa um dos pilares da rastreabilidade da plataforma.

Nenhuma entidade deverá possuir geração de código fora dos padrões estabelecidos neste documento.

Toda evolução da política de numeração deverá preservar compatibilidade, organização e histórico dos registros.

Fim do Documento.