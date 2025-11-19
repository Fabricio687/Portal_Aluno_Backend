# Scripts de Seed - Banco de Dados

Este diretório contém scripts para popular o banco de dados com dados de exemplo.

## Scripts Disponíveis

### 1. seedComplete.js (Recomendado)
Script completo que popula o banco de dados com:
- ✅ Cursos
- ✅ Aulas (Lessons)
- ✅ Provas (Exams)
- ✅ Mensagens (Messages)
- ✅ Notas (Grades)
- ✅ Registros de Presença (Attendance)
- ✅ Usuários (se não existirem)

**Como usar:**
```bash
npm run seed:complete
```

### 2. seedCourses.js
Script que popula apenas cursos, aulas e provas.

**Como usar:**
```bash
npm run seed:courses
```

### 3. seed.js
Script básico para criar usuários de exemplo.

**Como usar:**
```bash
npm run seed
```

## Configuração

Certifique-se de que o arquivo `config.env` está configurado com as seguintes variáveis:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco
# OU
DB_USER=usuario
DB_PASS=senha
DB_NAME=nome-do-banco
```

## Observações

- Os scripts **não apagam** dados existentes por padrão
- Se um curso já existir, o script apenas adiciona aulas/provas se não existirem
- O script `seedComplete.js` cria usuários de exemplo apenas se não existirem alunos/professores
- Os dados são gerados de forma aleatória mas realista

## Estrutura de Dados Criados

### Cursos
- 5 cursos de exemplo (Introdução à Programação, Algoritmos, Banco de Dados, etc.)
- Cada curso tem professor, horário, sala e descrição

### Aulas
- 16 aulas por curso (simulando um semestre)
- Datas baseadas no horário do curso

### Provas
- 3 provas por curso (P1, P2 e Prova Final)
- Datas distribuídas ao longo do semestre

### Mensagens
- Mensagens entre alunos e professores
- Assuntos variados (dúvidas, avisos, etc.)

### Notas
- Notas para 70% dos alunos em cada prova
- Notas aleatórias entre 5 e 10

### Presenças
- Registros de presença para cada aula
- Status: 70% presente, 20% falta, 8% atraso, 2% justificado
- Limitado a 500 registros para não sobrecarregar

## Solução de Problemas

### Erro de Conexão
- Verifique se as credenciais do MongoDB estão corretas
- Verifique se o IP está na whitelist do MongoDB Atlas
- Verifique se a variável `MONGODB_URI` ou `DB_USER/DB_PASS/DB_NAME` estão configuradas

### Erro de Permissão
- Certifique-se de que o usuário do MongoDB tem permissões de escrita

### Dados Duplicados
- Os scripts verificam se os dados já existem antes de criar
- Para limpar dados, você pode usar o MongoDB Compass ou fazer manualmente

