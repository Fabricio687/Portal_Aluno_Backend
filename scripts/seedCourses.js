require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Exam = require('../models/Exam');
const User = require('../models/User');

const courses = [
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
  },
  {
    name: 'Engenharia de Software',
    code: 'ES001',
    credits: 4,
    professor: 'Prof. Patricia Lima',
    schedule: 'Terça e Quinta 08:00-10:00',
    room: 'Sala 201',
    description: 'Metodologias de desenvolvimento de software e gestão de projetos',
    semester: 4
  },
  {
    name: 'Redes de Computadores',
    code: 'RC001',
    credits: 4,
    professor: 'Prof. Fernando Alves',
    schedule: 'Segunda e Quarta 10:00-12:00',
    room: 'Lab 106',
    description: 'Fundamentos de redes, protocolos TCP/IP e arquiteturas de rede',
    semester: 4
  },
  {
    name: 'Sistemas Operacionais',
    code: 'SO001',
    credits: 4,
    professor: 'Prof. Ricardo Pereira',
    schedule: 'Terça e Quinta 14:00-16:00',
    room: 'Lab 107',
    description: 'Funcionamento de sistemas operacionais, processos, threads e gerenciamento de memória',
    semester: 5
  },
  {
    name: 'Inteligência Artificial',
    code: 'IA001',
    credits: 5,
    professor: 'Prof. Luciana Ribeiro',
    schedule: 'Segunda e Quarta 14:00-16:30',
    room: 'Lab 108',
    description: 'Introdução à IA, machine learning e algoritmos de busca',
    semester: 6
  },
  {
    name: 'Segurança da Informação',
    code: 'SI001',
    credits: 4,
    professor: 'Prof. Alexandre Torres',
    schedule: 'Terça e Quinta 19:00-21:00',
    room: 'Lab 109',
    description: 'Princípios de segurança, criptografia e proteção de dados',
    semester: 6
  }
];

// Função para gerar datas de aulas
function generateLessons(course, startDate) {
  const lessons = [];
  
  // Detectar dias da semana do horário
  let targetDay = 1; // Segunda por padrão
  const scheduleLower = course.schedule.toLowerCase();
  
  if (scheduleLower.includes('segunda')) {
    targetDay = 1; // Segunda-feira
  } else if (scheduleLower.includes('terça')) {
    targetDay = 2; // Terça-feira
  } else if (scheduleLower.includes('quarta')) {
    targetDay = 3; // Quarta-feira
  } else if (scheduleLower.includes('quinta')) {
    targetDay = 4; // Quinta-feira
  } else if (scheduleLower.includes('sexta')) {
    targetDay = 5; // Sexta-feira
  }
  
  // Encontrar a primeira data com o dia da semana correto
  let currentDate = new Date(startDate);
  const daysToAdd = (targetDay - currentDate.getDay() + 7) % 7;
  if (daysToAdd > 0) {
    currentDate.setDate(currentDate.getDate() + daysToAdd);
  } else if (currentDate.getDay() !== targetDay) {
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  // Criar 16 aulas (semestre - 2 aulas por semana)
  for (let i = 0; i < 16; i++) {
    const lessonDate = new Date(currentDate);
    lessonDate.setDate(currentDate.getDate() + (i * 7));
    
    // Garantir que é o dia correto da semana
    const dayDiff = (targetDay - lessonDate.getDay() + 7) % 7;
    if (dayDiff !== 0) {
      lessonDate.setDate(lessonDate.getDate() + dayDiff);
    }
    
    lessons.push({
      course: course._id,
      title: `Aula ${i + 1} - ${course.name}`,
      description: `Conteúdo da aula ${i + 1} do curso ${course.name}`,
      date: lessonDate,
      resources: []
    });
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
  
  // P2 - 2 meses após início
  const p2Date = new Date(semesterStart);
  p2Date.setMonth(p2Date.getMonth() + 2);
  
  // Prova Final - 3 meses após início
  const finalDate = new Date(semesterStart);
  finalDate.setMonth(finalDate.getMonth() + 3);
  
  exams.push(
    {
      course: course._id,
      title: `P1 - ${course.name}`,
      description: 'Primeira avaliação parcial',
      date: p1Date,
      maxGrade: 10,
      weight: 0.3
    },
    {
      course: course._id,
      title: `P2 - ${course.name}`,
      description: 'Segunda avaliação parcial',
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

async function seedDatabase() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado ao MongoDB');

    // Limpar cursos existentes (opcional - comentar se quiser manter)
    // await Course.deleteMany({});
    // await Lesson.deleteMany({});
    // await Exam.deleteMany({});
    // console.log('🗑️ Cursos, aulas e provas antigas removidas');

    const semesterStartDate = new Date();
    semesterStartDate.setMonth(semesterStartDate.getMonth() - 1); // Começar 1 mês atrás

    for (const courseData of courses) {
      // Verificar se curso já existe
      let course = await Course.findOne({ code: courseData.code });
      
      if (!course) {
        // Criar curso
        course = await Course.create(courseData);
        console.log(`✅ Curso criado: ${course.code} - ${course.name}`);

        // Criar aulas
        const lessonsData = generateLessons(course, semesterStartDate);
        await Lesson.insertMany(lessonsData);
        console.log(`   📚 ${lessonsData.length} aulas criadas`);

        // Criar provas
        const examsData = generateExams(course, semesterStartDate);
        await Exam.insertMany(examsData);
        console.log(`   📝 ${examsData.length} provas criadas`);
      } else {
        console.log(`⚠️ Curso já existe: ${course.code} - ${course.name}`);
        
        // Verificar se precisa adicionar aulas/provas
        const existingLessons = await Lesson.countDocuments({ course: course._id });
        const existingExams = await Exam.countDocuments({ course: course._id });
        
        if (existingLessons === 0) {
          const lessonsData = generateLessons(course, semesterStartDate);
          await Lesson.insertMany(lessonsData);
          console.log(`   📚 ${lessonsData.length} aulas adicionadas`);
        }
        
        if (existingExams === 0) {
          const examsData = generateExams(course, semesterStartDate);
          await Exam.insertMany(examsData);
          console.log(`   📝 ${examsData.length} provas adicionadas`);
        }
      }
    }

    console.log('\n🎉 Seeding concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no seeding:', error);
    process.exit(1);
  }
}

seedDatabase();
