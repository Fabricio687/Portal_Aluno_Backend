// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/register - Criar novo usuário
router.post('/register', authController.register);

// POST /api/auth/login - Login do usuário
router.post('/login', authController.login);

// GET /api/auth/me - Buscar dados do usuário autenticado
router.get('/me', authenticateToken, authController.getMe);

// PUT /api/auth/me - Atualizar perfil do usuário autenticado
router.put('/me', authenticateToken, authController.updateMe);

module.exports = router;
