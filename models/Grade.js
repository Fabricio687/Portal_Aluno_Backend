const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Estudante é obrigatório']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: false // Permite null quando courseName é usado
  },
  courseName: {
    type: String,
    required: [true, 'Nome do curso é obrigatório']
  },
  grade: {
    type: Number,
    required: [true, 'Nota é obrigatória'],
    min: [0, 'Nota mínima é 0'],
    max: [100, 'Nota máxima é 100']
  },
  maxGrade: {
    type: Number,
    required: [true, 'Nota máxima é obrigatória'],
    default: 100
  },
  type: {
    type: String,
    enum: ['exam', 'assignment', 'project', 'final'],
    required: [true, 'Tipo de avaliação é obrigatório']
  },
  date: {
    type: Date,
    required: [true, 'Data é obrigatória'],
    default: Date.now
  },
  weight: {
    type: Number,
    required: [true, 'Peso é obrigatório'],
    min: [0, 'Peso mínimo é 0'],
    max: [1, 'Peso máximo é 1']
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Grade', gradeSchema);
