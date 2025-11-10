# 🚀 Guia de Deploy no Vercel (Plano Gratuito)

## 📋 Pré-requisitos

1. Conta no Vercel (gratuita): https://vercel.com
2. Conta no MongoDB Atlas (gratuita): https://www.mongodb.com/cloud/atlas
3. Repositório Git (GitHub, GitLab ou Bitbucket)

---

## 🔧 Deploy do Backend

### Passo 1: Preparar o Repositório

1. Certifique-se de que todos os arquivos estão commitados:
```bash
git add .
git commit -m "Preparar para deploy no Vercel"
git push
```

### Passo 2: Deploy no Vercel

1. Acesse https://vercel.com e faça login
2. Clique em **"Add New"** > **"Project"**
3. Importe o repositório do backend
4. Configure as seguintes configurações:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (raiz do projeto)
   - **Build Command**: (deixe vazio)
   - **Output Directory**: (deixe vazio)
   - **Install Command**: `npm install`

### Passo 3: Configurar Variáveis de Ambiente

No painel do Vercel, vá em **Settings** > **Environment Variables** e adicione:

#### Opção A: Usando URI Completa do MongoDB (Recomendado)
```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco?retryWrites=true&w=majority
```

#### Opção B: Usando Variáveis Individuais
```
DB_USER=seu_usuario_mongodb
DB_PASS=sua_senha_mongodb
DB_NAME=portal-aluno
```

#### Variáveis Obrigatórias (Ambas as Opções)
```
JWT_SECRET=sua-chave-secreta-forte-minimo-32-caracteres-aleatorios
JWT_EXPIRES_IN=7d
NODE_ENV=production
CORS_ORIGIN=https://seu-frontend.vercel.app
```

⚠️ **IMPORTANTE**: 
- `JWT_SECRET` deve ter pelo menos 32 caracteres em produção
- `CORS_ORIGIN` deve conter a URL do seu frontend (ex: `https://portal-aluno-frontend.vercel.app`)
- Se tiver múltiplas origens, separe por vírgula: `https://app1.vercel.app,https://app2.vercel.app`

### Passo 4: Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar
3. Anote a URL do backend (ex: `https://portal-aluno-backend.vercel.app`)

---

## 🎨 Deploy do Frontend

### Passo 1: Preparar o Repositório

1. Certifique-se de que todos os arquivos estão commitados

### Passo 2: Deploy no Vercel

1. No painel do Vercel, clique em **"Add New"** > **"Project"**
2. Importe o repositório do frontend
3. Configure as seguintes configurações:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (raiz do projeto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Passo 3: Configurar Variáveis de Ambiente

No painel do Vercel, vá em **Settings** > **Environment Variables** e adicione:

```
VITE_API_URL=https://portal-aluno-backend.vercel.app/api
```

⚠️ **IMPORTANTE**: Substitua `portal-aluno-backend.vercel.app` pela URL real do seu backend.

### Passo 4: Atualizar vercel.json do Frontend

Edite o arquivo `vercel.json` do frontend e atualize a URL do backend:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://SUA-URL-BACKEND.vercel.app/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Passo 5: Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar
3. Anote a URL do frontend

### Passo 6: Atualizar CORS do Backend

Após obter a URL do frontend, volte ao projeto do backend no Vercel:

1. Vá em **Settings** > **Environment Variables**
2. Atualize `CORS_ORIGIN` com a URL do frontend:
```
CORS_ORIGIN=https://seu-frontend.vercel.app
```
3. Faça um novo deploy do backend

---

## ✅ Verificação Pós-Deploy

### Testar Backend

1. Acesse: `https://seu-backend.vercel.app/status`
2. Deve retornar: `{"status":"online","timestamp":"...","environment":"production"}`

### Testar Frontend

1. Acesse a URL do frontend
2. Tente fazer login
3. Verifique se as requisições estão funcionando

---

## 🔍 Solução de Problemas

### Erro: "CORS não configurado para produção"
- **Solução**: Adicione a variável `CORS_ORIGIN` com a URL do frontend

### Erro: "Token inválido ou expirado"
- **Solução**: Verifique se `JWT_SECRET` está configurado e tem pelo menos 32 caracteres

### Erro: "Erro ao conectar ao MongoDB"
- **Solução**: 
  - Verifique se as credenciais do MongoDB estão corretas
  - No MongoDB Atlas, vá em **Network Access** e adicione `0.0.0.0/0` para permitir todas as conexões (ou apenas IPs do Vercel)

### Erro: "Function timeout"
- **Solução**: O plano gratuito do Vercel tem limite de 10 segundos por função. Otimize consultas ao banco de dados.

### Frontend não consegue conectar ao backend
- **Solução**: 
  - Verifique se `VITE_API_URL` está configurado corretamente
  - Verifique se o `CORS_ORIGIN` do backend inclui a URL do frontend
  - Verifique os logs do Vercel para erros

---

## 📝 Notas Importantes

1. **Plano Gratuito do Vercel**:
   - Limite de 100GB de bandwidth por mês
   - Funções serverless com timeout de 10 segundos
   - Deploys ilimitados

2. **MongoDB Atlas (Plano Gratuito)**:
   - 512MB de armazenamento
   - Compartilhado (pode ter lentidão em horários de pico)

3. **Variáveis de Ambiente**:
   - São injetadas no build do frontend (VITE_*)
   - São acessíveis em runtime no backend

4. **Logs**:
   - Acesse os logs no painel do Vercel em cada projeto
   - Use `console.log()` para debug (aparece nos logs do Vercel)

---

## 🎉 Pronto!

Seu projeto está no ar! 🚀

Para atualizações futuras, basta fazer `git push` e o Vercel fará deploy automático.


