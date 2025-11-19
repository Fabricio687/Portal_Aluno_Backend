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
    const userRole = req.user.role;
    const userId = req.user.id;
    
    // Verificar se o usuário tem permissão (admin ou professor)
    if (userRole !== 'admin' && userRole !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas professores e administradores podem registrar presenças.'
      });
    }
    
    // Verificar se o aluno existe
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Aluno não encontrado'
      });
    }
    
    // Verificar se o curso existe (se courseId foi fornecido)
    let course = null;
    if (courseId) {
      course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Curso não encontrado'
        });
      }
      
      // Se for professor, verificar se ele leciona este curso
      if (userRole === 'teacher') {
        const user = await User.findById(userId);
        if (course.professor !== user.name) {
          return res.status(403).json({
            success: false,
            message: 'Você não tem permissão para registrar presenças neste curso'
          });
        }
      }
    }
    
    // Garantir que courseName tenha valor
    let finalCourseName = courseName || '';
    if (!finalCourseName && course) {
      finalCourseName = course.name;
    }
    if (!finalCourseName && courseId) {
      // Se não tem nome mas tem ID, buscar o curso
      const courseDoc = await Course.findById(courseId);
      if (courseDoc) {
        finalCourseName = courseDoc.name;
      }
    }
    
    const attendance = await Attendance.create({
      student: studentId,
      course: courseId || null,
      courseName: finalCourseName,
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

// Obter alunos de um curso (para professores)
exports.getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userRole = req.user.role;
    const userId = req.user.id;
    
    // Verificar se o usuário tem permissão
    if (userRole !== 'admin' && userRole !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }
    
    // Verificar se o curso existe e popular alunos
    const course = await Course.findById(courseId).populate('students', 'name email registration role');
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso não encontrado'
      });
    }
    
    // Se for professor, verificar se ele leciona este curso
    if (userRole === 'teacher') {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
      
      // Verificar se o professor leciona este curso (comparar nome)
      if (course.professor !== user.name) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para acessar este curso'
        });
      }
    }
    
    // Buscar alunos que estão inscritos no curso (array students no Course)
    let students = [];
    if (course.students && course.students.length > 0) {
      // Filtrar apenas alunos (pode ter outros tipos no array)
      students = course.students
        .filter(s => s.role === 'student')
        .map(s => ({
          _id: s._id,
          name: s.name,
          email: s.email,
          registration: s.registration
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Se não encontrou alunos no array, tentar fallback
    if (students.length === 0) {
      students = await User.find({
        course: course.name,
        role: 'student'
      }).select('name email registration').sort({ name: 1 }).lean();
    }
    
    res.status(200).json({
      success: true,
      data: {
        course: {
          _id: course._id,
          name: course.name,
          code: course.code
        },
        students
      }
    });
  } catch (error) {
    console.error('Erro ao buscar alunos do curso:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar alunos do curso',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor'
    });
  }
};

// Criar múltiplos registros de presença de uma vez
exports.createMultipleAttendances = async (req, res) => {
  try {
    const { courseId, date, attendances } = req.body; // attendances é array de {studentId, status, justification}
    const userRole = req.user.role;
    const userId = req.user.id;
    
    // Verificar se o usuário tem permissão
    if (userRole !== 'admin' && userRole !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }
    
    // Verificar se o curso existe
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso não encontrado'
      });
    }
    
    // Se for professor, verificar se ele leciona este curso
    if (userRole === 'teacher') {
      const user = await User.findById(userId);
      if (course.professor !== user.name) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para registrar presenças neste curso'
        });
      }
    }
    
    // Validar dados de entrada
    if (!attendances || !Array.isArray(attendances) || attendances.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lista de presenças vazia ou inválida'
      });
    }
    
    // Criar registros de presença com tratamento de erros individual
    const attendanceRecords = [];
    const errors = [];
    
    for (const att of attendances) {
      try {
        // Validar dados do registro
        if (!att.studentId) {
          errors.push(`Registro sem studentId`);
          continue;
        }
        
        if (!att.status) {
          errors.push(`Registro do aluno ${att.studentId} sem status`);
          continue;
        }
        
        // Verificar se o aluno existe
        const student = await User.findById(att.studentId);
        if (!student) {
          errors.push(`Aluno não encontrado: ${att.studentId}`);
          continue;
        }
        
        // Normalizar data para comparação (apenas data, sem hora)
        const attendanceDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(attendanceDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(attendanceDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        // Verificar se já existe registro para este aluno nesta data
        const existingAttendance = await Attendance.findOne({
          student: att.studentId,
          course: courseId,
          date: {
            $gte: startOfDay,
            $lte: endOfDay
          }
        });
        
        if (existingAttendance) {
          // Atualizar registro existente ao invés de criar novo
          existingAttendance.status = att.status;
          existingAttendance.justification = att.justification || '';
          await existingAttendance.save();
          attendanceRecords.push(existingAttendance);
        } else {
          // Criar novo registro
          const newAttendance = await Attendance.create({
            student: att.studentId,
            course: courseId,
            courseName: course.name,
            date: attendanceDate,
            status: att.status,
            justification: att.justification || '',
            professor: req.user.name || course.professor || ''
          });
          attendanceRecords.push(newAttendance);
        }
      } catch (err) {
        console.error(`Erro ao criar registro para aluno ${att.studentId}:`, err);
        errors.push(`Erro ao processar aluno ${att.studentId}: ${err.message}`);
      }
    }
    
    // Se não conseguiu criar nenhum registro, retornar erro
    if (attendanceRecords.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Não foi possível criar nenhum registro de presença',
        errors: errors
      });
    }
    
    // Popular os registros
    try {
      await Attendance.populate(attendanceRecords, [
        { path: 'student', select: 'name email registration' },
        { path: 'course', select: 'name code' }
      ]);
    } catch (populateErr) {
      console.error('Erro ao popular registros:', populateErr);
      // Continuar mesmo se populate falhar
    }
    
    const message = errors.length > 0
      ? `${attendanceRecords.length} registro(s) criado(s), ${errors.length} erro(s)`
      : `${attendanceRecords.length} registro(s) de presença criado(s) com sucesso`;
    
    res.status(201).json({
      success: true,
      message: message,
      data: attendanceRecords,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar registros de presença',
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
