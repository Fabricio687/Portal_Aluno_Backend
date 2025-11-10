const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Course = require('../models/Course');

// Obter faltas do aluno autenticado
exports.getMyAttendances = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Buscar todas as faltas do aluno
    const attendances = await Attendance.find({ student: userId })
      .sort({ date: -1 })
      .populate('course', 'name code');
    
    // Calcular estatísticas
    const totalClasses = attendances.length;
    const presentCount = attendances.filter(a => a.status === 'present').length;
    const absentCount = attendances.filter(a => a.status === 'absent').length;
    const lateCount = attendances.filter(a => a.status === 'late').length;
    const excusedCount = attendances.filter(a => a.status === 'excused').length;
    const attendanceRate = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(2) : 0;
    
    res.status(200).json({
      success: true,
      data: {
        attendances,
        stats: {
          total: totalClasses,
          present: presentCount,
          absent: absentCount,
          late: lateCount,
          excused: excusedCount,
          attendanceRate: parseFloat(attendanceRate)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar faltas',
      error: error.message
    });
  }
};

// Obter faltas por curso
exports.getAttendancesByCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;
    
    // Verificar se o curso existe
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso não encontrado'
      });
    }
    
    // Buscar faltas do aluno neste curso
    const attendances = await Attendance.find({ 
      student: userId,
      course: courseId
    })
      .sort({ date: -1 })
      .populate('course', 'name code');
    
    // Calcular estatísticas do curso
    const totalClasses = attendances.length;
    const presentCount = attendances.filter(a => a.status === 'present').length;
    const attendanceRate = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(2) : 0;
    
    res.status(200).json({
      success: true,
      data: {
        course: {
          _id: course._id,
          name: course.name,
          code: course.code
        },
        attendances,
        stats: {
          total: totalClasses,
          present: presentCount,
          absent: totalClasses - presentCount,
          attendanceRate: parseFloat(attendanceRate)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar faltas do curso',
      error: error.message
    });
  }
};

// Criar registro de presença (admin/professor apenas)
exports.createAttendance = async (req, res) => {
  try {
    const { studentId, courseId, courseName, date, status, justification, professor } = req.body;
    
    // Verificar se o aluno existe
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Aluno não encontrado'
      });
    }
    
    // Verificar se o curso existe (se courseId foi fornecido)
    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Curso não encontrado'
        });
      }
    }
    
    const attendance = await Attendance.create({
      student: studentId,
      course: courseId || null,
      courseName: courseName || '',
      date: date || new Date(),
      status,
      justification: justification || '',
      professor: professor || req.user.name || ''
    });
    
    await attendance.populate('student', 'name email registration');
    await attendance.populate('course', 'name code');
    
    res.status(201).json({
      success: true,
      message: 'Registro de presença criado com sucesso',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar registro de presença',
      error: error.message
    });
  }
};

// Atualizar registro de presença (admin/professor apenas)
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, justification } = req.body;
    
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Registro de presença não encontrado'
      });
    }
    
    if (status) attendance.status = status;
    if (justification !== undefined) attendance.justification = justification;
    
    await attendance.save();
    await attendance.populate('student', 'name email registration');
    await attendance.populate('course', 'name code');
    
    res.status(200).json({
      success: true,
      message: 'Registro de presença atualizado com sucesso',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar registro de presença',
      error: error.message
    });
  }
};

// Excluir registro de presença (admin/professor apenas)
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Registro de presença não encontrado'
      });
    }
    
    await attendance.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Registro de presença excluído com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir registro de presença',
      error: error.message
    });
  }
};
