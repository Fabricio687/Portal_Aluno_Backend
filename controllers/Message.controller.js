const Message = require('../models/Message');
const User = require('../models/User');

// Enviar mensagem
exports.sendMessage = async (req, res) => {
  try {
    const { receiverEmail, subject, content } = req.body;
    
    if (!receiverEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email do destinatário é obrigatório'
      });
    }
    
    // Verificar se o destinatário existe por email
    const receiver = await User.findOne({ email: receiverEmail.toLowerCase().trim() });
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Destinatário não encontrado com este email'
      });
    }
    
    // Não permitir enviar mensagem para si mesmo
    if (receiver._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível enviar mensagem para si mesmo'
      });
    }
    
    const message = await Message.create({
      sender: req.user.id,
      receiver: receiver._id,
      subject,
      content,
      attachments: req.body.attachments || []
    });
    
    // Popular os dados do destinatário para retornar
    await message.populate('receiver', 'name email role');
    await message.populate('sender', 'name email role');
    
    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar mensagem',
      error: error.message
    });
  }
};

// Buscar usuários por email (para autocomplete no frontend)
exports.searchUsersByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email || email.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Forneça pelo menos 2 caracteres para buscar'
      });
    }
    
    // Buscar usuários cujo email contenha o termo (excluindo o próprio usuário)
    const users = await User.find({
      email: { $regex: email, $options: 'i' },
      _id: { $ne: req.user.id } // Excluir o próprio usuário
    })
    .select('name email role')
    .limit(10);
    
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuários',
      error: error.message
    });
  }
};

// Obter mensagens recebidas
exports.getInbox = async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user.id })
      .sort({ createdAt: -1 })
      .populate('sender', 'name email role');
    
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar mensagens recebidas',
      error: error.message
    });
  }
};

// Obter mensagens enviadas
exports.getSent = async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user.id })
      .sort({ createdAt: -1 })
      .populate('receiver', 'name email role');
    
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar mensagens enviadas',
      error: error.message
    });
  }
};

// Obter mensagem por ID
exports.getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role');
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }
    
    // Verificar permissão
    if (message.sender.toString() !== req.user.id && message.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a acessar esta mensagem'
      });
    }
    
    // Marcar como lida se o usuário for o destinatário
    if (message.receiver.toString() === req.user.id && !message.read) {
      message.read = true;
      await message.save();
    }
    
    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar mensagem',
      error: error.message
    });
  }
};

// Excluir mensagem
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }
    
    // Verificar permissão
    if (message.sender.toString() !== req.user.id && message.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a excluir esta mensagem'
      });
    }
    
    await message.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Mensagem excluída com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir mensagem',
      error: error.message
    });
  }
};