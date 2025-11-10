const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  fileUrl: {
    type: String,
    required: [true, 'URL do arquivo é obrigatória']
  },
  fileName: {
    type: String,
    required: [true, 'Nome do arquivo é obrigatório']
  },
  fileType: {
    type: String,
    required: [true, 'Tipo do arquivo é obrigatório']
  },
  fileSize: {
    type: Number,
    required: [true, 'Tamanho do arquivo é obrigatório']
  },
  category: {
    type: String,
    enum: ['declaração', 'atestado', 'histórico', 'boleto', 'contrato', 'outro'],
    default: 'outro'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);