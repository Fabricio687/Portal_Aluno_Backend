# 🌱 Como Executar o Seed Completo

## 🎯 Objetivo

Preencher **TODAS** as coleções do banco de dados com dados fictícios para aparecer no frontend:

- ✅ **users** - Usuários (admin, professores, alunos)
- ✅ **courses** - Cursos
- ✅ **lessons** - Aulas
- ✅ **exams** - Provas
- ✅ **grades** - Notas
- ✅ **attendances** - Presenças
- ✅ **messages** - Mensagens
- ✅ **documents** - Documentos
- ✅ **spots** - Vagas
- ✅ **bookings** - Reservas
- ✅ **calendarevents** - Eventos de Calendário
- ✅ **certificates** - Certificados
- ✅ **notifications** - Notificações

## 🚀 Executar o Seed

### Passo 1: Certifique-se que o MongoDB está configurado

Verifique se o `config.env` está configurado corretamente:

```bash
cd back-do-cafe-main
npm run validate:config
```

Deve aparecer: `✅ CONFIGURAÇÃO VÁLIDA!`

### Passo 2: Execute o Seed

```bash
npm run seed:full
```

## 📊 O que será criado

O script criará:

- **39 usuários**:
  - 1 admin: `admin@portal.edu.br` / `123456`
  - 8 professores
  - 30 alunos

- **10 cursos** completos

- **160 aulas** (16 por curso)

- **30 provas** (3 por curso)

- **~240 notas** (80% dos alunos têm nota em cada prova)

- **~1600 presenças** (todos os alunos em todas as aulas)

- **80 mensagens** (50 de alunos para professores, 30 de professores para alunos)

- **50 documentos** (de diferentes categorias)

- **30 vagas** (com tecnologias)

- **40 reservas** (de vagas)

- **~30 eventos** (de calendário - 10 baseados em cursos + 20 gerais)

- **20 certificados** (de diferentes tipos)

- **~90 notificações** (2-5 por aluno)

**Total: ~2.300+ registros** criados automaticamente!

## ⏱️ Tempo de Execução

O script leva aproximadamente **2-5 minutos** para executar, dependendo da velocidade da conexão com o MongoDB Atlas.

## ✅ Verificar se Funcionou

Após executar, você verá:

```
🎉 SEED COMPLETO CONCLUÍDO COM SUCESSO!
==================================================

📊 Resumo dos dados criados:
   👥 Usuários: 39 (1 admin, 8 professores, 30 alunos)
   📚 Cursos: 10
   📖 Aulas: 160
   📝 Provas: 30
   📊 Notas: ~240
   ✅ Presenças: ~1600
   💬 Mensagens: 80
   📄 Documentos: 50
   💼 Vagas: 30
   📅 Reservas: 40
   📆 Eventos: ~30
   🎓 Certificados: 20
   🔔 Notificações: ~90

🔑 Credenciais de acesso:
   Admin: admin@portal.edu.br / 123456
   Professores: [email do professor] / 123456
   Alunos: [email do aluno] / 123456
```

## 🧪 Testar no Frontend

1. Inicie o backend:
   ```bash
   npm run dev
   ```

2. Inicie o frontend (em outro terminal):
   ```bash
   cd fribt-main
   npm run dev
   ```

3. Acesse: `http://localhost:5173`

4. Faça login com: `admin@portal.edu.br` / `123456`

5. Navegue pelo sistema - **TODAS as coleções devem aparecer com dados!**

## 🔄 Recriar Dados

Se quiser recriar tudo do zero:

1. **Limpe o banco de dados** (opcional - o script adiciona novos dados mesmo se já existirem)
2. Execute novamente: `npm run seed:full`

## ❌ Problemas?

### Erro de conexão
- Verifique se o MongoDB Atlas está configurado corretamente
- Execute: `npm run validate:config`

### Erro de autenticação
- Verifique se a URI do MongoDB está correta no `config.env`
- Veja: `RESOLVER_ERRO_BAD_AUTH.md`

### Dados não aparecem no frontend
- Verifique se o backend está rodando
- Verifique se o frontend está conectado ao backend
- Veja: `VERIFICAR_TUDO_FUNCIONANDO.md`

## 📚 Mais Informações

- `ANALISE_COMPLETA_PROJETO.md` - Análise detalhada de todas as entidades
- `TUDO_PRONTO.md` - Guia completo do sistema
- `SOLUCAO_COMPLETA.md` - Solução de problemas

---

**🎉 Pronto! Todas as coleções serão preenchidas automaticamente!**

