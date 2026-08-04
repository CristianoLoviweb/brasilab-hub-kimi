# 10_EVENTOS_DO_SISTEMA.md

# Brasilab Intranet Lab

Versão: 1.0
Status: Em Planejamento
Data: Julho de 2026

---

# 1. OBJETIVO

Este documento estabelece a política oficial de Eventos da Brasilab Intranet Lab.

Seu objetivo é definir todos os eventos relevantes gerados pela plataforma e padronizar seu comportamento.

Os Eventos representam acontecimentos importantes do sistema e poderão ser utilizados por diversos módulos simultaneamente.

Toda implementação relacionada aos Eventos deverá respeitar obrigatoriamente este documento.

---

# 2. DEFINIÇÃO

Um Evento representa um acontecimento relevante ocorrido dentro da plataforma.

Os Eventos deverão ser gerados sempre que uma ação importante for concluída.

Um Evento não representa uma tela, um botão ou uma funcionalidade.

Ele representa um fato ocorrido.

Exemplos:

- Lead criado;
- Proposta aprovada;
- Pedido gerado;
- Arquivo enviado;
- Ordem concluída.

---

# 3. OBJETIVOS

Os Eventos deverão permitir que diferentes módulos da plataforma reajam automaticamente a uma mesma ação.

Um único Evento poderá ser utilizado para:

- registrar Histórico;
- gerar Notificação;
- atualizar indicadores;
- registrar Auditoria;
- executar integrações futuras;
- alimentar Dashboards.

---

# 4. PRINCÍPIOS FUNDAMENTAIS

Todo Evento deverá obedecer aos seguintes princípios:

- representar um fato ocorrido;
- possuir identificação única;
- possuir nome padronizado;
- ser rastreável;
- possuir data e horário;
- possuir entidade relacionada;
- possuir usuário responsável, quando aplicável.

---

# 5. PADRÃO DE NOMENCLATURA

Os Eventos deverão utilizar nomenclatura padronizada.

Formato:

```text
entidade.acao
```

Exemplos:

```text
lead.created
lead.updated
lead.converted

proposal.created
proposal.revision.created
proposal.approved

order.created

production.started

purchase.received
```

Toda nomenclatura deverá utilizar letras minúsculas.

Separadores deverão utilizar ponto (.).

---

# 6. EVENTOS DOS LEADS

Eventos previstos:

```text
lead.created

lead.updated

lead.assigned

lead.contact.created

lead.converted

lead.lost

lead.disqualified
```

---

# 7. EVENTOS DAS PROPOSTAS

Eventos previstos:

```text
proposal.created

proposal.updated

proposal.sent

proposal.revision.created

proposal.approved

proposal.rejected

proposal.cancelled

proposal.converted
```

---

# 8. EVENTOS DOS PEDIDOS

Eventos previstos:

```text
order.created

order.updated

order.cancelled

order.completed
```

---

# 9. EVENTOS DAS ORDENS DE PRODUÇÃO

Eventos previstos:

```text
production.created

production.started

production.paused

production.resumed

production.completed

production.cancelled
```

---

# 10. EVENTOS DAS COMPRAS

Eventos previstos:

```text
purchase.created

purchase.quoted

purchase.approved

purchase.received

purchase.cancelled
```

---

# 11. EVENTOS DO FINANCEIRO

Eventos previstos:

```text
financial.created

financial.paid

financial.received

financial.cancelled
```

---

# 12. EVENTOS DOS ARQUIVOS

Eventos previstos:

```text
file.uploaded

file.updated

file.deleted

file.downloaded

file.classified
```

---

# 13. EVENTOS DOS USUÁRIOS

Eventos previstos:

```text
user.created

user.updated

user.login

user.logout

user.password.changed

user.permissions.changed
```

---

# 14. DADOS DO EVENTO

Todo Evento deverá registrar, quando aplicável:

- identificador;
- entidade;
- ação;
- usuário;
- data;
- horário;
- módulo;
- origem;
- entidade relacionada.

Esses dados poderão ser utilizados por diferentes módulos.

---

# 15. DISPARADORES

Um Evento poderá disparar automaticamente outras ações.

Exemplo:

```text
proposal.approved

↓

Histórico

↓

Notificação

↓

Atualização do Dashboard

↓

Liberação para criação do Pedido
```

Outro exemplo:

```text
file.uploaded

↓

Histórico

↓

Atualização da lista de arquivos

↓

Notificação (quando aplicável)
```

---

# 16. MÚLTIPLOS DESTINOS

O mesmo Evento poderá ser utilizado simultaneamente por diferentes módulos.

Exemplo:

```text
proposal.approved

↓

Histórico

↓

Financeiro

↓

Dashboard

↓

Comercial

↓

Notificações
```

Nenhum módulo deverá precisar criar novamente um Evento já existente.

---

# 17. EVENTOS FUTUROS

A arquitetura deverá permitir utilização futura dos Eventos para:

- integrações externas;
- APIs;
- Webhooks;
- automações;
- BI;
- Inteligência Artificial;
- aplicativos móveis;
- notificações em tempo real.

A implementação dessas funcionalidades não faz parte da primeira versão da plataforma.

---

# 18. EVENTOS E HISTÓRICOS

Nem todo Evento deverá gerar Histórico.

Entretanto, praticamente todo Histórico será originado por um Evento.

Os documentos deverão permanecer independentes.

---

# 19. EVENTOS E NOTIFICAÇÕES

Nem todo Evento deverá gerar Notificação.

Cada módulo decidirá quais Eventos deverão ser comunicados aos usuários.

---

# 20. EVENTOS E AUDITORIA

Eventos relacionados à segurança poderão gerar Auditoria automaticamente.

Exemplos:

```text
user.login

user.password.changed

permissions.updated
```

---

# 21. EVOLUÇÃO

Novos Eventos poderão ser adicionados futuramente.

Entretanto:

- deverão seguir o padrão oficial;
- deverão possuir documentação;
- deverão evitar duplicidade;
- deverão permanecer compatíveis com esta política.

---

# 22. EXEMPLO COMPLETO

Fluxo:

```text
Lead criado

↓

Evento

lead.created

↓

Histórico

↓

Dashboard

↓

Notificação
```

Outro exemplo:

```text
Proposta aprovada

↓

Evento

proposal.approved

↓

Histórico

↓

Notificação

↓

Atualização da Proposta

↓

Liberação do Pedido

↓

Indicadores
```

---

# 23. RESULTADO ESPERADO

Os Eventos deverão representar todos os acontecimentos importantes da plataforma.

Eles deverão funcionar como mecanismo central de comunicação entre os módulos, permitindo reutilização, rastreabilidade e futura integração com novos recursos.

---

# 24. CONSIDERAÇÕES FINAIS

Os Eventos do Sistema representam a base para a comunicação interna da Brasilab Intranet Lab.

Toda evolução da plataforma deverá priorizar o reaproveitamento dos Eventos existentes antes da criação de novos.

A utilização de Eventos permitirá que diferentes módulos trabalhem de forma integrada, desacoplada e preparada para futuras expansões, mantendo a arquitetura organizada e consistente.

Fim do Documento.