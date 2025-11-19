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
    
    // Verificar se as variáveis estão configuradas
    const hasValidConfig = MONGODB_URI || (DB_USER && DB_PASS && DB_NAME && 
      !DB_USER.includes('seu_usuario') && !DB_PASS.includes('sua_senha'));
    
    if (!hasValidConfig) {
      console.error('❌ Variáveis de ambiente do MongoDB não configuradas!');
      console.error('   MONGODB_URI:', MONGODB_URI ? '✅ definida' : '❌ não definida');
      console.error('   DB_USER:', DB_USER ? (DB_USER.includes('seu_usuario') ? '⚠️ valor de exemplo' : '✅ definida') : '❌ não definida');
      console.error('   DB_PASS:', DB_PASS ? (DB_PASS.includes('sua_senha') ? '⚠️ valor de exemplo' : '✅ definida') : '❌ não definida');
      console.error('   DB_NAME:', DB_NAME ? '✅ definida' : '❌ não definida');
      
      return res.status(503).json({
        success: false,
        message: 'Serviço temporariamente indisponível. Configure o MongoDB no arquivo config.env.',
        error: process.env.NODE_ENV === 'development' 
          ? 'Variáveis de ambiente do MongoDB não configuradas ou contêm valores de exemplo. Configure MONGODB_URI ou DB_USER/DB_PASS/DB_NAME com valores REAIS no arquivo config.env. Veja CONFIGURAR_MONGODB.md' 
          : undefined
      });
    }

    const uri = MONGODB_URI || `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.7hrgleb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

    console.log('🔄 Tentando reconectar ao MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ Reconectado ao MongoDB com sucesso!');
    next();
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    
    // Mensagens de erro mais específicas
    let errorMessage = 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.';
    let debugError = error.message;
    
    if (error.message.includes('authentication failed')) {
      errorMessage = 'Erro de autenticação no MongoDB. Verifique usuário e senha no config.env.';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Timeout ao conectar ao MongoDB. Verifique sua conexão com a internet.';
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      errorMessage = 'Não foi possível resolver o endereço do MongoDB. Verifique a URI no config.env.';
    }
    
    return res.status(503).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? debugError : undefined
    });
  }
};

module.exports = { ensureDbConnection };


