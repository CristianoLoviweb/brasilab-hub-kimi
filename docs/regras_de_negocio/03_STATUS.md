# 03_STATUS.md

# Brasilab Intranet Lab

Versão: 1.0
Status: Em Planejamento
Data: Julho de 2026

---

# 1. OBJETIVO

Este documento estabelece a política oficial de Status da Brasilab Intranet Lab.

Seu objetivo é definir o ciclo de vida das principais entidades da plataforma.

Cada módulo poderá possuir seus próprios Status.

Toda alteração de Status deverá respeitar obrigatoriamente este documento.

---

# 2. DEFINIÇÃO

Um Status representa o estado atual de uma entidade em determinado momento do seu ciclo de vida.

O Status deverá refletir exatamente a situação operacional do registro.

Ele nunca deverá ser utilizado apenas como elemento visual.

Mudanças de Status poderão gerar:

- histórico;
- notificações;
- auditoria;
- alterações em outros módulos;
- bloqueios;
- liberações.

---

# 3. PRINCÍPIOS FUNDAMENTAIS

Todo Status deverá obedecer aos seguintes princípios:

- representar apenas um estado real;
- possuir significado único;
- possuir regras claras de entrada;
- possuir regras claras de saída;
- gerar histórico;
- permitir rastreabilidade.

Nunca deverão existir dois Status diferentes representando a mesma situação.

---

# 4. STATUS DOS LEADS

Fluxo previsto:

```text
Novo
↓
Em Contato
↓
Qualificado
↓
Convertido
```

Situações alternativas:

```text
Novo
↓
Desqualificado
```

ou

```text
Novo
↓
Perdido
```

---

## NOVO

Representa um Lead recém recebido.

Entrada:

- criação manual;
- importação;
- APIs externas.

Saída:

- Em Contato
- Perdido
- Desqualificado

---

## EM CONTATO

Representa um Lead que já está sendo trabalhado.

O vendedor já iniciou relacionamento.

---

## QUALIFICADO

O Lead possui potencial para geração de Proposta.

---

## CONVERTIDO

Representa um Lead transformado em Proposta.

Ao entrar neste Status o sistema deverá:

- registrar histórico;
- criar vínculo com a Proposta;
- impedir nova conversão.

---

## PERDIDO

Representa um Lead perdido para concorrência ou desistência.

---

## DESQUALIFICADO

Representa um Lead que não atende ao perfil da empresa.

---

# 5. STATUS DAS PROPOSTAS

Fluxo principal:

```text
Em Projeto
↓
Enviada
↓
Em Negociação
↓
Aprovada
↓
Convertida em Pedido
```

Fluxos alternativos:

```text
Em Projeto
↓
Cancelada
```

```text
Enviada
↓
Recusada
```

```text
Em Negociação
↓
Expirada
```

---

## EM PROJETO

Status inicial.

A Proposta está sendo preparada.

---

## ENVIADA

A Proposta foi enviada ao cliente.

Ao entrar neste Status o sistema poderá:

- registrar histórico;
- registrar data do envio;
- permitir acompanhamento.

---

## EM NEGOCIAÇÃO

Cliente retornou solicitando alterações ou está negociando condições.

---

## APROVADA

Cliente aprovou comercialmente a Proposta.

A partir deste Status poderá ser criado o Pedido.

---

## CONVERTIDA EM PEDIDO

Representa que a Proposta originou um Pedido.

O vínculo entre Proposta e Pedido deverá permanecer permanente.

---

## RECUSADA

Cliente recusou a Proposta.

---

## CANCELADA

A Proposta foi cancelada internamente.

---

## EXPIRADA

Validade encerrada.

---

# 6. STATUS DOS PEDIDOS

Fluxo principal:

```text
Em Preparação
↓
Liberado
↓
Em Produção
↓
Produção Concluída
↓
Em Expedição
↓
Entregue
```

Situações alternativas:

```text
Cancelado
```

```text
Suspenso
```

Cada alteração poderá disparar ações nos módulos de Produção, Compras e Logística.

---

# 7. STATUS DAS ORDENS DE PRODUÇÃO

Fluxo principal:

```text
Planejamento
↓
Liberada
↓
Em Produção
↓
Pausada
↓
Em Produção
↓
Concluída
```

Também poderá existir:

```text
Cancelada
```

Cada mudança deverá registrar histórico.

---

# 8. STATUS DAS COMPRAS

Fluxo previsto:

```text
Solicitada
↓
Cotação
↓
Aprovada
↓
Comprada
↓
Recebida
```

Também poderá existir:

```text
Cancelada
```

---

# 9. STATUS FINANCEIROS

Exemplos previstos:

Contas a Receber

```text
Aberto
↓
Parcial
↓
Recebido
```

Contas a Pagar

```text
Aberto
↓
Parcial
↓
Pago
```

Também poderá existir:

```text
Cancelado
```

---

# 10. ALTERAÇÃO DE STATUS

Nem todo usuário poderá alterar qualquer Status.

Cada módulo poderá possuir regras específicas de permissão.

As permissões serão documentadas em:

```text
07_PERMISSOES_ESPECIAIS.md
```

---

# 11. HISTÓRICO

Toda alteração de Status deverá registrar:

- entidade;
- Status anterior;
- novo Status;
- usuário;
- data;
- hora;
- observações quando aplicável.

As regras completas serão documentadas em:

```text
05_HISTORICOS.md
```

---

# 12. NOTIFICAÇÕES

Algumas mudanças de Status poderão gerar notificações automáticas.

Exemplos:

- Proposta enviada.
- Proposta aprovada.
- Pedido liberado.
- Ordem concluída.
- Compra recebida.

As regras serão documentadas em:

```text
08_NOTIFICACOES.md
```

---

# 13. RESTRIÇÕES

Alguns Status poderão bloquear alterações.

Exemplo:

Uma Ordem concluída não poderá ser excluída.

Um Pedido entregue não poderá voltar para "Em Preparação".

Uma Proposta convertida em Pedido não poderá ser convertida novamente.

Cada módulo poderá possuir regras adicionais.

---

# 14. CONCORRÊNCIA

O sistema deverá impedir alterações simultâneas inconsistentes de Status.

Sempre que necessário deverão ser utilizadas transações.

---

# 15. EXEMPLOS COMPLETOS

## Fluxo Comercial

```text
Lead

↓

Novo

↓

Em Contato

↓

Qualificado

↓

Convertido

↓

Proposta

↓

Em Projeto

↓

Enviada

↓

Em Negociação

↓

Aprovada

↓

Pedido
```

---

## Fluxo Produção

```text
Pedido

↓

Liberado

↓

OP

↓

Planejamento

↓

Liberada

↓

Produção

↓

Concluída
```

---

## Fluxo Financeiro

```text
Pedido

↓

Faturado

↓

Conta a Receber

↓

Aberto

↓

Recebido
```

---

# 16. EVOLUÇÃO

Novos Status poderão ser adicionados futuramente.

Entretanto:

- deverão possuir documentação;
- deverão possuir regras de entrada;
- deverão possuir regras de saída;
- deverão gerar histórico quando necessário.

---

# 17. CONSIDERAÇÕES FINAIS

Os Status da Brasilab Intranet Lab representam o ciclo de vida oficial das entidades da plataforma.

Eles não deverão ser tratados apenas como indicadores visuais.

Cada mudança de Status deverá representar uma alteração real no processo de negócio, preservando rastreabilidade, auditoria e consistência entre os módulos.

Fim do Documento.