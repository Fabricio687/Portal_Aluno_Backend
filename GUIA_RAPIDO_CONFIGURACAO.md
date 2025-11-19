# 🚀 Guia Rápido de Configuração

## ⚠️ Erro 503 - Serviço Indisponível

Se você está vendo o erro **503 Service Unavailable**, significa que o backend não consegue conectar ao MongoDB.

## ✅ Solução Rápida (3 Passos)

### Passo 1: Configure o MongoDB Atlas

1. Acesse: https://www.mongodb.com/cloud/atlas
2. Crie uma conta gratuita (se não tiver)
3. Crie um cluster gratuito (M0)
4. Crie um usuário com senha
5. Adicione seu IP na whitelist (ou use `0.0.0.0/0` para desenvolvimento)

### Passo 2: Obtenha a URI de Conexão

1. No MongoDB Atlas, vá em **Database**
2. Clique em **Connect** no seu cluster
3. Escolha **Connect your application**
4. Copie a URI (algo como):
   ```
   mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/nome-do-banco?retryWrites=true&w=majority
   ```

### Passo 3: Configure o config.env

Abra o arquivo `back-do-cafe-main/config.env` e **substitua** a linha:

```env
# MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco?retryWrites=true&w=majority
```

Por (removendo o # e colocando sua URI real):

```env
MONGODB_URI=mongodb+srv://SEU_USUARIO:SUA_SENHA@cluster0.xxxxx.mongodb.net/portal-aluno?retryWrites=true&w=majority
```

**IMPORTANTE**: Substitua `SEU_USUARIO`, `SUA_SENHA` e `cluster0.xxxxx` pelos valores reais!

### Passo 4: Reinicie o Backend

1. Pare o backend (Ctrl+C)
2. Inicie novamente:
   ```bash
   cd back-do-cafe-main
   npm run dev
   ```

Você deve ver:
```
✅ Conectado ao MongoDB Atlas
🚀 Servidor Portal do Aluno rodando na porta... 3100
```

## 🧪 Testar

1. Abra no navegador: `http://localhost:3100/api`
   - Deve aparecer uma mensagem JSON

2. Tente fazer login no frontend
   - O erro 503 deve desaparecer

## 📋 Checklist

- [ ] MongoDB Atlas criado
- [ ] Usuário criado no MongoDB Atlas
- [ ] IP adicionado na whitelist
- [ ] URI de conexão copiada
- [ ] `config.env` configurado com MONGODB_URI real
- [ ] Backend reiniciado
- [ ] Backend mostra "✅ Conectado ao MongoDB Atlas"

## 🔧 Alternativa: Usar Variáveis Individuais

Se preferir usar variáveis individuais ao invés de URI completa:

```env
DB_USER=seu_usuario_real_aqui
DB_PASS=sua_senha_real_aqui
DB_NAME=portal-aluno
```

**IMPORTANTE**: Use valores REAIS, não "seu_usuario_mongodb"!

## ❌ Erros Comuns

### "Variáveis contêm valores de exemplo"
- **Solução**: Configure valores REAIS do MongoDB Atlas

### "Timeout ao conectar"
- **Solução**: Verifique sua conexão com internet e se o IP está na whitelist

### "Authentication failed"
- **Solução**: Verifique se usuário e senha estão corretos

### "Cannot resolve hostname"
- **Solução**: Verifique se a URI está correta (sem espaços extras)

## 📚 Mais Ajuda

- `CONFIGURAR_MONGODB.md` - Guia detalhado
- `TROUBLESHOOTING_LOGIN.md` - Mais soluções
- `INICIAR_BACKEND.md` - Como iniciar o backend

