// middleware/dbConnection.js
const mongoose = require('mongoose');

/**
 * Middleware para garantir que há conexão com o MongoDB antes de processar requisições
 * Tenta reconectar se necessário
 */
const ensureDbConnection = async (req, res, next) => {
  try {
    // Verificar se já está conectado
    if (mongoose.connection.readyState === 1) {
      return next();
    }

    // Tentar reconectar
    const { DB_USER, DB_PASS, DB_NAME, MONGODB_URI } = process.env;
    const uri = MONGODB_URI || `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.7hrgleb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    next();
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    return res.status(503).json({
      success: false,
      message: 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { ensureDbConnection };


