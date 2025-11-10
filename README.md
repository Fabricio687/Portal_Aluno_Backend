# Portal do Aluno - Backend API

Backend API para o Portal do Aluno SENAC, desenvolvido com Node.js, Express e MongoDB.

## 🚀 Funcionalidades

- **Autenticação**: Login e registro de estudantes
- **Gestão de Usuários**: CRUD completo de estudantes
- **Cursos**: Gerenciamento de disciplinas e matrículas
- **Notas**: Sistema de avaliações e notas
- **Frequência**: Controle de presença
- **Notificações**: Sistema de alertas e mensagens
- **JWT**: Autenticação segura com tokens

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **CORS** - Cross-origin resource sharing

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- MongoDB Atlas ou MongoDB local
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   # Copie o arquivo .env.example para .env
   cp .env.example .env
   
   # Edite o arquivo .env com suas configurações
   ```

4. Configure as variáveis no arquivo `.env`:
   ```
   PORT=3001
   DB_USER=seu_usuario_mongodb
   DB_PASS=sua_senha_mongodb
   DB_NAME=portal-aluno
   JWT_SECRET=sua_chave_secreta
   CORS_ORIGIN=http://localhost:3000
   ```

## 🚀 Executando

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

## 📚 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login do usuário
- `GET /api/auth/me` - Obter perfil do usuário logado

### Teste
- `GET /api/ping` - Teste de conectividade
- `GET /` - Status da API

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Para acessar rotas protegidas, inclua o token no header:

```
Authorization: Bearer <seu_token_jwt>
```

## 📁 Estrutura do Projeto

```
├── controllers/     # Controladores da API
├── middleware/      # Middlewares (auth, validação)
├── models/          # Modelos do MongoDB
├── routes/          # Rotas da API
├── config/          # Configurações
├── Uploads/         # Arquivos estáticos
├── index.js         # Arquivo principal
└── package.json     # Dependências
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

---

**Desenvolvido com ❤️ pela equipe SENAC**