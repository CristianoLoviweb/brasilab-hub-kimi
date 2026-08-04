# 02_REVISOES.md

# Brasilab Intranet Lab

Versão: 1.0  
Status: Em Planejamento  
Data: Julho de 2026

---

# 1. OBJETIVO

- Este documento estabelece as regras oficiais para criação, numeração, armazenamento e utilização das Revisões de Propostas da Brasilab Intranet Lab.
- Seu objetivo é garantir que todas as versões de uma Proposta permaneçam preservadas, identificáveis e rastreáveis.
- Nenhuma nova versão de uma Proposta poderá substituir ou apagar definitivamente uma versão anterior.
- Toda implementação relacionada a Revisões deverá respeitar obrigatoriamente este documento.

---

# 2. DEFINIÇÃO

- Uma Revisão representa uma nova versão comercial da mesma Proposta.
- A Revisão deverá registrar o estado da Proposta em determinado momento da negociação.
- Cada Revisão deverá permanecer vinculada à Proposta que a originou.
- Uma Revisão não deverá existir de forma independente.
- A criação de uma Revisão não deverá gerar uma nova Proposta.
- O código principal da Proposta deverá permanecer o mesmo em todas as Revisões.

Exemplo:

```text
Proposta: BL 600-04/26

Revisão 0
Revisão 1
Revisão 2
```

---

# 3. PRINCÍPIOS FUNDAMENTAIS

- Toda Proposta deverá possuir pelo menos uma Revisão.
- Nenhuma Proposta poderá existir sem Revisão.
- A primeira versão da Proposta será sempre a Revisão 0.
- As Revisões deverão utilizar numeração sequencial crescente.
- A numeração de uma Revisão nunca poderá ser reutilizada.
- Uma Revisão anterior nunca deverá ser sobrescrita por uma Revisão posterior.
- A exclusão definitiva de uma Revisão registrada não deverá ser permitida.
- Toda criação de Revisão deverá gerar histórico.
- O Pedido deverá permanecer vinculado à Revisão aprovada que originou sua criação.

---

# 4. REVISÃO 0

- A Revisão 0 representa a versão inicial da Proposta.
- Ela deverá ser criada automaticamente no mesmo processo de criação da Proposta.
- O usuário não deverá criar manualmente a Revisão 0.
- A criação da Proposta e da Revisão 0 deverá ocorrer em uma única operação segura.
- Caso a criação da Revisão 0 falhe, a Proposta não deverá ser considerada concluída.
- A Revisão 0 deverá permanecer registrada mesmo que posteriormente sejam criadas novas Revisões.

Fluxo inicial:

```text
Lead
↓
Conversão em Proposta
↓
Geração do código da Proposta
↓
Criação automática da Revisão 0
```

Exemplo:

```text
Código da Proposta: BL 600-04/26
Revisão inicial: REV 0
```

---

# 5. NUMERAÇÃO DAS REVISÕES

- A numeração deverá começar obrigatoriamente em 0.
- Cada nova Revisão deverá receber o próximo número inteiro disponível.
- A numeração deverá ser sequencial dentro de cada Proposta.
- A sequência de uma Proposta não deverá interferir na sequência de outra Proposta.
- Não deverá existir limite inicial para a quantidade de Revisões.

Exemplo válido:

```text
BL 600-04/26 — REV 0
BL 600-04/26 — REV 1
BL 600-04/26 — REV 2
BL 600-04/26 — REV 3
```

Exemplo de Propostas independentes:

```text
BL 600-04/26 — REV 0
BL 600-04/26 — REV 1
BL 600-04/26 — REV 2

BL 600-05/26 — REV 0
BL 600-05/26 — REV 1
```

---

# 6. ALGORITMO DE GERAÇÃO

Ao criar uma nova Revisão, o sistema deverá:

1. Identificar a Proposta selecionada.
2. Localizar a maior numeração de Revisão já registrada para essa Proposta.
3. Acrescentar 1 ao número encontrado.
4. Criar a nova Revisão utilizando o número calculado.
5. Registrar o usuário responsável.
6. Registrar a data e o horário da criação.
7. Preservar todas as Revisões anteriores.
8. Atualizar a Revisão atual da Proposta.
9. Registrar a criação no histórico.

Exemplo:

```text
Maior Revisão existente: REV 2

2 + 1 = 3

Nova Revisão: REV 3
```

- A geração deverá ocorrer no backend ou no banco de dados.
- O número não deverá ser calculado apenas no frontend.
- O sistema deverá impedir a criação simultânea de duas Revisões com o mesmo número.
- A operação deverá utilizar transação ou mecanismo equivalente de consistência.

---

# 7. IDENTIFICAÇÃO DA REVISÃO ATUAL

- A Proposta deverá possuir uma Revisão atual claramente identificada.
- A Revisão atual será, normalmente, a Revisão de maior número criada.
- Após a criação bem-sucedida de uma nova Revisão, ela deverá tornar-se a Revisão atual.
- A Proposta deverá exibir a numeração da Revisão atual em sua tela principal.
- A Revisão atual não deverá eliminar o acesso às versões anteriores.

Exemplo:

```text
Proposta: BL 600-04/26
Revisão atual: REV 3
```

---

# 8. QUANDO CRIAR UMA NOVA REVISÃO

Uma nova Revisão deverá ser criada quando houver alteração comercial ou documental relevante na Proposta apresentada ao cliente.

Exemplos:

- Alteração do valor total.
- Alteração do frete.
- Alteração dos produtos ou serviços oferecidos.
- Alteração de quantidades.
- Alteração de especificações comerciais.
- Alteração da forma de pagamento.
- Alteração da condição de pagamento.
- Alteração do prazo de entrega.
- Alteração relevante do local de instalação.
- Envio de uma nova versão do orçamento ao cliente.
- Substituição dos arquivos que representam a Proposta enviada.
- Alteração solicitada pelo cliente que resulte em nova apresentação comercial.

---

# 9. ALTERAÇÕES QUE NÃO EXIGEM NOVA REVISÃO

Alterações administrativas que não modificam o conteúdo comercial apresentado ao cliente poderão ser realizadas sem criação de nova Revisão.

Exemplos:

- Correção de telefone.
- Correção de e-mail.
- Alteração do vendedor responsável.
- Inclusão de observação interna.
- Registro de contato.
- Reagendamento de atividade.
- Alteração de prioridade interna.
- Inclusão de arquivo geral que não substitui a Proposta enviada.
- Correção cadastral do Cliente.

- Essas alterações deverão gerar histórico quando forem relevantes.
- A interface deverá diferenciar claramente uma edição administrativa da criação de uma nova Revisão.
- O usuário não deverá criar uma Revisão apenas para registrar contato ou observação interna.

---

# 10. CRIAÇÃO DA NOVA REVISÃO

- A criação deverá ser iniciada dentro da visualização da Proposta.
- O sistema deverá oferecer uma ação claramente identificada como `Criar nova Revisão`.
- O usuário deverá possuir permissão específica para executar essa ação.
- O sistema deverá informar qual será o número da nova Revisão.
- O usuário deverá confirmar a operação antes da criação definitiva.
- O sistema poderá solicitar um motivo ou resumo da alteração.
- O motivo deverá permanecer registrado no histórico.

Exemplo:

```text
Revisão atual: REV 2
Nova Revisão a ser criada: REV 3
```

---

# 11. ORIGEM DOS DADOS DA NOVA REVISÃO

- Por padrão, uma nova Revisão deverá utilizar a Revisão atual como base.
- Os dados comerciais poderão ser copiados para facilitar a edição.
- A cópia deverá gerar um novo registro independente.
- Alterações realizadas na nova Revisão não poderão modificar a anterior.
- A Revisão de origem deverá permanecer identificada.

Exemplo:

```text
REV 2
↓
Utilizada como base
↓
REV 3
```

A nova Revisão poderá herdar inicialmente:

- Valor.
- Frete.
- Validade.
- Forma de pagamento.
- Condição de pagamento.
- Prazo de entrega.
- Local de instalação.
- Observações comerciais.
- Itens, quando a Proposta for Automática.
- Outras informações comerciais aplicáveis.

---

# 12. DADOS PRESERVADOS EM CADA REVISÃO

Cada Revisão deverá preservar um retrato das informações comerciais existentes no momento de sua criação ou conclusão.

Informações previstas:

- Número da Revisão.
- Proposta relacionada.
- Revisão utilizada como origem.
- Tipo da Proposta.
- Valor total.
- Valor do frete.
- Validade.
- Forma de pagamento.
- Condição de pagamento.
- Prazo de entrega.
- Local de instalação.
- Observações comerciais.
- Observações sobre a Revisão.
- Usuário responsável.
- Data e horário de criação.
- Arquivos vinculados.
- Itens e totais, quando a Proposta for Automática.

- Os campos definitivos serão estabelecidos durante o detalhamento do módulo de Propostas.
- Nenhuma Revisão deverá depender somente dos dados atuais da Proposta para reconstruir sua versão histórica.

---

# 13. PROPOSTA MANUAL

Nas Propostas Manuais:

- O orçamento será produzido fora da plataforma.
- Cada Revisão poderá possuir seus próprios arquivos.
- O vendedor deverá informar manualmente os valores e condições comerciais aplicáveis.
- O sistema não será obrigado a interpretar o conteúdo dos arquivos enviados.
- A plataforma deverá preservar os arquivos de cada Revisão.
- O usuário deverá indicar quais arquivos representam a nova versão comercial.

Exemplo:

```text
BL 600-04/26

REV 0
- proposta_rev0.pdf
- planilha_rev0.xlsx

REV 1
- proposta_rev1.pdf
- projeto_rev1.dwg
```

---

# 14. PROPOSTA AUTOMÁTICA

Nas Propostas Automáticas:

- Cada Revisão deverá preservar os itens, quantidades, preços, descontos, serviços, frete e totais daquela versão.
- Uma alteração em produtos ou valores deverá ocorrer em uma nova Revisão quando modificar a oferta apresentada ao cliente.
- A Revisão anterior deverá continuar consultável.
- O documento comercial gerado deverá permanecer vinculado à Revisão correspondente.
- A alteração da tabela de produtos no futuro não deverá modificar retroativamente Revisões já registradas.
- Os valores utilizados deverão ser preservados como parte da própria Revisão.

---

# 15. ARQUIVOS DA REVISÃO

- Um arquivo poderá estar vinculado a uma Revisão específica.
- Um arquivo também poderá ser classificado como geral da Proposta.
- Arquivos de Revisões anteriores deverão permanecer preservados.
- O envio de arquivos para uma nova Revisão não deverá apagar arquivos anteriores.
- O sistema deverá identificar claramente a qual Revisão cada arquivo pertence.
- Os arquivos deverão respeitar as regras de segurança, classificação e acesso da plataforma.

Tipos de vínculo:

```text
Arquivo geral da Proposta
```

ou:

```text
Arquivo da REV 0
Arquivo da REV 1
Arquivo da REV 2
```

As regras completas serão documentadas em:

```text
06_ARQUIVOS.md
```

---

# 16. REAPROVEITAMENTO DE ARQUIVOS

Ao criar uma nova Revisão, o sistema poderá permitir:

- Enviar novos arquivos.
- Reaproveitar arquivos da Revisão anterior.
- Manter arquivos gerais da Proposta.
- Combinar arquivos novos e reaproveitados.

- O reaproveitamento não deverá alterar o arquivo original.
- O sistema deverá preservar o vínculo de origem.
- A interface deverá informar quando um arquivo foi reaproveitado.
- O sistema não deverá duplicar fisicamente o arquivo quando uma referência segura for suficiente.

---

# 17. VALORES E CONDIÇÕES ANTERIORES

- Os valores de uma Revisão anterior deverão permanecer consultáveis.
- Uma nova Revisão não deverá alterar retroativamente valores anteriores.
- O sistema deverá permitir identificar as diferenças entre Revisões.
- O usuário autorizado deverá conseguir verificar qual valor foi apresentado em cada versão.
- Informações financeiras deverão respeitar permissões específicas.

Exemplo:

```text
REV 0 — R$ 80.000,00
REV 1 — R$ 84.500,00
REV 2 — R$ 82.900,00
```

---

# 18. COMPARAÇÃO ENTRE REVISÕES

O sistema poderá futuramente permitir comparação entre duas Revisões.

A comparação poderá apresentar:

- Alteração de valor.
- Alteração de frete.
- Alteração de prazo.
- Alteração de forma ou condição de pagamento.
- Alteração de itens.
- Alteração de quantidades.
- Arquivos adicionados.
- Arquivos removidos da versão atual.
- Observações registradas.

- A comparação não é obrigatória na primeira implementação.
- A arquitetura deverá permitir sua implementação futura.

---

# 19. STATUS E REVISÕES

- A criação de uma nova Revisão poderá alterar o fluxo de acompanhamento da Proposta.
- O status resultante será definido no documento de Status.
- A criação de uma Revisão não deverá apagar o histórico de status anterior.
- O sistema deverá registrar qual Revisão estava ativa em cada evento relevante.
- O envio de uma Revisão ao cliente deverá ser vinculado à versão correspondente.

As regras completas serão documentadas em:

```text
03_STATUS.md
```

---

# 20. CONTATOS RELACIONADOS À REVISÃO

- Um contato poderá estar relacionado à Proposta de forma geral.
- Quando o contato tratar de uma versão específica, poderá ser vinculado à Revisão correspondente.
- O sistema deverá permitir registrar qual Revisão foi enviada, discutida, aprovada ou recusada.
- O histórico deverá manter esse vínculo.

Exemplo:

```text
31/07/2026 — REV 2 enviada ao cliente.
01/08/2026 — Cliente solicitou alteração na REV 2.
02/08/2026 — REV 3 criada.
```

---

# 21. APROVAÇÃO DA REVISÃO

- A aprovação comercial deverá identificar qual Revisão foi aprovada.
- Não deverá existir aprovação genérica sem vínculo com uma versão.
- Apenas uma Revisão deverá ser utilizada como origem de cada Pedido.
- O sistema deverá registrar o usuário que informou a aprovação.
- A data e o horário deverão ser preservados.
- O histórico deverá registrar a aprovação.

Exemplo:

```text
Proposta: BL 600-04/26
Revisão aprovada: REV 3
```

---

# 22. CONVERSÃO EM PEDIDO

- O Pedido deverá ser gerado a partir da Revisão aprovada.
- A conversão deverá preservar o vínculo com a Proposta e com a Revisão.
- O Pedido deverá copiar ou referenciar as informações comerciais da versão aprovada.
- Revisões criadas posteriormente não deverão alterar automaticamente o Pedido já gerado.
- A tela do Pedido deverá exibir a Proposta e a Revisão que o originaram.
- A tela da Proposta deverá exibir o Pedido gerado.

Exemplo:

```text
Pedido: PIB_26001
Proposta de origem: BL 600-04/26
Revisão aprovada: REV 3
```

---

# 23. REVISÃO APÓS A CRIAÇÃO DO PEDIDO

- A criação de uma nova Revisão após a geração do Pedido não deverá alterar automaticamente os dados do Pedido.
- Mudanças posteriores à aprovação deverão seguir processo específico.
- Dependendo da alteração, poderá ser necessário criar um Aditivo.
- O vínculo original do Pedido com a Revisão aprovada deverá permanecer imutável.
- As regras de Aditivos serão documentadas separadamente.

---

# 24. EXCLUSÃO DE REVISÕES

- Revisões registradas não deverão ser excluídas definitivamente.
- Uma Revisão criada incorretamente poderá ser anulada por usuário autorizado.
- A anulação deverá exigir justificativa.
- A Revisão anulada deverá permanecer visível no histórico.
- Sua numeração não poderá ser reutilizada.
- Uma Revisão anulada não poderá gerar Pedido.
- A ação deverá gerar auditoria.

Exemplo:

```text
REV 0 — Ativa
REV 1 — Anulada
REV 2 — Ativa
```

A próxima Revisão deverá ser:

```text
REV 3
```

Nunca:

```text
REV 1
```

---

# 25. ALTERAÇÃO DE REVISÃO REGISTRADA

- Uma Revisão já consolidada não deverá ser livremente alterada.
- Correções administrativas limitadas poderão ser permitidas conforme autorização.
- Alterações comerciais relevantes deverão gerar nova Revisão.
- O sistema deverá impedir que uma versão enviada ou aprovada seja modificada silenciosamente.
- Toda correção autorizada deverá gerar histórico e auditoria.
- O documento de Permissões Especiais definirá quem poderá executar essas ações.

---

# 26. HISTÓRICO

A criação de uma Revisão deverá registrar:

- Proposta.
- Número da Revisão.
- Revisão utilizada como origem.
- Usuário responsável.
- Data.
- Horário.
- Motivo ou resumo.
- Valores principais, quando aplicável.
- Arquivos adicionados ou reaproveitados.
- Alteração da Revisão atual.

Também deverão gerar histórico:

- Envio ao cliente.
- Anulação.
- Aprovação.
- Recusa.
- Vinculação ao Pedido.
- Correções autorizadas.

As regras completas serão documentadas em:

```text
05_HISTORICOS.md
```

---

# 27. PERMISSÕES

Poderão existir permissões específicas para:

- Criar Revisão.
- Visualizar Revisões anteriores.
- Visualizar valores.
- Editar Revisão em preparação.
- Anular Revisão.
- Aprovar Revisão.
- Converter Revisão em Pedido.
- Visualizar arquivos confidenciais.
- Comparar Revisões.

As regras completas serão documentadas em:

```text
07_PERMISSOES_ESPECIAIS.md
```

---

# 28. CONCORRÊNCIA E CONSISTÊNCIA

- O sistema deverá impedir a criação de duas Revisões com o mesmo número.
- A numeração deverá ser calculada de forma segura no backend ou banco de dados.
- Deverá existir restrição de unicidade para a combinação entre Proposta e número da Revisão.
- A criação deverá ocorrer em transação.
- Em caso de falha, nenhuma Revisão incompleta deverá permanecer registrada.
- O sistema deverá validar novamente a sequência no momento da gravação.

Restrição lógica esperada:

```text
Proposta + Número da Revisão = combinação única
```

---

# 29. EXEMPLO COMPLETO

```text
Lead criado
↓
Lead convertido em Proposta
↓
Proposta BL 600-04/26 criada
↓
REV 0 criada automaticamente
↓
REV 0 enviada ao cliente
↓
Cliente solicita alterações
↓
REV 1 criada com base na REV 0
↓
REV 1 enviada ao cliente
↓
Cliente solicita nova alteração
↓
REV 2 criada com base na REV 1
↓
REV 2 aprovada
↓
Pedido PIB_26001 gerado a partir da REV 2
```

Relacionamento final:

```text
BL 600-04/26
├── REV 0
├── REV 1
└── REV 2 — Aprovada
    └── PIB_26001
```

---

# 30. RESULTADO ESPERADO

Qualquer implementação deverá produzir o seguinte comportamento:

```text
Nova Proposta
→ cria automaticamente REV 0

Nova alteração comercial
→ cria REV 1

Nova alteração comercial
→ cria REV 2

REV 2 aprovada
→ Pedido vinculado à REV 2

Nova alteração posterior
→ não modifica automaticamente o Pedido
```

---

# 31. EVOLUÇÃO

- Este documento deverá evoluir conforme o módulo de Propostas for detalhado.
- Novas regras não poderão contradizer os princípios de preservação e rastreabilidade.
- Mudanças deverão ser registradas na documentação do projeto.
- Nenhuma alteração deverá modificar retroativamente Revisões históricas.

---

# 32. CONSIDERAÇÕES FINAIS

- O sistema de Revisões deverá preservar integralmente a evolução de cada Proposta.
- Nenhuma nova versão deverá apagar ou substituir silenciosamente uma versão anterior.
- O código principal da Proposta deverá permanecer o mesmo.
- A numeração das Revisões deverá ser automática, sequencial e não reutilizável.
- Toda aprovação e conversão em Pedido deverá identificar exatamente qual Revisão foi utilizada.
- A rastreabilidade das Revisões será obrigatória durante todo o ciclo comercial.

Fim do Documento.