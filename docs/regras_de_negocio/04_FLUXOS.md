# 04_FLUXOS.md

# Brasilab Intranet Lab

Versão: 1.0
Status: Em Planejamento
Data: Julho de 2026

---

# 1. OBJETIVO

Este documento estabelece os fluxos oficiais da Brasilab Intranet Lab.

Seu objetivo é documentar como as informações percorrem a plataforma, desde sua origem até a conclusão do processo.

Os Fluxos representam o comportamento operacional da empresa.

Toda implementação deverá respeitar obrigatoriamente estes Fluxos.

---

# 2. DEFINIÇÃO

Um Fluxo representa o caminho percorrido por uma entidade durante seu ciclo de vida.

Os Fluxos conectam diferentes módulos da plataforma.

Os Fluxos não substituem os Status.

Enquanto o Status representa a situação atual de uma entidade, o Fluxo representa a sequência de processos pela qual essa entidade deverá passar.

---

# 3. PRINCÍPIOS FUNDAMENTAIS

Todo Fluxo deverá obedecer aos seguintes princípios:

- possuir início claramente definido;
- possuir fim claramente definido;
- respeitar a ordem lógica dos processos;
- preservar rastreabilidade;
- impedir saltos indevidos;
- registrar histórico das operações importantes.

Nenhum módulo deverá quebrar um Fluxo oficial da plataforma.

---

# 4. FLUXO COMERCIAL

O Fluxo Comercial representa todo o relacionamento com o cliente, desde o primeiro contato até a formalização da venda.

Fluxo principal:

```text
Lead
↓
Proposta
↓
Pedido
```

Descrição:

Lead

Recebimento da oportunidade comercial.

↓

Proposta

Negociação comercial.

↓

Pedido

Formalização da venda.

---

# 5. FLUXO DO LEAD

```text
Lead criado
↓
Qualificação
↓
Contato
↓
Negociação Inicial
↓
Conversão em Proposta
```

Fluxos alternativos:

```text
Lead
↓
Desqualificado
```

ou

```text
Lead
↓
Perdido
```

---

# 6. FLUXO DA PROPOSTA

```text
Lead
↓
Conversão
↓
Criação da Proposta
↓
Criação automática da REV 0
↓
Negociação
↓
Novas Revisões
↓
Aprovação
↓
Conversão em Pedido
```

Caso o cliente solicite alterações:

```text
REV 0
↓
REV 1
↓
REV 2
↓
REV 3
```

Cada Revisão preservará a anterior.

---

# 7. FLUXO DO PEDIDO

O Pedido nasce exclusivamente a partir de uma Proposta aprovada.

Fluxo:

```text
Proposta Aprovada
↓
Conversão
↓
Pedido
↓
Complementação de informações
↓
Liberação
```

Após criado o Pedido poderá iniciar diversos Fluxos paralelos.

---

# 8. FLUXO DA PRODUÇÃO

A Produção inicia após a liberação do Pedido.

Fluxo:

```text
Pedido
↓
Ordens de Produção
↓
Execução
↓
Conclusão
```

Um único Pedido poderá gerar diversas Ordens de Produção.

Exemplo:

```text
Pedido

↓

OP Marcenaria

↓

OP Marmoaria

↓

OP Compras

↓

OP Instalação
```

As Ordens poderão executar simultaneamente.

---

# 9. FLUXO DAS COMPRAS

Caso algum item precise ser adquirido:

```text
Pedido

↓

Solicitação

↓

Cotação

↓

Compra

↓

Recebimento

↓

Disponível para Produção
```

Nem todo Pedido exigirá Compras.

---

# 10. FLUXO DO ESTOQUE

Materiais disponíveis:

```text
Estoque

↓

Reserva

↓

Separação

↓

Consumo

↓

Baixa
```

Materiais comprados:

```text
Compra

↓

Recebimento

↓

Entrada

↓

Reserva

↓

Consumo
```

---

# 11. FLUXO DA LOGÍSTICA

Após conclusão da Produção:

```text
Produção

↓

Separação

↓

Expedição

↓

Entrega

↓

Instalação

↓

Conclusão
```

Nem todo Pedido exigirá instalação.

---

# 12. FLUXO FINANCEIRO

O Financeiro acompanha praticamente todo o processo.

Fluxo simplificado:

```text
Pedido

↓

Faturamento

↓

Conta a Receber

↓

Recebimento

↓

Conciliação
```

Também existirão Fluxos para:

- Compras;
- Contas a Pagar;
- Boletos;
- Cobranças.

---

# 13. FLUXOS PARALELOS

Diversos Fluxos poderão ocorrer simultaneamente.

Exemplo:

```text
Pedido

↓

Produção

↓

Compras

↓

Financeiro

↓

Logística
```

Esses Fluxos deverão permanecer sincronizados.

---

# 14. DEPENDÊNCIAS

Nem todos os Fluxos poderão iniciar imediatamente.

Exemplos:

Pedido

depende de:

- Proposta aprovada.

Produção

depende de:

- Pedido.

Compras

depende de:

- necessidade identificada.

Expedição

depende de:

- Produção concluída.

---

# 15. BLOQUEIOS

O sistema deverá impedir Fluxos inválidos.

Exemplos:

Não permitir:

```text
Lead

↓

Pedido
```

Nem:

```text
Proposta

↓

Produção
```

Nem:

```text
Pedido

↓

Entrega

(sem Produção)
```

---

# 16. HISTÓRICO

Cada transição importante deverá registrar histórico.

Exemplos:

Lead convertido.

Proposta criada.

Revisão criada.

Pedido criado.

OP criada.

Compra criada.

Entrega realizada.

Recebimento confirmado.

---

# 17. NOTIFICAÇÕES

Mudanças importantes poderão gerar notificações.

Exemplos:

Nova Proposta.

Pedido criado.

Nova OP.

Compra aprovada.

Produção concluída.

Entrega realizada.

---

# 18. EXEMPLO COMPLETO

Fluxo esperado:

```text
Lead

↓

Proposta

↓

REV 0

↓

REV 1

↓

REV 2

↓

Aprovação

↓

Pedido

↓

OP Marcenaria

↓

OP Marmoaria

↓

Compras

↓

Produção

↓

Expedição

↓

Entrega

↓

Financeiro

↓

Finalizado
```

---

# 19. EVOLUÇÃO

Novos Fluxos poderão ser incorporados futuramente.

Entretanto:

- deverão possuir documentação própria;
- deverão respeitar os Fluxos existentes;
- não poderão quebrar a rastreabilidade da plataforma.

---

# 20. CONSIDERAÇÕES FINAIS

Os Fluxos representam o funcionamento operacional oficial da Brasilab Intranet Lab.

Eles deverão orientar o desenvolvimento da plataforma e garantir que todas as áreas da empresa trabalhem de forma integrada.

Nenhum módulo deverá criar caminhos alternativos que comprometam a consistência dos processos empresariais.

Toda evolução da plataforma deverá preservar estes Fluxos ou atualizá-los formalmente na documentação antes da implementação.

Fim do Documento.