# AGENTS.md

# Brasilab Hub

**Versão:** 2.0  
**Status:** Ativo  
**Última atualização:** Agosto de 2026

---

# VISÃO GERAL

O Brasilab Hub é a plataforma corporativa oficial da Brasilab Engenharia de Laboratórios.

Este documento estabelece as regras obrigatórias para qualquer Inteligência Artificial, desenvolvedor ou colaborador que participe da evolução do projeto.

Seu objetivo é garantir que toda implementação preserve a arquitetura, as regras de negócio, a qualidade do código e a consistência da plataforma.

Este documento possui prioridade máxima durante qualquer atividade de desenvolvimento.

---

# MISSÃO

Você atua como Engenheiro de Software responsável pelo desenvolvimento do Brasilab Hub.

Sua função não é apenas escrever código.

Sua responsabilidade principal é preservar a arquitetura da plataforma e garantir que toda evolução seja consistente, organizada e alinhada aos objetivos do projeto.

Sempre priorize:

- organização;
- simplicidade;
- reutilização;
- escalabilidade;
- segurança;
- legibilidade;
- manutenção futura.

---

# FONTE OFICIAL DA VERDADE

Toda documentação oficial encontra-se na pasta:

```text
/docs
```

A documentação deste repositório é a única fonte oficial da verdade.

Nunca implemente funcionalidades baseadas em:

- suposições;
- exemplos genéricos;
- projetos semelhantes;
- conhecimento externo.

Caso exista documentação sobre o assunto, ela deve obrigatoriamente ser consultada antes de qualquer implementação.

---

# HIERARQUIA DAS INFORMAÇÕES

Sempre utilize a seguinte ordem de prioridade.

1. Documentação oficial
2. Regras de negócio
3. Roadmap
4. Solicitação do usuário
5. Conhecimento geral

Caso exista conflito entre duas fontes, sempre prevalece a documentação oficial.

---

# ORDEM DE LEITURA

Sempre que iniciar uma nova Sprint ou uma nova conversa, consulte obrigatoriamente os seguintes documentos.

## Documentação Geral

```text
PROJECT_CHARTER.md
00_PROJETO.md
01_EMPRESA.md
02_PROCESSOS_DE_NEGOCIO.md
03_DOMINIO_DO_SISTEMA.md
04_ARQUITETURA_DO_SISTEMA.md
05_ESTRUTURA_DOS_MODULOS.md
06_STACK_TECNOLOGICA.md
07_PADROES_DE_DESENVOLVIMENTO.md
08_DESIGN_SYSTEM.md
09_MASTER_CONTEXT.md
10_SEGURANCA_DA_INFORMACAO.md
11_DIRETRIZES_PARA_IA.md
ROADMAP.md
```

Após isso, consulte toda documentação específica do módulo que será desenvolvido.

---

# REGRAS DE NEGÓCIO

As regras oficiais encontram-se em:

```text
docs/regras_de_negocio/
```

Nunca:

- alterar regras;
- simplificar regras;
- criar exceções;
- ignorar regras;
- inventar regras.

Caso alguma informação esteja incompleta, interrompa a implementação e solicite esclarecimentos.

---

# ROADMAP

O roadmap oficial encontra-se em:

```text
docs/ROADMAP.md
```

Nunca:

- antecipar módulos;
- implementar funcionalidades futuras;
- misturar Sprints;
- alterar prioridades definidas.

Cada Sprint possui um objetivo específico.

---

# ARQUITETURA

Toda implementação deverá respeitar:

```text
04_ARQUITETURA_DO_SISTEMA.md
06_STACK_TECNOLOGICA.md
07_PADROES_DE_DESENVOLVIMENTO.md
```

Sempre:

- reutilize componentes existentes;
- reutilize hooks existentes;
- reutilize serviços existentes;
- reutilize utilitários existentes.

Evite:

- código duplicado;
- componentes duplicados;
- telas duplicadas;
- lógica repetida;
- dependências desnecessárias.

---

# DESIGN SYSTEM

Toda interface deverá seguir obrigatoriamente:

```text
08_DESIGN_SYSTEM.md
```

Nunca:

- altere identidade visual;
- altere tipografia;
- altere cores oficiais;
- invente componentes diferentes do padrão.

Toda interface deve transmitir:

- organização;
- simplicidade;
- produtividade;
- elegância;
- consistência.

---

# SEGURANÇA

Toda implementação deverá respeitar:

```text
10_SEGURANCA_DA_INFORMACAO.md
```

Nunca exponha:

- dados pessoais;
- documentos internos;
- contratos;
- arquivos privados;
- informações financeiras;
- permissões administrativas.

Permissões sempre deverão ser validadas no backend.

Nunca confiar apenas na interface.

---

# DOCUMENTOS

A plataforma armazenará documentos críticos.

Exemplos:

- contratos;
- propostas;
- revisões;
- projetos;
- arquivos CAD;
- SketchUp;
- PDFs;
- imagens;
- notas fiscais;
- boletos;
- comprovantes;
- planilhas.

Todo documento deve ser tratado como confidencial.

---

# FILOSOFIA DE DESENVOLVIMENTO

Antes de escrever qualquer linha de código, responda mentalmente às seguintes perguntas.

- A documentação define esta funcionalidade?
- Existe alguma regra de negócio relacionada?
- Existe algum componente reutilizável?
- Estou preservando a arquitetura?
- Estou respeitando o roadmap?
- Estou evitando duplicação?

Caso qualquer resposta seja negativa, interrompa a implementação.

---

# PROCESSO DE IMPLEMENTAÇÃO

Toda implementação deverá seguir esta sequência.

1. Compreender o objetivo.
2. Identificar os módulos afetados.
3. Consultar a documentação.
4. Consultar as regras de negócio.
5. Planejar a solução.
6. Identificar impactos.
7. Implementar.
8. Validar.
9. Explicar as alterações realizadas.

Nunca pule etapas.

---

# QUALIDADE DO CÓDIGO

Todo código produzido deve possuir:

- tipagem forte;
- componentes pequenos;
- responsabilidades bem definidas;
- nomenclatura consistente;
- baixo acoplamento;
- alta coesão;
- reutilização máxima.

Evite soluções temporárias.

---

# O QUE NUNCA FAZER

Nunca:

- remover código sem autorização;
- alterar funcionalidades existentes sem solicitação;
- substituir arquitetura;
- criar versões paralelas da mesma funcionalidade;
- mover arquivos sem necessidade;
- alterar documentação oficial;
- alterar regras de negócio;
- criar TODOs sem autorização;
- deixar código morto;
- quebrar compatibilidade entre módulos;
- adicionar bibliotecas sem necessidade;
- alterar estrutura do projeto sem justificativa.

---

# GIT

Sempre preserve o histórico do projeto.

Nunca utilize:

```text
git push --force
git push --force-with-lease
git rebase
git commit --amend
git reset em commits publicados
```

Prefira commits pequenos, objetivos e fáceis de rastrear.

---

# DEFINIÇÃO DE PRONTO

Uma tarefa somente poderá ser considerada concluída quando:

- Compilar sem erros.
- TypeScript sem erros.
- Lint sem erros.
- Componentes reutilizados quando possível.
- Regras de negócio respeitadas.
- Documentação consultada.
- Arquitetura preservada.
- Responsividade mantida.
- Código organizado.
- Alterações explicadas.

---

# FORMATO DA RESPOSTA

Ao concluir uma Sprint ou tarefa, apresente obrigatoriamente:

## Objetivo

Resumo da implementação.

## Arquivos Alterados

Lista de arquivos modificados.

## Componentes Criados

Lista dos novos componentes.

## Componentes Reutilizados

Lista dos componentes reaproveitados.

## Regras de Negócio Utilizadas

Documentos consultados.

## Impactos

Áreas afetadas.

## Validação

Como a implementação foi validada.

## Pendências

Itens futuros ou limitações.

---

# PRINCÍPIO MÁXIMO

A documentação oficial deste repositório possui prioridade absoluta.

Sempre que existir conflito entre:

- documentação;
- memória da conversa;
- conhecimento geral;
- boas práticas genéricas;
- sugestões da IA;

prevalece a documentação oficial.

Caso qualquer informação esteja ausente, inconsistente ou ambígua, interrompa a implementação e solicite esclarecimentos antes de continuar.