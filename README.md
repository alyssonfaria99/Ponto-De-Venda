# PDV API (Frente de Caixa)

## Descrição do Projeto
Este projeto consiste na criação de uma API para um sistema de PDV (Frente de Caixa). O projeto está dividido em diferentes sprints com o objetivo de construir funcionalidades incrementais, começando pela manipulação de dados de categorias e usuários, avançando para produtos, clientes e pedidos. A API é desenvolvida em **Node.js** com **PostgreSQL** como banco de dados e inclui a utilização de autenticação via **Bearer Token** para proteger as rotas.

## Funcionalidades

### 1ª Sprint
- Cadastro de usuários com validação de email único e criptografia de senha.
- Login de usuários com geração de token de autenticação.
- Listar categorias previamente cadastradas.
- Visualizar e editar perfil do usuário logado.

### 2ª Sprint
- Cadastro e edição de produtos com vínculo a categorias.
- Listar todos os produtos ou por categoria.
- Detalhar e excluir produtos cadastrados.
- Cadastro, listagem, detalhamento e edição de clientes com validação de CPF e email únicos.

### 3ª Sprint
- Cadastro e listagem de pedidos com produtos vinculados.
- Validação de estoque ao cadastrar pedidos.
- Envio de email ao cliente após o cadastro de um pedido.
- Exclusão e manipulação de imagens vinculadas a produtos.
- Aplicação de regras para impedir a exclusão de produtos vinculados a pedidos.

## Tecnologias Utilizadas
- **Node.js**: Para desenvolvimento da API.
- **PostgreSQL**: Para gerenciamento do banco de dados.
- **JWT (JSON Web Token)**: Para autenticação dos usuários.
- **Bcrypt**: Para criptografia de senhas.
- **Nodemailer**: Para envio de emails.
- **Serviços de Armazenamento (Blackblaze)**: Para upload de imagens de produtos.

## Instalação
### Pré-requisitos
   - Node.js >= 14.0.0
   
   - PostgreSQL >= 13.0.0
   
1. Clone o repositório
   ```bash
   git clone https://github.com/alyssonfaria99/Ponto-De-Venda.git
   cd Ponto-De-Venda

2. Instale as dependências
   ```bash
      npm install

3. Configura as variáveis de ambiente criando um arquivo .env na raíz do projeto, seguindo o exemplo:
   ```bash
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=seuusuario
   DB_PASSWORD=suasenha
   DB_NAME=pdv
   JWT_SECRET=sua_chave_secreta
   EMAIL_USER=seuemail@example.com
   EMAIL_PASS=suasenha
   STORAGE_API_URL=https://api.armazem.com
   STORAGE_API_KEY=sua_api_key
