/**
 * Script de Diagnóstico Completo do Sistema
 * Verifica todos os componentes e identifica problemas
 */

require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
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

const { DB_USER, DB_PASS, DB_NAME, MONGODB_URI } = process.env;

let uri;
if (MONGODB_URI) {
  uri = MONGODB_URI;
} else if (DB_USER && DB_PASS && DB_NAME) {
  uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.7hrgleb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
} else {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

async function diagnoseAll() {
  const issues = [];
  const warnings = [];
  
  try {
    console.log('\n🔍 DIAGNÓSTICO COMPLETO DO SISTEMA\n');
    console.log('='.repeat(60));
    
    // 1. Conectar ao MongoDB
    console.log('\n1️⃣ Conectando ao MongoDB...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Conectado ao MongoDB');
    
    // 2. Verificar dados básicos
    console.log('\n2️⃣ Verificando dados básicos...');
    const usersCount = await User.countDocuments();
    const coursesCount = await Course.countDocuments();
    const lessonsCount = await Lesson.countDocuments();
    const examsCount = await Exam.countDocuments();
    
    console.log(`   Usuários: ${usersCount}`);
    console.log(`   Cursos: ${coursesCount}`);
    console.log(`   Aulas: ${lessonsCount}`);
    console.log(`   Provas: ${examsCount}`);
    
    if (usersCount === 0) {
      issues.push('Nenhum usuário encontrado. Execute: npm run seed:full');
    }
    if (coursesCount === 0) {
      issues.push('Nenhum curso encontrado. Execute: npm run seed:full');
    }
    
    // 3. Verificar integridade dos dados
    console.log('\n3️⃣ Verificando integridade dos dados...');
    
    // Verificar cursos sem alunos
    const coursesWithoutStudents = await Course.find({ 
      $or: [
        { students: { $exists: false } },
        { students: { $size: 0 } }
      ]
    });
    if (coursesWithoutStudents.length > 0) {
      warnings.push(`${coursesWithoutStudents.length} curso(s) sem alunos`);
    }
    
    // Verificar aulas sem curso válido
    const lessonsWithoutCourse = await Lesson.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseData'
        }
      },
      {
        $match: {
          courseData: { $size: 0 }
        }
      }
    ]);
    if (lessonsWithoutCourse.length > 0) {
      warnings.push(`${lessonsWithoutCourse.length} aula(s) com curso inválido`);
    }
    
    // Verificar provas sem curso válido
    const examsWithoutCourse = await Exam.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseData'
        }
      },
      {
        $match: {
          courseData: { $size: 0 }
        }
      }
    ]);
    if (examsWithoutCourse.length > 0) {
      warnings.push(`${examsWithoutCourse.length} prova(s) com curso inválido`);
    }
    
    // Verificar notas sem aluno válido
    const gradesWithoutStudent = await Grade.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'student',
          foreignField: '_id',
          as: 'studentData'
        }
      },
      {
        $match: {
          studentData: { $size: 0 }
        }
      }
    ]);
    if (gradesWithoutStudent.length > 0) {
      warnings.push(`${gradesWithoutStudent.length} nota(s) com aluno inválido`);
    }
    
    // Verificar presenças sem aluno válido
    const attendancesWithoutStudent = await Attendance.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'student',
          foreignField: '_id',
          as: 'studentData'
        }
      },
      {
        $match: {
          studentData: { $size: 0 }
        }
      }
    ]);
    if (attendancesWithoutStudent.length > 0) {
      warnings.push(`${attendancesWithoutStudent.length} presença(s) com aluno inválido`);
    }
    
    // 4. Verificar professores e seus cursos
    console.log('\n4️⃣ Verificando professores e cursos...');
    const teachers = await User.find({ role: 'teacher' });
    console.log(`   Professores encontrados: ${teachers.length}`);
    
    for (const teacher of teachers) {
      const teacherCourses = await Course.find({ professor: teacher.name });
      if (teacherCourses.length === 0) {
        warnings.push(`Professor ${teacher.name} não tem cursos atribuídos`);
      } else {
        console.log(`   ✅ ${teacher.name}: ${teacherCourses.length} curso(s)`);
      }
    }
    
    // 5. Verificar alunos e seus cursos
    console.log('\n5️⃣ Verificando alunos e cursos...');
    const students = await User.find({ role: 'student' }).limit(10);
    console.log(`   Verificando ${students.length} alunos (amostra)...`);
    
    let studentsWithoutCourses = 0;
    for (const student of students) {
      const studentCourses = await Course.find({ students: student._id });
      if (studentCourses.length === 0) {
        studentsWithoutCourses++;
      }
    }
    if (studentsWithoutCourses > 0) {
      warnings.push(`${studentsWithoutCourses} aluno(s) sem cursos (amostra)`);
    }
    
    // 6. Verificar dados recentes
    console.log('\n6️⃣ Verificando dados recentes...');
    const recentLessons = await Lesson.find().sort({ createdAt: -1 }).limit(5);
    const recentExams = await Exam.find().sort({ createdAt: -1 }).limit(5);
    const recentGrades = await Grade.find().sort({ createdAt: -1 }).limit(5);
    
    console.log(`   Últimas aulas criadas: ${recentLessons.length}`);
    console.log(`   Últimas provas criadas: ${recentExams.length}`);
    console.log(`   Últimas notas criadas: ${recentGrades.length}`);
    
    // 7. Resumo
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO DO DIAGNÓSTICO');
    console.log('='.repeat(60));
    
    if (issues.length === 0 && warnings.length === 0) {
      console.log('\n✅ Nenhum problema encontrado! Sistema está funcionando corretamente.\n');
    } else {
      if (issues.length > 0) {
        console.log('\n❌ PROBLEMAS CRÍTICOS:');
        issues.forEach((issue, i) => {
          console.log(`   ${i + 1}. ${issue}`);
        });
      }
      
      if (warnings.length > 0) {
        console.log('\n⚠️  AVISOS:');
        warnings.forEach((warning, i) => {
          console.log(`   ${i + 1}. ${warning}`);
        });
      }
    }
    
    console.log('\n💡 RECOMENDAÇÕES:');
    console.log('   1. Execute: npm run seed:full (se houver dados faltando)');
    console.log('   2. Verifique os logs do backend para erros');
    console.log('   3. Teste as rotas principais no frontend');
    console.log('   4. Verifique se o MongoDB está acessível\n');
    
    await mongoose.disconnect();
    process.exit(issues.length > 0 ? 1 : 0);
  } catch (error) {
    console.error('\n❌ Erro no diagnóstico:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

diagnoseAll();

