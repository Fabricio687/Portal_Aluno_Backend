const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['matricula', 'conclusao', 'historico', 'declaracao', 'outro'],
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  documentUrl: {
    type: String
  },
  documentCode: {
    type: String,
    required: true
    // unique: true removido - usando índice explícito abaixo para evitar duplicação
  },
  status: {
    type: String,
    enum: ['pendente', 'emitido', 'cancelado'],
    default: 'pendente'
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Índices para melhorar a performance das consultas
CertificateSchema.index({ student: 1 });
CertificateSchema.index({ documentCode: 1 }, { unique: true });

module.exports = mongoose.model('Certificate', CertificateSchema);