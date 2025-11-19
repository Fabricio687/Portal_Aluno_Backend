# Script de Seed Completo - seedFull.js

## 📋 Descrição

Este script popula **automaticamente** todo o banco de dados do Portal do Aluno com dados fictícios coerentes, respeitando todas as relações e regras do sistema.

## 🎯 Entidades Populadas

O script cria dados para **todas** as entidades do sistema:

1. **Users** (Usuários)
   - 1 Administrador
   - 8 Professores
   - 30 Alunos

2. **Courses** (Cursos)
   - 10 cursos completos com todas as informações

3. **Lessons** (Aulas)
   - 16 aulas por curso (total: 160 aulas)
   - Datas baseadas nos horários dos cursos

4. **Exams** (Provas)
   - 3 provas por curso (P1, P2, Prova Final)
   - Total: 30 provas

5. **Grades** (Notas)
   - Notas para 80% dos alunos em cada prova
   - Notas entre 5.0 e 10.0

6. **Attendance** (Presenças)
   - Registros de presença para aulas
   - Status: presente (70%), falta (20%), atraso (8%), justificado (2%)

7. **Messages** (Mensagens)
   - 20 mensagens de alunos para professores
   - 10 mensagens de professores para alunos

8. **Documents** (Documentos)
   - 25 documentos de diferentes categorias
   - Associados a alunos e cursos

9. **Spots** (Vagas)
   - 15 vagas de emprego/estágio
   - Com tecnologias e empresas fictícias

10. **Bookings** (Reservas)
    - 20 reservas de vagas
    - Algumas aprovadas, outras pendentes

11. **Calendar Events** (Eventos de Calendário)
    - Eventos baseados em cursos
    - Eventos gerais do sistema

12. **Certificates** (Certificados)
    - 20 certificados de diferentes tipos
    - Com diferentes status

13. **Notifications** (Notificações)
    - 40 notificações para alunos
    - Diferentes tipos e prioridades

## 🚀 Como Usar

### Executar o Script

```bash
cd back-do-cafe-main
npm run seed:full
```

### Requisitos

1. **MongoDB Atlas configurado** no arquivo `config.env`
2. **Banco de dados vazio** (ou o script avisará se já houver dados)

## 📊 Dados Criados

### Usuários

- **Admin**: `admin@portal.edu.br` / `123456`
- **Professores**: Email gerado automaticamente / `123456`
- **Alunos**: Email gerado automaticamente / `123456`

### Cursos

10 cursos pré-definidos:
- Introdução à Programação
- Algoritmos e Estruturas de Dados
- Banco de Dados
- Desenvolvimento Web
- Programação Orientada a Objetos
- Engenharia de Software
- Redes de Computadores
- Sistemas Operacionais
- Inteligência Artificial
- Segurança da Informação

Cada curso tem:
- Professor atribuído
- Horário e sala
- Entre 8 e 20 alunos associados

## 🔗 Relações Respeitadas

O script garante que todas as relações sejam válidas:

- ✅ Alunos associados aos cursos corretos
- ✅ Aulas vinculadas aos cursos
- ✅ Provas vinculadas aos cursos
- ✅ Notas vinculadas a alunos e provas
- ✅ Presenças vinculadas a alunos, cursos e aulas
- ✅ Mensagens entre usuários válidos
- ✅ Documentos vinculados a alunos e cursos
- ✅ Reservas vinculadas a vagas e alunos
- ✅ Eventos vinculados a cursos e criadores
- ✅ Certificados vinculados a alunos e cursos
- ✅ Notificações vinculadas a alunos

## ⚙️ Características

- **Dados Realistas**: Nomes, emails e informações coerentes
- **Distribuição Aleatória**: Alunos distribuídos aleatoriamente nos cursos
- **Datas Coerentes**: Aulas e provas em sequência lógica
- **Notas Realistas**: Distribuição de notas entre 5.0 e 10.0
- **Presenças Realistas**: 70% de presença, 20% falta, etc.
- **Não Sobrecarrega**: Limita registros para não sobrecarregar o banco

## 🔄 Reexecutar

Se você quiser recriar todos os dados:

1. **Limpar o banco** (opcional, mas recomendado)
2. Executar novamente: `npm run seed:full`

O script avisará se já existem dados no banco.

## 📝 Notas

- O script **não apaga** dados existentes automaticamente
- Se já houver dados, o script avisará mas continuará
- Para limpar completamente, você precisa fazer manualmente no MongoDB
- Todas as senhas são `123456` para facilitar testes
- Emails são gerados automaticamente baseados nos nomes

## 🐛 Solução de Problemas

### Erro de Conexão
- Verifique se o `config.env` está configurado corretamente
- Veja `CONFIGURAR_MONGODB.md` para ajuda

### Erro de Validação
- O script respeita todas as validações dos models
- Verifique os logs para identificar o problema específico

### Dados Duplicados
- O script não verifica duplicatas (exceto campos únicos)
- Para evitar, limpe o banco antes de executar

## 📈 Estatísticas Esperadas

Após executar o script, você terá aproximadamente:

- 39 usuários
- 10 cursos
- 160 aulas
- 30 provas
- ~240 notas
- ~200 presenças
- 30 mensagens
- 25 documentos
- 15 vagas
- 20 reservas
- ~20 eventos
- 20 certificados
- 40 notificações

**Total: ~800+ registros** criados automaticamente!

