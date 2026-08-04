# 07_PERMISSOES_ESPECIAIS.md

# Brasilab Intranet Lab

Versão: 1.0
Status: Em Planejamento
Data: Julho de 2026

---

# 1. OBJETIVO

Este documento estabelece as regras oficiais para controle de permissões especiais da Brasilab Intranet Lab.

Seu objetivo é definir quais operações deverão possuir controle de acesso diferenciado, garantindo segurança, rastreabilidade e proteção das informações da empresa.

As permissões especiais complementam o sistema tradicional de perfis e grupos de usuários.

Toda implementação relacionada ao controle de acesso deverá respeitar obrigatoriamente este documento.

---

# 2. DEFINIÇÃO

Permissões Especiais representam autorizações adicionais necessárias para executar operações consideradas críticas.

Essas permissões não substituem os perfis de acesso.

Elas funcionam como uma camada adicional de segurança.

Mesmo que um usuário possua acesso a determinado módulo, ele poderá não possuir autorização para executar determinadas ações.

---

# 3. HIERARQUIA DE ACESSO

O sistema deverá controlar o acesso utilizando a seguinte hierarquia:

```text
Usuário

↓

Grupo

↓

Perfil

↓

Permissões Gerais

↓

Permissões Especiais
```

Cada nível complementa o anterior.

Uma Permissão Especial nunca deverá conceder acesso a um módulo ao qual o usuário não possui acesso.

---

# 4. GRUPOS

Os Grupos representam grandes áreas da empresa.

Exemplos:

- Comercial;
- Produção;
- Compras;
- Financeiro;
- Logística;
- Administrativo;
- Diretoria.

Os grupos facilitam a organização dos usuários.

---

# 5. PERFIS

Os Perfis representam o cargo ou função exercida pelo usuário.

Exemplos:

- Administrador;
- Diretor;
- Gerente;
- Coordenador;
- Supervisor;
- Vendedor;
- Comprador;
- Projetista;
- Operador;
- Financeiro;
- Conferente.

Cada Perfil poderá possuir permissões diferentes.

---

# 6. PERMISSÕES GERAIS

As Permissões Gerais controlam o acesso aos módulos da plataforma.

Exemplos:

- acessar Leads;
- acessar Propostas;
- acessar Pedidos;
- acessar Produção;
- acessar Compras;
- acessar Financeiro;
- acessar Relatórios;
- acessar Configurações.

Essas permissões definem apenas o acesso inicial ao módulo.

---

# 7. PERMISSÕES ESPECIAIS

As Permissões Especiais controlam operações críticas.

Exemplos:

- excluir registros;
- aprovar propostas;
- converter proposta em pedido;
- anular revisão;
- cancelar pedido;
- alterar valores financeiros;
- visualizar documentos confidenciais;
- excluir arquivos;
- alterar permissões de usuários;
- visualizar custos internos;
- alterar dados fiscais;
- liberar produção.

---

# 8. OPERAÇÕES CRÍTICAS

As seguintes operações deverão possuir Permissão Especial.

## Comercial

- Aprovar Proposta.
- Cancelar Proposta.
- Converter Proposta em Pedido.
- Alterar valores após envio ao cliente.
- Anular Revisão.
- Alterar código da Proposta (quando permitido).

---

## Pedidos

- Cancelar Pedido.
- Alterar Pedido aprovado.
- Excluir Pedido.
- Criar Aditivo.
- Alterar condições comerciais.

---

## Produção

- Cancelar Ordem de Produção.
- Excluir Ordem.
- Alterar Produção concluída.
- Reabrir Ordem concluída.

---

## Compras

- Aprovar Compra.
- Cancelar Compra.
- Alterar fornecedor após aprovação.

---

## Financeiro

- Alterar valores.
- Alterar vencimentos.
- Excluir títulos.
- Registrar recebimentos.
- Registrar pagamentos.
- Estornar movimentações.

---

## Administração

- Alterar permissões.
- Alterar perfis.
- Alterar grupos.
- Excluir usuários.
- Resetar senhas.

---

# 9. DADOS CONFIDENCIAIS

O acesso às seguintes informações deverá possuir controle especial:

- custos internos;
- margem de lucro;
- salários;
- documentos financeiros;
- contratos;
- boletos;
- comprovantes;
- dados bancários;
- documentos fiscais.

Nem todo usuário do módulo deverá visualizar essas informações.

---

# 10. VISUALIZAÇÃO

As permissões poderão controlar:

- visualizar;
- criar;
- editar;
- excluir;
- aprovar;
- cancelar;
- imprimir;
- exportar;
- baixar arquivos.

Cada operação poderá possuir autorização própria.

---

# 11. ALTERAÇÃO DE PERMISSÕES

A alteração de permissões deverá ser restrita.

Somente usuários autorizados poderão modificar:

- grupos;
- perfis;
- permissões gerais;
- permissões especiais.

Toda alteração deverá gerar Histórico e Auditoria.

---

# 12. HERANÇA

Os Perfis poderão herdar permissões básicas.

As Permissões Especiais deverão ser concedidas individualmente.

Exemplo:

```text
Perfil

Vendedor

↓

Permissões Gerais

↓

Permissão Especial

Converter Proposta em Pedido
```

Outro vendedor poderá possuir o mesmo Perfil sem essa autorização.

---

# 13. VALIDAÇÕES

Toda operação crítica deverá validar:

- usuário autenticado;
- grupo;
- perfil;
- permissões gerais;
- permissões especiais.

A validação nunca deverá ocorrer apenas na interface.

O backend deverá validar novamente todas as permissões.

---

# 14. AUDITORIA

Toda utilização de Permissões Especiais deverá gerar Auditoria.

O sistema deverá registrar:

- usuário;
- operação;
- entidade;
- data;
- horário;
- IP (quando aplicável);
- justificativa (quando necessária).

---

# 15. JUSTIFICATIVA

Algumas operações poderão exigir justificativa obrigatória.

Exemplos:

- exclusão;
- cancelamento;
- anulação;
- alteração de valores;
- alteração financeira.

A justificativa deverá permanecer registrada permanentemente.

---

# 16. BLOQUEIOS

Mesmo possuindo acesso ao módulo, o usuário não deverá conseguir executar operações para as quais não possua autorização.

A interface poderá ocultar determinadas ações.

Entretanto, a validação obrigatoriamente deverá ocorrer também no backend.

---

# 17. EXEMPLOS

## Exemplo 1

```text
Usuário

↓

Grupo Comercial

↓

Perfil Vendedor

↓

Pode criar Propostas

↓

Não pode aprová-las
```

---

## Exemplo 2

```text
Usuário

↓

Grupo Comercial

↓

Perfil Gerente Comercial

↓

Pode criar Propostas

↓

Pode aprovar Propostas

↓

Pode converter em Pedido
```

---

## Exemplo 3

```text
Usuário

↓

Grupo Produção

↓

Perfil Operador

↓

Pode visualizar OP

↓

Não pode excluir OP

↓

Não pode cancelar OP
```

---

# 18. EVOLUÇÃO

Novas Permissões Especiais poderão ser criadas futuramente.

Entretanto:

- deverão possuir documentação;
- deverão possuir justificativa;
- deverão ser compatíveis com esta política.

---

# 19. RESULTADO ESPERADO

Toda operação considerada crítica deverá possuir controle específico de autorização.

O sistema deverá impedir que usuários executem ações incompatíveis com sua função.

As permissões deverão ser flexíveis, permitindo diferentes combinações entre grupos, perfis e autorizações especiais.

---

# 20. CONSIDERAÇÕES FINAIS

O sistema de Permissões Especiais representa uma camada adicional de segurança da Brasilab Intranet Lab.

Sua principal função é proteger operações críticas, preservar a integridade das informações e garantir que cada usuário execute apenas as ações compatíveis com suas responsabilidades.

Toda utilização dessas permissões deverá ser rastreável, auditável e compatível com a Política de Segurança da Informação da plataforma.

Fim do Documento.