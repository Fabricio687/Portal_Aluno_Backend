const Document = require('../models/Document');
const User = require('../models/User');
const Course = require('../models/Course');
const path = require('path');
const fs = require('fs');

// Obter documentos do usuário autenticado
exports.getMyDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const documents = await Document.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('course', 'name code');
    
    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar documentos',
      error: error.message
    });
  }
};

// Obter documento por ID
exports.getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const document = await Document.findById(id)
      .populate('user', 'name email registration')
      .populate('course', 'name code');
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento não encontrado'
      });
    }
    
    // Verificar permissão: aluno vê só os próprios, professor/admin vê todos
    if (userRole === 'student' && document.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a acessar este documento'
      });
    }
    
    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar documento',
      error: error.message
    });
  }
};

// Upload de documento
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo enviado'
      });
    }
    
    const userId = req.user.id;
    const { title, description, category, courseId } = req.body;
    
    // Construir URL do arquivo
    const fileUrl = `/files/${req.file.filename}`;
    
    const document = await Document.create({
      title: title || req.file.originalname,
      description: description || '',
      fileUrl: fileUrl,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      category: category || 'outro',
      user: userId,
      course: courseId || null
    });
    
    await document.populate('course', 'name code');
    await document.populate('user', 'name email registration');
    
    res.status(201).json({
      success: true,
      message: 'Documento enviado com sucesso',
      data: document
    });
  } catch (error) {
    // Se houver erro, deletar arquivo enviado
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer upload do documento',
      error: error.message
    });
  }
};

// Obter documentos de alunos (para professores/admins)
exports.getStudentDocuments = async (req, res) => {
  try {
    const userRole = req.user.role;
    
    // Apenas professores e admins podem ver documentos de alunos
    if (userRole !== 'teacher' && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado'
      });
    }
    
    const { studentId, courseId, category } = req.query;
    const query = {};
    
    if (studentId) {
      query.user = studentId;
    }
    
    if (courseId) {
      query.course = courseId;
    }
    
    if (category) {
      query.category = category;
    }
    
    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email registration')
      .populate('course', 'name code');
    
    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar documentos',
      error: error.message
    });
  }
};

// Deletar documento
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento não encontrado'
      });
    }
    
    // Verificar permissão: aluno deleta só os próprios, admin deleta qualquer
    if (userRole === 'student' && document.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a deletar este documento'
      });
    }
    
    // Deletar arquivo físico
    if (document.fileUrl) {
      const fileName = path.basename(document.fileUrl);
      const filePath = path.join(__dirname, '../uploads', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await document.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Documento deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar documento',
      error: error.message
    });
  }
};

// Atualizar documento (apenas metadados)
exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, category, isPublic } = req.body;
    
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento não encontrado'
      });
    }
    
    // Verificar permissão: aluno atualiza só os próprios
    if (document.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a atualizar este documento'
      });
    }
    
    if (title) document.title = title;
    if (description !== undefined) document.description = description;
    if (category) document.category = category;
    if (isPublic !== undefined) document.isPublic = isPublic;
    
    await document.save();
    await document.populate('course', 'name code');
    await document.populate('user', 'name email registration');
    
    res.status(200).json({
      success: true,
      message: 'Documento atualizado com sucesso',
      data: document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar documento',
      error: error.message
    });
  }
};


