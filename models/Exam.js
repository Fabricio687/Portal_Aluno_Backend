const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Curso é obrigatório']
  },
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Data é obrigatória']
  },
  maxGrade: {
    type: Number,
    default: 100,
    min: [1, 'Nota máxima deve ser positiva']
  },
  weight: {
    type: Number,
    default: 0.3,
    min: [0, 'Peso mínimo é 0'],
    max: [1, 'Peso máximo é 1']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);


