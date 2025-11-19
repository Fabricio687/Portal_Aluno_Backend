// Carregar variáveis de ambiente
const path = require('path');
const fs = require('fs');

// Tentar carregar config.env de diferentes locais
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
  // Tentar carregar do .env também
  require('dotenv').config();
}

const mongoose = require('mongoose');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Exam = require('../models/Exam');
const Message = require('../models/Message');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Configuração de conexão
const { DB_USER, DB_PASS, DB_NAME, MONGODB_URI, DATABASE } = process.env;

// Construir URI do MongoDB
let uri;

// Verificar se MONGODB_URI aponta para localhost (erro comum)
if (MONGODB_URI) {
  if (MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')) {
    console.error('\n❌ Erro: MONGODB_URI está configurado para MongoDB local!');
    console.error('   URI atual:', MONGODB_URI);
    console.error('\n💡 Você precisa usar MongoDB Atlas (cloud).');
    console.error('   Configure MONGODB_URI com a URI do MongoDB Atlas:');
    console.error('   MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco');
    console.error('\n   Ou configure DB_USER, DB_PASS e DB_NAME com valores reais do Atlas.');
    process.exit(1);
  }
  uri = MONGODB_URI;
  console.log('✅ Usando MONGODB_URI do config.env');
} else if (DATABASE) {
  if (DATABASE.includes('localhost') || DATABASE.includes('127.0.0.1')) {
    console.error('\n❌ Erro: DATABASE está configurado para MongoDB local!');
    console.error('   Configure MONGODB_URI com a URI do MongoDB Atlas.');
    process.exit(1);
  }
  uri = DATABASE;
  console.log('✅ Usando DATABASE do config.env');
} else if (DB_USER && DB_PASS && DB_NAME) {
  // Verificar se são valores de exemplo
  if (DB_USER.includes('seu_usuario') || DB_PASS.includes('sua_senha') || DB_NAME.includes('seu_banco')) {
    console.error('\n❌ Erro: Variáveis DB_USER, DB_PASS ou DB_NAME contêm valores de exemplo!');
    console.error('   Configure valores reais do MongoDB Atlas no config.env');
    process.exit(1);
  }
  // Construir URI do MongoDB Atlas (usando o mesmo padrão do index.js)
  // NOTA: Se seu cluster tiver um nome diferente, você deve usar MONGODB_URI completa
  uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.7hrgleb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
  console.log('✅ Construindo URI a partir de DB_USER, DB_PASS e DB_NAME');
  console.log('⚠️  NOTA: Se seu cluster MongoDB Atlas tiver nome diferente, use MONGODB_URI completa no config.env');
} else {
  console.error('\n❌ Erro: Variáveis de ambiente não configuradas!');
  console.error('\n📋 Variáveis encontradas:');
  console.error(`   MONGODB_URI: ${MONGODB_URI ? '✅ definida' : '❌ não definida'}`);
  console.error(`   DATABASE: ${DATABASE ? '✅ definida' : '❌ não definida'}`);
  console.error(`   DB_USER: ${DB_USER ? '✅ definida' : '❌ não definida'}`);
  console.error(`   DB_PASS: ${DB_PASS ? '✅ definida' : '❌ não definida'}`);
  console.error(`   DB_NAME: ${DB_NAME ? '✅ definida' : '❌ não definida'}`);
  console.error('\n💡 Solução:');
  console.error('   1. Edite o arquivo config.env na raiz do projeto back-do-cafe-main');
  console.error('   2. Configure uma das opções:');
  console.error('      - MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco');
  console.error('      - OU configure DB_USER, DB_PASS e DB_NAME com valores REAIS do MongoDB Atlas');
  console.error('   3. Veja o arquivo config.env.example para referência');
  process.exit(1);
}

// Cursos para criar
const coursesData = [
  {
    name: 'Introdução à Programação',
    code: 'IP001',
    credits: 4,
    professor: 'Prof. Carlos Silva',
    schedule: 'Segunda e Quarta 08:00-10:00',
    room: 'Lab 101',
    description: 'Fundamentos de programação e lógica de programação',
    semester: 1
  },
  {
    name: 'Algoritmos e Estruturas de Dados',
    code: 'AED001',
    credits: 5,
    professor: 'Prof. Ana Paula Costa',
    schedule: 'Terça e Quinta 14:00-16:30',
    room: 'Lab 102',
    description: 'Estruturas de dados básicas e algoritmos de ordenação e busca',
    semester: 2
  },
  {
    name: 'Banco de Dados',
    code: 'BD001',
    credits: 4,
    professor: 'Prof. Roberto Santos',
    schedule: 'Segunda e Quarta 14:00-16:00',
    room: 'Lab 103',
    description: 'Modelagem e implementação de bancos de dados relacionais',
    semester: 2
  },
  {
    name: 'Desenvolvimento Web',
    code: 'DW001',
    credits: 5,
    professor: 'Prof. Juliana Oliveira',
    schedule: 'Terça e Quinta 19:00-21:30',
    room: 'Lab 104',
    description: 'Desenvolvimento de aplicações web com HTML, CSS, JavaScript e frameworks',
    semester: 3
  },
  {
    name: 'Programação Orientada a Objetos',
    code: 'POO001',
    credits: 5,
    professor: 'Prof. Marcos Fernandes',
    schedule: 'Segunda e Quarta 19:00-21:30',
    room: 'Lab 105',
    description: 'Conceitos de POO, classes, herança, polimorfismo e encapsulamento',
    semester: 3
  }
];

// Função para gerar datas de aulas
function generateLessons(course, startDate) {
  const lessons = [];
  
  // Detectar dias da semana do horário
  let targetDays = [1]; // Segunda por padrão
  const scheduleLower = course.schedule.toLowerCase();
  
  if (scheduleLower.includes('segunda') && scheduleLower.includes('quarta')) {
    targetDays = [1, 3]; // Segunda e Quarta
  } else if (scheduleLower.includes('terça') && scheduleLower.includes('quinta')) {
    targetDays = [2, 4]; // Terça e Quinta
  } else if (scheduleLower.includes('segunda')) {
    targetDays = [1];
  } else if (scheduleLower.includes('terça')) {
    targetDays = [2];
  } else if (scheduleLower.includes('quarta')) {
    targetDays = [3];
  } else if (scheduleLower.includes('quinta')) {
    targetDays = [4];
  }
  
  // Encontrar a primeira data com o dia da semana correto
  let currentDate = new Date(startDate);
  const firstDay = targetDays[0];
  const daysToAdd = (firstDay - currentDate.getDay() + 7) % 7;
  if (daysToAdd > 0) {
    currentDate.setDate(currentDate.getDate() + daysToAdd);
  } else if (currentDate.getDay() !== firstDay) {
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  // Criar 16 aulas (semestre - 2 aulas por semana)
  let lessonCount = 0;
  let weekOffset = 0;
  
  while (lessonCount < 16) {
    for (const day of targetDays) {
      if (lessonCount >= 16) break;
      
      const lessonDate = new Date(currentDate);
      lessonDate.setDate(currentDate.getDate() + (weekOffset * 7) + (day - firstDay));
      
      lessons.push({
        course: course._id,
        title: `Aula ${lessonCount + 1} - ${course.name}`,
        description: `Conteúdo da aula ${lessonCount + 1} do curso ${course.name}. Tópicos abordados: conceitos fundamentais e práticas.`,
        date: lessonDate,
        resources: []
      });
      
      lessonCount++;
    }
    weekOffset++;
  }
  
  return lessons;
}

// Função para gerar provas
function generateExams(course, startDate) {
  const exams = [];
  const semesterStart = new Date(startDate);
  
  // P1 - 1 mês após início
  const p1Date = new Date(semesterStart);
  p1Date.setMonth(p1Date.getMonth() + 1);
  p1Date.setDate(15); // Dia 15 do mês
  
  // P2 - 2 meses após início
  const p2Date = new Date(semesterStart);
  p2Date.setMonth(p2Date.getMonth() + 2);
  p2Date.setDate(15);
  
  // Prova Final - 3 meses após início
  const finalDate = new Date(semesterStart);
  finalDate.setMonth(finalDate.getMonth() + 3);
  finalDate.setDate(20);
  
  exams.push(
    {
      course: course._id,
      title: `P1 - ${course.name}`,
      description: 'Primeira avaliação parcial do curso',
      date: p1Date,
      maxGrade: 10,
      weight: 0.3
    },
    {
      course: course._id,
      title: `P2 - ${course.name}`,
      description: 'Segunda avaliação parcial do curso',
      date: p2Date,
      maxGrade: 10,
      weight: 0.3
    },
    {
      course: course._id,
      title: `Prova Final - ${course.name}`,
      description: 'Avaliação final do curso',
      date: finalDate,
      maxGrade: 10,
      weight: 0.4
    }
  );
  
  return exams;
}

// Função para gerar mensagens
function generateMessages(students, teachers, courses) {
  const messages = [];
  const subjects = [
    'Dúvida sobre a aula',
    'Entrega de trabalho',
    'Solicitação de revisão',
    'Consulta sobre nota',
    'Informação importante',
    'Aviso sobre prova',
    'Material complementar'
  ];
  
  const contents = [
    'Olá professor(a), gostaria de tirar uma dúvida sobre o conteúdo da última aula.',
    'Boa tarde, estou enviando o trabalho conforme solicitado.',
    'Prezado(a) professor(a), gostaria de solicitar uma revisão da minha nota.',
    'Olá, tenho uma dúvida sobre minha nota na última avaliação.',
    'Informo que não poderei comparecer à aula de amanhã.',
    'Gostaria de confirmar a data da próxima prova.',
    'Agradeço pelo material complementar enviado.'
  ];
  
  // Criar algumas mensagens entre alunos e professores
  for (let i = 0; i < Math.min(students.length, 10); i++) {
    const student = students[i];
    const teacher = teachers[i % teachers.length];
    const course = courses[i % courses.length];
    
    const messageIndex = i % subjects.length;
    
    messages.push({
      sender: student._id,
      receiver: teacher._id,
      subject: `${subjects[messageIndex]} - ${course.name}`,
      content: contents[messageIndex],
      read: Math.random() > 0.5,
      attachments: []
    });
  }
  
  // Criar algumas mensagens de professores para alunos
  for (let i = 0; i < Math.min(teachers.length, 5); i++) {
    const teacher = teachers[i];
    const student = students[i % students.length];
    const course = courses[i % courses.length];
    
    messages.push({
      sender: teacher._id,
      receiver: student._id,
      subject: `Aviso - ${course.name}`,
      content: 'Prezado(a) aluno(a), informo que a próxima aula será sobre um novo tópico. Por favor, revise o material enviado.',
      read: false,
      attachments: []
    });
  }
  
  return messages;
}

// Função para gerar notas
function generateGrades(students, courses, exams) {
  const grades = [];
  
  for (const exam of exams) {
    const course = courses.find(c => c._id.toString() === exam.course.toString());
    if (!course) continue;
    
    // Gerar notas para alguns alunos (70% dos alunos)
    const studentsToGrade = students.filter(() => Math.random() > 0.3);
    
    for (const student of studentsToGrade) {
      // Nota aleatória entre 5 e 10
      const gradeValue = Math.floor(Math.random() * 5) + 5;
      
      grades.push({
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
    }
  }
  
  return grades;
}

// Função para gerar presenças
function generateAttendances(students, courses, lessons) {
  const attendances = [];
  const statuses = ['present', 'absent', 'late', 'excused'];
  const statusWeights = [0.7, 0.2, 0.08, 0.02]; // 70% presente, 20% falta, 8% atraso, 2% justificado
  
  for (const lesson of lessons) {
    const course = courses.find(c => c._id.toString() === lesson.course.toString());
    if (!course) continue;
    
    // Buscar alunos que fazem este curso
    const courseStudents = students.filter(s => 
      s.course && s.course.toLowerCase().includes(course.name.toLowerCase().split(' ')[0])
    );
    
    // Se não encontrar por nome, pegar alguns alunos aleatórios
    const studentsForLesson = courseStudents.length > 0 
      ? courseStudents 
      : students.slice(0, Math.min(10, students.length));
    
    for (const student of studentsForLesson) {
      // Escolher status baseado nos pesos
      const rand = Math.random();
      let cumulative = 0;
      let status = 'present';
      
      for (let i = 0; i < statuses.length; i++) {
        cumulative += statusWeights[i];
        if (rand <= cumulative) {
          status = statuses[i];
          break;
        }
      }
      
      attendances.push({
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
    }
  }
  
  return attendances;
}

async function seedDatabase() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    console.log('📍 URI:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Ocultar credenciais no log
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10
    });
    console.log('✅ Conectado ao MongoDB\n');

    // Buscar ou criar usuários
    console.log('👥 Verificando usuários...');
    let students = await User.find({ role: 'student' }).limit(20);
    let teachers = await User.find({ role: 'teacher' }).limit(5);
    
    if (students.length === 0) {
      console.log('⚠️  Nenhum aluno encontrado. Criando alunos de exemplo...');
      // Criar alguns alunos de exemplo
      const studentData = [
        { name: 'João Silva', email: 'joao.silva@aluno.com', password: '123456', registration: 'AL001', course: 'Introdução à Programação', semester: 1, role: 'student' },
        { name: 'Maria Santos', email: 'maria.santos@aluno.com', password: '123456', registration: 'AL002', course: 'Algoritmos e Estruturas de Dados', semester: 2, role: 'student' },
        { name: 'Pedro Costa', email: 'pedro.costa@aluno.com', password: '123456', registration: 'AL003', course: 'Banco de Dados', semester: 2, role: 'student' },
        { name: 'Ana Oliveira', email: 'ana.oliveira@aluno.com', password: '123456', registration: 'AL004', course: 'Desenvolvimento Web', semester: 3, role: 'student' },
        { name: 'Carlos Pereira', email: 'carlos.pereira@aluno.com', password: '123456', registration: 'AL005', course: 'Programação Orientada a Objetos', semester: 3, role: 'student' }
      ];
      
      for (const data of studentData) {
        const student = new User(data);
        await student.save();
        students.push(student);
      }
      console.log(`✅ ${studentData.length} alunos criados`);
    } else {
      console.log(`✅ ${students.length} alunos encontrados`);
    }
    
    if (teachers.length === 0) {
      console.log('⚠️  Nenhum professor encontrado. Criando professores de exemplo...');
      // Criar professores baseados nos cursos
      const teacherData = [
        { name: 'Prof. Carlos Silva', email: 'carlos.silva@professor.com', password: '123456', registration: 'PR001', course: 'Ciência da Computação', semester: 1, role: 'teacher' },
        { name: 'Prof. Ana Paula Costa', email: 'ana.costa@professor.com', password: '123456', registration: 'PR002', course: 'Ciência da Computação', semester: 1, role: 'teacher' },
        { name: 'Prof. Roberto Santos', email: 'roberto.santos@professor.com', password: '123456', registration: 'PR003', course: 'Ciência da Computação', semester: 1, role: 'teacher' }
      ];
      
      for (const data of teacherData) {
        const teacher = new User(data);
        await teacher.save();
        teachers.push(teacher);
      }
      console.log(`✅ ${teacherData.length} professores criados`);
    } else {
      console.log(`✅ ${teachers.length} professores encontrados`);
    }

    // Criar cursos
    console.log('\n📚 Criando cursos...');
    const courses = [];
    const semesterStartDate = new Date();
    semesterStartDate.setMonth(semesterStartDate.getMonth() - 1);
    
    for (const courseData of coursesData) {
      let course = await Course.findOne({ code: courseData.code });
      
      if (!course) {
        course = await Course.create(courseData);
        console.log(`✅ Curso criado: ${course.code} - ${course.name}`);
      } else {
        console.log(`⚠️  Curso já existe: ${course.code} - ${course.name}`);
      }
      courses.push(course);
    }

    // Criar aulas
    console.log('\n📖 Criando aulas...');
    let totalLessons = 0;
    for (const course of courses) {
      const existingLessons = await Lesson.countDocuments({ course: course._id });
      
      if (existingLessons === 0) {
        const lessonsData = generateLessons(course, semesterStartDate);
        await Lesson.insertMany(lessonsData);
        totalLessons += lessonsData.length;
        console.log(`   ✅ ${lessonsData.length} aulas criadas para ${course.name}`);
      } else {
        console.log(`   ⚠️  ${existingLessons} aulas já existem para ${course.name}`);
      }
    }
    console.log(`✅ Total de aulas: ${totalLessons}`);

    // Criar provas
    console.log('\n📝 Criando provas...');
    let totalExams = 0;
    const allExams = [];
    for (const course of courses) {
      const existingExams = await Exam.countDocuments({ course: course._id });
      
      if (existingExams === 0) {
        const examsData = generateExams(course, semesterStartDate);
        const createdExams = await Exam.insertMany(examsData);
        allExams.push(...createdExams);
        totalExams += examsData.length;
        console.log(`   ✅ ${examsData.length} provas criadas para ${course.name}`);
      } else {
        const existing = await Exam.find({ course: course._id });
        allExams.push(...existing);
        console.log(`   ⚠️  ${existingExams} provas já existem para ${course.name}`);
      }
    }
    console.log(`✅ Total de provas: ${totalExams}`);

    // Criar mensagens
    console.log('\n💬 Criando mensagens...');
    const existingMessages = await Message.countDocuments();
    if (existingMessages === 0 && students.length > 0 && teachers.length > 0) {
      const messagesData = generateMessages(students, teachers, courses);
      await Message.insertMany(messagesData);
      console.log(`✅ ${messagesData.length} mensagens criadas`);
    } else {
      console.log(`⚠️  ${existingMessages} mensagens já existem`);
    }

    // Criar notas
    console.log('\n📊 Criando notas...');
    if (students.length > 0 && allExams.length > 0) {
      const existingGrades = await Grade.countDocuments();
      if (existingGrades === 0) {
        const gradesData = generateGrades(students, courses, allExams);
        await Grade.insertMany(gradesData);
        console.log(`✅ ${gradesData.length} notas criadas`);
      } else {
        console.log(`⚠️  ${existingGrades} notas já existem`);
      }
    } else {
      console.log('⚠️  Não é possível criar notas: faltam alunos ou provas');
    }

    // Criar presenças
    console.log('\n✅ Criando registros de presença...');
    if (students.length > 0) {
      const allLessons = await Lesson.find({});
      const existingAttendances = await Attendance.countDocuments();
      
      if (existingAttendances === 0 && allLessons.length > 0) {
        const attendancesData = generateAttendances(students, courses, allLessons);
        // Limitar a 500 registros para não sobrecarregar
        const limitedAttendances = attendancesData.slice(0, 500);
        await Attendance.insertMany(limitedAttendances);
        console.log(`✅ ${limitedAttendances.length} registros de presença criados`);
      } else {
        console.log(`⚠️  ${existingAttendances} registros de presença já existem`);
      }
    } else {
      console.log('⚠️  Não é possível criar presenças: faltam alunos');
    }

    console.log('\n🎉 Seeding completo concluído com sucesso!');
    console.log('\n📋 Resumo:');
    console.log(`   - Cursos: ${courses.length}`);
    console.log(`   - Aulas: ${totalLessons}`);
    console.log(`   - Provas: ${totalExams}`);
    console.log(`   - Alunos: ${students.length}`);
    console.log(`   - Professores: ${teachers.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no seeding:', error);
    process.exit(1);
  }
}

seedDatabase();

