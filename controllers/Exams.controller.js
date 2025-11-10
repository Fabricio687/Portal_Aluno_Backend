const Exam = require('../models/Exam');
const Course = require('../models/Course');

exports.listByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Verificar se courseId é um ObjectId válido ou buscar pelo nome/código
    let course = null;
    const mongoose = require('mongoose');
    
    if (mongoose.Types.ObjectId.isValid(courseId)) {
      course = await Course.findById(courseId);
    } else {
      // Buscar por nome ou código do curso
      course = await Course.findOne({ 
        $or: [
          { name: { $regex: courseId, $options: 'i' } },
          { code: { $regex: courseId, $options: 'i' } }
        ]
      });
    }
    
    // Se encontrou um curso, buscar provas pelo ObjectId
    if (course) {
      const exams = await Exam.find({ course: course._id })
        .populate('course', 'name code')
        .sort({ date: -1 });
      
      return res.json({
        success: true,
        data: exams,
        count: exams.length
      });
    }
    
    // Se não encontrou curso, retornar array vazio ao invés de erro
    res.json({
      success: true,
      data: [],
      count: 0,
      message: 'Nenhum curso encontrado com esse identificador'
    });
  } catch (error) {
    console.error('Erro ao listar provas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar provas',
      error: error.message
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { course, title, description, date, maxGrade, weight } = req.body;
    
    // Validar se curso existe
    if (course) {
      const courseExists = await Course.findById(course);
      if (!courseExists) {
        return res.status(404).json({
          success: false,
          message: 'Curso não encontrado'
        });
      }
    }
    
    const exam = await Exam.create({
      course: course || null,
      title,
      description: description || '',
      date: date ? new Date(date) : new Date(),
      maxGrade: maxGrade || 100,
      weight: weight || 0.3
    });
    
    const populated = await Exam.findById(exam._id)
      .populate('course', 'name code');
    
    res.status(201).json({
      success: true,
      message: 'Prova criada com sucesso',
      data: populated
    });
  } catch (error) {
    console.error('Erro ao criar prova:', error);
    
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
      message: 'Erro ao criar prova',
      error: error.message
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    
    // Converter date se fornecido
    if (updates.date) {
      updates.date = new Date(updates.date);
    }
    
    const updated = await Exam.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('course', 'name code');
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Prova não encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Prova atualizada com sucesso',
      data: updated
    });
  } catch (error) {
    console.error('Erro ao atualizar prova:', error);
    
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
      message: 'Erro ao atualizar prova',
      error: error.message
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Exam.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Prova não encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Prova removida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover prova:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover prova',
      error: error.message
    });
  }
};


