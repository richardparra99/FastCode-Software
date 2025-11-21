const express = require("express");
const router = express.Router();
const controladorCliente = require("../controllers/cliente.controller");
const { autenticar } = require("../middlewares/auth.middleware");

/**
 * Todas las rutas de clientes requieren autenticación
 */

/**
 * GET /api/clientes
 * Listar todos los clientes
 * Query params: ?busqueda=texto
 */
router.get("/", autenticar, controladorCliente.obtenerTodos);

/**
 * GET /api/clientes/buscar/telefono
 * Buscar clientes por teléfono
 * Query params: ?phone=591XXXXXX
 */
router.get(
  "/buscar/telefono",
  autenticar,
  controladorCliente.buscarPorTelefono
);

/**
 * GET /api/clientes/:id
 * Obtener cliente por ID
 */
router.get("/:id", autenticar, controladorCliente.obtenerPorId);

/**
 * POST /api/clientes
 * Crear nuevo cliente
 * Body: { full_name, phone?, address?, is_whatsapp? }
 */
router.post("/", autenticar, controladorCliente.crear);

/**
 * PATCH /api/clientes/:id
 * Actualizar cliente
 * Body: { full_name?, phone?, address?, is_whatsapp? }
 */
router.patch("/:id", autenticar, controladorCliente.actualizar);

/**
 * DELETE /api/clientes/:id
 * Eliminar cliente
 */
router.delete("/:id", autenticar, controladorCliente.eliminar);

module.exports = router;
