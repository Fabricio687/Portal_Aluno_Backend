# Corrigir Porta do Backend

## Problema

O backend está rodando na porta **3001**, mas deveria estar na porta **3100** (conforme config.env).

## Solução Rápida

### Opção 1: Reiniciar o Backend (Recomendado)

1. **Pare o backend** (Ctrl+C no terminal)
2. **Reinicie o backend**:
   ```bash
   npm run dev
   ```
3. **Verifique a mensagem**:
   ```
   🚀 Servidor Portal do Aluno rodando na porta... 3100
   ```

Se ainda aparecer porta 3001, continue com a Opção 2.

### Opção 2: Verificar Variáveis de Ambiente

O problema pode ser que há uma variável de ambiente `PORT=3001` definida no sistema.

**Windows PowerShell:**
```powershell
# Verificar se há PORT definida
$env:PORT

# Se aparecer 3001, remova temporariamente:
$env:PORT = $null

# Ou defina explicitamente:
$env:PORT = "3100"
```

**Windows CMD:**
```cmd
REM Verificar
echo %PORT%

REM Remover
set PORT=

REM Ou definir
set PORT=3100
```

### Opção 3: Verificar Outros Arquivos .env

Pode haver um arquivo `.env` na raiz que está sobrescrevendo o `config.env`:

1. Verifique se existe `back-do-cafe-main/.env`
2. Se existir, verifique se tem `PORT=3001`
3. Remova ou corrija para `PORT=3100`

### Opção 4: Usar Porta 3001 (Temporário)

Se não conseguir mudar para 3100, você pode atualizar o frontend temporariamente:

1. Edite `fribt-main/vite.config.cjs`
2. Mude `target: 'http://localhost:3100'` para `target: 'http://localhost:3001'`
3. Reinicie o frontend

## Verificação

Após reiniciar o backend, você deve ver:

```
📄 Carregando config.env de: C:\Users\silvi\Downloads\back-do-cafe-main\back-do-cafe-main\config.env
🚀 Servidor Portal do Aluno rodando na porta... 3100
📚 API disponível em: http://localhost:3100/api
```

## Por que isso acontece?

O Node.js usa a seguinte ordem de prioridade para variáveis de ambiente:

1. Variáveis de ambiente do sistema (maior prioridade)
2. Arquivo `.env` na raiz
3. Arquivo `config.env` (se especificado)
4. Valor padrão no código

Se você tiver `PORT=3001` definido no sistema ou em um `.env`, ele sobrescreve o `config.env`.

