const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  sendMessage,
  getInbox,
  getSent,
  getMessage,
  deleteMessage,
  searchUsersByEmail
} = require('../controllers/Message.controller');

// Rotas protegidas
router.get('/search-users', protect, searchUsersByEmail);
router.post('/', protect, sendMessage);
router.get('/inbox', protect, getInbox);
router.get('/sent', protect, getSent);
router.get('/:id', protect, getMessage);
router.delete('/:id', protect, deleteMessage);

module.exports = router;