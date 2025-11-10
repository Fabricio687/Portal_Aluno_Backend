const CalendarEvent = require('../models/Calendar');

// Obter todos os eventos do calendário
exports.getEvents = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    let query = {};
    
    // Filtrar por data
    if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate) };
      query.endDate = { $lte: new Date(endDate) };
    }
    
    // Filtrar por tipo
    if (type) {
      query.type = type;
    }
    
    // Filtrar por visibilidade
    const userRole = req.user.role;
    query.visibleTo = { $in: [userRole, 'all'] };
    
    const events = await CalendarEvent.find(query)
      .populate('course', 'name code')
      .populate('createdBy', 'name');
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar eventos do calendário',
      error: error.message
    });
  }
};

// Criar evento no calendário
exports.createEvent = async (req, res) => {
  try {
    // Adicionar o usuário que está criando o evento
    req.body.createdBy = req.user.id;
    
    const event = await CalendarEvent.create(req.body);
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar evento no calendário',
      error: error.message
    });
  }
};

// Atualizar evento do calendário
exports.updateEvent = async (req, res) => {
  try {
    let event = await CalendarEvent.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado'
      });
    }
    
    // Verificar se o usuário é o criador do evento ou admin
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a atualizar este evento'
      });
    }
    
    event = await CalendarEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar evento do calendário',
      error: error.message
    });
  }
};

// Excluir evento do calendário
exports.deleteEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado'
      });
    }
    
    // Verificar se o usuário é o criador do evento ou admin
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a excluir este evento'
      });
    }
    
    await event.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Evento excluído com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir evento do calendário',
      error: error.message
    });
  }
};