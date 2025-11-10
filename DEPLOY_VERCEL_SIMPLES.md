# 🚀 Deploy no Vercel - Guia Rápido

## 📋 Pré-requisitos

1. Conta no Vercel: https://vercel.com (gratuita)
2. Conta no MongoDB Atlas: https://www.mongodb.com/cloud/atlas (gratuita)
3. Repositório Git (GitHub, GitLab ou Bitbucket)

---

## 🔧 Passo 1: Deploy do Backend

### 1.1. Preparar o Repositório

```bash
cd Projeto-PortalAluno-Backend
git add .
git commit -m "Preparar para deploy no Vercel"
git push
```

### 1.2. Deploy no Vercel

1. Acesse https://vercel.com e faça login
2. Clique em **"Add New"** > **"Project"**
3. Conecte seu repositório Git
4. Selecione o repositório do **backend**
5. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (raiz)
   - **Build Command**: (deixe vazio)
   - **Output Directory**: (deixe vazio)
   - **Install Command**: `npm install`

### 1.3. Variáveis de Ambiente do Backend

No painel do Vercel, vá em **Settings** > **Environment Variables** e adicione:

```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/portal-aluno?retryWrites=true&w=majority
JWT_SECRET=sua-chave-secreta-forte-minimo-32-caracteres-aleatorios
JWT_EXPIRES_IN=7d
NODE_ENV=production
CORS_ORIGIN=https://seu-frontend.vercel.app
```

⚠️ **IMPORTANTE**:
- `JWT_SECRET`: Mínimo 32 caracteres (gere uma chave aleatória forte)
- `MONGODB_URI`: Obtenha no MongoDB Atlas (Database > Connect > Connect your application)
- `CORS_ORIGIN`: Você vai atualizar isso depois com a URL do frontend

### 1.4. Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar
3. **Anote a URL do backend** (ex: `https://portal-aluno-backend.vercel.app`)

---

## 🎨 Passo 2: Deploy do Frontend

### 2.1. Preparar o Repositório

```bash
cd portal-aluno-frontend
git add .
git commit -m "Preparar para deploy no Vercel"
git push
```

### 2.2. Deploy no Vercel

1. No painel do Vercel, clique em **"Add New"** > **"Project"**
2. Conecte o repositório do **frontend**
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (raiz)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2.3. Variáveis de Ambiente do Frontend

No painel do Vercel, vá em **Settings** > **Environment Variables** e adicione:

```
VITE_API_URL=https://portal-aluno-backend.vercel.app/api
```

⚠️ **Substitua** `portal-aluno-backend.vercel.app` pela URL real do seu backend.

### 2.4. Atualizar vercel.json do Frontend

O arquivo `vercel.json` já está configurado, mas verifique se a URL do backend está correta:

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

### 2.5. Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar
3. **Anote a URL do frontend** (ex: `https://portal-aluno-frontend.vercel.app`)

---

## ✅ Passo 3: Atualizar CORS do Backend

Após obter a URL do frontend:

1. Volte ao projeto do **backend** no Vercel
2. Vá em **Settings** > **Environment Variables**
3. Atualize `CORS_ORIGIN` com a URL do frontend:
   ```
   CORS_ORIGIN=https://portal-aluno-frontend.vercel.app
   ```
4. Vá em **Deployments** e faça um novo deploy (ou aguarde o redeploy automático)

---

## 🧪 Passo 4: Testar

### Testar Backend

Acesse: `https://seu-backend.vercel.app/status`

Deve retornar:
```json
{
  "status": "online",
  "database": "connected",
  "timestamp": "...",
  "environment": "production"
}
```

### Testar Frontend

1. Acesse a URL do frontend
2. Tente fazer login
3. Verifique se tudo está funcionando

---

## 🔍 Solução de Problemas

### ❌ Erro: "CORS não configurado"
- **Solução**: Adicione `CORS_ORIGIN` com a URL do frontend no backend

### ❌ Erro: "Token inválido"
- **Solução**: Verifique se `JWT_SECRET` tem pelo menos 32 caracteres

### ❌ Erro: "Erro ao conectar ao MongoDB"
- **Solução**: 
  - Verifique se `MONGODB_URI` está correto
  - No MongoDB Atlas, vá em **Network Access** e adicione `0.0.0.0/0` (ou apenas IPs do Vercel)

### ❌ Frontend não conecta ao backend
- **Solução**: 
  - Verifique se `VITE_API_URL` está correto no frontend
  - Verifique se `CORS_ORIGIN` inclui a URL do frontend no backend
  - Veja os logs no Vercel para mais detalhes

---

## 📝 Notas

- **Deploys automáticos**: Após configurar, cada `git push` faz deploy automático
- **Logs**: Acesse os logs no painel do Vercel em cada projeto
- **Variáveis de ambiente**: Podem ser diferentes para Production, Preview e Development

---

## 🎉 Pronto!

Seu Portal do Aluno está no ar! 🚀

Para atualizações futuras, basta fazer `git push` e o Vercel fará deploy automático.

