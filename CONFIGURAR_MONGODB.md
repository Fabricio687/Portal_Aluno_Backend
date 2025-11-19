# Como Configurar o MongoDB Atlas

## Problema: Erro de Conexão

Se você está recebendo erros como:
- `connect ECONNREFUSED ::1:27017`
- `MongooseServerSelectionError`
- `ERR_CONNECTION_REFUSED`

Isso significa que o banco de dados não está configurado corretamente.

## Solução: Configurar MongoDB Atlas

### Passo 1: Criar Conta no MongoDB Atlas

1. Acesse: https://www.mongodb.com/cloud/atlas
2. Crie uma conta gratuita (se não tiver)
3. Crie um cluster gratuito (M0)

### Passo 2: Obter Credenciais

1. No MongoDB Atlas, vá em **Database Access**
2. Crie um usuário com senha (anote as credenciais)
3. Vá em **Network Access**
4. Adicione seu IP ou use `0.0.0.0/0` para permitir todos (apenas desenvolvimento)

### Passo 3: Obter a URI de Conexão

1. No MongoDB Atlas, vá em **Database**
2. Clique em **Connect** no seu cluster
3. Escolha **Connect your application**
4. Copie a URI de conexão (algo como):
   ```
   mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/nome-do-banco?retryWrites=true&w=majority
   ```

### Passo 4: Configurar o config.env

Abra o arquivo `back-do-cafe-main/config.env` e configure **UMA das opções**:

#### Opção 1: Usar URI Completa (Recomendado)

```env
# Comente ou remova as linhas DB_USER, DB_PASS, DB_NAME
# DB_USER=seu_usuario_mongodb
# DB_PASS=sua_senha_mongodb
# DB_NAME=portal-aluno

# Descomente e configure com sua URI real:
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster0.xxxxx.mongodb.net/portal-aluno?retryWrites=true&w=majority
```

#### Opção 2: Usar Variáveis Individuais

```env
# Configure com suas credenciais REAIS:
DB_USER=seu_usuario_real_aqui
DB_PASS=sua_senha_real_aqui
DB_NAME=portal-aluno

# IMPORTANTE: Se usar esta opção, verifique se o nome do cluster no script está correto
# O script usa: cluster0.7hrgleb.mongodb.net
# Se seu cluster tiver nome diferente, use a Opção 1 (MONGODB_URI)
```

### Passo 5: Testar a Conexão

```bash
cd back-do-cafe-main
npm run test:backend
```

Se aparecer "✅ Backend está rodando", está tudo certo!

### Passo 6: Executar o Seed

```bash
npm run seed:complete
```

## Exemplo de config.env Correto

```env
# Configurações do Servidor
PORT=3100
NODE_ENV=development

# MongoDB Atlas - Opção 1 (Recomendado)
MONGODB_URI=mongodb+srv://meuusuario:minhasenha@cluster0.abc123.mongodb.net/portal-aluno?retryWrites=true&w=majority

# OU MongoDB Atlas - Opção 2
# DB_USER=meuusuario
# DB_PASS=minhasenha
# DB_NAME=portal-aluno

# Configurações JWT
JWT_SECRET=senac-portal-aluno-secret-key-2024-mude-esta-chave-em-producao
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

## Erros Comuns

### "MONGODB_URI está configurado para MongoDB local!"
- **Solução**: Remova ou comente a linha `MONGODB_URI=mongodb://localhost:27017/...`
- Use a URI do MongoDB Atlas (mongodb+srv://...)

### "Variáveis contêm valores de exemplo!"
- **Solução**: Configure valores REAIS do MongoDB Atlas
- Não use "seu_usuario_mongodb" ou "sua_senha_mongodb"

### "Cluster name diferente"
- **Solução**: Use a Opção 1 (MONGODB_URI completa) ao invés de variáveis individuais

## Ainda com Problemas?

1. Verifique se o IP está na whitelist do MongoDB Atlas
2. Verifique se o usuário tem permissões no banco
3. Verifique se a senha está correta (sem espaços extras)
4. Teste a conexão diretamente no MongoDB Compass com a mesma URI

