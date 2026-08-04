# 05_HISTORICOS.md

# Brasilab Intranet Lab

Versão: 1.0
Status: Em Planejamento
Data: Julho de 2026

---

# 1. OBJETIVO

Este documento estabelece as regras oficiais para registro de históricos na Brasilab Intranet Lab.

Seu objetivo é garantir a rastreabilidade completa das operações realizadas na plataforma.

Toda alteração relevante deverá gerar um registro de histórico.

Os históricos representam parte fundamental da auditoria da plataforma e deverão preservar a evolução das informações ao longo do tempo.

---

# 2. DEFINIÇÃO

Um Histórico representa o registro permanente de uma ação executada sobre uma entidade da plataforma.

O Histórico não deverá ser confundido com Log Técnico.

Enquanto o Log registra eventos técnicos da aplicação, o Histórico registra acontecimentos relacionados ao negócio.

Todo Histórico deverá permanecer preservado durante toda a vida útil da entidade.

---

# 3. PRINCÍPIOS FUNDAMENTAIS

Todo Histórico deverá obedecer aos seguintes princípios:

- rastreabilidade;
- integridade;
- cronologia;
- imutabilidade;
- clareza;
- identificação do responsável.

Registros históricos não deverão ser alterados ou excluídos após sua criação.

Sempre que possível deverão representar exatamente o que aconteceu.

---

# 4. OBJETIVOS DO HISTÓRICO

O Histórico deverá permitir responder perguntas como:

- Quem realizou determinada ação?
- Quando ela aconteceu?
- O que foi alterado?
- Qual era o valor anterior?
- Qual passou a ser o novo valor?
- Qual usuário executou a ação?
- Qual entidade foi afetada?

---

# 5. ESTRUTURA DO REGISTRO

Todo registro deverá possuir, no mínimo:

- entidade;
- identificador da entidade;
- tipo da ação;
- descrição;
- usuário responsável;
- data;
- horário.

Sempre que aplicável também deverão ser registrados:

- valor anterior;
- novo valor;
- observações;
- arquivos relacionados;
- revisão relacionada;
- IP;
- origem da operação.

---

# 6. APRESENTAÇÃO

O Histórico deverá ser apresentado em ordem cronológica.

O registro mais recente deverá aparecer primeiro.

Cada item deverá apresentar claramente:

- ícone da ação;
- descrição;
- usuário;
- data;
- horário.

Quando necessário poderão ser exibidas informações complementares.

---

# 7. HISTÓRICO DOS LEADS

As seguintes ações deverão gerar Histórico:

- Lead criado;
- Lead editado;
- alteração de responsável;
- contato registrado;
- observação adicionada;
- arquivo enviado;
- mudança de Status;
- conversão em Proposta;
- Lead perdido;
- Lead desqualificado.

Exemplo:

```text
31/07/2026 09:32

Cristiano Vieira

Registrou contato telefônico.

Cliente informou interesse em receber proposta.
```

---

# 8. HISTÓRICO DAS PROPOSTAS

Deverão gerar Histórico:

- criação da Proposta;
- criação da Revisão 0;
- criação de nova Revisão;
- envio ao cliente;
- retorno do cliente;
- alteração de valor;
- alteração da validade;
- alteração de pagamento;
- alteração de prazo;
- anexos enviados;
- aprovação;
- recusa;
- cancelamento;
- conversão em Pedido.

Exemplo:

```text
31/07/2026 14:05

Juliene Lourenço

Criou a Revisão 2.

Motivo:

Alterações solicitadas pelo cliente.
```

---

# 9. HISTÓRICO DOS PEDIDOS

Deverão gerar Histórico:

- Pedido criado;
- alteração de dados comerciais;
- alteração do local de instalação;
- alteração de observações;
- inclusão de item;
- remoção de item;
- alteração de quantidade;
- alteração de arquivos;
- criação de Ordem de Produção;
- exclusão de Ordem;
- alteração de Status.

Exemplo:

```text
Pedido PIB_26001

Ordem de Produção

OPB_26001_02

foi criada para o setor Marmoaria.
```

---

# 10. HISTÓRICO DAS ORDENS DE PRODUÇÃO

Deverão gerar Histórico:

- criação;
- edição;
- alteração de prioridade;
- alteração de responsável;
- início da produção;
- pausa;
- retomada;
- conclusão;
- cancelamento;
- exclusão (quando permitida).

Exemplo:

```text
OPB_26001_02

Produção iniciada.

Responsável:

José Carlos.
```

---

# 11. HISTÓRICO DAS COMPRAS

Deverão gerar Histórico:

- solicitação criada;
- fornecedor selecionado;
- cotação registrada;
- compra aprovada;
- compra cancelada;
- recebimento do material.

---

# 12. HISTÓRICO DO FINANCEIRO

Deverão gerar Histórico:

- título criado;
- vencimento alterado;
- boleto emitido;
- pagamento registrado;
- recebimento confirmado;
- estorno;
- cancelamento.

---

# 13. HISTÓRICO DOS ARQUIVOS

Deverão gerar Histórico:

- upload;
- exclusão;
- substituição;
- download (quando configurado);
- alteração de categoria;
- alteração de classificação;
- alteração de Revisão.

Exemplo:

```text
Arquivo

projeto_rev2.dwg

adicionado à Revisão 2.
```

---

# 14. HISTÓRICO DE SEGURANÇA

Algumas operações críticas também deverão gerar Histórico.

Exemplos:

- login;
- logout;
- alteração de senha;
- redefinição de senha;
- alteração de permissões;
- alteração de grupo;
- alteração de perfil;
- desbloqueio de usuário.

Essas informações também poderão ser utilizadas para auditoria.

---

# 15. HISTÓRICO AUTOMÁTICO

Sempre que possível os registros deverão ser gerados automaticamente.

O usuário não deverá precisar registrar manualmente ações executadas pelo sistema.

Exemplos:

- criação de Revisão;
- criação de Pedido;
- criação de OP;
- mudança de Status;
- geração automática de códigos.

---

# 16. HISTÓRICO MANUAL

Algumas ações poderão exigir descrição informada pelo usuário.

Exemplos:

- contato comercial;
- visita técnica;
- negociação;
- justificativa de cancelamento;
- justificativa de anulação;
- observações gerais.

Esses registros deverão identificar claramente o autor.

---

# 17. ALTERAÇÕES DE CAMPOS

Quando possível, o Histórico deverá informar:

Campo alterado.

Valor anterior.

Novo valor.

Exemplo:

```text
Valor da Proposta

Anterior

R$ 82.500,00

Novo

R$ 84.300,00
```

---

# 18. HISTÓRICO DE STATUS

Toda mudança de Status deverá gerar Histórico.

Exemplo:

```text
Status alterado

Em Projeto

↓

Enviada
```

O sistema deverá registrar:

- usuário;
- data;
- horário;
- Status anterior;
- novo Status.

---

# 19. HISTÓRICO DAS REVISÕES

Toda criação de Revisão deverá registrar:

- número da Revisão;
- usuário;
- motivo;
- data;
- horário;
- arquivos adicionados;
- principais alterações comerciais.

---

# 20. O QUE NÃO DEVERÁ GERAR HISTÓRICO

Operações meramente visuais não deverão gerar Histórico.

Exemplos:

- abrir tela;
- fechar tela;
- pesquisar;
- ordenar tabela;
- trocar página;
- alterar filtros;
- visualizar dashboard.

---

# 21. IMUTABILIDADE

Nenhum registro histórico deverá ser alterado após sua criação.

Caso uma informação tenha sido registrada incorretamente, uma nova ação deverá complementar o Histórico.

O Histórico deverá representar exatamente a sequência dos acontecimentos.

---

# 22. AUDITORIA

Os Históricos poderão ser utilizados como base para auditorias futuras.

Sempre que necessário deverão permitir reconstruir completamente a evolução de uma entidade.

---

# 23. PESQUISA

Futuramente o sistema poderá permitir pesquisa em Históricos.

Filtros previstos:

- usuário;
- período;
- módulo;
- entidade;
- tipo da ação.

---

# 24. COMPONENTE ÚNICO

Toda a plataforma deverá utilizar um único componente visual para apresentação dos Históricos.

Esse componente deverá ser reutilizado por todos os módulos.

Apenas o conteúdo será alterado.

---

# 25. EXEMPLO COMPLETO

```text
31/07/2026 09:00

Lead criado.

↓

31/07/2026 10:15

Contato registrado.

↓

31/07/2026 14:40

Proposta criada.

↓

31/07/2026 14:41

REV 0 criada automaticamente.

↓

01/08/2026 11:10

REV 1 criada.

↓

03/08/2026 16:20

Proposta aprovada.

↓

03/08/2026 16:30

Pedido PIB_26001 criado.

↓

04/08/2026 08:15

OPB_26001_01 criada.
```

---

# 26. RESULTADO ESPERADO

Qualquer implementação deverá produzir um Histórico completo, cronológico e imutável.

O usuário deverá conseguir compreender toda a evolução de uma entidade apenas consultando seu Histórico.

A plataforma deverá utilizar o mesmo padrão visual e estrutural em todos os módulos.

---

# 27. EVOLUÇÃO

Novos eventos poderão ser incorporados futuramente.

Entretanto:

- deverão possuir documentação;
- deverão seguir este padrão;
- deverão utilizar o componente oficial de Histórico.

---

# 28. CONSIDERAÇÕES FINAIS

O Histórico representa a memória operacional da Brasilab Intranet Lab.

Toda ação relevante deverá permanecer registrada de forma permanente, organizada e rastreável.

A qualidade dos Históricos será fundamental para auditorias, acompanhamento operacional e compreensão da evolução dos processos da empresa.

Fim do Documento.