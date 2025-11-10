const express = require("express");
const DashboardController = require("../controllers/Dashboard.controller");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

// Rota genérica (mantida para compatibilidade)
router.get("/", authenticateToken, DashboardController.index);

// Rotas específicas por perfil
router.get("/student", authenticateToken, DashboardController.getStudentDashboard);
router.get("/teacher", authenticateToken, DashboardController.getTeacherDashboard);
router.get("/admin", authenticateToken, DashboardController.getAdminDashboard);

module.exports = router;
