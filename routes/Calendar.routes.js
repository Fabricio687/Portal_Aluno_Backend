const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/Calendar.controller');

// Rotas protegidas
router.get('/', protect, getEvents);
router.post('/', protect, authorize('admin', 'teacher'), createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;