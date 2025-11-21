const express = require("express");
const router = express.Router();
const controladorDashboard = require("../controllers/dashboard.controller");
const { autenticar } = require("../middlewares/auth.middleware");

/**
 * @route   GET /api/dashboard/estadisticas
 * @desc    Obtener estadísticas del dashboard
 * @access  Privado (requiere autenticación)
 */
router.get(
  "/estadisticas",
  autenticar,
  controladorDashboard.obtenerEstadisticas
);

module.exports = router;
