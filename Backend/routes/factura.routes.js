const express = require("express");
const router = express.Router();
const controladorFactura = require("../controllers/factura.controller");
const { autenticar } = require("../middlewares/auth.middleware");

// ============================================
// RUTAS PARA GESTIÓN DE FACTURAS
// ============================================

/**
 * POST /api/facturas
 * Crear factura (desde pedido o directa)
 * Body para factura directa: {
 *   clienteId?: 1,
 *   razonSocial: "Cliente Final",
 *   nit: "0",
 *   metodoPago: "EFECTIVO|TRANSFERENCIA|TARJETA|CREDITO",
 *   items: [{
 *     productoId: 1,
 *     cantidad: 2,
 *     precioUnitario: 10.50,
 *     descuento: 0
 *   }],
 *   notas?: "Observaciones"
 * }
 * Body para factura desde pedido: {
 *   pedido_id: 1,
 *   nit: "123456789",
 *   razon_social: "Empresa SA",
 *   metodo_pago: "EFECTIVO"
 * }
 */
router.post("/", autenticar, controladorFactura.crearFactura);

/**
 * GET /api/facturas/:id
 * Obtener factura por ID con todos sus detalles
 */
router.get("/:id", autenticar, controladorFactura.obtenerFactura);

/**
 * GET /api/facturas
 * Listar facturas con filtros opcionales
 * Query params:
 *   - estado: EMITIDA|PAGADA|ANULADA
 *   - cliente_id: ID del cliente
 *   - metodo_pago: EFECTIVO|TRANSFERENCIA|TARJETA|CREDITO
 *   - fecha_inicio: "2025-01-01"
 *   - fecha_fin: "2025-01-31"
 */
router.get("/", autenticar, controladorFactura.obtenerTodasFacturas);

/**
 * PATCH /api/facturas/:id/estado
 * Actualizar estado de factura
 * Body: { estado: "EMITIDA|PAGADA|ANULADA" }
 */
router.patch("/:id/estado", autenticar, controladorFactura.actualizarEstado);

/**
 * POST /api/facturas/:id/anular
 * Anular factura y reversar asiento contable
 */
router.post("/:id/anular", autenticar, controladorFactura.anularFactura);

// ============================================
// RUTAS PARA REPORTES DE FACTURACIÓN
// ============================================

/**
 * GET /api/facturas/reportes/ventas
 * Reporte de ventas por periodo
 * Query params:
 *   - fecha_inicio: "2025-01-01" (requerido)
 *   - fecha_fin: "2025-01-31" (requerido)
 *   - agrupar_por: "dia|mes|metodo_pago" (opcional)
 */
router.get("/reportes/ventas", controladorFactura.obtenerReporteVentas);

/**
 * GET /api/facturas/reportes/por-cliente
 * Reporte de ventas por cliente
 * Query params:
 *   - fecha_inicio: "2025-01-01" (requerido)
 *   - fecha_fin: "2025-01-31" (requerido)
 */
router.get("/reportes/por-cliente", controladorFactura.obtenerVentasPorCliente);

module.exports = router;
