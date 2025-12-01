const express = require("express");
const router = express.Router();
const controladorContabilidad = require("../controllers/contabilidad.controller");
const { autenticar } = require("../middlewares/auth.middleware");

// ============================================
// RUTAS PARA PLAN DE CUENTAS
// ============================================

/**
 * GET /api/contabilidad/plan-cuentas
 * Obtener plan de cuentas completo o filtrado
 * Query params: tipo, nivel, activas_solamente, permite_movimiento
 */
router.get(
  "/plan-cuentas",
  autenticar,
  controladorContabilidad.obtenerPlanCuentas
);

/**
 * POST /api/contabilidad/cuentas
 * Crear nueva cuenta contable
 * Body: { codigo, nombre, tipo, nivel, padre_id?, descripcion? }
 */
router.post("/cuentas", autenticar, controladorContabilidad.crearCuenta);

/**
 * PATCH /api/contabilidad/cuentas/:id
 * Actualizar cuenta existente
 * Body: { nombre?, descripcion?, esta_activa?, permite_movimiento? }
 */
router.patch(
  "/cuentas/:id",
  autenticar,
  controladorContabilidad.actualizarCuenta
);

// ============================================
// RUTAS PARA ASIENTOS CONTABLES
// ============================================

/**
 * POST /api/contabilidad/asientos
 * Crear asiento contable
 * Body: {
 *   fecha_asiento: "2025-01-15",
 *   glosa: "Descripción",
 *   tipo: "MANUAL|VENTA|COMPRA|AJUSTE|CIERRE",
 *   detalles: [{
 *     cuenta_id: 1,
 *     debe: 1000,
 *     haber: 0,
 *     descripcion: "Detalle"
 *   }]
 * }
 */
router.post("/asientos", autenticar, controladorContabilidad.crearAsiento);

/**
 * GET /api/contabilidad/asientos/:id
 * Obtener asiento por ID con sus detalles
 */
router.get("/asientos/:id", autenticar, controladorContabilidad.obtenerAsiento);

/**
 * POST /api/contabilidad/asientos/:id/aprobar
 * Aprobar asiento contable
 */
router.post(
  "/asientos/:id/aprobar",
  autenticar,
  controladorContabilidad.aprobarAsiento
);

/**
 * POST /api/contabilidad/asientos/:id/anular
 * Anular asiento contable
 */
router.post(
  "/asientos/:id/anular",
  autenticar,
  controladorContabilidad.anularAsiento
);

// ============================================
// RUTAS PARA REPORTES CONTABLES
// ============================================

/**
 * GET /api/contabilidad/libro-diario
 * Libro diario (asientos cronológicos)
 * Query params: fecha_inicio, fecha_fin, tipo
 */
router.get(
  "/libro-diario",
  autenticar,
  controladorContabilidad.obtenerLibroDiario
);

/**
 * Libro mayor por cuenta
 * Query params: cuenta_id, fecha_inicio, fecha_fin
 */
router.get(
  "/libro-mayor",
  autenticar,
  controladorContabilidad.obtenerLibroMayor
);

/**
 * GET /api/contabilidad/libro-mayor-general
 * Libro Mayor de todas las cuentas (formato T)
 */
router.get(
  "/libro-mayor-general",
  autenticar,
  controladorContabilidad.obtenerLibroMayorGeneral
);

/**
 * GET /api/contabilidad/balance-comprobacion
 * Balance de comprobación
 * Query params: fecha_inicio, fecha_fin
 */
router.get(
  "/balance-comprobacion",
  autenticar,
  controladorContabilidad.obtenerBalanceComprobacion
);

/**
 * GET /api/contabilidad/balance-general
 * Balance general (situación financiera)
 * Query params: fecha_corte (default: hoy)
 */
router.get(
  "/balance-general",
  autenticar,
  controladorContabilidad.obtenerBalanceGeneral
);

/**
 * GET /api/contabilidad/estado-resultados
 * Estado de resultados (ganancias y pérdidas)
 * Query params: fecha_inicio, fecha_fin
 */
router.get(
  "/estado-resultados",
  autenticar,
  controladorContabilidad.obtenerEstadoResultados
);

module.exports = router;
