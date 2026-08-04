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

- React Router

Responsabilidades:

- navegação;
- rotas protegidas;
- rotas públicas;
- navegação entre módulos;
- breadcrumbs.

---

# 9. BANCO DE DADOS

Banco oficial:

- PostgreSQL

Gerenciado através do:

- Supabase

Todo dado operacional da empresa deverá permanecer armazenado no banco de dados.

O banco será considerado a fonte oficial de todas as informações da plataforma.

---

# 10. BACKEND

Serviço oficial:

- Supabase

Recursos previstos:

- PostgreSQL
- Authentication
- Storage
- Edge Functions
- APIs
- Realtime

Sempre que possível deverão ser utilizados recursos nativos da plataforma.

---

# 11. AUTENTICAÇÃO

Serviço oficial:

- Supabase Auth

Recursos previstos:

- login;
- logout;
- recuperação de senha;
- sessões;
- refresh tokens;
- autenticação segura.

Toda autenticação deverá utilizar mecanismos oficiais da plataforma.

---

# 12. STORAGE

Serviço oficial:

- Supabase Storage

O Storage será utilizado exclusivamente para armazenar arquivos físicos.

O Storage NÃO deverá ser utilizado como fonte de informações da aplicação.

Toda informação sobre arquivos deverá permanecer armazenada no banco de dados.

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

---

# 27. CONSIDERAÇÕES FINAIS

A Stack Tecnológica da Brasilab Intranet Lab foi definida para proporcionar uma plataforma moderna, segura, escalável e preparada para longo prazo.

A segurança da informação será tratada como um requisito fundamental da arquitetura e não como uma funcionalidade adicional.

Todas as decisões tecnológicas deverão priorizar proteção dos dados, rastreabilidade, manutenção e evolução contínua da plataforma.

Fim do Documento.