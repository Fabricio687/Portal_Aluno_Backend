const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const AttendanceController = require('../controllers/Attendance.controller');

// Rotas para alunos visualizarem suas faltas
router.get('/my-attendances', protect, AttendanceController.getMyAttendances);
router.get('/course/:courseId', protect, AttendanceController.getAttendancesByCourse);

// Rotas para admin/professor gerenciarem faltas
router.post('/', protect, AttendanceController.createAttendance);
router.post('/multiple', protect, AttendanceController.createMultipleAttendances);
router.get('/course/:courseId/students', protect, AttendanceController.getCourseStudents);
router.put('/:id', protect, AttendanceController.updateAttendance);
router.delete('/:id', protect, AttendanceController.deleteAttendance);

module.exports = router;




