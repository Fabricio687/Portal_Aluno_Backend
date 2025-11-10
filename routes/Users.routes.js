const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');
const UsersController = require('../controllers/Users.controller');

const router = express.Router();

// Todas as rotas requerem autenticação e autorização de admin
router.get('/', authenticateToken, authorize('admin'), UsersController.getAll);
router.get('/:id', authenticateToken, authorize('admin'), UsersController.getById);
router.post('/', authenticateToken, authorize('admin'), UsersController.create);
router.put('/:id', authenticateToken, authorize('admin'), UsersController.update);
router.delete('/:id', authenticateToken, authorize('admin'), UsersController.remove);

module.exports = router;


