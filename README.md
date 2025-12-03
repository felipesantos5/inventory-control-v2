# 📦 Controle de Estoque

Bem-vindo ao Controle de Estoque! Este é um sistema completo para gerenciamento de inventário, desenvolvido com uma API robusta em Spring Boot e um frontend moderno em React.

## ✨ Funcionalidades

- **🔐 Autenticação:** Sistema seguro com login baseado em JWT (Access Token + Refresh Token).
- **👤 Gerenciamento de Usuários:** Criação e exclusão de usuários (restrito a Admins).
- **👥 Níveis de Acesso:**
  - **Admin:** Acesso total ao sistema.
  - **Funcionário (Employee):** Acesso restrito às categorias de produtos designadas.
- **📚 Gerenciamento de Categorias:** CRUD completo para categorias de produtos (restrito a Admins).
- **🛍️ Gerenciamento de Produtos:** CRUD completo para produtos, com permissões baseadas nas categorias do funcionário.
- **💰 Ajuste de Preços:** Funcionalidade para ajustar o preço de todos os produtos por percentual (restrito a Admins).
- **↔️ Movimentação de Estoque:** Registro de entradas e saídas de produtos, atualizando automaticamente a quantidade em estoque. Avisos sobre estoque mínimo/máximo.
- **📊 Relatórios:**
  - Lista de Preços.
  - Balanço de Estoque (quantidade física e valor financeiro).
  - Produtos Abaixo do Estoque Mínimo.
  - Contagem de Produtos por Categoria.
  - Produtos com Maior Movimentação (entrada e saída).
- **📜 Documentação da API:** Interface Swagger UI para explorar e testar os endpoints da API.

## 🛠️ Tecnologias Utilizadas

**Backend (API):**

- Java 21
- Spring Boot 3
- Spring Security (com JWT)
- Spring Data JPA (Hibernate)
- PostgreSQL
- Maven
- Docker & Docker Compose
- Lombok
- Springdoc OpenAPI (Swagger UI)

**Frontend:**

- React 19
- TypeScript
- Vite
- Zustand (Gerenciamento de Estado)
- Axios
- React Router DOM
- Tailwind CSS
- Shadcn UI (Componentes)
- Lucide React (Ícones)
- Zod (Validação de Schema)
- React Hook Form

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Docker](https://www.docker.com/get-started/) e [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Yarn](https://yarnpkg.com/getting-started/install) (ou npm)

### ⚙️ Backend (API com Docker)

1.  **Navegue até o diretório `api`:**

    ```bash
    cd api
    ```

2.  **Crie um arquivo `.env`:**
    Baseie-se nas variáveis de ambiente usadas no `docker-compose.yml` e `application.properties`. Crie um arquivo chamado `.env` na raiz do diretório `api` com o seguinte conteúdo:

    ```env
    # Database Configuration
    DB_URL=jdbc:postgresql://db:5432/inventory_control_db
    DB_USERNAME=inventory_admin
    DB_PASSWORD=controleestoquepass

    # JWT Configuration
    JWT_SECRET=SEU_SEGREDO_JWT_LONGO_E_SEGURO_AQUI # Troque por uma chave segura
    JWT_EXPIRATION_MS=3600000 # 1 hora
    JWT_REFRESH_EXPIRATION_MS=604800000 # 7 dias
    ```

    - **Importante:** Substitua `SEU_SEGREDO_JWT_LONGO_E_SEGURO_AQUI` por uma chave secreta forte e aleatória.

3.  **Suba os containers Docker:**

    ```bash
    docker-compose up -d --build
    ```

    Isso irá construir a imagem da API e iniciar os containers da API e do banco de dados PostgreSQL.

4.  **Acesso:**
    - A API estará disponível em: `http://localhost:8080`
    - A documentação Swagger UI estará disponível em: `http://localhost:8080/swagger-ui.html`

### 🖥️ Frontend

1.  **Navegue até o diretório `frontend`:**

    ```bash
    cd ../frontend
    # ou cd frontend a partir da raiz do projeto
    ```

2.  **Crie um arquivo `.env`:**
    Crie um arquivo chamado `.env` na raiz do diretório `frontend` com o seguinte conteúdo, apontando para a URL da sua API backend:

    ```env
    VITE_API_BASE_URL=http://localhost:8080/api
    ```

3.  **Instale as dependências:**

    ```bash
    yarn install
    # ou npm install
    ```

4.  **Inicie o servidor de desenvolvimento:**

    ```bash
    yarn dev
    # ou npm run dev
    ```

5.  **Acesso:**
    - A aplicação frontend estará disponível em: `http://localhost:5173`.

## 🔑 Autenticação

- Um usuário **Admin** padrão é criado na inicialização da API:
  - **Email:** `admin@gmail.com`
  - **Senha:** `admin123`
- Use essas credenciais para fazer login no frontend.

Aproveite o sistema! 🎉
