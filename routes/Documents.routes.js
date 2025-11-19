const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const DocumentController = require('../controllers/Document.controller');
const upload = require('../config/upload');

// Rotas para alunos
router.get('/my-documents', protect, DocumentController.getMyDocuments);
router.post('/upload', protect, upload.single('file'), DocumentController.uploadDocument);
router.get('/:id', protect, DocumentController.getDocument);
router.put('/:id', protect, DocumentController.updateDocument);
router.delete('/:id', protect, DocumentController.deleteDocument);

// Rotas para professores/admins verem documentos de alunos
router.get('/students/all', protect, DocumentController.getStudentDocuments);

module.exports = router;


