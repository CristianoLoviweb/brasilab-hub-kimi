# 03_DOMINIO_DO_SISTEMA.md

# Brasilab Intranet Lab

Versão: 1.0
Status: Em Planejamento
Data: Julho de 2026

---

# 1. APRESENTAÇÃO

- Este documento define os principais conceitos utilizados pela Brasilab Intranet Lab.
- Seu objetivo é criar uma linguagem única para todo o projeto.
- Todos os módulos deverão utilizar exatamente as mesmas definições aqui documentadas.
- Nenhum conceito deverá possuir interpretações diferentes entre módulos.
- Sempre que um novo conceito surgir, este documento deverá ser atualizado.

---

# 2. DOMÍNIO DO SISTEMA

- O domínio do sistema representa o conjunto de entidades, conceitos e relacionamentos que compõem o funcionamento da empresa.
- Cada entidade deverá possuir responsabilidades bem definidas.
- Cada entidade deverá possuir um ciclo de vida próprio.
- O sistema deverá manter consistência entre todos os relacionamentos.

---

# 3. LEAD

Definição:

- Um Lead representa uma oportunidade comercial.

Características:

- Ainda não existe venda.
- Ainda não existe pedido.
- Pode possuir diversos contatos registrados.
- Pode possuir anexos.
- Pode possuir observações.
- Pode possuir histórico.
- Pode ser convertido em uma ou mais propostas.

---

# 4. CLIENTE

Definição:

- Cliente representa uma pessoa física ou jurídica que mantém relacionamento comercial com a empresa.

Características:

- Pode possuir diversos Leads.
- Pode possuir diversas Propostas.
- Pode possuir diversos Pedidos.
- Pode possuir diversos contatos.
- Deve possuir cadastro único.

---

# 5. PROPOSTA

Definição:

- Uma proposta representa uma oferta comercial elaborada para um cliente.

Características:

- Sempre pertence a um cliente.
- Sempre possui origem conhecida.
- Pode possuir diversas revisões.
- Pode possuir anexos.
- Pode possuir histórico.
- Pode ser aprovada.
- Pode ser recusada.
- Pode ser cancelada.
- Pode originar um Pedido.

---

# 6. REVISÃO

Definição:

- Uma revisão representa uma nova versão da mesma proposta.

Características:

- Nunca existe de forma independente.
- Sempre pertence a uma proposta.
- Possui numeração própria.
- Mantém histórico.
- Pode gerar novos arquivos.

---

# 7. PEDIDO

Definição:

- Um pedido representa a formalização de uma venda.

Características:

- Sempre possui origem em uma proposta aprovada.
- Possui cliente.
- Possui itens.
- Possui histórico.
- Pode gerar diversas Ordens de Produção.
- Pode gerar compras.
- Pode gerar faturamento.

---

# 8. ITEM DO PEDIDO

Definição:

- Um Item representa um produto, serviço ou conjunto de componentes pertencentes ao Pedido.

Características:

- Sempre pertence a um Pedido.
- Pode originar uma ou mais Ordens de Produção.
- Pode possuir observações técnicas.

---

# 9. ORDEM DE PRODUÇÃO

Definição:

- Uma Ordem de Produção representa uma atividade operacional destinada à fabricação ou preparação de um conjunto de itens.

Características:

- Sempre pertence a um Pedido.
- Pode atender um ou vários itens.
- Possui setor responsável.
- Possui prioridade.
- Possui status.
- Possui histórico.
- Possui anexos.

---

# 10. SETOR

Definição:

- Setor representa uma área operacional da empresa.

Exemplos:

- Comercial.
- Engenharia.
- Produção.
- Compras.
- Financeiro.
- Logística.
- Administrativo.

---

# 11. USUÁRIO

Definição:

- Usuário representa uma pessoa autorizada a utilizar a Intranet.

Características:

- Possui autenticação.
- Possui permissões.
- Pode executar ações.
- Todas as ações deverão ser registradas.

---

# 12. PERFIL

Definição:

- Perfil representa um conjunto de permissões atribuídas a um usuário.

Exemplos:

- Administrador.
- Comercial.
- Engenharia.
- Produção.
- Compras.
- Financeiro.
- Diretoria.

---

# 13. HISTÓRICO

Definição:

- Histórico representa o registro cronológico de eventos relacionados a uma entidade.

Características:

- Nunca poderá ser apagado.
- Nunca poderá ser alterado.
- Sempre registrará usuário, data e ação realizada.
- Deverá garantir rastreabilidade completa.

---

# 14. ANEXO

Definição:

- Anexo representa qualquer arquivo armazenado pelo sistema.

Exemplos:

- PDF.
- DWG.
- DOCX.
- XLSX.
- Imagens.
- Modelos 3D.
- Outros documentos.

Características:

- Sempre deverá possuir vínculo com alguma entidade.
- Deverá possuir histórico de envio.

---

# 15. STATUS

Definição:

- Status representa a situação atual de uma entidade.

Características:

- Cada módulo possuirá seus próprios status.
- O significado de cada status será documentado individualmente.
- Mudanças de status deverão gerar histórico.

---

# 16. AUDITORIA

Definição:

- Auditoria representa o conjunto de registros utilizados para rastrear ações executadas dentro da plataforma.

Características:

- Toda alteração importante deverá ser auditada.
- O objetivo é garantir transparência e rastreabilidade.

---

# 17. DASHBOARD

Definição:

- Dashboard representa o ambiente inicial da Intranet.

Objetivos:

- Exibir indicadores.
- Exibir pendências.
- Exibir atividades recentes.
- Facilitar acesso rápido às principais funcionalidades.

---

# 18. MÓDULO

Definição:

- Módulo representa um conjunto organizado de funcionalidades relacionadas a um mesmo processo empresarial.

Exemplos:

- Comercial.
- Produção.
- Compras.
- Financeiro.
- Estoque.

Cada módulo deverá possuir independência funcional, mantendo integração com os demais.

---

# 19. REGRAS DE DOMÍNIO

- Um Lead pode gerar várias Propostas.
- Uma Proposta pertence a apenas um Cliente.
- Uma Proposta possui uma ou mais Revisões.
- Apenas uma Proposta aprovada pode gerar um Pedido.
- Um Pedido pode possuir diversos Itens.
- Um Pedido pode gerar diversas Ordens de Produção.
- Uma Ordem de Produção sempre pertence a um Pedido.
- Todo Histórico é imutável.
- Toda ação relevante deve gerar Auditoria.
- Todo Usuário atua através de um Perfil de Permissões.

---

# 20. EVOLUÇÃO

- Este documento deverá crescer continuamente.
- Novos conceitos deverão ser adicionados antes da implementação de novos módulos.
- Todas as definições aqui descritas deverão servir como referência oficial para o desenvolvimento da plataforma.

Fim do Documento.