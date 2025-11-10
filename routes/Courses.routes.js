const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');
const CoursesController = require('../controllers/Courses.controller');

const router = express.Router();

// Listar todos os cursos (público - necessário para registro)
router.get('/', CoursesController.getAll);

// Buscar curso por ID
router.get('/:id', authenticateToken, CoursesController.getById);

// CRUD - Apenas admin e teacher
router.post('/', authenticateToken, authorize('admin', 'teacher'), CoursesController.create);
router.put('/:id', authenticateToken, authorize('admin', 'teacher'), CoursesController.update);
router.delete('/:id', authenticateToken, authorize('admin', 'teacher'), CoursesController.remove);

// Gerenciar alunos no curso
router.post('/:id/students', authenticateToken, authorize('admin', 'teacher'), CoursesController.addStudent);
router.delete('/:id/students', authenticateToken, authorize('admin', 'teacher'), CoursesController.removeStudent);

module.exports = router;
