const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');
const ExamsController = require('../controllers/Exams.controller');

const router = express.Router();

// Listar provas por curso (alunos e staff)
router.get('/course/:courseId', authenticateToken, ExamsController.listByCourse);

// Staff CRUD
router.post('/', authenticateToken, authorize('admin', 'teacher'), ExamsController.create);
router.put('/:id', authenticateToken, authorize('admin', 'teacher'), ExamsController.update);
router.delete('/:id', authenticateToken, authorize('admin', 'teacher'), ExamsController.remove);

module.exports = router;


