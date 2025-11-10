# Portal do Aluno - Backend

Backend API para o Portal do Aluno SENAC construído com Express.js e MongoDB.

## 🚀 Tecnologias

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JsonWebToken)
- Bcrypt
- Multer (uploads)
- Nodemailer (emails)

## 📋 Pré-requisitos

- Node.js 18 ou superior
- MongoDB Atlas ou MongoDB local
- Conta no Vercel (para deploy)

## 🔧 Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp config.env.example config.env
```

4. Edite o arquivo `config.env` com suas configurações:

```env
PORT=3100
NODE_ENV=development
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco?retryWrites=true&w=majority
JWT_SECRET=sua-chave-secreta-super-forte-minimo-32-caracteres
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

## 🏃 Executar

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm start
```

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter usuário atual

### Cursos
- `GET /api/courses` - Listar cursos
- `POST /api/courses` - Criar curso (admin/teacher)
- `GET /api/courses/:id` - Obter curso por ID
- `PUT /api/courses/:id` - Atualizar curso (admin/teacher)
- `DELETE /api/courses/:id` - Deletar curso (admin)

### Notas
- `GET /api/grades` - Listar notas
- `POST /api/grades` - Criar nota (teacher/admin)
- `GET /api/grades/:id` - Obter nota por ID
- `PUT /api/grades/:id` - Atualizar nota (teacher/admin)
- `DELETE /api/grades/:id` - Deletar nota (admin)

### Aulas
- `GET /api/lessons` - Listar aulas
- `POST /api/lessons` - Criar aula (teacher/admin)
- `GET /api/lessons/:id` - Obter aula por ID
- `PUT /api/lessons/:id` - Atualizar aula (teacher/admin)
- `DELETE /api/lessons/:id` - Deletar aula (admin)

### Provas
- `GET /api/exams` - Listar provas
- `POST /api/exams` - Criar prova (teacher/admin)
- `GET /api/exams/:id` - Obter prova por ID
- `PUT /api/exams/:id` - Atualizar prova (teacher/admin)
- `DELETE /api/exams/:id` - Deletar prova (admin)

### Usuários
- `GET /api/users` - Listar usuários (admin)
- `GET /api/users/:id` - Obter usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário (admin)

### Dashboard
- `GET /api/dashboard` - Obter dados do dashboard

### Mensagens
- `GET /api/messages` - Listar mensagens
- `POST /api/messages` - Enviar mensagem
- `GET /api/messages/:id` - Obter mensagem por ID

### Calendário
- `GET /api/calendar` - Listar eventos do calendário
- `POST /api/calendar` - Criar evento (teacher/admin)
- `GET /api/calendar/:id` - Obter evento por ID
- `PUT /api/calendar/:id` - Atualizar evento (teacher/admin)
- `DELETE /api/calendar/:id` - Deletar evento (admin)

### Presença
- `GET /api/attendance` - Listar presenças
- `POST /api/attendance` - Registrar presença (teacher/admin)
- `GET /api/attendance/:id` - Obter presença por ID

### Certificados
- `GET /api/certificates` - Listar certificados
- `POST /api/certificates` - Criar certificado (admin)
- `GET /api/certificates/:id` - Obter certificado por ID

## 🔒 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Inclua o token no header:

```
Authorization: Bearer <token>
```

## 📝 Variáveis de Ambiente

### Obrigatórias

- `MONGODB_URI` - URI de conexão do MongoDB
- `JWT_SECRET` - Chave secreta para JWT (mínimo 32 caracteres em produção)

### Opcionais

- `PORT` - Porta do servidor (padrão: 3100)
- `NODE_ENV` - Ambiente (development/production)
- `CORS_ORIGIN` - Origens permitidas para CORS (separadas por vírgula)
- `FRONTEND_URL` - URL do frontend (para links em emails)
- `SMTP_HOST` - Host SMTP para emails
- `SMTP_PORT` - Porta SMTP
- `SMTP_SECURE` - Usar SSL/TLS
- `SMTP_USER` - Usuário SMTP
- `SMTP_PASS` - Senha SMTP

## 🚀 Deploy no Vercel

Veja o arquivo [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md) para instruções detalhadas.

### Resumo

1. Configure as variáveis de ambiente no Vercel
2. Faça o deploy via CLI ou Dashboard
3. Configure o CORS para aceitar requisições do frontend

## ⚠️ Limitações

### Uploads de Arquivos

No Vercel, a rota `/files` não funcionará porque as funções serverless são stateless. Para produção, use um serviço de storage externo:

- AWS S3
- Cloudinary
- Firebase Storage
- Google Cloud Storage
- Vercel Blob Storage (plano Pro)

## 📞 Suporte

Para mais informações, consulte:
- [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md) - Guia de deploy
- [README_DEPLOY.md](../README_DEPLOY.md) - Guia completo de deploy

## 📄 Licença

ISC
