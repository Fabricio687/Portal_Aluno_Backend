require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const routes = require("./routes");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const { ensureDbConnection } = require("./middleware/dbConnection");

const app = express();

// Configurar CORS usando lista de origens do ambiente
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(o => o.trim()).filter(Boolean);

// URLs fixas do frontend em produção
const FRONTEND_URLS = [
  'https://projeto-integrador-914d.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

// Adicionar URLs fixas do frontend
FRONTEND_URLS.forEach(url => {
  if (!allowedOrigins.includes(url)) {
    allowedOrigins.push(url);
  }
});

// Adicionar origens padrão do Vercel se estiver em produção
if (process.env.VERCEL && process.env.VERCEL_URL) {
  const vercelUrl = `https://${process.env.VERCEL_URL}`;
  if (!allowedOrigins.includes(vercelUrl)) {
    allowedOrigins.push(vercelUrl);
  }
}

console.log('🌐 CORS - Origens permitidas:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requisições sem origem (ex: scripts internos, ferramentas, serverless functions)
    if (!origin) {
      return callback(null, true);
    }
    
    // Em desenvolvimento local, permitir tudo
    if (process.env.NODE_ENV !== 'production' && (process.env.VERCEL !== '1')) {
      return callback(null, true);
    }
    
    // Verificar se a origem está na lista de permitidas
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // No Vercel, permitir qualquer origem .vercel.app
    if (process.env.VERCEL === '1' && origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Permitir localhost em qualquer ambiente
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Log apenas se bloqueado (para debug)
    console.warn('🌐 CORS - Origem bloqueada:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware de logging
if (process.env.NODE_ENV !== 'test') {
  app.use(logger);
}

// Habilitar o parser de JSON em todas as rotas
app.use(express.json({ limit: '10mb' })); // Limite de 10MB para uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rota principal
app.get("/", (req, res) => {
  return res.send("Portal do Aluno API - Funcionando!");
});

// Usar rotas (com verificação de conexão DB)
app.use('/api', ensureDbConnection, routes);

// Servir arquivos estáticos (uploads)
// NOTA: No Vercel, esta rota não funcionará porque as funções serverless são stateless
// Para produção, use um serviço de storage externo (AWS S3, Cloudinary, etc.)
if (process.env.VERCEL !== '1') {
  app.use("/files", express.static(path.resolve(__dirname, "uploads")));
} else {
  // No Vercel, retornar erro informativo
  app.use("/files", (req, res) => {
    res.status(501).json({
      success: false,
      message: 'Serviço de arquivos não disponível no Vercel. Use um serviço de storage externo.',
      error: 'File storage not available in serverless environment'
    });
  });
}

// Rota de teste
app.get("/ping", (req, res) => {
  console.log("recebeu ping");
  res.send("pong");
});

// Rota para verificar status (health check)
app.get('/status', ensureDbConnection, async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.json({
      status: 'online',
      database: dbStatus,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Serviço indisponível',
      error: error.message
    });
  }
});

// Validar variáveis de ambiente críticas
function validateEnvironment() {
  // Se MONGODB_URI estiver definido, não precisa de DB_USER, DB_PASS, DB_NAME
  const hasMongoUri = !!process.env.MONGODB_URI;
  const required = hasMongoUri 
    ? ['JWT_SECRET'] 
    : ['JWT_SECRET', 'DB_USER', 'DB_PASS', 'DB_NAME'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Variáveis de ambiente obrigatórias não configuradas:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n💡 Configure as variáveis de ambiente no Vercel ou no arquivo .env');
    process.exit(1);
  }
  
  // Validar JWT_SECRET não é o valor padrão inseguro
  if (process.env.JWT_SECRET === 'seu_secret_aqui') {
    console.error('❌ JWT_SECRET não pode ser o valor padrão inseguro');
    console.error('💡 Configure uma chave única no arquivo .env');
    process.exit(1);
  }
  
  // Validar comprimento mínimo (mais rigoroso em produção)
  const minLength = process.env.NODE_ENV === 'production' ? 32 : 16;
  if (process.env.JWT_SECRET.length < minLength) {
    const envMsg = process.env.NODE_ENV === 'production' 
      ? '❌ JWT_SECRET deve ter pelo menos 32 caracteres em produção'
      : '⚠️  JWT_SECRET deve ter pelo menos 16 caracteres (recomendado: 32+)';
    console.error(envMsg);
    console.error('💡 Use uma chave forte e única');
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.warn('⚠️  Continuando em modo desenvolvimento, mas use uma chave mais forte em produção');
    }
  }
  
  console.log('✅ Variáveis de ambiente validadas');
}

async function startDatabase() {
  const { DB_USER, DB_PASS, DB_NAME, MONGODB_URI } = process.env;
  
  // Usar MONGODB_URI se fornecido, caso contrário construir a URI
  const uri = MONGODB_URI || `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.7hrgleb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

  try {
    // Verificar se já está conectado
    if (mongoose.connection.readyState === 1) {
      console.log("✅ Já conectado ao MongoDB Atlas");
      return;
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
      maxPoolSize: 10, // Manter até 10 conexões no pool
      minPoolSize: 2, // Manter pelo menos 2 conexões
    });
    console.log("✅ Conectado ao MongoDB Atlas");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB: ", error.message);
    
    // Mensagem mais clara sobre whitelist
    if (error.message.includes('whitelist') || error.message.includes('IP')) {
      console.error('\n📋 SOLUÇÃO PARA CONECTAR AO MONGODB ATLAS:');
      console.error('1. Acesse: https://cloud.mongodb.com/');
      console.error('2. Vá em "Network Access" (ou "IP Access List")');
      console.error('3. Clique em "Add IP Address"');
      console.error('4. Adicione seu IP atual OU use "0.0.0.0/0" para permitir todos (apenas desenvolvimento)');
      console.error('5. Aguarde alguns minutos para a mudança ser aplicada');
      console.error('\n💡 Para produção no Vercel, adicione os IPs do Vercel ou use 0.0.0.0/0');
      console.error('\n⚠️  O servidor continuará rodando, mas as rotas da API não funcionarão até conectar ao banco.');
      console.error('💡 O middleware tentará reconectar automaticamente a cada requisição.\n');
    }
    
    // Não fazer exit - deixar o servidor rodar e tentar reconectar nas requisições
    // O middleware ensureDbConnection tentará reconectar
    throw error; // Propaga o erro para ser tratado pelo catch externo
  }
}

// Validar ambiente antes de iniciar (apenas em desenvolvimento local)
if (process.env.VERCEL !== '1') {
  validateEnvironment();
  
  // Tentar conectar ao banco
  startDatabase()
    .then(() => {
      // Se conectou com sucesso, iniciar servidor
      const port = process.env.PORT || 3100;
      app.listen(port, () => {
        console.log(`🚀 Servidor Portal do Aluno rodando na porta... ${port}`);
        console.log(`📚 API disponível em: http://localhost:${port}/api`);
      });
    })
    .catch((error) => {
      // Se falhou, ainda assim iniciar o servidor (middleware tentará reconectar)
      console.warn('\n⚠️  Servidor iniciando sem conexão ao banco.');
      console.warn('💡 O middleware tentará reconectar automaticamente nas requisições.');
      console.warn('💡 Configure o MongoDB Atlas e reinicie o servidor quando estiver pronto.\n');
      
      const port = process.env.PORT || 3100;
      app.listen(port, () => {
        console.log(`🚀 Servidor Portal do Aluno rodando na porta... ${port}`);
        console.log(`📚 API disponível em: http://localhost:${port}/api`);
        console.log(`⚠️  ATENÇÃO: Banco de dados não conectado. Configure o MongoDB Atlas.`);
      });
    });
} else {
  // No Vercel, validar ambiente mas não fazer exit se faltar (variáveis podem ser injetadas depois)
  // A conexão será tentada na primeira requisição
  try {
    validateEnvironment();
  } catch (error) {
    console.warn('⚠️  Validação de ambiente falhou, mas continuando (variáveis podem ser injetadas pelo Vercel)');
  }
  // Tentar conectar ao banco (não bloquear se falhar)
  startDatabase().catch(err => {
    console.warn('⚠️  Falha ao conectar ao banco na inicialização, será tentado novamente na primeira requisição');
  });
}

// Middleware de tratamento de erros (deve ser o último, após todas as rotas)
app.use(errorHandler);

// Exportar app para Vercel
module.exports = app;
