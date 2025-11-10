const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');
const LessonsController = require('../controllers/Lessons.controller');

const router = express.Router();

// Listar aulas por curso (alunos e staff)
router.get('/course/:courseId', authenticateToken, LessonsController.listByCourse);

// Staff CRUD
router.post('/', authenticateToken, authorize('admin', 'teacher'), LessonsController.create);
router.put('/:id', authenticateToken, authorize('admin', 'teacher'), LessonsController.update);
router.delete('/:id', authenticateToken, authorize('admin', 'teacher'), LessonsController.remove);

module.exports = router;


