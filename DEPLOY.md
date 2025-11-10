# Guia de Implantação do Portal do Aluno

## Implantação do Backend

1. Faça login na sua conta Vercel (https://vercel.com)
2. Clique em "Add New" > "Project"
3. Importe o repositório do backend
4. Configure as variáveis de ambiente:
   - `DB_USER`: Usuário do MongoDB
   - `DB_PASS`: Senha do MongoDB
   - `DB_NAME`: Nome do banco de dados
   - `CORS_ORIGIN`: URLs permitidas (incluir a URL do frontend)
   - `JWT_SECRET`: Chave secreta para autenticação
5. Clique em "Deploy"

## Implantação do Frontend

1. Faça login na sua conta Vercel
2. Clique em "Add New" > "Project"
3. Importe o repositório do frontend
4. Configure as variáveis de ambiente:
   - `VITE_API_URL`: URL completa da API backend (ex: https://portal-aluno-backend.vercel.app/api)
5. Clique em "Deploy"

## Verificação pós-implantação

1. Teste o login no frontend
2. Verifique se todas as funcionalidades estão operando corretamente
3. Verifique se a comunicação entre frontend e backend está funcionando

## Solução de problemas comuns

- **Erro CORS**: Verifique se a URL do frontend está incluída na variável `CORS_ORIGIN` do backend
- **Erro de autenticação**: Verifique se o token JWT está sendo gerado e armazenado corretamente
- **Erro de conexão com o banco de dados**: Verifique as credenciais do MongoDB e se o IP está liberado no Atlas