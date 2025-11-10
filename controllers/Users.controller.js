const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Listar usuários (filtrado por role se necessário)
exports.getAll = async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    
    // Não retornar senha
    const users = await User.find(query)
      .select('-password')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar usuários',
      error: error.message
    });
  }
};

// Buscar usuário por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário',
      error: error.message
    });
  }
};

// Criar usuário (admin apenas)
exports.create = async (req, res) => {
  try {
    const { name, email, password, registration, course, semester, role } = req.body;
    
    // Validações básicas
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e senha são obrigatórios'
      });
    }
    
    // Validar senha
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Senha deve ter pelo menos 6 caracteres'
      });
    }
    
    // Se não forneceu matrícula, gerar automaticamente
    let finalRegistration = registration;
    if (!finalRegistration || finalRegistration.trim() === '') {
      // Importar função de geração de matrícula
      const generateRegistration = async () => {
        const year = new Date().getFullYear().toString().slice(-2);
        const lastUser = await User.findOne({ 
          registration: new RegExp(`^${year}`) 
        }).sort({ registration: -1 });
        
        let sequence = 1;
        if (lastUser && lastUser.registration) {
          const lastSeq = parseInt(lastUser.registration.slice(-5)) || 0;
          sequence = lastSeq + 1;
        }
        
        for (let attempt = 0; attempt < 10; attempt++) {
          const reg = `${year}${sequence.toString().padStart(5, '0')}`;
          const exists = await User.findOne({ registration: reg });
          if (!exists) {
            return reg;
          }
          sequence += 1;
        }
        throw new Error('Não foi possível gerar matrícula única');
      };
      
      finalRegistration = await generateRegistration();
    }
    
    // Verificar se email ou matrícula já existem
    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { registration: finalRegistration }]
    });
    
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email ou matrícula já cadastrado'
      });
    }
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      registration: finalRegistration,
      course: course ? course.trim() : '',
      semester: semester || 1,
      role: role || 'student'
    });
    
    const userData = user.toObject();
    delete userData.password;
    
    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: userData
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    
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
      message: 'Erro ao criar usuário',
      error: error.message
    });
  }
};

// Atualizar usuário
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    
    // Se tiver senha, fazer hash
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password;
    }
    
    const updated = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: updated
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    
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
      message: 'Erro ao atualizar usuário',
      error: error.message
    });
  }
};

// Deletar usuário
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Não permitir deletar a si mesmo
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível deletar seu próprio usuário'
      });
    }
    
    const deleted = await User.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuário removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover usuário',
      error: error.message
    });
  }
};


