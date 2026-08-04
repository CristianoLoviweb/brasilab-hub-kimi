# 08_NOTIFICACOES.md

# Brasilab Intranet Lab

Versão: 1.0
Status: Em Planejamento
Data: Julho de 2026

---

# 1. OBJETIVO

Este documento estabelece as regras oficiais para geração, envio e gerenciamento de Notificações da Brasilab Intranet Lab.

Seu objetivo é garantir que os usuários sejam informados sobre eventos importantes da plataforma, mantendo comunicação eficiente entre os módulos e seus responsáveis.

Toda implementação relacionada às notificações deverá respeitar obrigatoriamente este documento.

---

# 2. DEFINIÇÃO

Uma Notificação representa um aviso gerado automaticamente pelo sistema ou por uma ação realizada por um usuário.

As notificações têm como finalidade informar acontecimentos relevantes que exijam conhecimento ou ação do destinatário.

As notificações não substituem os Históricos.

Enquanto o Histórico registra permanentemente um acontecimento, a Notificação serve para informar o usuário sobre esse acontecimento.

---

# 3. PRINCÍPIOS FUNDAMENTAIS

Toda Notificação deverá obedecer aos seguintes princípios:

- relevância;
- objetividade;
- clareza;
- rastreabilidade;
- oportunidade.

O sistema deverá evitar excesso de notificações desnecessárias.

Somente eventos importantes deverão gerar notificações automáticas.

---

# 4. TIPOS DE NOTIFICAÇÃO

Inicialmente a plataforma utilizará notificações internas.

Exemplos:

- aviso na barra superior;
- central de notificações;
- indicadores visuais.

Futuramente poderão ser adicionados:

- e-mail;
- WhatsApp;
- Push Notification;
- Microsoft Teams;
- Google Chat;
- outros canais.

A arquitetura deverá permitir essa evolução.

---

# 5. DESTINATÁRIOS

Uma Notificação poderá ser enviada para:

- usuário específico;
- responsável pela entidade;
- grupo;
- perfil;
- múltiplos usuários.

O sistema deverá determinar automaticamente os destinatários conforme as regras de negócio.

---

# 6. NOTIFICAÇÕES DOS LEADS

Poderão gerar Notificações:

- novo Lead recebido;
- Lead atribuído ao vendedor;
- Lead sem contato há determinado período;
- agendamento de contato vencido;
- contato agendado para hoje.

Exemplo:

```text
Novo Lead disponível para atendimento.
```

---

# 7. NOTIFICAÇÕES DAS PROPOSTAS

Poderão gerar Notificações:

- nova Proposta criada;
- nova Revisão criada;
- Proposta enviada ao cliente;
- Proposta próxima do vencimento;
- Proposta aprovada;
- Proposta recusada;
- Proposta convertida em Pedido.

Exemplo:

```text
A Proposta BL 600-04/26 foi aprovada pelo cliente.
```

---

# 8. NOTIFICAÇÕES DOS PEDIDOS

Poderão gerar Notificações:

- novo Pedido criado;
- Pedido liberado para Produção;
- Pedido alterado;
- Pedido cancelado;
- Pedido concluído.

---

# 9. NOTIFICAÇÕES DAS ORDENS DE PRODUÇÃO

Poderão gerar Notificações:

- Ordem criada;
- Ordem liberada;
- Produção iniciada;
- Produção pausada;
- Produção concluída;
- Ordem cancelada.

Exemplo:

```text
A Ordem OPB_26001_02 foi concluída.
```

---

# 10. NOTIFICAÇÕES DAS COMPRAS

Poderão gerar Notificações:

- solicitação criada;
- cotação pendente;
- compra aprovada;
- material recebido;
- atraso no recebimento.

---

# 11. NOTIFICAÇÕES DO FINANCEIRO

Poderão gerar Notificações:

- título próximo do vencimento;
- pagamento realizado;
- recebimento confirmado;
- boleto vencido;
- inadimplência.

---

# 12. NOTIFICAÇÕES DE ARQUIVOS

Poderão gerar Notificações:

- documento enviado;
- documento substituído;
- documento aprovado;
- documento recusado.

---

# 13. NOTIFICAÇÕES DE SEGURANÇA

Poderão gerar Notificações:

- alteração de senha;
- alteração de permissões;
- acesso suspeito;
- múltiplas tentativas de login;
- bloqueio de usuário.

---

# 14. PRIORIDADE

As Notificações poderão possuir níveis de prioridade.

## Baixa

Informações gerais.

---

## Média

Eventos que exigem acompanhamento.

---

## Alta

Eventos que exigem ação do usuário.

---

## Crítica

Eventos relacionados à segurança ou que possam comprometer a operação da empresa.

---

# 15. STATUS DAS NOTIFICAÇÕES

Cada Notificação poderá possuir um dos seguintes estados:

- Não Lida;
- Lida;
- Arquivada.

O sistema deverá registrar quando a Notificação foi visualizada.

---

# 16. AÇÕES AUTOMÁTICAS

Algumas Notificações poderão direcionar o usuário diretamente para a entidade relacionada.

Exemplo:

```text
Nova Ordem de Produção criada.

↓

Abrir Ordem
```

---

# 17. AGRUPAMENTO

Quando houver diversas Notificações semelhantes, o sistema poderá agrupá-las.

Exemplo:

```text
3 novas Propostas aguardam análise.
```

Ao invés de gerar três notificações independentes.

---

# 18. HISTÓRICO

A geração de uma Notificação poderá registrar Histórico quando a regra de negócio exigir.

O simples fato de um usuário visualizar uma Notificação não deverá gerar Histórico operacional.

---

# 19. EXPIRAÇÃO

Algumas Notificações poderão expirar automaticamente.

Exemplos:

- lembretes de contato;
- avisos de prazo;
- tarefas concluídas.

A política de expiração poderá variar conforme o tipo da Notificação.

---

# 20. CONFIGURAÇÕES FUTURAS

Futuramente o usuário poderá configurar:

- tipos de Notificação;
- horários de recebimento;
- canais de envio;
- frequência.

Essas configurações não fazem parte da primeira versão da plataforma.

---

# 21. EXEMPLOS

Exemplo 1:

```text
Novo Lead recebido.

Responsável:

Cristiano Vieira.
```

---

Exemplo 2:

```text
A Proposta BL 600-04/26 vence amanhã.
```

---

Exemplo 3:

```text
Pedido PIB_26001 liberado para Produção.
```

---

Exemplo 4:

```text
Material da Compra CPB_26008 foi recebido.
```

---

# 22. RESULTADO ESPERADO

O sistema deverá informar os usuários apenas sobre acontecimentos relevantes.

As Notificações deverão facilitar o acompanhamento das atividades sem gerar excesso de informações.

Toda Notificação deverá possuir contexto suficiente para que o usuário compreenda rapidamente o evento ocorrido.

---

# 23. EVOLUÇÃO

Novos tipos de Notificações poderão ser adicionados futuramente.

A arquitetura deverá permitir integração com novos canais de comunicação sem necessidade de alterar as regras de negócio existentes.

---

# 24. CONSIDERAÇÕES FINAIS

As Notificações representam o principal mecanismo de comunicação entre a plataforma e seus usuários.

Sua finalidade é manter cada colaborador informado sobre acontecimentos relevantes, prazos, responsabilidades e eventos importantes relacionados às suas atividades.

As Notificações deverão ser simples, objetivas, úteis e integradas aos demais módulos da Brasilab Intranet Lab.

Fim do Documento.