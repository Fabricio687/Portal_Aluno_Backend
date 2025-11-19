/**
 * Script para verificar se os dados estão no banco e acessíveis
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

async function verifyData() {
  try {
    console.log('\n🔍 Verificando dados no banco...\n');
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('✅ Conectado ao MongoDB\n');
    
    const collections = {
      'users': User,
      'courses': Course,
      'lessons': Lesson,
      'exams': Exam,
      'grades': Grade,
      'attendances': Attendance,
      'messages': Message,
      'documents': Document,
      'spots': Spots,
      'bookings': Booking,
      'calendarevents': CalendarEvent,
      'certificates': Certificate,
      'notifications': Notification
    };
    
    console.log('📊 Contagem de documentos por coleção:\n');
    
    for (const [name, Model] of Object.entries(collections)) {
      try {
        const count = await Model.countDocuments();
        const sample = await Model.findOne();
        
        console.log(`   ${name.padEnd(20)}: ${count.toString().padStart(5)} documentos`);
        
        if (count > 0 && sample) {
          console.log(`   ${' '.repeat(20)}  ✅ Dados encontrados (exemplo: ${sample._id})`);
        } else if (count === 0) {
          console.log(`   ${' '.repeat(20)}  ⚠️  Coleção vazia!`);
        }
      } catch (error) {
        console.log(`   ${name.padEnd(20)}: ❌ Erro - ${error.message}`);
      }
    }
    
    // Verificar alguns dados específicos
    console.log('\n🔍 Verificando dados específicos:\n');
    
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      console.log(`   ✅ Admin encontrado: ${admin.email}`);
    } else {
      console.log(`   ❌ Admin não encontrado!`);
    }
    
    const teachers = await User.countDocuments({ role: 'teacher' });
    console.log(`   ${teachers > 0 ? '✅' : '❌'} Professores: ${teachers}`);
    
    const students = await User.countDocuments({ role: 'student' });
    console.log(`   ${students > 0 ? '✅' : '❌'} Alunos: ${students}`);
    
    const coursesWithStudents = await Course.countDocuments({ 
      students: { $exists: true, $ne: [] } 
    });
    console.log(`   ${coursesWithStudents > 0 ? '✅' : '❌'} Cursos com alunos: ${coursesWithStudents}`);
    
    console.log('\n✅ Verificação concluída!\n');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro na verificação:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

verifyData();

