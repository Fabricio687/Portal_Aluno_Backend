// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

// Middleware para proteger rotas
const protect = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Erro de configuração do servidor' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
    
    req.user = user; // { id, email, role }
    next();
  });
};

// Middleware para autorizar papéis específicos
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    next();
  };
};

module.exports = { protect, authorize, authenticateToken: protect };
