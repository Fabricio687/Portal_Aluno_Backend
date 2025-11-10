const Course = require('../models/Course');
const User = require('../models/User');

// Listar todos os cursos
exports.getAll = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('students', 'name email registration')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      data: courses,
      count: courses.length
    });
  } catch (error) {
    console.error('Erro ao listar cursos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar cursos',
      error: error.message
    });
  }
};

// Buscar curso por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id)
      .populate('students', 'name email registration');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Erro ao buscar curso:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar curso',
      error: error.message
    });
  }
};

// Criar curso
exports.create = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    const populated = await Course.findById(course._id)
      .populate('students', 'name email registration');
    
    res.status(201).json({
      success: true,
      message: 'Curso criado com sucesso',
      data: populated
    });
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Código do curso já existe'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro ao criar curso',
      error: error.message
    });
  }
};

// Atualizar curso
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Course.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('students', 'name email registration');
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Curso não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Curso atualizado com sucesso',
      data: updated
    });
  } catch (error) {
    console.error('Erro ao atualizar curso:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar curso',
      error: error.message
    });
  }
};

// Deletar curso
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Course.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Curso não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Curso removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover curso:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover curso',
      error: error.message
    });
  }
};

// Adicionar aluno ao curso
exports.addStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;
    
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso não encontrado'
      });
    }
    
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Aluno não encontrado'
      });
    }
    
    if (course.students.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Aluno já está inscrito no curso'
      });
    }
    
    course.students.push(studentId);
    await course.save();
    
    const populated = await Course.findById(id)
      .populate('students', 'name email registration');
    
    res.json({
      success: true,
      message: 'Aluno adicionado ao curso com sucesso',
      data: populated
    });
  } catch (error) {
    console.error('Erro ao adicionar aluno:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar aluno',
      error: error.message
    });
  }
};

// Remover aluno do curso
exports.removeStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;
    
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso não encontrado'
      });
    }
    
    course.students = course.students.filter(s => s.toString() !== studentId);
    await course.save();
    
    const populated = await Course.findById(id)
      .populate('students', 'name email registration');
    
    res.json({
      success: true,
      message: 'Aluno removido do curso com sucesso',
      data: populated
    });
  } catch (error) {
    console.error('Erro ao remover aluno:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover aluno',
      error: error.message
    });
  }
};


