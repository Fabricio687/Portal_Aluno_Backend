const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Exam = require('../models/Exam');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');

// Obter estatísticas do dashboard para alunos
exports.getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Verificar se userId é válido
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuário inválido'
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Buscar cursos onde o aluno está inscrito
    const courses = await Course.find({ students: userObjectId }).select('_id name code').lean();
    const courseIds = courses.map(c => c._id);

    // Estatísticas de presença (otimizado com agregação)
    let attendanceStats = [];
    try {
      attendanceStats = await Attendance.aggregate([
        { $match: { student: userObjectId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
    } catch (err) {
      console.error('Erro ao buscar estatísticas de presença:', err);
      attendanceStats = [];
    }
    
    const totalClasses = attendanceStats.reduce((sum, stat) => sum + stat.count, 0);
    const presentClasses = attendanceStats.find(s => s._id === 'present')?.count || 0;
    const attendanceRate = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

    // Próximas aulas e provas em paralelo
    const currentDate = new Date();
    let nextLessons = [];
    let nextExams = [];

    try {
      if (courseIds.length > 0) {
        [nextLessons, nextExams] = await Promise.all([
          Lesson.find({
            course: { $in: courseIds },
            date: { $gte: currentDate }
          })
            .sort({ date: 1 })
            .limit(5)
            .populate('course', 'name code')
            .lean(),
          Exam.find({
            course: { $in: courseIds },
            date: { $gte: currentDate }
          })
            .sort({ date: 1 })
            .limit(5)
            .populate('course', 'name code')
            .lean()
        ]);
      }
    } catch (err) {
      console.error('Erro ao buscar aulas e provas:', err);
      nextLessons = [];
      nextExams = [];
    }

    // Notas recentes (sem populate de exam que não existe)
    let recentGrades = [];
    try {
      const gradesQuery = await Grade.find({ student: userObjectId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();
      
      // Populate manual do course para cada nota (mais seguro)
      recentGrades = await Promise.all(
        gradesQuery.map(async (grade) => {
          let courseInfo = null;
          
          // Tentar buscar curso se tiver ObjectId válido
          if (grade.course) {
            try {
              const courseId = typeof grade.course === 'string' 
                ? grade.course 
                : grade.course.toString();
              
              if (mongoose.Types.ObjectId.isValid(courseId)) {
                courseInfo = await Course.findById(courseId).select('name code').lean();
              }
            } catch (err) {
              console.error('Erro ao buscar curso da nota:', err);
            }
          }
          
          return {
            _id: grade._id,
            student: grade.student,
            course: courseInfo || { name: grade.courseName || 'Curso não encontrado', code: '' },
            courseName: grade.courseName,
            grade: grade.grade,
            maxGrade: grade.maxGrade,
            type: grade.type,
            date: grade.date,
            weight: grade.weight,
            description: grade.description,
            createdAt: grade.createdAt,
            updatedAt: grade.updatedAt
          };
        })
      );
    } catch (err) {
      console.error('Erro ao buscar notas:', err);
      recentGrades = [];
    }

    // Média geral (otimizado com agregação)
    let overallAverage = 0;
    try {
      const gradeStats = await Grade.aggregate([
        { $match: { student: userObjectId } },
        {
          $group: {
            _id: null,
            average: { $avg: '$grade' },
            count: { $sum: 1 }
          }
        }
      ]);
      overallAverage = gradeStats.length > 0 && gradeStats[0].average ? gradeStats[0].average : 0;
    } catch (err) {
      console.error('Erro ao calcular média:', err);
      overallAverage = 0;
    }

    res.status(200).json({
      success: true,
      data: {
        attendanceStats: {
          totalClasses,
          presentClasses,
          attendanceRate: parseFloat(attendanceRate.toFixed(2))
        },
        nextLessons: nextLessons || [],
        nextExams: nextExams || [],
        recentGrades: recentGrades || [],
        overallAverage: parseFloat(overallAverage.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Erro completo no dashboard do aluno:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados do dashboard',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor'
    });
  }
};

// Obter estatísticas do dashboard para professores
exports.getTeacherDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar cursos onde o professor (nome) corresponde ao nome do usuário
    const user = await User.findById(userId);
    const courses = await Course.find({ professor: user?.name || '' });
    const courseIds = courses.map(c => c._id);

    // Próximas aulas a ministrar (aulas dos cursos do professor)
    const currentDate = new Date();
    const nextLessons = await Lesson.find({
      course: courseIds.length > 0 ? { $in: courseIds } : { $exists: false },
      date: { $gte: currentDate }
    })
      .sort({ date: 1 })
      .limit(5)
      .populate('course', 'name code');

    // Próximas provas a aplicar (provas dos cursos do professor)
    const nextExams = await Exam.find({
      course: courseIds.length > 0 ? { $in: courseIds } : { $exists: false },
      date: { $gte: currentDate }
    })
      .sort({ date: 1 })
      .limit(5)
      .populate('course', 'name code');

    // Estatísticas de alunos por curso
    const courseStats = [];

    for (const course of courses) {
      // Contar alunos pelo nome do curso (campo course é string no User)
      const studentsCount = await User.countDocuments({
        course: course.name,
        role: 'student'
      });

      const gradesAvg = await Grade.aggregate([
        { $match: { course: course._id } },
        { $group: { _id: null, average: { $avg: '$grade' } } }
      ]);

      courseStats.push({
        course: {
          _id: course._id,
          name: course.name,
          code: course.code
        },
        studentsCount,
        gradesAverage: gradesAvg.length > 0 ? gradesAvg[0].average.toFixed(2) : 0
      });
    }

    res.status(200).json({
      success: true,
      data: {
        nextLessons,
        nextExams,
        courseStats,
        totalCourses: courses.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados do dashboard',
      error: error.message
    });
  }
};

// Obter estatísticas do dashboard para administradores
exports.getAdminDashboard = async (req, res) => {
  try {
    // Contagem de usuários por tipo
    const studentsCount = await User.countDocuments({ role: 'student' });
    const teachersCount = await User.countDocuments({ role: 'teacher' });
    const adminsCount = await User.countDocuments({ role: 'admin' });

    // Contagem de cursos
    const coursesCount = await Course.countDocuments();

    // Estatísticas de notas
    const gradesStats = await Grade.aggregate([
      { $group: { _id: null, average: { $avg: '$grade' } } }
    ]);

    // Estatísticas de presença
    const attendanceStats = await Attendance.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Formatar estatísticas de presença
    const formattedAttendance = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      justified: 0
    };
    attendanceStats.forEach(stat => {
      if (stat._id) {
        formattedAttendance[stat._id] = stat.count;
        // 'excused' também conta como 'justified'
        if (stat._id === 'excused') {
          formattedAttendance.justified = (formattedAttendance.justified || 0) + stat.count;
        }
      }
    });

    // Cursos mais populares (contar alunos pelo nome do curso)
    const allCourses = await Course.find().select('name code').lean();
    const popularCourses = await Promise.all(
      allCourses.map(async (course) => {
        const studentsCount = await User.countDocuments({
          course: course.name,
          role: 'student'
        });
        return {
          _id: course._id,
          name: course.name,
          code: course.code,
          studentsCount
        };
      })
    );
    
    // Ordenar por número de alunos e pegar os 5 primeiros
    popularCourses.sort((a, b) => b.studentsCount - a.studentsCount);
    const topPopularCourses = popularCourses.slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        usersStats: {
          students: studentsCount,
          teachers: teachersCount,
          admins: adminsCount,
          total: studentsCount + teachersCount + adminsCount
        },
        coursesCount,
        gradesAverage: gradesStats.length > 0 && gradesStats[0].average ? gradesStats[0].average.toFixed(2) : '0.00',
        attendanceStats: formattedAttendance,
        popularCourses: topPopularCourses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados do dashboard',
      error: error.message
    });
  }
};

// Obter dashboard baseado no papel do usuário
exports.getDashboard = async (req, res) => {
  try {
    const userRole = req.user.role;

    switch (userRole) {
      case 'student':
        return await exports.getStudentDashboard(req, res);
      case 'teacher':
        return await exports.getTeacherDashboard(req, res);
      case 'admin':
        return await exports.getAdminDashboard(req, res);
      default:
        return res.status(403).json({
          success: false,
          message: 'Papel de usuário não suportado'
        });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados do dashboard',
      error: error.message
    });
  }
};

// Método index para compatibilidade (usa getDashboard)
exports.index = exports.getDashboard;