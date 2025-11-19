# 📝 Configurar MongoDB Atlas - Passo a Passo Visual

## ⚠️ Erro Atual: "bad auth : Authentication failed"

Este erro significa que suas credenciais do MongoDB estão incorretas ou são valores de exemplo.

## ✅ Solução Completa

### PASSO 1: Criar Conta no MongoDB Atlas

1. Acesse: **https://www.mongodb.com/cloud/atlas**
2. Clique em **"Try Free"** ou **"Sign Up"**
3. Preencha o formulário e crie sua conta
4. Confirme seu email

### PASSO 2: Criar Cluster Gratuito

1. Após fazer login, você verá a tela de criação de cluster
2. Escolha a opção **FREE (M0)** - é gratuito para sempre
3. Escolha um **Cloud Provider** (AWS, Google Cloud ou Azure)
4. Escolha uma **Region** próxima (ex: São Paulo se disponível)
5. Deixe o nome padrão ou escolha um nome (ex: "Cluster0")
6. Clique em **"Create Cluster"**
7. Aguarde 2-3 minutos enquanto o cluster é criado

### PASSO 3: Criar Usuário do Banco de Dados

1. No menu lateral esquerdo, clique em **"Database Access"**
2. Clique no botão **"Add New Database User"**
3. Em **"Authentication Method"**, escolha **"Password"**
4. Em **"Username"**, digite um nome (ex: `portal-aluno-user`)
5. Em **"Password"**, clique em **"Autogenerate Secure Password"** OU digite uma senha forte
   - **IMPORTANTE**: Anote essa senha! Você vai precisar dela!
6. Em **"Database User Privileges"**, deixe **"Atlas admin"** (padrão)
7. Clique em **"Add User"**
8. **ANOTE**: Usuário e Senha criados!

### PASSO 4: Configurar Network Access (Whitelist)

1. No menu lateral esquerdo, clique em **"Network Access"**
2. Clique em **"Add IP Address"**
3. Clique no botão **"Allow Access from Anywhere"**
   - Isso adiciona `0.0.0.0/0` (permite de qualquer lugar)
   - Para desenvolvimento, isso é seguro
4. Clique em **"Confirm"**
5. Aguarde alguns segundos para a mudança ser aplicada

### PASSO 5: Obter URI de Conexão

1. No menu lateral esquerdo, clique em **"Database"**
2. Você verá seu cluster listado
3. Clique no botão **"Connect"** ao lado do cluster
4. Uma janela popup aparecerá
5. Escolha **"Connect your application"**
6. Em **"Driver"**, selecione **"Node.js"**
7. Em **"Version"**, deixe a versão mais recente
8. Você verá uma string como esta:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
9. **Copie essa string completa**

### PASSO 6: Montar a URI Completa

A URI que você copiou tem `<username>` e `<password>` que precisam ser substituídos.

**Exemplo da URI copiada:**
```
mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

**Substitua:**
- `<username>` pelo usuário que você criou (ex: `portal-aluno-user`)
- `<password>` pela senha que você criou (ex: `MinhaSenh@123`)
- Adicione o nome do banco antes do `?` (ex: `/portal-aluno`)

**URI final deve ficar assim:**
```
mongodb+srv://portal-aluno-user:MinhaSenh@123@cluster0.abc123.mongodb.net/portal-aluno?retryWrites=true&w=majority
```

**⚠️ ATENÇÃO**: Se sua senha tiver caracteres especiais como `@`, `#`, `!`, etc., você precisa codificá-los na URL:
- `@` vira `%40`
- `#` vira `%23`
- `!` vira `%21`
- etc.

Ou use uma senha sem caracteres especiais para facilitar.

### PASSO 7: Configurar o config.env

1. Abra o arquivo: `back-do-cafe-main/config.env`
2. Encontre a linha (deve estar comentada com #):
   ```env
   # MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco?retryWrites=true&w=majority
   ```
3. **Remova o #** e **substitua** pela sua URI real:
   ```env
   MONGODB_URI=mongodb+srv://portal-aluno-user:MinhaSenh@123@cluster0.abc123.mongodb.net/portal-aluno?retryWrites=true&w=majority
   ```
4. **Salve o arquivo**

### PASSO 8: Validar a Configuração

Execute o script de validação:

```bash
cd back-do-cafe-main
npm run validate:config
```

Se aparecer "✅ CONFIGURAÇÃO VÁLIDA!", está tudo certo!

### PASSO 9: Reiniciar o Backend

1. Pare o backend (Ctrl+C)
2. Inicie novamente:
   ```bash
   npm run dev
   ```

3. Você deve ver:
   ```
   ✅ Conectado ao MongoDB Atlas
   🚀 Servidor Portal do Aluno rodando na porta... 3100
   ```

### PASSO 10: Testar

1. Abra: `http://localhost:3100/api`
   - Deve aparecer uma mensagem JSON

2. Tente fazer login no frontend
   - O erro 503 deve desaparecer!

## 🔍 Verificar se Está Funcionando

### No Terminal do Backend:
```
✅ Conectado ao MongoDB Atlas
🚀 Servidor Portal do Aluno rodando na porta... 3100
```

### No Navegador (http://localhost:3100/api):
```json
{
  "message": "Portal do Aluno API - Funcionando!",
  "version": "1.0.0"
}
```

## ❌ Erros Comuns

### "bad auth : Authentication failed"
- **Causa**: Usuário ou senha incorretos
- **Solução**: Verifique se copiou corretamente a senha (sem espaços extras)

### "Timeout"
- **Causa**: IP não está na whitelist
- **Solução**: Adicione `0.0.0.0/0` na Network Access

### "Cannot resolve hostname"
- **Causa**: URI malformada
- **Solução**: Verifique se não há espaços ou caracteres extras

### Senha com caracteres especiais
Se sua senha tem `@`, `#`, etc., você tem 2 opções:

**Opção 1**: Criar nova senha sem caracteres especiais
**Opção 2**: Codificar os caracteres na URL:
- `@` → `%40`
- `#` → `%23`
- `!` → `%21`
- `$` → `%24`
- `&` → `%26`

## 🎉 Pronto!

Após seguir todos os passos, seu sistema deve estar funcionando!

Para popular o banco com dados de teste:
```bash
npm run seed:full
```

