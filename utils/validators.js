// utils/validators.js

/**
 * Validação de email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validação de senha (mínimo 6 caracteres)
 */
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Sanitizar string (remover espaços extras)
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/\s+/g, ' ');
};

/**
 * Validar ObjectId do MongoDB
 */
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Middleware de validação genérico
 */
const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    // Validar body
    if (schema.body) {
      Object.keys(schema.body).forEach(key => {
        const validator = schema.body[key];
        const value = req.body[key];

        if (validator.required && (!value || value === '')) {
          errors.push(`${key} é obrigatório`);
        } else if (value && validator.validate && !validator.validate(value)) {
          errors.push(validator.message || `${key} é inválido`);
        }
      });
    }

    // Validar params
    if (schema.params) {
      Object.keys(schema.params).forEach(key => {
        const validator = schema.params[key];
        const value = req.params[key];

        if (validator.required && (!value || value === '')) {
          errors.push(`${key} é obrigatório`);
        } else if (value && validator.validate && !validator.validate(value)) {
          errors.push(validator.message || `${key} é inválido`);
        }
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors
      });
    }

    next();
  };
};

module.exports = {
  isValidEmail,
  isValidPassword,
  sanitizeString,
  isValidObjectId,
  validate
};


