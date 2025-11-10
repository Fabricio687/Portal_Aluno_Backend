const Certificate = require('../models/Certificate');
const User = require('../models/User');
const crypto = require('crypto');

// Gerar código único para documento
const generateDocumentCode = () => {
  return crypto.randomBytes(5).toString('hex').toUpperCase();
};

// Obter todos os documentos do aluno
exports.getStudentCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user.id })
      .sort({ createdAt: -1 })
      .populate('course', 'name code');

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar documentos',
      error: error.message
    });
  }
};

// Obter um documento específico
exports.getCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('course', 'name code')
      .populate('student', 'name email registration')
      .populate('issuedBy', 'name');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Documento não encontrado'
      });
    }

    // Verificar se o documento pertence ao aluno ou se é um admin
    if (certificate.student._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a acessar este documento'
      });
    }

    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar documento',
      error: error.message
    });
  }
};

// Solicitar emissão de documento
exports.requestCertificate = async (req, res) => {
  try {
    const { type, description, course } = req.body;

    // Validar campos obrigatórios
    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de documento é obrigatório'
      });
    }

    if (!description || description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Descrição/motivo é obrigatório'
      });
    }

    // Gerar código único para o documento
    const documentCode = generateDocumentCode();

    // Validar tipo de documento
    const validTypes = ['matricula', 'conclusao', 'historico', 'declaracao', 'outro'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de documento inválido'
      });
    }

    // Definir título com base no tipo
    let title;
    switch (type) {
      case 'matricula':
        title = 'Declaração de Matrícula';
        break;
      case 'conclusao':
        title = 'Certificado de Conclusão';
        break;
      case 'historico':
        title = 'Histórico Escolar';
        break;
      case 'declaracao':
        title = 'Declaração de Vínculo';
        break;
      case 'outro':
        title = description || 'Documento Acadêmico';
        break;
      default:
        title = 'Documento Acadêmico';
    }

    const certificate = await Certificate.create({
      student: req.user.id,
      title,
      description,
      type,
      documentCode,
      course
    });

    res.status(201).json({
      success: true,
      data: certificate,
      message: 'Solicitação de documento enviada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao solicitar documento',
      error: error.message
    });
  }
};

// Emitir documento (apenas admin)
exports.issueCertificate = async (req, res) => {
  try {
    const { documentUrl } = req.body;

    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Documento não encontrado'
      });
    }

    certificate.status = 'emitido';
    certificate.documentUrl = documentUrl;
    certificate.issueDate = new Date();
    certificate.issuedBy = req.user.id;

    await certificate.save();

    res.status(200).json({
      success: true,
      data: certificate,
      message: 'Documento emitido com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao emitir documento',
      error: error.message
    });
  }
};

// Verificar autenticidade de documento
exports.verifyCertificate = async (req, res) => {
  try {
    const { documentCode } = req.params;

    const certificate = await Certificate.findOne({ documentCode })
      .populate('student', 'name email registration')
      .populate('course', 'name code');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Documento não encontrado ou código inválido'
      });
    }

    // Verificar se o documento foi emitido
    if (certificate.status !== 'emitido') {
      return res.status(400).json({
        success: false,
        message: 'Este documento ainda não foi emitido oficialmente'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        isValid: true,
        documentCode: certificate.documentCode,
        type: certificate.type,
        title: certificate.title,
        issueDate: certificate.issueDate,
        student: {
          name: certificate.student.name,
          registration: certificate.student.registration
        },
        course: certificate.course ? certificate.course.name : null
      },
      message: 'Documento autêntico'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar documento',
      error: error.message
    });
  }
};