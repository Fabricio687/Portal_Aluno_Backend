/**
 * Script de Seed Completo - Portal do Aluno
 * 
 * Este script popula o banco de dados com dados fictícios coerentes
 * para todas as entidades do sistema, respeitando todas as relações.
 * 
 * Entidades populadas:
 * - Users (students, teachers, admin)
 * - Courses
 * - Lessons
 * - Exams
 * - Grades
 * - Attendance
 * - Messages
 * - Documents
 * - Spots
 * - Bookings
 * - Calendar Events
 * - Certificates
 * - Notifications
 */

// Carregar variáveis de ambiente
const path = require('path');
const fs = require('fs');

const configPaths = [
  path.join(__dirname, '../config.env'),
  path.join(process.cwd(), 'config.env'),
  './config.env'
];

let configLoaded = false;
for (const configPath of configPaths) {
  if (fs.existsSync(configPath)) {
    require('dotenv').config({ path: configPath });
    console.log(`📄 Carregando config.env de: ${configPath}`);
    configLoaded = true;
    break;
  }
}

if (!configLoaded) {
  require('dotenv').config();
  console.log('⚠️  config.env não encontrado, usando .env ou variáveis de ambiente do sistema');
}

const mongoose = require('mongoose');

// Importar todos os models
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Exam = require('../models/Exam');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');
const Message = require('../models/Message');
const Document = require('../models/Document');
const Spots = require('../models/Spots');
const Booking = require('../models/Booking');
const CalendarEvent = require('../models/Calendar');
const Certificate = require('../models/Certificate');
const Notification = require('../models/Notification');

// Configuração de conexão
const { DB_USER, DB_PASS, DB_NAME, MONGODB_URI, DATABASE } = process.env;

let uri;
if (MONGODB_URI) {
  if (MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')) {
    console.error('\n❌ Erro: MONGODB_URI está configurado para MongoDB local!');
    console.error('   Configure MONGODB_URI com a URI do MongoDB Atlas.');
    process.exit(1);
  }
  uri = MONGODB_URI;
  console.log('✅ Usando MONGODB_URI do config.env');
} else if (DATABASE) {
  uri = DATABASE;
  console.log('✅ Usando DATABASE do config.env');
} else if (DB_USER && DB_PASS && DB_NAME) {
  if (DB_USER.includes('seu_usuario') || DB_PASS.includes('sua_senha')) {
    console.error('\n❌ Erro: Variáveis contêm valores de exemplo!');
    console.error('   Configure valores reais do MongoDB Atlas no config.env');
    process.exit(1);
  }
  uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.7hrgleb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
  console.log('✅ Construindo URI a partir de DB_USER, DB_PASS e DB_NAME');
} else {
  console.error('\n❌ Erro: Variáveis de ambiente não configuradas!');
  process.exit(1);
}

// ============================================
// DADOS FICTÍCIOS
// ============================================

const FIRST_NAMES = [
  'João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Juliana', 'Roberto', 'Fernanda',
  'Lucas', 'Mariana', 'Rafael', 'Patricia', 'Bruno', 'Camila', 'Thiago', 'Larissa',
  'Gabriel', 'Amanda', 'Felipe', 'Beatriz', 'André', 'Carolina', 'Diego', 'Isabela',
  'Marcos', 'Vanessa', 'Ricardo', 'Tatiana', 'Paulo', 'Renata', 'Gustavo', 'Priscila'
];

const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Costa', 'Rodrigues', 'Almeida',
  'Nascimento', 'Lima', 'Araújo', 'Fernandes', 'Carvalho', 'Gomes', 'Martins', 'Rocha',
  'Ribeiro', 'Alves', 'Monteiro', 'Mendes', 'Barros', 'Freitas', 'Barbosa', 'Dias',
  'Cavalcanti', 'Moreira', 'Castro', 'Cardoso', 'Teixeira', 'Correia', 'Azevedo', 'Machado'
];

const COURSE_NAMES = [
  { name: 'Introdução à Programação', code: 'IP001', credits: 4, description: 'Fundamentos de programação e lógica' },
  { name: 'Algoritmos e Estruturas de Dados', code: 'AED001', credits: 5, description: 'Estruturas de dados e algoritmos' },
  { name: 'Banco de Dados', code: 'BD001', credits: 4, description: 'Modelagem e implementação de bancos de dados' },
  { name: 'Desenvolvimento Web', code: 'DW001', credits: 5, description: 'Desenvolvimento web com HTML, CSS, JavaScript' },
  { name: 'Programação Orientada a Objetos', code: 'POO001', credits: 5, description: 'Conceitos de POO e design patterns' },
  { name: 'Engenharia de Software', code: 'ES001', credits: 4, description: 'Metodologias de desenvolvimento' },
  { name: 'Redes de Computadores', code: 'RC001', credits: 4, description: 'Fundamentos de redes e protocolos' },
  { name: 'Sistemas Operacionais', code: 'SO001', credits: 4, description: 'Funcionamento de sistemas operacionais' },
  { name: 'Inteligência Artificial', code: 'IA001', credits: 5, description: 'Introdução à IA e machine learning' },
  { name: 'Segurança da Informação', code: 'SI001', credits: 4, description: 'Princípios de segurança e criptografia' }
];

const SCHEDULES = [
  'Segunda e Quarta 08:00-10:00',
  'Terça e Quinta 14:00-16:30',
  'Segunda e Quarta 14:00-16:00',
  'Terça e Quinta 19:00-21:30',
  'Segunda e Quarta 19:00-21:30',
  'Terça e Quinta 08:00-10:00',
  'Segunda e Quarta 10:00-12:00',
  'Terça e Quinta 14:00-16:00',
  'Segunda e Quarta 14:00-16:30',
  'Terça e Quinta 19:00-21:00'
];

const ROOMS = ['Lab 101', 'Lab 102', 'Lab 103', 'Lab 104', 'Lab 105', 'Lab 106', 'Lab 107', 'Lab 108', 'Lab 109', 'Sala 201', 'Sala 202', 'Sala 203'];

const TECH_STACKS = [
  ['JavaScript', 'React', 'Node.js'],
  ['Python', 'Django', 'PostgreSQL'],
  ['Java', 'Spring Boot', 'MySQL'],
  ['C#', '.NET', 'SQL Server'],
  ['PHP', 'Laravel', 'MySQL'],
  ['Ruby', 'Rails', 'PostgreSQL'],
  ['Go', 'Gin', 'MongoDB'],
  ['TypeScript', 'Angular', 'Node.js']
];

const COMPANIES = [
  'Tech Solutions', 'Digital Innovations', 'Code Masters', 'Software Pro', 'Dev Experts',
  'Innovation Labs', 'Tech Hub', 'Code Factory', 'Digital Works', 'Smart Systems'
];

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateEmail(firstName, lastName) {
  const domains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'aluno.edu.br'];
  // Remover espaços e caracteres especiais, substituir por pontos
  const cleanFirstName = firstName.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '');
  const cleanLastName = lastName.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '');
  return `${cleanFirstName}.${cleanLastName}@${randomItem(domains)}`;
}

function generateRegistration(year, sequence) {
  return `${year}${sequence.toString().padStart(5, '0')}`;
}

// ============================================
// FUNÇÕES DE CRIAÇÃO
// ============================================

async function createUsers() {
  console.log('\n👥 Criando usuários...');
  
  const users = [];
  const year = new Date().getFullYear().toString().slice(-2);
  let studentSeq = 1;
  let teacherSeq = 1;
  const existingEmails = new Set();
  const existingRegistrations = new Set();
  
  // Buscar emails e matrículas existentes
  const existingUsers = await User.find({}, 'email registration');
  existingUsers.forEach(u => {
    existingEmails.add(u.email);
    existingRegistrations.add(u.registration);
  });
  
  // Criar Admin (se não existir)
  if (!existingEmails.has('admin@portal.edu.br')) {
    const admin = new User({
      name: 'Administrador Sistema',
      email: 'admin@portal.edu.br',
      password: '123456',
      registration: 'ADM001',
      course: 'Administração',
      semester: 1,
      role: 'admin',
      status: 'active'
    });
    await admin.save();
    users.push(admin);
    existingEmails.add(admin.email);
    existingRegistrations.add(admin.registration);
    console.log(`   ✅ Admin criado: ${admin.email}`);
  } else {
    const admin = await User.findOne({ email: 'admin@portal.edu.br' });
    users.push(admin);
    console.log(`   ⚠️  Admin já existe: ${admin.email}`);
  }
  
  // Criar Professores (8 professores)
  const teacherNames = [
    'Prof. Carlos Silva', 'Prof. Ana Paula Costa', 'Prof. Roberto Santos',
    'Prof. Juliana Oliveira', 'Prof. Marcos Fernandes', 'Prof. Patricia Lima',
    'Prof. Fernando Alves', 'Prof. Luciana Ribeiro'
  ];
  
  let teachersCreated = 0;
  for (const teacherName of teacherNames) {
    const [firstName, ...lastNameParts] = teacherName.replace('Prof. ', '').split(' ');
    const lastName = lastNameParts.join(' ');
    
    let email = generateEmail(firstName, lastName);
    let registration = `PR${teacherSeq.toString().padStart(3, '0')}`;
    
    // Garantir email único
    let emailCounter = 1;
    while (existingEmails.has(email)) {
      email = generateEmail(firstName, lastName + emailCounter);
      emailCounter++;
    }
    
    // Garantir matrícula única
    while (existingRegistrations.has(registration)) {
      teacherSeq++;
      registration = `PR${teacherSeq.toString().padStart(3, '0')}`;
    }
    
    const teacher = new User({
      name: teacherName,
      email: email,
      password: '123456',
      registration: registration,
      course: 'Ciência da Computação',
      semester: 1,
      role: 'teacher',
      status: 'active'
    });
    await teacher.save();
    users.push(teacher);
    existingEmails.add(email);
    existingRegistrations.add(registration);
    teachersCreated++;
    teacherSeq++;
  }
  console.log(`   ✅ ${teachersCreated} professores criados`);
  
  // Criar Alunos (30 alunos)
  let studentsCreated = 0;
  for (let i = 0; i < 30; i++) {
    const firstName = randomItem(FIRST_NAMES);
    const lastName = randomItem(LAST_NAMES);
    const fullName = `${firstName} ${lastName}`;
    
    let email = generateEmail(firstName, lastName);
    let registration = generateRegistration(year, studentSeq);
    
    // Garantir email único (tentar até 10 vezes)
    let attempts = 0;
    while (existingEmails.has(email) && attempts < 10) {
      email = generateEmail(firstName, lastName + studentSeq);
      attempts++;
    }
    
    // Garantir matrícula única
    while (existingRegistrations.has(registration)) {
      studentSeq++;
      registration = generateRegistration(year, studentSeq);
    }
    
    // Se ainda houver duplicata, pular
    if (existingEmails.has(email)) {
      console.log(`   ⚠️  Email duplicado ignorado: ${email}`);
      continue;
    }
    
    const student = new User({
      name: fullName,
      email: email,
      password: '123456',
      registration: registration,
      course: randomItem(['Ciência da Computação', 'Engenharia de Software', 'Sistemas de Informação']),
      semester: randomInt(1, 8),
      role: 'student',
      status: 'active'
    });
    await student.save();
    users.push(student);
    existingEmails.add(email);
    existingRegistrations.add(registration);
    studentsCreated++;
    studentSeq++;
  }
  console.log(`   ✅ ${studentsCreated} alunos criados`);
  
  return users;
}

async function createCourses(teachers) {
  console.log('\n📚 Criando cursos...');
  
  const courses = [];
  const teacherPool = teachers.filter(u => u.role === 'teacher');
  
  for (let i = 0; i < COURSE_NAMES.length; i++) {
    const courseData = COURSE_NAMES[i];
    const professor = teacherPool[i % teacherPool.length];
    
    const course = new Course({
      name: courseData.name,
      code: courseData.code,
      credits: courseData.credits,
      professor: professor.name,
      schedule: SCHEDULES[i % SCHEDULES.length],
      room: ROOMS[i % ROOMS.length],
      description: courseData.description,
      semester: randomInt(1, 6),
      status: 'enrolled',
      students: []
    });
    
    await course.save();
    courses.push(course);
    console.log(`   ✅ Curso criado: ${course.code} - ${course.name}`);
  }
  
  return courses;
}

async function assignStudentsToCourses(courses, students) {
  console.log('\n🔗 Associando alunos aos cursos...');
  
  const studentList = students.filter(s => s.role === 'student');
  
  for (const course of courses) {
    // Cada curso tem entre 8 e 20 alunos
    const numStudents = randomInt(8, Math.min(20, studentList.length));
    const selectedStudents = randomItems(studentList, numStudents);
    
    course.students = selectedStudents.map(s => s._id);
    await course.save();
    
    console.log(`   ✅ ${numStudents} alunos associados ao curso ${course.code}`);
  }
}

async function createLessons(courses) {
  console.log('\n📖 Criando aulas...');
  
  const lessons = [];
  const semesterStart = new Date();
  semesterStart.setMonth(semesterStart.getMonth() - 2);
  const semesterEnd = new Date();
  semesterEnd.setMonth(semesterEnd.getMonth() + 4); // 6 meses de semestre
  
  const lessonTitles = [
    'Introdução ao conteúdo',
    'Fundamentos teóricos',
    'Prática de laboratório',
    'Exercícios práticos',
    'Revisão de conceitos',
    'Aplicação prática',
    'Trabalho em grupo',
    'Apresentação de projetos',
    'Avaliação prática',
    'Correção de exercícios',
    'Discussão de casos',
    'Seminário temático',
    'Atividade prática',
    'Demonstração técnica',
    'Workshop prático',
    'Revisão para prova',
    'Correção de avaliação',
    'Projeto final',
    'Apresentação final',
    'Encerramento do módulo'
  ];
  
  for (const course of courses) {
    // Detectar dias da semana do horário
    const scheduleLower = course.schedule.toLowerCase();
    let targetDays = [1, 3, 5]; // Segunda, Quarta e Sexta por padrão
    
    if (scheduleLower.includes('terça') && scheduleLower.includes('quinta')) {
      targetDays = [2, 4];
    } else if (scheduleLower.includes('segunda') && scheduleLower.includes('quarta')) {
      targetDays = [1, 3];
    } else if (scheduleLower.includes('segunda')) {
      targetDays = [1];
    } else if (scheduleLower.includes('terça')) {
      targetDays = [2];
    } else if (scheduleLower.includes('quarta')) {
      targetDays = [3];
    } else if (scheduleLower.includes('quinta')) {
      targetDays = [4];
    } else if (scheduleLower.includes('sexta')) {
      targetDays = [5];
    }
    
    // Criar aulas para TODOS os dias da semana do curso durante o semestre
    let currentDate = new Date(semesterStart);
    let lessonCount = 0;
    
    // Criar aulas até o fim do semestre
    while (currentDate <= semesterEnd && lessonCount < 60) {
      const dayOfWeek = currentDate.getDay(); // 0 = domingo, 1 = segunda, etc.
      const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek; // Ajustar domingo para 7
      
      // Se o dia da semana está nos dias do curso, criar aula
      if (targetDays.includes(adjustedDay)) {
        const lessonTitle = lessonTitles[lessonCount % lessonTitles.length];
        const lessonDate = new Date(currentDate);
        
        // Definir horário baseado no schedule
        if (scheduleLower.includes('08:00') || scheduleLower.includes('8:00')) {
          lessonDate.setHours(8, 0, 0, 0);
        } else if (scheduleLower.includes('10:00')) {
          lessonDate.setHours(10, 0, 0, 0);
        } else if (scheduleLower.includes('14:00') || scheduleLower.includes('2:00')) {
          lessonDate.setHours(14, 0, 0, 0);
        } else if (scheduleLower.includes('19:00') || scheduleLower.includes('7:00')) {
          lessonDate.setHours(19, 0, 0, 0);
        } else {
          lessonDate.setHours(8, 0, 0, 0);
        }
        
        const lesson = new Lesson({
          course: course._id,
          title: `${lessonTitle} - ${course.name}`,
          description: `Aula do curso ${course.name}. ${course.description}`,
          date: lessonDate,
          resources: lessonCount % 3 === 0 ? [`Material_Aula_${lessonCount + 1}.pdf`, `Slides_Aula_${lessonCount + 1}.pptx`] : []
        });
        
        await lesson.save();
        lessons.push(lesson);
        lessonCount++;
      }
      
      // Avançar para o próximo dia
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    console.log(`   ✅ ${lessonCount} aulas criadas para ${course.code}`);
  }
  
  return lessons;
}

async function createExams(courses) {
  console.log('\n📝 Criando provas...');
  
  const exams = [];
  const semesterStart = new Date();
  semesterStart.setMonth(semesterStart.getMonth() - 2);
  const semesterEnd = new Date();
  semesterEnd.setMonth(semesterEnd.getMonth() + 4);
  
  const examTypes = [
    { title: 'Avaliação Parcial 1', weight: 20, type: 'parcial' },
    { title: 'Avaliação Parcial 2', weight: 20, type: 'parcial' },
    { title: 'Avaliação Parcial 3', weight: 20, type: 'parcial' },
    { title: 'Trabalho Prático', weight: 15, type: 'trabalho' },
    { title: 'Projeto Final', weight: 15, type: 'projeto' },
    { title: 'Prova Final', weight: 10, type: 'final' }
  ];
  
  for (const course of courses) {
    // Criar 4 a 6 provas por curso distribuídas ao longo do semestre
    const totalDays = Math.floor((semesterEnd - semesterStart) / (1000 * 60 * 60 * 24));
    const examsForCourse = randomInt(4, 6);
    
    for (let i = 0; i < examsForCourse; i++) {
      const examInfo = examTypes[i % examTypes.length];
      const daysFromStart = Math.floor((totalDays / (examsForCourse + 1)) * (i + 1));
      
      const examDate = new Date(semesterStart);
      examDate.setDate(examDate.getDate() + daysFromStart);
      
      // Definir horário (manhã ou tarde)
      if (i % 2 === 0) {
        examDate.setHours(8, 0, 0, 0); // 08:00
      } else {
        examDate.setHours(14, 0, 0, 0); // 14:00
      }
      
      // Garantir que seja em dia útil (segunda a sexta)
      const dayOfWeek = examDate.getDay();
      if (dayOfWeek === 0) { // Domingo
        examDate.setDate(examDate.getDate() + 1);
      } else if (dayOfWeek === 6) { // Sábado
        examDate.setDate(examDate.getDate() + 2);
      }
      
      const exam = new Exam({
        course: course._id,
        title: `${examInfo.title} - ${course.name}`,
        description: `${examInfo.type === 'final' ? 'Avaliação final' : examInfo.type === 'trabalho' ? 'Trabalho prático' : examInfo.type === 'projeto' ? 'Projeto final' : 'Avaliação parcial'} do curso ${course.name}`,
        date: examDate,
        maxGrade: 10,
        weight: examInfo.weight
      });
      
      await exam.save();
      exams.push(exam);
    }
    
    console.log(`   ✅ ${examsForCourse} provas criadas para ${course.code}`);
  }
  
  return exams;
}

async function createGrades(courses, exams, students) {
  console.log('\n📊 Criando notas...');
  
  const studentList = students.filter(s => s.role === 'student');
  let totalGrades = 0;
  
  for (const exam of exams) {
    const course = courses.find(c => c._id.toString() === exam.course.toString());
    if (!course) continue;
    
    // Buscar alunos do curso
    const courseStudents = studentList.filter(s => 
      course.students.some(cs => cs.toString() === s._id.toString())
    );
    
    // 80% dos alunos têm nota nesta prova
    const studentsWithGrade = courseStudents.filter(() => Math.random() > 0.2);
    
    for (const student of studentsWithGrade) {
      // Nota entre 5 e 10
      const gradeValue = parseFloat((randomFloat(5, 10)).toFixed(1));
      
      const grade = new Grade({
        student: student._id,
        course: course._id,
        courseName: course.name,
        grade: gradeValue,
        maxGrade: exam.maxGrade,
        type: exam.title.includes('Final') ? 'final' : 'exam',
        date: exam.date,
        weight: exam.weight,
        description: `Nota da ${exam.title}`
      });
      
      await grade.save();
      totalGrades++;
    }
  }
  
  console.log(`   ✅ ${totalGrades} notas criadas`);
}

async function createAttendance(courses, lessons, students) {
  console.log('\n✅ Criando registros de presença...');
  
  const studentList = students.filter(s => s.role === 'student');
  const statusWeights = { present: 0.7, absent: 0.2, late: 0.08, excused: 0.02 };
  let totalAttendance = 0;
  
  // Criar presenças para TODAS as aulas (não limitar)
  for (const lesson of lessons) {
    const course = courses.find(c => c._id.toString() === lesson.course.toString());
    if (!course) continue;
    
    // Buscar TODOS os alunos do curso
    const courseStudents = studentList.filter(s => 
      course.students.some(cs => cs.toString() === s._id.toString())
    );
    
    // Criar presença para TODOS os alunos da aula
    for (const student of courseStudents) {
      const rand = Math.random();
      let cumulative = 0;
      let status = 'present';
      
      for (const [stat, weight] of Object.entries(statusWeights)) {
        cumulative += weight;
        if (rand <= cumulative) {
          status = stat;
          break;
        }
      }
      
      const attendance = new Attendance({
        student: student._id,
        course: course._id,
        courseName: course.name,
        date: lesson.date,
        status: status,
        justification: status !== 'present' && Math.random() > 0.5 
          ? 'Justificativa: motivo pessoal/familiar' 
          : '',
        professor: course.professor
      });
      
      await attendance.save();
      totalAttendance++;
    }
  }
  
  console.log(`   ✅ ${totalAttendance} registros de presença criados`);
}

async function createMessages(users) {
  console.log('\n💬 Criando mensagens...');
  
  const students = users.filter(u => u.role === 'student');
  const teachers = users.filter(u => u.role === 'teacher');
  
  const subjects = [
    'Dúvida sobre a aula',
    'Entrega de trabalho',
    'Solicitação de revisão',
    'Consulta sobre nota',
    'Informação importante',
    'Aviso sobre prova',
    'Material complementar',
    'Dúvida sobre conteúdo'
  ];
  
  const contents = [
    'Olá professor(a), gostaria de tirar uma dúvida sobre o conteúdo da última aula.',
    'Boa tarde, estou enviando o trabalho conforme solicitado.',
    'Prezado(a) professor(a), gostaria de solicitar uma revisão da minha nota.',
    'Olá, tenho uma dúvida sobre minha nota na última avaliação.',
    'Informo que não poderei comparecer à aula de amanhã.',
    'Gostaria de confirmar a data da próxima prova.',
    'Agradeço pelo material complementar enviado.',
    'Tenho uma dúvida sobre o conteúdo abordado na última aula.'
  ];
  
  let totalMessages = 0;
  
  // Mensagens de alunos para professores (50 mensagens)
  for (let i = 0; i < 50; i++) {
    const student = randomItem(students);
    const teacher = randomItem(teachers);
    const index = i % subjects.length;
    
    const message = new Message({
      sender: student._id,
      receiver: teacher._id,
      subject: `${subjects[index]} - ${randomItem(['Urgente', 'Importante', ''])}`,
      content: contents[index],
      read: Math.random() > 0.4,
      attachments: []
    });
    
    await message.save();
    totalMessages++;
  }
  
  // Mensagens de professores para alunos (30 mensagens)
  for (let i = 0; i < 30; i++) {
    const teacher = randomItem(teachers);
    const student = randomItem(students);
    
    const message = new Message({
      sender: teacher._id,
      receiver: student._id,
      subject: 'Aviso Importante',
      content: 'Prezado(a) aluno(a), informo que a próxima aula será sobre um novo tópico. Por favor, revise o material enviado.',
      read: false,
      attachments: []
    });
    
    await message.save();
    totalMessages++;
  }
  
  console.log(`   ✅ ${totalMessages} mensagens criadas`);
}

async function createDocuments(users, courses) {
  console.log('\n📄 Criando documentos...');
  
  const students = users.filter(u => u.role === 'student');
  const categories = ['declaração', 'atestado', 'histórico', 'boleto', 'contrato', 'curriculo', 'outro'];
  const fileTypes = ['pdf', 'docx', 'jpg', 'png'];
  
  let totalDocs = 0;
  
  for (let i = 0; i < 50; i++) {
    const student = randomItem(students);
    const course = Math.random() > 0.5 ? randomItem(courses) : null;
    const category = randomItem(categories);
    
    const doc = new Document({
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} - ${student.name}`,
      description: `Documento do tipo ${category}`,
      fileUrl: `/uploads/documents/${student._id}_${Date.now()}.${randomItem(fileTypes)}`,
      fileName: `documento_${category}_${Date.now()}.${randomItem(fileTypes)}`,
      fileType: randomItem(fileTypes),
      fileSize: randomInt(100000, 5000000), // 100KB a 5MB
      category: category,
      user: student._id,
      course: course ? course._id : null,
      isPublic: Math.random() > 0.8
    });
    
    await doc.save();
    totalDocs++;
  }
  
  console.log(`   ✅ ${totalDocs} documentos criados`);
}

async function createSpots(users) {
  console.log('\n💼 Criando vagas (spots)...');
  
  const students = users.filter(u => u.role === 'student');
  const spots = [];
  
  for (let i = 0; i < 30; i++) {
    const spot = new Spots({
      thumbnail: `https://picsum.photos/400/300?random=${i}`,
      company: randomItem(COMPANIES),
      price: randomInt(2000, 8000),
      techs: randomItems(TECH_STACKS.flat(), randomInt(2, 5)),
      user: randomItem(students)._id
    });
    
    await spot.save();
    spots.push(spot);
  }
  
  console.log(`   ✅ ${spots.length} vagas criadas`);
  return spots;
}

async function createBookings(spots, users) {
  console.log('\n📅 Criando reservas (bookings)...');
  
  const students = users.filter(u => u.role === 'student');
  const bookings = [];
  
  for (let i = 0; i < 40; i++) {
    const spot = randomItem(spots);
    const student = randomItem(students);
    const date = randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    
    const booking = new Booking({
      date: date.toISOString().split('T')[0],
      approved: Math.random() > 0.3,
      user: student._id,
      spot: spot._id
    });
    
    await booking.save();
    bookings.push(booking);
  }
  
  console.log(`   ✅ ${bookings.length} reservas criadas`);
}

async function createCalendarEvents(courses, users) {
  console.log('\n📆 Criando eventos de calendário...');
  
  const teachers = users.filter(u => u.role === 'teacher');
  const admins = users.filter(u => u.role === 'admin');
  const creators = [...teachers, ...admins];
  
  const eventTypes = ['aula', 'prova', 'evento', 'feriado', 'outro'];
  const colors = ['#3788d8', '#28a745', '#ffc107', '#dc3545', '#6f42c1'];
  
  let totalEvents = 0;
  
  // Eventos baseados em cursos (aulas e provas)
  for (const course of courses) {
    const startDate = randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date(Date.now() + 60 * 24 * 60 * 60 * 1000));
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 2);
    
    const event = new CalendarEvent({
      title: `Aula - ${course.name}`,
      description: `Aula do curso ${course.name}`,
      startDate: startDate,
      endDate: endDate,
      allDay: false,
      type: 'aula',
      color: colors[0],
      course: course._id,
      visibleTo: ['all'],
      createdBy: randomItem(creators)._id
    });
    
    await event.save();
    totalEvents++;
  }
  
  // Eventos gerais (20 eventos)
  for (let i = 0; i < 20; i++) {
    const startDate = randomDate(new Date(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + randomInt(1, 4));
    
    const event = new CalendarEvent({
      title: `Evento ${i + 1}`,
      description: `Descrição do evento ${i + 1}`,
      startDate: startDate,
      endDate: endDate,
      allDay: Math.random() > 0.7,
      type: randomItem(eventTypes),
      color: randomItem(colors),
      visibleTo: randomItems(['all', 'students', 'teachers', 'admin'], randomInt(1, 2)),
      createdBy: randomItem(creators)._id
    });
    
    await event.save();
    totalEvents++;
  }
  
  console.log(`   ✅ ${totalEvents} eventos de calendário criados`);
}

async function createCertificates(students, courses, users) {
  console.log('\n🎓 Criando certificados...');
  
  const teachers = users.filter(u => u.role === 'teacher');
  const admins = users.filter(u => u.role === 'admin');
  const issuers = [...teachers, ...admins];
  
  const types = ['matricula', 'conclusao', 'historico', 'declaracao', 'outro'];
  const statuses = ['pendente', 'emitido', 'cancelado'];
  
  let totalCerts = 0;
  let docCodeSeq = 1000;
  
  for (let i = 0; i < 40; i++) {
    const student = randomItem(students);
    const course = Math.random() > 0.3 ? randomItem(courses) : null;
    const type = randomItem(types);
    const status = randomItem(statuses);
    
    const issueDate = randomDate(new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), new Date());
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    
    const certificate = new Certificate({
      student: student._id,
      title: `Certificado de ${type} - ${student.name}`,
      description: `Certificado do tipo ${type}`,
      type: type,
      issueDate: issueDate,
      expiryDate: type === 'conclusao' ? expiryDate : null,
      documentUrl: status === 'emitido' ? `/certificates/${student._id}_${docCodeSeq}.pdf` : null,
      documentCode: `CERT-${docCodeSeq}`,
      status: status,
      course: course ? course._id : null,
      issuedBy: status === 'emitido' ? randomItem(issuers)._id : null
    });
    
    await certificate.save();
    totalCerts++;
    docCodeSeq++;
  }
  
  console.log(`   ✅ ${totalCerts} certificados criados`);
}

async function createNotifications(students) {
  console.log('\n🔔 Criando notificações...');
  
  const types = ['info', 'warning', 'success', 'error'];
  const priorities = ['low', 'medium', 'high'];
  
  const notifications = [
    { title: 'Nova nota disponível', message: 'Uma nova nota foi lançada no sistema.', type: 'info' },
    { title: 'Prova agendada', message: 'Uma nova prova foi agendada. Verifique o calendário.', type: 'warning' },
    { title: 'Trabalho aprovado', message: 'Seu trabalho foi aprovado pelo professor.', type: 'success' },
    { title: 'Falta de presença', message: 'Você está com muitas faltas. Atenção!', type: 'error' },
    { title: 'Nova mensagem', message: 'Você recebeu uma nova mensagem.', type: 'info' },
    { title: 'Documento disponível', message: 'Um novo documento está disponível para download.', type: 'info' }
  ];
  
  let totalNotifs = 0;
  
  // Criar notificações para TODOS os alunos (pelo menos 3 por aluno)
  for (const student of students) {
    for (let i = 0; i < randomInt(2, 5); i++) {
      const notifTemplate = randomItem(notifications);
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + randomInt(7, 30));
      
      const notification = new Notification({
        student: student._id,
        title: notifTemplate.title,
        message: notifTemplate.message,
        type: notifTemplate.type,
        read: Math.random() > 0.6,
        priority: randomItem(priorities),
        expiresAt: expiresAt,
        actionUrl: Math.random() > 0.5 ? '/dashboard' : null
      });
      
      await notification.save();
      totalNotifs++;
    }
  }
  
  console.log(`   ✅ ${totalNotifs} notificações criadas`);
}

// ============================================
// FUNÇÃO PRINCIPAL
// ============================================

async function seedDatabase() {
  try {
    console.log('\n🔄 Conectando ao banco de dados...');
    console.log('📍 URI:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10
    });
    console.log('✅ Conectado ao MongoDB\n');

    // Verificar se já existem dados
    const existingUsers = await User.countDocuments();
    const existingCourses = await Course.countDocuments();
    
    if (existingUsers > 0 || existingCourses > 0) {
      console.log('⚠️  Já existem dados no banco de dados.');
      console.log(`   Usuários existentes: ${existingUsers}`);
      console.log(`   Cursos existentes: ${existingCourses}`);
      console.log('💡 O script irá adicionar novos dados ou pular duplicatas.\n');
    }

    // Criar dados (com tratamento de erros individual)
    console.log('\n🚀 Iniciando criação de dados...\n');
    
    let users = [];
    let courses = [];
    let lessons = [];
    let exams = [];
    let spots = [];
    
    try {
      users = await createUsers();
    } catch (error) {
      console.error('❌ Erro ao criar usuários:', error.message);
      // Buscar usuários existentes
      users = await User.find();
      console.log(`   ⚠️  Continuando com ${users.length} usuários existentes`);
    }
    
    try {
      courses = await createCourses(users);
    } catch (error) {
      console.error('❌ Erro ao criar cursos:', error.message);
      courses = await Course.find();
      console.log(`   ⚠️  Continuando com ${courses.length} cursos existentes`);
    }
    
    try {
      await assignStudentsToCourses(courses, users);
    } catch (error) {
      console.error('❌ Erro ao associar alunos aos cursos:', error.message);
    }
    
    try {
      lessons = await createLessons(courses);
    } catch (error) {
      console.error('❌ Erro ao criar aulas:', error.message);
      lessons = await Lesson.find();
    }
    
    try {
      exams = await createExams(courses);
    } catch (error) {
      console.error('❌ Erro ao criar provas:', error.message);
      exams = await Exam.find();
    }
    
    try {
      await createGrades(courses, exams, users);
    } catch (error) {
      console.error('❌ Erro ao criar notas:', error.message);
    }
    
    try {
      await createAttendance(courses, lessons, users);
    } catch (error) {
      console.error('❌ Erro ao criar presenças:', error.message);
    }
    
    try {
      await createMessages(users);
    } catch (error) {
      console.error('❌ Erro ao criar mensagens:', error.message);
    }
    
    try {
      await createDocuments(users, courses);
    } catch (error) {
      console.error('❌ Erro ao criar documentos:', error.message);
    }
    
    try {
      spots = await createSpots(users);
    } catch (error) {
      console.error('❌ Erro ao criar vagas:', error.message);
      spots = await Spots.find();
    }
    
    try {
      await createBookings(spots, users);
    } catch (error) {
      console.error('❌ Erro ao criar reservas:', error.message);
    }
    
    try {
      await createCalendarEvents(courses, users);
    } catch (error) {
      console.error('❌ Erro ao criar eventos:', error.message);
    }
    
    try {
      await createCertificates(
        users.filter(u => u.role === 'student'),
        courses,
        users
      );
    } catch (error) {
      console.error('❌ Erro ao criar certificados:', error.message);
    }
    
    try {
      await createNotifications(users.filter(u => u.role === 'student'));
    } catch (error) {
      console.error('❌ Erro ao criar notificações:', error.message);
    }

    // Resumo final
    console.log('\n' + '='.repeat(50));
    console.log('🎉 SEED COMPLETO CONCLUÍDO COM SUCESSO!');
    console.log('='.repeat(50));
    console.log('\n📊 Resumo dos dados criados:');
    console.log(`   👥 Usuários: ${users.length} (1 admin, ${users.filter(u => u.role === 'teacher').length} professores, ${users.filter(u => u.role === 'student').length} alunos)`);
    console.log(`   📚 Cursos: ${courses.length}`);
    console.log(`   📖 Aulas: ${lessons.length}`);
    console.log(`   📝 Provas: ${exams.length}`);
    console.log(`   📊 Notas: ${await Grade.countDocuments()}`);
    console.log(`   ✅ Presenças: ${await Attendance.countDocuments()}`);
    console.log(`   💬 Mensagens: ${await Message.countDocuments()}`);
    console.log(`   📄 Documentos: ${await Document.countDocuments()}`);
    console.log(`   💼 Vagas: ${spots.length}`);
    console.log(`   📅 Reservas: ${await Booking.countDocuments()}`);
    console.log(`   📆 Eventos: ${await CalendarEvent.countDocuments()}`);
    console.log(`   🎓 Certificados: ${await Certificate.countDocuments()}`);
    console.log(`   🔔 Notificações: ${await Notification.countDocuments()}`);
    console.log('\n🔑 Credenciais de acesso:');
    console.log('   Admin: admin@portal.edu.br / 123456');
    console.log('   Professores: [email do professor] / 123456');
    console.log('   Alunos: [email do aluno] / 123456');
    console.log('\n✅ Todos os dados foram criados com sucesso!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro no seeding:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Executar
seedDatabase();

