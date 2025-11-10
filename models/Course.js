const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do curso é obrigatório'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Código do curso é obrigatório'],
    unique: true,
    trim: true
  },
  credits: {
    type: Number,
    required: [true, 'Número de créditos é obrigatório'],
    min: [1, 'Mínimo de 1 crédito']
  },
  professor: {
    type: String,
    required: [true, 'Nome do professor é obrigatório'],
    trim: true
  },
  schedule: {
    type: String,
    required: [true, 'Horário é obrigatório'],
    trim: true
  },
  room: {
    type: String,
    required: [true, 'Sala é obrigatória'],
    trim: true
  },
  status: {
    type: String,
    enum: ['enrolled', 'completed', 'dropped'],
    default: 'enrolled'
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  description: {
    type: String,
    trim: true
  },
  semester: {
    type: Number,
    required: [true, 'Semestre é obrigatório']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
