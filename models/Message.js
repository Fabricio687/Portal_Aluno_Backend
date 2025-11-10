const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: [true, 'Assunto é obrigatório'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Conteúdo é obrigatório'],
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);