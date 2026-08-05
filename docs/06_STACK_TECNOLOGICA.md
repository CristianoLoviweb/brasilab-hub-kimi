# 06_STACK_TECNOLOGICA.md

# Brasilab Intranet Lab

Versão: 1.0
Status: Em Planejamento
Data: Julho de 2026

---

# 1. OBJETIVO

Este documento define a Stack Tecnológica oficial da Brasilab Intranet Lab.

Seu objetivo é padronizar todas as tecnologias, serviços, bibliotecas e recursos que serão utilizados durante o desenvolvimento da plataforma.

Além da definição das tecnologias, este documento estabelece diretrizes de infraestrutura, armazenamento, segurança da informação e proteção de dados.

Toda Sprint deverá respeitar esta Stack.

Nenhuma tecnologia deverá ser adicionada sem avaliação técnica e atualização deste documento.

---

# 2. FILOSOFIA TECNOLÓGICA

A plataforma deverá priorizar:

- simplicidade;
- estabilidade;
- segurança;
- escalabilidade;
- desempenho;
- facilidade de manutenção;
- reutilização;
- baixo acoplamento;
- documentação;
- compatibilidade com ferramentas modernas de desenvolvimento assistido por IA;.

Sempre que existir uma solução consolidada ela deverá ser priorizada.

Evitar bibliotecas experimentais ou pouco mantidas.

---

# 3. PLATAFORMA

A Brasilab Intranet Lab será desenvolvida utilizando IA como plataforma principal de desenvolvimento.

A IA será utilizado para:

- criação do projeto;
- evolução contínua;
- geração de componentes;
- manutenção da aplicação;
- organização da arquitetura.

Todo código deverá permanecer compatível com futuras atualizações da plataforma.

---

# 4. FRONTEND

Stack oficial:

- React
- TypeScript
- Vite

Objetivos:

- componentização;
- reutilização;
- alta performance;
- facilidade de manutenção;
- escalabilidade.

---

# 5. INTERFACE

Bibliotecas oficiais:

- Tailwind CSS
- shadcn/ui

Objetivos:

- Design moderno;
- Componentes reutilizáveis;
- Interface consistente;
- Facilidade de customização;
- Alta produtividade.

Evitar bibliotecas visuais adicionais sem necessidade real.

---

# 6. GERENCIAMENTO DE ESTADO

Tecnologias previstas:

- TanStack Query

Objetivos:

- cache inteligente;
- sincronização;
- atualização automática;
- controle de requisições.

Sempre que possível o estado deverá permanecer local ao componente.

Estados globais deverão existir apenas quando realmente necessários.

---

# 7. FORMULÁRIOS

Bibliotecas oficiais:

- React Hook Form
- Zod

Objetivos:

- validação consistente;
- formulários performáticos;
- tipagem forte;
- redução de erros.

---

# 8. ROTEAMENTO

Tecnologia oficial:

- TanStack Router (integrado ao TanStack Start)

Responsabilidades:

- navegação;
- rotas protegidas;
- rotas públicas;
- navegação entre módulos;
- breadcrumbs.

---

# 9. BANCO DE DADOS

Banco oficial:

- PostgreSQL 16

Acesso e migrations:

- Drizzle ORM + drizzle-kit (migrations SQL versionadas, aplicadas no deploy)

Execução:

- Container Docker em todos os ambientes (desenvolvimento, homologação, testes de integração e produção), orquestrado por Docker Compose — sem SQLite e sem banco alternativo.

Todo dado operacional da empresa deverá permanecer armazenado no banco de dados.

O banco será considerado a fonte oficial de todas as informações da plataforma.

---

# 10. BACKEND

Stack oficial:

- TanStack Start (Server Functions — `createServerFn`) executando sobre Nitro SSR, no mesmo codebase do frontend

Camadas do servidor:

- Repositórios (Drizzle ORM)
- Services com as regras de negócio
- Server Functions com validação (Zod) e autorização (catálogo de permissões) no servidor

Recursos:

- Persistência transacional no PostgreSQL
- Sessão e autenticação no servidor
- Upload multipart e streaming de arquivos (suporte a Range)

Não há API REST/GraphQL separada: as chamadas de dados sobem para o servidor dentro do mesmo projeto.

---

# 11. AUTENTICAÇÃO

Mecanismo oficial (homologado na Sprint 03.2):

- Sessão própria no servidor, com cookie `HttpOnly; SameSite=Lax` (`Secure` em produção)
- Senha com hash argon2id (`@node-rs/argon2`)
- Tabela de sessões com expiração e revogação no logout
- Limite de tentativas de login

Recursos:

- login;
- logout;
- recuperação de senha (estrutura prevista);
- sessões com validade controlada.

---

# 12. STORAGE

Solução oficial (homologada na Sprint 03.2):

- Volume persistente no servidor, em diretório configurável por variável de ambiente (`STORAGE_DIR`)
- Caminho preparado para object storage S3-compatível via variável de ambiente, sem mudança de código

O Storage será utilizado exclusivamente para armazenar arquivos físicos.

O Storage NÃO deverá ser utilizado como fonte de informações da aplicação.

Toda informação sobre arquivos deverá permanecer armazenada no banco de dados.

O banco registra somente o caminho relativo (ex.: `leads/<código>/arquivos/<uuid>.<ext>`) e os metadados — nunca caminho absoluto nem binário.

---

# 13. ARQUITETURA DE ARMAZENAMENTO

A plataforma deverá separar completamente:

Arquivo físico

e

Metadados do arquivo.

O Storage armazenará apenas o arquivo.

O PostgreSQL armazenará:

- nome original;
- nome interno;
- entidade relacionada;
- categoria;
- usuário responsável;
- data de envio;
- tamanho;
- hash;
- tipo;
- extensão;
- versão;
- nível de acesso;
- status;
- observações;
- histórico;
- logs de acesso.

O banco de dados será responsável por controlar todo o ciclo de vida dos documentos.

---

# 14. ORGANIZAÇÃO DOS ARQUIVOS

Os arquivos deverão ser organizados por entidade.

Exemplo:

Leads/

Clientes/

Propostas/

Pedidos/

OrdensProducao/

Financeiro/

Compras/

Contratos/

Comprovantes/

Temporarios/

Cada entidade poderá possuir sua própria organização interna.

A estrutura definitiva será documentada posteriormente.

---

# 15. TIPOS DE ARQUIVOS

A plataforma deverá suportar diversos formatos.

Exemplos:

Documentos

- PDF
- DOC
- DOCX
- XLS
- XLSX
- CSV
- TXT

Projetos

- DWG
- DXF
- SKP

Imagens

- JPG
- PNG
- WEBP
- SVG

Compactados

- ZIP
- RAR

Outros formatos poderão ser adicionados futuramente.

---

# 16. CLASSIFICAÇÃO DOS DOCUMENTOS

Todos os documentos deverão possuir um nível de classificação.

Categorias iniciais:

Público

Interno

Restrito

Confidencial

A classificação determinará como o sistema tratará permissões, downloads e auditorias.

---

# 17. SEGURANÇA DOS DOCUMENTOS

Nenhum documento deverá ficar publicamente acessível.

Não deverão existir URLs públicas permanentes.

Todo acesso deverá passar obrigatoriamente pelo sistema.

Antes de liberar qualquer arquivo o sistema deverá validar:

- autenticação;
- permissão;
- perfil;
- grupo;
- escopo;
- classificação do documento;
- vínculo com a entidade.

Caso qualquer validação falhe o acesso deverá ser negado.

---

# 18. DADOS SENSÍVEIS

A plataforma armazenará informações altamente sensíveis.

Exemplos:

- contratos;
- boletos;
- comprovantes;
- documentos financeiros;
- documentos fiscais;
- dados bancários;
- dados pessoais;
- informações comerciais;
- documentos internos.

Esses dados deverão receber tratamento especial de segurança.

---

# 19. CRIPTOGRAFIA

Informações críticas deverão permanecer protegidas.

Sempre que tecnicamente viável deverão ser criptografados:

- CPF;
- CNPJ;
- dados bancários;
- observações confidenciais;
- tokens;
- chaves;
- documentos pessoais;
- credenciais.

O sistema deverá utilizar algoritmos modernos e amplamente aceitos pela comunidade.

---

# 20. PROTEÇÃO DOS DADOS

A plataforma deverá seguir os princípios da Lei Geral de Proteção de Dados (LGPD).

Cada usuário deverá visualizar apenas os dados necessários para exercer sua função.

Campos sensíveis poderão possuir proteção adicional.

Consultas a informações críticas poderão gerar registros de auditoria.

---

# 21. AUDITORIA DE DOCUMENTOS

O sistema deverá registrar operações importantes relacionadas aos documentos.

Exemplos:

- upload;
- download;
- visualização;
- exclusão;
- substituição;
- alteração de classificação.

Cada registro deverá informar:

- usuário;
- data;
- horário;
- documento;
- entidade;
- operação realizada.

---

# 22. COMPONENTES COMPLEMENTARES

Ícones

- Lucide

Tabelas

- TanStack Table

Gráficos

- Recharts

Notificações

- Sonner

Calendário

- FullCalendar

---

# 23. VERSIONAMENTO

Versionamento oficial:

- Git

Hospedagem:

- GitHub

Todo desenvolvimento deverá permanecer versionado.

Nenhuma funcionalidade deverá ser desenvolvida fora do repositório oficial.

---

# 24. PADRÕES DE CÓDIGO

Idioma do código:

- Inglês

Idioma da interface:

- Português (Brasil)

Comentários:

- Português

Documentação:

- Português

---

# 25. TECNOLOGIAS NÃO RECOMENDADAS

Evitar:

- JQuery;
- Bootstrap;
- Material UI;
- Ant Design;
- Redux (salvo necessidade futura);
- Styled Components;
- CSS Modules;
- Moment.js;
- bibliotecas sem manutenção ativa.

---

# 26. EVOLUÇÃO DA STACK

A Stack poderá evoluir durante o projeto.

Toda alteração deverá ser:

- documentada;
- justificada;
- aprovada.

Este documento deverá ser atualizado sempre que uma tecnologia oficial for adicionada, removida ou substituída.

Registro de alterações:

- **Agosto de 2026 — Sprint 03.2 (homologada, Baseline v0.3.0):** o backend deixou de ser previsto sobre Supabase e passou a ser stack própria, conforme plano aprovado da Sprint: PostgreSQL 16 exclusivo em todos os ambientes (sem SQLite), Drizzle ORM com migrations SQL versionadas, Server Functions do TanStack Start sobre Nitro, autenticação própria com sessão em cookie HttpOnly + argon2id e storage em volume persistente no servidor (`STORAGE_DIR`). Registrado também que o roteamento oficial é TanStack Router (já em uso desde a fundação do projeto), substituindo a referência anterior a React Router.

---

# 27. CONSIDERAÇÕES FINAIS

A Stack Tecnológica da Brasilab Intranet Lab foi definida para proporcionar uma plataforma moderna, segura, escalável e preparada para longo prazo.

A segurança da informação será tratada como um requisito fundamental da arquitetura e não como uma funcionalidade adicional.

Todas as decisões tecnológicas deverão priorizar proteção dos dados, rastreabilidade, manutenção e evolução contínua da plataforma.

Fim do Documento.