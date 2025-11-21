const express = require("express");
const router = express.Router();
const controladorProducto = require("../controllers/producto.controller");
const { autenticar } = require("../middlewares/auth.middleware");

/**
 * Todas las rutas de productos requieren autenticación
 */

/**
 * GET /api/productos
 * Listar todos los productos
 * Query params: ?busqueda=texto&is_active=true
 */
router.get("/", autenticar, controladorProducto.obtenerTodos);

/**
 * GET /api/productos/:id
 * Obtener producto por ID con ingredientes
 */
router.get("/:id", autenticar, controladorProducto.obtenerPorId);

/**
 * POST /api/productos
 * Crear nuevo producto
 * Body: {
 *   name,
 *   description?,
 *   price,
 *   is_active?,
 *   receta?: [{ ingredient_id, quantity_required }]
 * }
 */
router.post("/", autenticar, controladorProducto.crear);

/**
 * PATCH /api/productos/:id
 * Actualizar producto
 * Body: {
 *   name?,
 *   description?,
 *   price?,
 *   is_active?,
 *   receta?: [{ ingredient_id, quantity_required }]
 * }
 */
router.patch("/:id", autenticar, controladorProducto.actualizar);

/**
 * DELETE /api/productos/:id
 * Eliminar (desactivar) producto
 */
router.delete("/:id", autenticar, controladorProducto.eliminar);

/**
 * POST /api/productos/:id/activar
 * Activar producto
 */
router.post("/:id/activar", autenticar, controladorProducto.activar);

/**
 * PUT /api/productos/:id/receta
 * Actualizar receta del producto
 * Body: {
 *   receta: [{ ingredient_id, quantity_required }]
 * }
 */
router.put("/:id/receta", autenticar, controladorProducto.actualizarReceta);

module.exports = router;
