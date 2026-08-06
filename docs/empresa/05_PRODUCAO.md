# SISTEMA DE PRODUÇÃO DA BRASILAB

**Documento:** 05_PRODUCAO.md  
**Versão:** 2.0  
**Status:** Documento Mestre  
**Última atualização:** 06/08/2026

---

# Objetivo

Este documento define o funcionamento do Sistema de Produção da Brasilab.

Seu objetivo é descrever como a empresa transforma um Pedido Comercial aprovado em produtos físicos prontos para entrega, garantindo organização, qualidade, rastreabilidade, produtividade e cumprimento dos prazos assumidos com o cliente.

O Sistema de Produção representa o principal núcleo operacional da empresa.

É nele que todo o planejamento realizado pelos departamentos Comercial, Financeiro, Compras e Gestão de Materiais passa a ser executado.

---

# Missão

A missão da Produção é fabricar cada Projeto exatamente conforme aprovado pelo cliente, utilizando corretamente os recursos da empresa e entregando produtos com qualidade, segurança e dentro do prazo estabelecido.

A Produção não fabrica móveis.

A Produção entrega soluções completas para laboratórios.

---

# Filosofia da Produção

A Produção da Brasilab trabalha baseada em quatro princípios.

- Planejamento antes da execução.
- Organização por setores especializados.
- Independência entre Ordens de Produção.
- Compromisso com o prazo do cliente.

Nenhuma decisão operacional deverá comprometer a qualidade final do Projeto.

---

# O Papel do Gerente Operacional (PCP)

O Gerente Operacional é o responsável pelo Planejamento e Controle da Produção (PCP).

Ele atua como coordenador de toda a operação da fábrica.

Entre suas responsabilidades estão:

- analisar os Pedidos aprovados;
- estudar o Projeto;
- identificar quais setores participarão da fabricação;
- dividir o Pedido em Ordens de Produção independentes;
- definir prioridades;
- acompanhar o andamento da fábrica;
- redistribuir prioridades quando necessário;
- acompanhar gargalos produtivos;
- coordenar Compras, Produção, Logística e Financeiro quando necessário.

O Gerente Operacional não executa a produção.

Ele coordena toda a operação da fábrica.

---

# Quando a Produção Começa

A Produção somente poderá iniciar quando existirem condições mínimas para fabricação.

Entre elas:

- Pedido aprovado;
- Planejamento Financeiro aprovado;
- materiais disponíveis ou com previsão compatível;
- Ordem de Produção emitida.

Sem essas condições a Produção permanecerá em planejamento.

---

# Fluxo Geral da Produção

Todo Pedido seguirá, sempre que possível, o fluxo abaixo.

```
Pedido

↓

Análise Operacional

↓

Planejamento da Produção

↓

Divisão em Ordens de Produção

↓

Fila dos Setores

↓

Execução

↓

Controle de Qualidade

↓

Conclusão das OPs

↓

Liberação para Logística
```

---

# Planejamento da Produção

Antes da emissão das Ordens de Produção o Gerente Operacional deverá responder perguntas como:

- quais setores participarão?

- quais materiais ainda precisam chegar?

- existe capacidade produtiva?

- existem riscos para o prazo?

- haverá terceirização?

- existe necessidade de prioridade especial?

Esse planejamento reduz retrabalho e melhora a utilização dos recursos da fábrica.

---

# Ordem de Produção

A Ordem de Produção representa a autorização oficial para execução de um determinado serviço.

Nenhuma atividade produtiva deverá iniciar sem uma Ordem de Produção.

Cada Ordem deverá conter:

- código;
- Pedido de origem;
- setor responsável;
- descrição do serviço;
- prioridade;
- responsável;
- datas previstas;
- observações técnicas.

---

# Um Pedido Pode Gerar Diversas Ordens

A Produção da Brasilab trabalha com Ordens independentes.

Um único Pedido poderá gerar diversas Ordens de Produção.

Exemplo:

```
Pedido

PIB260018

↓

OP260201

Marcenaria

↓

OP260202

Marmoraria

↓

OP260203

Serralheria

↓

OP260204

Pintura

↓

OP260205

Terceiros
```

Cada Ordem pertence exclusivamente a um setor.

Cada Ordem possui vida própria.

Cada Ordem possui cronograma próprio.

---

# Independência entre as Ordens

As Ordens de Produção não precisam evoluir simultaneamente.

Exemplo:

A Marmoraria poderá concluir sua Ordem antes da Marcenaria.

A Marcenaria poderá iniciar dias depois.

Isso faz parte da operação normal da fábrica.

O Pedido permanecerá em andamento até que todas as Ordens estejam concluídas.

---

# Setores da Produção

O sistema deverá permitir diferentes setores produtivos.

Exemplos:

- Marcenaria;
- Marmoraria;
- Serralheria;
- Pintura;
- Montagem;
- Terceiros.

Novos setores poderão ser criados conforme o crescimento da empresa.

---

# Fila Inteligente de Produção

Cada setor possui sua própria fila de produção.

As Ordens de Produção não serão executadas obrigatoriamente pela ordem de criação.

A posição de cada Ordem na fila deverá considerar diversos fatores operacionais.

---

# Critérios de Priorização

A prioridade das Ordens poderá considerar:

- prazo de entrega do Pedido;
- prioridade definida pelo Gerente Operacional;
- disponibilidade de materiais;
- capacidade produtiva do setor;
- dependência de outras Ordens;
- necessidades estratégicas da empresa.

O sistema poderá sugerir prioridades automaticamente.

A decisão final será sempre do Gerente Operacional.

---

# Regra Operacional

A Produção da Brasilab não trabalha pelo conceito de:

> Primeiro que entrou, primeiro que sai.

A Produção trabalha para cumprir os compromissos assumidos com os clientes.

Sempre que necessário o Gerente Operacional poderá alterar manualmente a ordem da fila para garantir:

- cumprimento dos prazos;
- melhor utilização da fábrica;
- redução de gargalos;
- atendimento de prioridades estratégicas.

---

# Materiais

Antes do início de cada Ordem deverão ser verificados:

- materiais disponíveis;
- materiais reservados;
- materiais pendentes;
- materiais em compra.

A Produção não deverá iniciar Ordens sem condições adequadas.

---

# Execução

Durante a execução da Ordem deverão ser registrados eventos relevantes.

Exemplos:

- início;
- pausa;
- retomada;
- conclusão;
- necessidade de materiais adicionais;
- problemas encontrados;
- observações técnicas;
- retrabalhos.

Esses registros formarão o histórico da Ordem.

---

# Controle de Qualidade

Toda Ordem deverá passar por conferência antes de ser considerada concluída.

A conferência deverá verificar:

- medidas;
- acabamento;
- funcionamento;
- conformidade com o Projeto;
- qualidade geral.

Ordens reprovadas retornarão para correção.

---

# Retrabalho

Sempre que ocorrer retrabalho deverão ser registrados:

- motivo;
- responsável;
- impacto no prazo;
- impacto financeiro;
- ações corretivas.

O objetivo é promover melhoria contínua da Produção.

---

# Conclusão da Ordem

Uma Ordem será considerada concluída quando:

- todas as atividades forem executadas;
- qualidade aprovada;
- materiais corretamente consumidos;
- documentação atualizada.

Após sua conclusão ela permanecerá disponível para consulta histórica.

---

# Conclusão do Pedido

O Pedido somente será considerado totalmente produzido quando todas as Ordens de Produção vinculadas estiverem concluídas.

Enquanto existir ao menos uma Ordem pendente, o Pedido permanecerá em Produção.

---

# Integração com Outros Departamentos

## Compras

Recebe solicitações quando houver necessidade de novos materiais.

---

## Gestão de Materiais

Fornece materiais para execução das Ordens.

---

## Financeiro

Recebe informações sobre custos extraordinários e impactos financeiros.

---

## Logística

Recebe os produtos concluídos para preparação da entrega.

---

# Indicadores

O Sistema de Produção deverá apresentar indicadores como:

- Ordens em andamento;
- Ordens concluídas;
- Ordens atrasadas;
- produtividade por setor;
- produtividade da fábrica;
- retrabalhos;
- desperdícios;
- consumo de materiais;
- capacidade produtiva;
- gargalos operacionais;
- cumprimento de prazos.

---

# Brasilab Intelligence

O Agente de Produção deverá atuar como consultor operacional da fábrica.

Exemplos:

> A Marcenaria possui excesso de Ordens aguardando início.

---

> A OP260154 deverá ser priorizada para evitar atraso na entrega do Pedido.

---

> A conclusão da OP da Marmoraria permitirá liberar imediatamente o Projeto para Expedição.

---

> Existe conflito de utilização do mesmo equipamento entre duas Ordens.

---

> O consumo de MDF está acima do planejado.

---

> O retrabalho da Serralheria aumentou nas últimas semanas.

---

> A capacidade produtiva da fábrica está próxima do limite para a próxima semana.

As recomendações servirão como apoio ao Gerente Operacional.

A decisão final permanecerá sempre humana.

---

# Segurança

Somente usuários autorizados poderão:

- criar Ordens;
- alterar prioridades;
- iniciar Ordens;
- concluir Ordens;
- cancelar Ordens;
- registrar retrabalhos.

Todas as alterações deverão permanecer registradas na Auditoria do sistema.

---

# Evolução Futura

O Sistema de Produção poderá incorporar futuramente:

- apontamento por colaborador;
- apontamento por máquina;
- cronograma gráfico (Gantt);
- capacidade produtiva automática;
- controle de máquinas;
- manutenção preventiva integrada;
- painéis em tempo real para a fábrica;
- indicadores OEE;
- integração com coletores móveis;
- previsão automática de atrasos utilizando inteligência artificial.

---

# Considerações Finais

O Sistema de Produção representa o coração operacional da Brasilab.

É através dele que todo o planejamento realizado pelos demais departamentos se transforma em produtos reais entregues aos clientes.

Sua arquitetura foi concebida para refletir o funcionamento da fábrica, permitindo que cada setor trabalhe de forma independente, respeitando sua capacidade produtiva e seus próprios cronogramas, enquanto o Gerente Operacional mantém a visão completa de toda a operação.

O Brasilab Intelligence utilizará essas informações para apoiar decisões estratégicas, antecipar gargalos, melhorar a produtividade e preservar o conhecimento operacional da empresa, garantindo que a Brasilab continue evoluindo de forma organizada, eficiente e sustentável ao longo das próximas décadas.