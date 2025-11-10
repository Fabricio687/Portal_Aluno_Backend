// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isValidEmail, sanitizeString } = require('../utils/validators');

// Função para gerar matrícula automática
const generateRegistration = async (maxAttempts = 10) => {
  const year = new Date().getFullYear().toString().slice(-2); // Últimos 2 dígitos do ano
  
  // Buscar a última matrícula do ano atual
  const lastUser = await User.findOne({ 
    registration: new RegExp(`^${year}`) 
  }).sort({ registration: -1 });
  
  let sequence = 1;
  if (lastUser && lastUser.registration) {
    // Extrair o número sequencial da última matrícula (últimos 5 dígitos)
    const lastSeq = parseInt(lastUser.registration.slice(-5)) || 0;
    sequence = lastSeq + 1;
  }
  
  // Tentar gerar matrícula única
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Formato: AANNNNN (ex: 2400001, 2400002, etc) - 2 dígitos do ano + 5 dígitos sequenciais
    const registration = `${year}${sequence.toString().padStart(5, '0')}`;
    
    // Verificar se a matrícula já existe
    const exists = await User.findOne({ registration });
    if (!exists) {
      return registration;
    }
    
    // Se existir, incrementar e tentar novamente
    sequence += 1;
  }
  
  // Se não conseguir gerar após várias tentativas, lançar erro
  throw new Error('Não foi possível gerar matrícula única após várias tentativas');
};

// Registrar novo usuário (DESABILITADO - apenas admins podem criar usuários)
exports.register = async (req, res) => {
  return res.status(403).json({ 
    message: 'Cadastro público desabilitado. Entre em contato com o administrador para criar uma conta.' 
  });
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações básicas
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Validar formato do email
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    // Buscar usuário
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não configurado');
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const userData = user.toObject();
    delete userData.password;

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: error.message || 'Erro ao fazer login' });
  }
};

// Buscar dados do usuário autenticado
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
};

// Atualizar perfil do usuário autenticado
exports.updateMe = async (req, res) => {
  try {
    const { name, course, semester } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuário não encontrado' 
      });
    }

    // Atualizar apenas campos permitidos
    if (name) user.name = name.trim();
    if (course) user.course = course.trim();
    if (semester !== undefined) user.semester = parseInt(semester) || 1;

    await user.save();

    // Gerar novo token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não configurado');
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const userData = user.toObject();
    delete userData.password;

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      user: userData,
      token
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    
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
      message: 'Erro ao atualizar perfil',
      error: error.message 
    });
  }
};
