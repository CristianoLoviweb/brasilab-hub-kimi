# 06_ARQUIVOS.md

# Brasilab Intranet Lab

Versão: 1.0
Status: Em Planejamento
Data: Julho de 2026

---

# 1. OBJETIVO

Este documento estabelece as regras oficiais para armazenamento, organização, classificação, versionamento, segurança e utilização de arquivos na Brasilab Intranet Lab.

Os arquivos representam parte fundamental das informações da empresa e deverão ser tratados como entidades importantes da plataforma.

Toda implementação relacionada ao gerenciamento de arquivos deverá respeitar obrigatoriamente este documento.

---

# 2. DEFINIÇÃO

Um Arquivo representa qualquer documento digital armazenado pela plataforma.

Exemplos:

- PDF;
- DOC;
- DOCX;
- XLS;
- XLSX;
- DWG;
- DXF;
- SKP;
- JPG;
- PNG;
- MP4;
- ZIP;
- RAR;
- XML;
- Outros formatos compatíveis.

O sistema deverá ser preparado para suportar novos formatos futuramente.

---

# 3. PRINCÍPIOS FUNDAMENTAIS

Todo arquivo deverá obedecer aos seguintes princípios:

- rastreabilidade;
- segurança;
- classificação;
- versionamento;
- organização;
- integridade;
- disponibilidade.

Nenhum arquivo deverá ficar "solto" dentro da plataforma.

Todo arquivo deverá possuir contexto.

---

# 4. ENTIDADES QUE PODERÃO POSSUIR ARQUIVOS

Inicialmente poderão possuir arquivos:

- Leads;
- Clientes;
- Propostas;
- Revisões;
- Pedidos;
- Ordens de Produção;
- Compras;
- Produtos;
- Fornecedores;
- Financeiro;
- Contratos;
- Usuários.

Novas entidades poderão ser adicionadas futuramente.

---

# 5. CLASSIFICAÇÃO DOS ARQUIVOS

Todo arquivo deverá possuir uma classificação.

Exemplos:

- Documento Comercial;
- Documento Técnico;
- Projeto;
- Foto;
- Contrato;
- Financeiro;
- Fiscal;
- Administrativo;
- Arquivo Geral.

A classificação facilitará pesquisas e permissões futuras.

---

# 6. VÍNCULO DOS ARQUIVOS

Todo arquivo deverá estar vinculado a uma entidade.

Exemplo:

```text
Lead
↓

Arquivo
```

ou

```text
Pedido

↓

Arquivo
```

Nunca deverá existir arquivo sem entidade relacionada.

---

# 7. ARQUIVOS DAS PROPOSTAS

As Propostas poderão possuir dois tipos de arquivos.

## Arquivos Gerais

Pertencem à Proposta.

Não estão associados a uma Revisão específica.

Exemplo:

```text
Memorial Descritivo.pdf
```

---

## Arquivos da Revisão

Pertencem exclusivamente àquela Revisão.

Exemplo:

```text
REV 0

proposta.pdf

layout.pdf

planilha.xlsx
```

Nova Revisão:

```text
REV 1

proposta_atualizada.pdf

layout_v2.pdf
```

Arquivos antigos deverão permanecer preservados.

---

# 8. ARQUIVOS DOS PEDIDOS

Os Pedidos poderão possuir:

- projetos executivos;
- arquivos comerciais;
- documentos técnicos;
- fotos;
- memoriais;
- observações anexadas.

---

# 9. ARQUIVOS DAS ORDENS DE PRODUÇÃO

Cada Ordem poderá possuir arquivos específicos.

Exemplos:

- desenho técnico;
- plano de corte;
- foto de referência;
- detalhamento;
- arquivos CNC;
- etiquetas.

Uma OP não deverá acessar automaticamente arquivos de outra OP.

---

# 10. ARQUIVOS DO FINANCEIRO

Exemplos:

- boletos;
- comprovantes;
- notas fiscais;
- recibos;
- XML;
- DANFE.

Esses arquivos deverão possuir proteção reforçada.

---

# 11. ENVIO DE ARQUIVOS

O sistema deverá permitir:

- upload individual;
- upload múltiplo;
- drag and drop;
- barra de progresso;
- cancelamento do envio.

Sempre que possível deverão ser exibidas informações durante o envio.

---

# 12. DADOS DO ARQUIVO

Todo arquivo deverá registrar:

- nome original;
- nome interno;
- extensão;
- tamanho;
- data;
- horário;
- usuário;
- entidade;
- classificação;
- revisão (quando existir);
- hash;
- tipo MIME.

---

# 13. NOME INTERNO

O nome utilizado no Storage não deverá depender do nome enviado pelo usuário.

O sistema deverá gerar um identificador interno único.

Exemplo:

```text
3d1fd6d8-acde-45ab-9d9d.pdf
```

O nome original deverá permanecer registrado apenas como metadado.

---

# 14. STORAGE

Os arquivos físicos deverão permanecer exclusivamente no Storage.

O banco de dados armazenará apenas os metadados.

Nunca deverão ser armazenados arquivos binários diretamente no banco de dados.

---

# 15. SEGURANÇA

Nenhum arquivo deverá possuir acesso público.

Todo acesso deverá passar obrigatoriamente pelo backend.

Antes de liberar um arquivo deverão ser verificadas:

- autenticação;
- autorização;
- permissões;
- classificação;
- vínculo da entidade.

---

# 16. DOWNLOAD

Todo download poderá gerar histórico.

O sistema poderá registrar:

- usuário;
- data;
- horário;
- arquivo;
- entidade relacionada.

Arquivos confidenciais poderão possuir auditoria reforçada.

---

# 17. EXCLUSÃO

A exclusão física de arquivos deverá ser evitada.

Sempre que possível o arquivo deverá ser marcado como inativo.

Caso a exclusão definitiva seja necessária:

- deverá existir permissão específica;
- deverá gerar auditoria;
- deverá gerar histórico.

---

# 18. VERSIONAMENTO

O envio de um novo arquivo não deverá substituir automaticamente um arquivo anterior.

Sempre que necessário deverá existir versionamento.

Exemplo:

```text
Projeto.pdf

↓

Projeto_REV1.pdf

↓

Projeto_REV2.pdf
```

A versão anterior deverá permanecer preservada.

---

# 19. REAPROVEITAMENTO

Um mesmo arquivo poderá ser reutilizado em diferentes entidades através de referência.

Sempre que possível evitar duplicação física.

O sistema deverá controlar os vínculos existentes.

---

# 20. VISUALIZAÇÃO

Sempre que possível o sistema deverá permitir visualização online.

Exemplos:

- PDF;
- JPG;
- PNG;
- TXT.

Arquivos não suportados poderão ser disponibilizados apenas para download.

---

# 21. PESQUISA

Futuramente deverá ser possível localizar arquivos por:

- nome;
- entidade;
- cliente;
- pedido;
- proposta;
- revisão;
- categoria;
- usuário;
- data;
- extensão.

---

# 22. LIMITES

O tamanho máximo permitido para upload será definido futuramente.

A plataforma deverá permitir diferentes limites conforme:

- tipo de arquivo;
- módulo;
- perfil do usuário.

---

# 23. EXTENSÕES PERMITIDAS

A lista oficial será definida futuramente.

Inicialmente deverão ser aceitos:

- PDF;
- DOC;
- DOCX;
- XLS;
- XLSX;
- PPT;
- PPTX;
- JPG;
- PNG;
- DWG;
- DXF;
- SKP;
- ZIP;
- XML.

Outras extensões poderão ser adicionadas posteriormente.

---

# 24. HISTÓRICO

As seguintes ações deverão gerar Histórico:

- upload;
- download;
- exclusão;
- alteração de categoria;
- alteração de classificação;
- alteração de Revisão;
- alteração de permissões.

---

# 25. PERMISSÕES

O acesso aos arquivos deverá respeitar o sistema de permissões da plataforma.

Poderão existir permissões específicas para:

- visualizar;
- enviar;
- substituir;
- excluir;
- baixar;
- compartilhar.

---

# 26. AUDITORIA

Arquivos classificados como confidenciais poderão registrar auditoria detalhada.

Exemplos:

- quem visualizou;
- quem baixou;
- quando acessou;
- qual entidade estava relacionada.

---

# 27. EXEMPLO DE ORGANIZAÇÃO

```text
Proposta BL 600-04/26

Arquivos Gerais

- Memorial.pdf
- Escopo.pdf

↓

REV 0

- proposta.pdf
- layout.pdf

↓

REV 1

- proposta_rev1.pdf
- layout_rev1.pdf

↓

REV 2

- proposta_rev2.pdf
- layout_rev2.pdf
```

---

# 28. RESULTADO ESPERADO

Todo arquivo deverá permanecer:

- identificado;
- classificado;
- protegido;
- rastreável;
- vinculado à entidade correta;
- preservado durante toda sua vida útil.

Nenhum documento importante deverá ser perdido ou sobrescrito.

---

# 29. EVOLUÇÃO

O gerenciamento de arquivos deverá evoluir juntamente com a plataforma.

Novos formatos, categorias e funcionalidades poderão ser adicionados futuramente.

Toda evolução deverá preservar compatibilidade com esta política.

---

# 30. CONSIDERAÇÕES FINAIS

Os arquivos representam um dos ativos mais importantes da Brasilab Intranet Lab.

Toda implementação deverá priorizar organização, segurança, rastreabilidade e facilidade de localização.

O gerenciamento de arquivos deverá permitir que qualquer documento seja encontrado rapidamente, mantendo controle completo sobre sua origem, classificação, permissões e histórico.

Fim do Documento.