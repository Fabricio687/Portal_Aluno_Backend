// middleware/logger.js

/**
 * Middleware de logging para requisições
 */
const logger = (req, res, next) => {
  const start = Date.now();
  
  // Log da requisição
  console.log(`📥 ${req.method} ${req.path}`, {
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString()
  });

  // Interceptar resposta para log
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '❌' : res.statusCode >= 300 ? '⚠️' : '✅';
    
    console.log(`${statusColor} ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    
    return originalSend.call(this, data);
  };

  next();
};

module.exports = logger;


