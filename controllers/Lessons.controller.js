const Lesson = require('../models/Lesson');
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
    
    // Se encontrou um curso, buscar aulas pelo ObjectId
    if (course) {
      const lessons = await Lesson.find({ course: course._id })
        .populate('course', 'name code')
        .sort({ date: -1 });
      
      return res.json({
        success: true,
        data: lessons,
        count: lessons.length
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
    console.error('Erro ao listar aulas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar aulas',
      error: error.message
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { course, title, description, date, resources } = req.body;
    
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
    
    const lesson = await Lesson.create({
      course: course || null,
      title,
      description: description || '',
      date: date ? new Date(date) : new Date(),
      resources: resources || []
    });
    
    const populated = await Lesson.findById(lesson._id)
      .populate('course', 'name code');
    
    res.status(201).json({
      success: true,
      message: 'Aula criada com sucesso',
      data: populated
    });
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    
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
      message: 'Erro ao criar aula',
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
    
    const updated = await Lesson.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('course', 'name code');
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Aula não encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Aula atualizada com sucesso',
      data: updated
    });
  } catch (error) {
    console.error('Erro ao atualizar aula:', error);
    
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
      message: 'Erro ao atualizar aula',
      error: error.message
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Lesson.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Aula não encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Aula removida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover aula:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover aula',
      error: error.message
    });
  }
};


