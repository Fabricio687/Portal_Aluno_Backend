// backend/routes/index.js
const express = require('express');
const router = express.Router();

// Rota raiz da API
router.get('/', (req, res) => {
  res.json({
    message: 'Portal do Aluno API - Funcionando!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      grades: '/api/grades',
      lessons: '/api/lessons',
      exams: '/api/exams',
      courses: '/api/courses',
      users: '/api/users',
      dashboard: '/api/dashboard',
      messages: '/api/messages',
      attendance: '/api/attendance'
    }
  });
});

// Importar todas as rotas
const authRoutes = require('./auth');
const calendarRoutes = require('./Calendar.routes');
const messageRoutes = require('./Messages.routes');
const dashboardRoutes = require('./Dashboard.routes');
const certificateRoutes = require('./Certificate.routes');
const attendanceRoutes = require('./Attendance.routes');

// Importar rotas de notas, aulas e provas
const gradesRoutes = require('./Grades.routes');
const lessonsRoutes = require('./Lessons.routes');
const examsRoutes = require('./Exams.routes');
const coursesRoutes = require('./Courses.routes');
const usersRoutes = require('./Users.routes');

// Importar rota de busca
const searchController = require('../controllers/Search.controller');
const { protect } = require('../middleware/auth');

// Definir rotas ativas
router.use('/auth', authRoutes);
router.use('/calendar', calendarRoutes);
router.use('/messages', messageRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/certificates', certificateRoutes);
router.use('/attendance', attendanceRoutes);

// Rotas de notas, aulas e provas
router.use('/grades', gradesRoutes);
router.use('/lessons', lessonsRoutes);
router.use('/exams', examsRoutes);
router.use('/courses', coursesRoutes);
router.use('/users', usersRoutes);

// Rota de busca global
router.get('/search', protect, searchController.search);

module.exports = router;
