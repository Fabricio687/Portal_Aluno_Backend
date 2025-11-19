# 📊 Análise Completa do Projeto - Portal do Aluno

## 🔍 Entidades Identificadas

Após análise completa do projeto, foram identificadas **13 entidades** principais:

### 1. **User** (Usuários)
- **Campos**: name, email, password, registration, course, semester, avatar, status, role
- **Tipos**: student, teacher, admin
- **Relações**: 
  - Referenciado por: Course.students, Grade.student, Attendance.student, Message.sender/receiver, Document.user, Spots.user, Booking.user, CalendarEvent.createdBy, Certificate.student/issuedBy, Notification.student

### 2. **Course** (Cursos)
- **Campos**: name, code, credits, professor, schedule, room, status, description, semester, students[]
- **Relações**:
  - Referencia: User (students[])
  - Referenciado por: Lesson.course, Exam.course, Grade.course, Attendance.course, Document.course, CalendarEvent.course, Certificate.course

### 3. **Lesson** (Aulas)
- **Campos**: course, title, description, date, resources[]
- **Relações**:
  - Referencia: Course (course)

### 4. **Exam** (Provas)
- **Campos**: course, title, description, date, maxGrade, weight
- **Relações**:
  - Referencia: Course (course)

### 5. **Grade** (Notas)
- **Campos**: student, course, courseName, grade, maxGrade, type, date, weight, description
- **Relações**:
  - Referencia: User (student), Course (course)

### 6. **Attendance** (Presenças)
- **Campos**: student, course, courseName, date, status, justification, professor
- **Relações**:
  - Referencia: User (student), Course (course)

### 7. **Message** (Mensagens)
- **Campos**: sender, receiver, subject, content, read, attachments[]
- **Relações**:
  - Referencia: User (sender, receiver)

### 8. **Document** (Documentos)
- **Campos**: title, description, fileUrl, fileName, fileType, fileSize, category, user, isPublic, course
- **Relações**:
  - Referencia: User (user), Course (course - opcional)

### 9. **Spots** (Vagas)
- **Campos**: thumbnail, company, price, techs[], user
- **Relações**:
  - Referencia: User (user)
  - Referenciado por: Booking.spot

### 10. **Booking** (Reservas)
- **Campos**: date, approved, user, spot
- **Relações**:
  - Referencia: User (user), Spots (spot)

### 11. **CalendarEvent** (Eventos de Calendário)
- **Campos**: title, description, startDate, endDate, allDay, type, color, course, visibleTo[], createdBy
- **Relações**:
  - Referencia: Course (course - opcional), User (createdBy)

### 12. **Certificate** (Certificados)
- **Campos**: student, title, description, type, issueDate, expiryDate, documentUrl, documentCode, status, course, issuedBy
- **Relações**:
  - Referencia: User (student, issuedBy), Course (course - opcional)

### 13. **Notification** (Notificações)
- **Campos**: student, title, message, type, read, actionUrl, priority, expiresAt
- **Relações**:
  - Referencia: User (student)

## 📋 Mapa de Relações

```
User
├── Course.students[] (muitos alunos por curso)
├── Grade.student (uma nota por aluno)
├── Attendance.student (muitas presenças por aluno)
├── Message.sender/receiver (mensagens entre usuários)
├── Document.user (documentos do usuário)
├── Spots.user (vagas criadas pelo usuário)
├── Booking.user (reservas do usuário)
├── CalendarEvent.createdBy (eventos criados)
├── Certificate.student/issuedBy (certificados)
└── Notification.student (notificações do aluno)

Course
├── Lesson.course (muitas aulas por curso)
├── Exam.course (muitas provas por curso)
├── Grade.course (notas do curso)
├── Attendance.course (presenças do curso)
├── Document.course (documentos do curso)
├── CalendarEvent.course (eventos do curso)
└── Certificate.course (certificados do curso)

Spots
└── Booking.spot (muitas reservas por vaga)
```

## ✅ Script de Seed Completo

O script `seedFull.js` já existe e cobre **TODAS** as 13 entidades:

1. ✅ **createUsers()** - Cria 1 admin, 8 professores, 30 alunos
2. ✅ **createCourses()** - Cria 10 cursos com professores atribuídos
3. ✅ **assignStudentsToCourses()** - Associa 8-20 alunos por curso
4. ✅ **createLessons()** - Cria 16 aulas por curso (160 total)
5. ✅ **createExams()** - Cria 3 provas por curso (30 total)
6. ✅ **createGrades()** - Cria notas para 80% dos alunos em cada prova
7. ✅ **createAttendance()** - Cria registros de presença para aulas
8. ✅ **createMessages()** - Cria 30 mensagens entre usuários
9. ✅ **createDocuments()** - Cria 25 documentos
10. ✅ **createSpots()** - Cria 15 vagas
11. ✅ **createBookings()** - Cria 20 reservas
12. ✅ **createCalendarEvents()** - Cria eventos de calendário
13. ✅ **createCertificates()** - Cria 20 certificados
14. ✅ **createNotifications()** - Cria 40 notificações

## 🎯 Características do Script

- ✅ **Respeita todas as relações** - Todas as chaves estrangeiras são válidas
- ✅ **Dados realistas** - Nomes, emails, datas coerentes
- ✅ **Validações respeitadas** - Todos os campos obrigatórios preenchidos
- ✅ **Distribuição inteligente** - Alunos distribuídos nos cursos, notas realistas
- ✅ **Não quebra nada** - Usa os models existentes sem modificá-los
- ✅ **Fácil de executar** - `npm run seed:full`

## 📊 Dados Criados

Após executar `npm run seed:full`:

- **39 usuários** (1 admin, 8 professores, 30 alunos)
- **10 cursos** completos
- **160 aulas** (16 por curso)
- **30 provas** (3 por curso)
- **~240 notas** (80% dos alunos têm nota)
- **~200 presenças** (distribuídas nas aulas)
- **30 mensagens** (entre alunos e professores)
- **25 documentos** (de diferentes categorias)
- **15 vagas** (com tecnologias)
- **20 reservas** (de vagas)
- **~20 eventos** (de calendário)
- **20 certificados** (de diferentes tipos)
- **40 notificações** (para alunos)

**Total: ~800+ registros** criados automaticamente!

## 🔗 Ordem de Criação (Respeitando Dependências)

1. **Users** (primeiro - base para tudo)
2. **Courses** (usa professores)
3. **assignStudentsToCourses** (relaciona alunos e cursos)
4. **Lessons** (usa cursos)
5. **Exams** (usa cursos)
6. **Grades** (usa alunos, cursos e provas)
7. **Attendance** (usa alunos, cursos e aulas)
8. **Messages** (usa usuários)
9. **Documents** (usa alunos e cursos)
10. **Spots** (usa alunos)
11. **Bookings** (usa alunos e spots)
12. **CalendarEvents** (usa cursos e usuários)
13. **Certificates** (usa alunos, cursos e usuários)
14. **Notifications** (usa alunos)

## ✅ Validações Respeitadas

- ✅ Campos obrigatórios preenchidos
- ✅ Enums respeitados (role, status, type, etc.)
- ✅ Valores dentro dos limites (semestre 1-10, notas 0-100, etc.)
- ✅ Referências válidas (ObjectIds existentes)
- ✅ Unicidade respeitada (emails, matrículas, códigos de certificado)

## 🚀 Como Usar

```bash
cd back-do-cafe-main
npm run seed:full
```

O script:
1. Valida a configuração do MongoDB
2. Conecta ao banco
3. Cria todos os dados na ordem correta
4. Mostra um resumo completo
5. Fornece credenciais de acesso

## 📝 Credenciais Criadas

- **Admin**: `admin@portal.edu.br` / `123456`
- **Professores**: Email gerado automaticamente / `123456`
- **Alunos**: Email gerado automaticamente / `123456`

## ✨ Conclusão

O script `seedFull.js` está **100% completo** e cobre todas as entidades, relações e validações do sistema. Pode ser usado com segurança para popular o banco de dados!

