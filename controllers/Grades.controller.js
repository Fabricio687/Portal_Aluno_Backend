// backend/controllers/Grades.controller.js
const Grade = require('../models/Grade');
const User = require('../models/User');

// Buscar notas do aluno autenticado
exports.getGradesByStudent = async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.user.id })
      .populate('course', 'name code')
      .sort({ date: -1 });
    
    res.json({
      success: true,
      data: grades,
      count: grades.length
    });
  } catch (error) {
    console.error('Erro ao buscar notas:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao buscar notas',
      error: error.message 
    });
  }
};

// Buscar todas as notas (staff vê todas, student vê apenas as suas)
exports.getAllGrades = async (req, res) => {
  try {
    const query = (req.user.role === 'student') 
      ? { student: req.user.id }
      : {};
    
    const grades = await Grade.find(query)
      .populate('student', 'name email registration')
      .populate('course', 'name code')
      .sort({ date: -1 });
    
    res.json({
      success: true,
      data: grades,
      count: grades.length
    });
  } catch (error) {
    console.error('Erro ao buscar notas:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao buscar notas',
      error: error.message 
    });
  }
};

// Buscar notas de um aluno específico (apenas staff)
exports.getGradesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Aluno não encontrado'
      });
    }
    
    const grades = await Grade.find({ student: studentId })
      .populate('course', 'name code')
      .sort({ date: -1 });
    
    res.json({
      success: true,
      data: grades,
      count: grades.length,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        registration: student.registration
      }
    });
  } catch (error) {
    console.error('Erro ao buscar notas do aluno:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao buscar notas do aluno',
      error: error.message 
    });
  }
};

// Buscar nota específica
exports.getGradeById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate('student', 'name email registration')
      .populate('course', 'name code');
    
    if (!grade) {
      return res.status(404).json({ 
        success: false,
        message: 'Nota não encontrada' 
      });
    }
    
    res.json({
      success: true,
      data: grade
    });
  } catch (error) {
    console.error('Erro ao buscar nota:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao buscar nota',
      error: error.message 
    });
  }
};

// Criar nova nota (professor/admin)
exports.createGrade = async (req, res) => {
  try {
    const { student, course, courseName, grade, maxGrade, type, date, weight, description } = req.body;
    
    // Validações
    if (!student || !courseName || grade === undefined || !type) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: student, courseName, grade, type'
      });
    }
    
    const newGrade = new Grade({
      student,
      course: course || null,
      courseName,
      grade,
      maxGrade: maxGrade || 100,
      type,
      date: date ? new Date(date) : new Date(),
      weight: weight || 0.3,
      description: description || ''
    });
    
    await newGrade.save();
    
    const populatedGrade = await Grade.findById(newGrade._id)
      .populate('student', 'name email registration')
      .populate('course', 'name code');
    
    res.status(201).json({
      success: true,
      message: 'Nota criada com sucesso',
      data: populatedGrade
    });
  } catch (error) {
    console.error('Erro ao criar nota:', error);
    
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
      message: 'Erro ao criar nota',
      error: error.message 
    });
  }
};

// Atualizar nota (professor/admin)
exports.updateGrade = async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Converter date se fornecido
    if (updates.date) {
      updates.date = new Date(updates.date);
    }
    
    const updatedGrade = await Grade.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('student', 'name email registration')
      .populate('course', 'name code');
    
    if (!updatedGrade) {
      return res.status(404).json({ 
        success: false,
        message: 'Nota não encontrada' 
      });
    }
    
    res.json({
      success: true,
      message: 'Nota atualizada com sucesso',
      data: updatedGrade
    });
  } catch (error) {
    console.error('Erro ao atualizar nota:', error);
    
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
      message: 'Erro ao atualizar nota',
      error: error.message 
    });
  }
};

// Deletar nota (professor/admin)
exports.deleteGrade = async (req, res) => {
  try {
    const deletedGrade = await Grade.findByIdAndDelete(req.params.id);
    
    if (!deletedGrade) {
      return res.status(404).json({ 
        success: false,
        message: 'Nota não encontrada' 
      });
    }
    
    res.json({
      success: true,
      message: 'Nota deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar nota:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao deletar nota',
      error: error.message 
    });
  }
};
