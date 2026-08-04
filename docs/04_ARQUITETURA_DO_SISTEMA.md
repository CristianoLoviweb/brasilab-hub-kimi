# 04_ARQUITETURA_DO_SISTEMA.md

# Brasilab Intranet Lab

Versão: 1.0
Status: Em Planejamento
Data: Julho de 2026

---

# 1. OBJETIVO

- Este documento define a arquitetura geral da Brasilab Intranet Lab.
- Seu objetivo é estabelecer padrões estruturais para todo o projeto.
- Todas as futuras implementações deverão respeitar esta arquitetura.
- Nenhum módulo poderá ser desenvolvido ignorando as definições aqui estabelecidas.

---

# 2. FILOSOFIA DA ARQUITETURA

- O sistema deverá ser modular.
- O sistema deverá ser escalável.
- O sistema deverá ser simples de manter.
- O sistema deverá evitar acoplamentos desnecessários.
- O sistema deverá favorecer reutilização de componentes.
- O sistema deverá possuir responsabilidades bem definidas.
- O sistema deverá crescer sem necessidade de grandes refatorações.

---

# 3. PRINCÍPIOS

A arquitetura deverá seguir os seguintes princípios:

- Modularidade.
- Simplicidade.
- Consistência.
- Reutilização.
- Escalabilidade.
- Baixo acoplamento.
- Alta coesão.
- Responsabilidade única.
- Separação de responsabilidades.

---

# 4. VISÃO GERAL

A Intranet será composta por módulos independentes.

Cada módulo será responsável por um domínio específico do negócio.

Os módulos compartilharão uma única base de dados.

Os módulos poderão comunicar-se entre si através das regras de negócio definidas pelo sistema.

Nenhum módulo deverá acessar diretamente informações internas de outro módulo sem utilizar suas interfaces oficiais.

---

# 5. ESTRUTURA GERAL

A aplicação será dividida em cinco grandes camadas.

- Interface do Usuário.
- Componentes Compartilhados.
- Regras de Negócio.
- Persistência de Dados.
- Serviços Externos.

Cada camada possuirá responsabilidades próprias.

---

# 6. CAMADA DE INTERFACE

Responsabilidades:

- Exibir informações.
- Receber ações do usuário.
- Validar entradas básicas.
- Exibir feedbacks.
- Navegação.

A interface nunca deverá conter regras de negócio complexas.

---

# 7. CAMADA DE COMPONENTES

Responsabilidades:

- Componentes reutilizáveis.
- Layouts.
- Cards.
- Tabelas.
- Formulários.
- Modais.
- Menus.
- Botões.
- Alertas.

Todos os componentes deverão ser reutilizáveis.

---

# 8. CAMADA DE NEGÓCIO

Responsabilidades:

- Regras empresariais.
- Validações.
- Fluxos.
- Permissões.
- Conversões.
- Processamentos.

Toda regra importante deverá existir nesta camada.

---

# 9. CAMADA DE DADOS

Responsabilidades:

- Persistência.
- Consultas.
- Atualizações.
- Exclusões.
- Transações.

A camada de dados nunca deverá conhecer detalhes da interface.

---

# 10. CAMADA DE SERVIÇOS

Responsabilidades:

- Uploads.
- Autenticação.
- E-mails.
- APIs.
- Notificações.
- Serviços externos.

Esses serviços deverão permanecer desacoplados dos módulos.

---

# 11. MÓDULOS

Cada módulo deverá possuir autonomia funcional.

Exemplo:

- Comercial.
- Clientes.
- Propostas.
- Pedidos.
- Produção.
- Compras.
- Financeiro.
- Estoque.
- RH.
- Configurações.

A comunicação ocorrerá através das regras do domínio.

---

# 12. COMPONENTES GLOBAIS

Alguns componentes serão compartilhados por toda a plataforma.

Exemplos:

- Sidebar.
- Header.
- Breadcrumb.
- Pesquisa Global.
- Notificações.
- Modal.
- Drawer.
- Confirm Dialog.
- Toast.
- Upload.
- Tabela.
- Paginação.

Esses componentes deverão existir apenas uma vez.

---

# 13. GERENCIAMENTO DE ESTADO

O estado da aplicação deverá ser dividido em três categorias.

Estado Global

- Usuário.
- Sessão.
- Tema.
- Permissões.
- Configurações.

Estado Compartilhado

- Dados de módulos.
- Listagens.
- Cache.

Estado Local

- Formulários.
- Modais.
- Componentes.

Cada informação deverá existir no menor escopo possível.

---

# 14. NAVEGAÇÃO

A navegação deverá ser simples.

Objetivos:

- Poucos cliques.
- URLs organizadas.
- Breadcrumb.
- Pesquisa rápida.
- Menu consistente.

O usuário nunca deverá sentir que está perdido.

---

# 15. PADRÃO DE MÓDULOS

Todos os módulos deverão seguir uma estrutura semelhante.

Cada módulo deverá possuir:

- Dashboard.
- Listagem.
- Cadastro.
- Edição.
- Visualização.
- Histórico.
- Configurações (quando necessário).

O objetivo é criar previsibilidade para o usuário.

---

# 16. AUDITORIA

Todas as ações relevantes deverão gerar registros de auditoria.

Exemplos:

- Criação.
- Alteração.
- Exclusão.
- Login.
- Alteração de permissões.
- Mudança de status.

A rastreabilidade será um requisito obrigatório.

---

# 17. SEGURANÇA

A segurança deverá ser considerada desde o início do projeto.

Princípios:

- Autenticação.
- Autorização.
- Permissões.
- Auditoria.
- Validação.
- Proteção contra acessos indevidos.

Nenhum módulo poderá ignorar essas regras.

---

# 18. ESCALABILIDADE

A arquitetura deverá permitir:

- novos módulos;
- novos usuários;
- novas permissões;
- novos processos;
- novas integrações;

sem necessidade de reconstrução da plataforma.

---

# 19. EVOLUÇÃO

A arquitetura deverá evoluir continuamente.

Sempre que uma decisão estrutural for alterada:

- este documento deverá ser atualizado;
- o MASTER_CONTEXT deverá ser revisado;
- a alteração deverá ser registrada no CHANGELOG.

---

# 20. CONSIDERAÇÕES FINAIS

A arquitetura da Brasilab Intranet Lab deverá priorizar longevidade.

Toda decisão técnica deverá favorecer organização, manutenção, reutilização e evolução contínua.

Nenhuma decisão deverá ser tomada visando apenas acelerar o desenvolvimento.

A arquitetura será considerada um dos ativos mais importantes do projeto.

Fim do Documento.

# 18. ARQUITETURA DE ACESSO

* O sistema deverá possuir uma arquitetura de controle de acesso baseada em usuários, grupos, perfis e permissões.
* O controle de acesso deverá existir desde a fundação do projeto.
* Nenhum módulo deverá depender apenas da ocultação visual de menus ou botões.
* Toda permissão deverá ser validada também na camada responsável pela execução da operação.
* O sistema deverá aplicar o princípio do menor privilégio.
* Cada usuário deverá possuir acesso somente às informações e ações necessárias para sua função.
* O controle de acesso deverá ser centralizado e reutilizado por todos os módulos.
* Nenhum módulo deverá criar um sistema próprio e isolado de permissões.

---

# 19. USUÁRIOS

* Usuário representa uma pessoa autorizada a acessar a Intranet.
* Cada usuário deverá possuir uma conta individual.
* Contas compartilhadas não deverão ser utilizadas.
* Cada ação relevante deverá ser vinculada ao usuário responsável.
* Um usuário poderá pertencer a um ou mais grupos.
* Um usuário poderá possuir um perfil principal.
* Um usuário poderá receber permissões adicionais ou restrições específicas, quando necessário.
* Usuários poderão ser ativados, bloqueados ou desativados.
* A desativação de um usuário não deverá apagar seu histórico.

---

# 20. GRUPOS DE ACESSO

* Grupo de acesso representa um conjunto de usuários que compartilham características operacionais ou organizacionais.
* Os grupos poderão representar departamentos, equipes, unidades ou responsabilidades específicas.
* Um grupo poderá possuir permissões próprias.
* Um usuário poderá pertencer a mais de um grupo.
* As permissões recebidas por meio dos grupos deverão ser combinadas conforme as regras definidas pelo sistema.
* A remoção de um usuário de um grupo não deverá apagar ações realizadas anteriormente.

Exemplos iniciais de grupos:

* Comercial.
* Projetos.
* Engenharia.
* Produção.
* Marcenaria.
* Marmoraria.
* Compras.
* Logística.
* Financeiro.
* Administrativo.
* Diretoria.
* Tecnologia.

---

# 21. PERFIS DE ACESSO

* Perfil de acesso representa um conjunto padronizado de permissões associado à função exercida pelo usuário.
* O perfil define o nível funcional de acesso dentro do sistema.
* Um perfil não deverá ser confundido com um departamento.
* O grupo representa onde o usuário atua.
* O perfil representa o que o usuário pode fazer.
* Os perfis deverão ser configuráveis.
* Alterações em um perfil deverão refletir nos usuários vinculados a ele.
* Alterações de perfil deverão gerar auditoria.

Exemplos iniciais de perfis:

* Administrador do Sistema.
* Diretor.
* Gerente.
* Supervisor.
* Vendedor.
* Projetista.
* Operador de Produção.
* Comprador.
* Analista Financeiro.
* Consulta.
* Auditor.

---

# 22. PERMISSÕES

* Permissão representa uma autorização específica para visualizar ou executar determinada ação.
* As permissões deverão ser granulares.
* Não deverá existir apenas uma distinção genérica entre administrador e usuário comum.
* Cada módulo deverá declarar formalmente suas permissões.
* As permissões deverão ser verificadas antes da execução de qualquer ação protegida.
* A ausência de permissão deverá sempre resultar em bloqueio seguro.

As permissões poderão seguir ações padronizadas, como:

* Visualizar.
* Listar.
* Criar.
* Editar.
* Excluir.
* Alterar status.
* Aprovar.
* Cancelar.
* Exportar.
* Importar.
* Anexar arquivos.
* Visualizar valores.
* Visualizar informações confidenciais.
* Gerenciar configurações.
* Gerenciar permissões.

Exemplos:

* `leads.visualizar`
* `leads.criar`
* `leads.editar`
* `propostas.aprovar`
* `pedidos.converter`
* `ordens_producao.criar`
* `ordens_producao.concluir`
* `financeiro.visualizar_valores`
* `usuarios.gerenciar`
* `permissoes.gerenciar`

---

# 23. ESCOPO DE VISIBILIDADE DOS DADOS

* Possuir acesso a um módulo não significa necessariamente poder visualizar todos os registros desse módulo.
* O sistema deverá permitir controle de acesso também pelo escopo dos dados.
* O escopo deverá ser considerado nas consultas, indicadores, relatórios e pesquisas.
* O controle não poderá ser aplicado somente depois que os dados forem carregados no frontend.

Escopos previstos:

* Próprios registros.
* Registros da equipe.
* Registros do setor.
* Registros da unidade.
* Todos os registros da empresa.

Exemplos:

* Um vendedor poderá visualizar apenas seus próprios leads e propostas.
* Um supervisor comercial poderá visualizar os registros de sua equipe.
* A diretoria poderá visualizar todos os registros.
* Um operador de produção poderá visualizar apenas Ordens de Produção de seu setor.
* O Financeiro poderá visualizar valores que não estarão disponíveis para a Produção.

---

# 24. HIERARQUIA E COMPOSIÇÃO DE ACESSO

* O acesso efetivo de um usuário poderá resultar da combinação entre perfil, grupos e permissões individuais.
* O sistema deverá possuir uma regra clara para resolver conflitos.
* Restrições explícitas deverão possuir prioridade sobre permissões concedidas.
* Permissões administrativas não deverão ser concedidas automaticamente por pertencer a um departamento.
* Exceções individuais deverão ser utilizadas apenas quando necessárias.
* O sistema deverá permitir identificar a origem de cada permissão recebida.

O acesso efetivo deverá considerar:

* Perfil principal.
* Grupos vinculados.
* Permissões concedidas diretamente.
* Restrições aplicadas diretamente.
* Escopo de visibilidade.
* Estado atual da conta.

---

# 25. VALIDAÇÃO DE ACESSO

* A interface poderá ocultar menus, botões e ações não autorizadas.
* A ocultação visual será apenas uma melhoria de experiência.
* A autorização real deverá ser validada antes da execução da ação.
* Rotas protegidas deverão impedir acesso direto por URL.
* Consultas deverão retornar apenas registros autorizados.
* APIs e operações no banco deverão respeitar o mesmo controle.
* Nenhum dado confidencial deverá ser enviado ao navegador de um usuário sem autorização.

---

# 26. GESTÃO DE ACESSOS

* O sistema deverá possuir uma área administrativa específica para gestão de usuários, grupos, perfis e permissões.
* Essa área deverá ser acessível apenas por usuários autorizados.
* O administrador deverá conseguir visualizar quais acessos um usuário possui.
* O sistema deverá informar a origem de cada acesso.
* Alterações deverão possuir confirmação e auditoria.
* Mudanças críticas poderão exigir justificativa.

A gestão deverá permitir:

* Criar e editar perfis.
* Criar e editar grupos.
* Vincular usuários a grupos.
* Definir perfil principal.
* Conceder permissões específicas.
* Aplicar restrições específicas.
* Definir escopo de dados.
* Ativar, bloquear e desativar usuários.
* Consultar histórico de alterações de acesso.

---

# 27. AUDITORIA DE ACESSO

* Toda alteração em usuários, grupos, perfis e permissões deverá gerar auditoria.
* O registro deverá informar o responsável pela alteração.
* O registro deverá informar data e horário.
* O registro deverá indicar o estado anterior e o estado posterior.
* O histórico de acesso não poderá ser alterado ou excluído.
* Tentativas de acesso negado a áreas críticas poderão ser registradas.
* Logins, bloqueios e encerramentos de sessão deverão ser auditáveis.

---

# 28. ACESSO EM MÚLTIPLOS MÓDULOS

* Cada módulo deverá integrar-se ao mesmo sistema central de autorização.
* O Comercial não deverá implementar permissões diferentes das utilizadas pela Produção.
* O Financeiro poderá possuir permissões adicionais devido à sensibilidade das informações.
* Novos módulos deverão declarar suas permissões antes de serem implementados.
* Nenhuma Sprint será considerada concluída sem validação dos acessos aplicáveis ao módulo desenvolvido.
