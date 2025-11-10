const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Estudante é obrigatório']
  },
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Mensagem é obrigatória'],
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'error'],
    required: [true, 'Tipo é obrigatório'],
    default: 'info'
  },
  read: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
