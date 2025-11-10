# Guia de Deploy no Vercel - Backend

## Pré-requisitos

1. Conta no Vercel (https://vercel.com)
2. Conta no MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
3. Repositório Git (GitHub, GitLab ou Bitbucket)

## Passo a Passo

### 1. Preparar o Projeto

O projeto já está configurado para funcionar no Vercel. Certifique-se de que:
- O arquivo `api/index.js` existe (já criado)
- O arquivo `vercel.json` está correto (já configurado)

### 2. Fazer Deploy no Vercel

#### Opção A: Via CLI do Vercel

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

#### Opção B: Via Dashboard do Vercel

1. Acesse https://vercel.com
2. Clique em "New Project"
3. Conecte seu repositório Git
4. Configure o projeto:
   - **Framework Preset**: Other
   - **Root Directory**: `back-do-cafe-main` (ou o nome da pasta do backend)
   - **Build Command**: (deixe vazio ou `npm install`)
   - **Output Directory**: (deixe vazio)
   - **Install Command**: `npm install`

### 3. Configurar Variáveis de Ambiente

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

#### Variáveis Obrigatórias

```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco?retryWrites=true&w=majority
JWT_SECRET=sua-chave-secreta-super-forte-minimo-32-caracteres
```

#### Variáveis Opcionais (mas recomendadas)

```
NODE_ENV=production
CORS_ORIGIN=https://seu-frontend.vercel.app,https://seu-dominio.com
FRONTEND_URL=https://seu-frontend.vercel.app
PORT=3100
```

#### Variáveis de Email (opcional)

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-app-password
```

### 4. Configurar MongoDB Atlas

1. Acesse https://cloud.mongodb.com/
2. Vá em **Network Access**
3. Adicione o IP `0.0.0.0/0` para permitir todas as conexões (ou os IPs do Vercel)
4. Vá em **Database Access** e crie um usuário com senha
5. Copie a connection string e use como `MONGODB_URI`

### 5. Testar o Deploy

Após o deploy, teste a API:

```bash
# Health check
curl https://seu-backend.vercel.app/status

# Teste da API
curl https://seu-backend.vercel.app/api
```

### 6. Configurar CORS

No painel do Vercel, adicione a variável `CORS_ORIGIN` com a URL do seu frontend:

```
CORS_ORIGIN=https://seu-frontend.vercel.app
```

## Troubleshooting

### Erro de CORS
- Verifique se a variável `CORS_ORIGIN` está configurada corretamente
- Certifique-se de que a URL do frontend está na lista de origens permitidas

### Erro de Conexão com MongoDB
- Verifique se o `MONGODB_URI` está correto
- Verifique se o IP `0.0.0.0/0` está na lista de Network Access do MongoDB Atlas
- Verifique se o usuário e senha estão corretos

### Erro de JWT_SECRET
- Certifique-se de que o `JWT_SECRET` tem pelo menos 32 caracteres
- Use uma chave forte e única

### Timeout nas Requisições
- O Vercel tem um timeout de 10 segundos para funções serverless no plano gratuito
- Considere otimizar as consultas ao banco de dados
- Considere usar o plano Pro para timeouts maiores

## Estrutura de Arquivos

```
back-do-cafe-main/
├── api/
│   └── index.js          # Entry point para Vercel
├── controllers/
├── middleware/
├── models/
├── routes/
├── index.js              # App Express
├── vercel.json           # Configuração do Vercel
└── package.json
```

## URLs Importantes

Após o deploy, você receberá uma URL como:
- `https://seu-backend.vercel.app`

Use esta URL para configurar o frontend.

