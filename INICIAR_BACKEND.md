# Como Iniciar o Backend

## Erro: ERR_CONNECTION_REFUSED

Se você está vendo este erro no console do navegador:
```
ERR_CONNECTION_REFUSED
Failed to load resource: net::ERR_CONNECTION_REFUSED
:3100/api/auth/login
```

Isso significa que o **backend não está rodando**.

## Solução: Iniciar o Backend

### Passo 1: Abrir um Terminal

Abra um **novo terminal** (mantenha o frontend rodando em outro terminal).

### Passo 2: Navegar até a Pasta do Backend

```bash
cd back-do-cafe-main
```

### Passo 3: Verificar se as Dependências Estão Instaladas

```bash
npm install
```

(Só precisa fazer isso uma vez, ou quando instalar novas dependências)

### Passo 4: Verificar o Arquivo config.env

Certifique-se de que o arquivo `config.env` está configurado corretamente:

```env
PORT=3100
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco
# OU
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=portal-aluno

JWT_SECRET=senac-portal-aluno-secret-key-2024-mude-esta-chave-em-producao
```

### Passo 5: Iniciar o Backend

**Opção 1: Modo Desenvolvimento (com auto-reload)**
```bash
npm run dev
```

**Opção 2: Modo Produção**
```bash
npm start
```

### Passo 6: Verificar se Está Funcionando

Você deve ver mensagens como:

```
✅ Conectado ao MongoDB Atlas
🚀 Servidor Portal do Aluno rodando na porta... 3100
📚 API disponível em: http://localhost:3100/api
```

### Passo 7: Testar no Navegador

Abra no navegador:
```
http://localhost:3100/api
```

Deve aparecer uma mensagem JSON confirmando que a API está funcionando.

## ⚠️ IMPORTANTE

- O backend precisa estar **rodando o tempo todo** enquanto você usa o frontend
- Deixe o terminal do backend **aberto e rodando**
- Se fechar o terminal, o backend para e você precisa iniciar novamente

## Estrutura de Terminais

Você precisa ter **2 terminais abertos**:

**Terminal 1 - Backend:**
```bash
cd back-do-cafe-main
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd fribt-main
npm run dev
```

## Erros Comuns

### "Port 3100 is already in use"
- Alguém já está usando a porta 3100
- Feche outros processos ou mude a porta no `config.env`

### "MongoDB connection error"
- Verifique se o `MONGODB_URI` está correto no `config.env`
- Verifique se o IP está na whitelist do MongoDB Atlas
- Veja o arquivo `CONFIGURAR_MONGODB.md`

### "JWT_SECRET não configurado"
- Adicione `JWT_SECRET` no arquivo `config.env`
- Reinicie o backend

## Testar Conexão

Para testar se o backend está respondendo:

```bash
npm run test:backend
```

Se aparecer "✅ Backend está rodando", está tudo certo!

