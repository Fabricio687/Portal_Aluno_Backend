// backend/routes/Grades.routes.js
const express = require('express');
const router = express.Router();
const gradesController = require('../controllers/Grades.controller');
const { authenticateToken, authorize } = require('../middleware/auth');

// GET /api/grades/me - Buscar todas as notas do aluno autenticado
router.get('/me', authenticateToken, gradesController.getGradesByStudent);

// GET /api/grades - Buscar todas as notas (staff: todas, student: apenas suas)
router.get('/', authenticateToken, gradesController.getAllGrades);

// GET /api/grades/student/:studentId - Buscar notas de um aluno específico (staff)
router.get('/student/:studentId', authenticateToken, authorize('teacher', 'admin'), gradesController.getGradesByStudentId);

// GET /api/grades/:id - Buscar nota específica
router.get('/:id', authenticateToken, gradesController.getGradeById);

// POST /api/grades - Criar nova nota (professor/admin)
router.post('/', authenticateToken, authorize('teacher', 'admin'), gradesController.createGrade);

// PUT /api/grades/:id - Atualizar nota (professor/admin)
router.put('/:id', authenticateToken, authorize('teacher', 'admin'), gradesController.updateGrade);

// DELETE /api/grades/:id - Deletar nota (professor/admin)
router.delete('/:id', authenticateToken, authorize('teacher', 'admin'), gradesController.deleteGrade);

module.exports = router;
