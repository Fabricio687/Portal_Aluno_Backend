const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Exam = require('../models/Exam');
const CalendarEvent = require('../models/Calendar');

// Busca global em cursos, aulas, provas e eventos
exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.json({
        success: true,
        data: {
          courses: [],
          lessons: [],
          exams: [],
          events: []
        }
      });
    }
    
    const searchTerm = q.trim();
    const searchRegex = { $regex: searchTerm, $options: 'i' };
    
    // Buscar em paralelo
    const [courses, lessons, exams, events] = await Promise.all([
      // Buscar cursos
      Course.find({
        $or: [
          { name: searchRegex },
          { code: searchRegex }
        ]
      })
        .populate('students', 'name email registration')
        .limit(10)
        .lean(),
      
      // Buscar aulas
      Lesson.find({
        $or: [
          { title: searchRegex }
        ]
      })
        .populate('course', 'name code')
        .limit(10)
        .lean(),
      
      // Buscar provas
      Exam.find({
        $or: [
          { title: searchRegex }
        ]
      })
        .populate('course', 'name code')
        .limit(10)
        .lean(),
      
      // Buscar eventos do calendário
      CalendarEvent.find({
        $or: [
          { title: searchRegex }
        ]
      })
        .populate('course', 'name code')
        .limit(10)
        .lean()
    ]);
    
    res.json({
      success: true,
      data: {
        courses,
        lessons,
        exams,
        events,
        total: courses.length + lessons.length + exams.length + events.length
      }
    });
  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao realizar busca',
      error: error.message
    });
  }
};

module.exports = exports;

