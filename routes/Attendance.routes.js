const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const AttendanceController = require('../controllers/Attendance.controller');

// Rotas para alunos visualizarem suas faltas
router.get('/my-attendances', protect, AttendanceController.getMyAttendances);
router.get('/course/:courseId', protect, AttendanceController.getAttendancesByCourse);

// Rotas para admin/professor gerenciarem faltas
// Nota: Você pode adicionar middleware de autorização aqui se necessário
router.post('/', protect, AttendanceController.createAttendance);
router.put('/:id', protect, AttendanceController.updateAttendance);
router.delete('/:id', protect, AttendanceController.deleteAttendance);

module.exports = router;




