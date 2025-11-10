const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getStudentCertificates,
  getCertificate,
  requestCertificate,
  issueCertificate,
  verifyCertificate
} = require('../controllers/Certificate.controller');

// Rota pública para verificar autenticidade de documentos
router.get('/verificar/:documentCode', verifyCertificate);

// Rotas protegidas para alunos
router.get('/meus-documentos', protect, getStudentCertificates);
router.get('/:id', protect, getCertificate);
router.post('/solicitar', protect, requestCertificate);

// Rotas protegidas para administradores
router.put('/emitir/:id', protect, authorize('admin'), issueCertificate);

module.exports = router;