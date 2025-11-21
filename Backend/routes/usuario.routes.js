const express = require("express");
const router = express.Router();
const controladorUsuario = require("../controllers/usuario.controller");
const {
  autenticar,
  autorizarRoles,
} = require("../middlewares/auth.middleware");

/**
 * GET /api/usuarios
 * Listar todos los usuarios (requiere autenticación)
 */
router.get("/", autenticar, controladorUsuario.obtenerTodos);

/**
 * GET /api/usuarios/:id
 * Obtener usuario por ID (requiere autenticación)
 */
router.get("/:id", autenticar, controladorUsuario.obtenerPorId);

/**
 * POST /api/usuarios
 * Crear nuevo usuario (solo ADMIN)
 */
router.post("/", autenticar, autorizarRoles("ADMIN"), controladorUsuario.crear);

/**
 * PATCH /api/usuarios/:id
 * Actualizar usuario (solo ADMIN)
 */
router.patch(
  "/:id",
  autenticar,
  autorizarRoles("ADMIN"),
  controladorUsuario.actualizar
);

/**
 * DELETE /api/usuarios/:id
 * Eliminar (desactivar) usuario (solo ADMIN)
 */
router.delete(
  "/:id",
  autenticar,
  autorizarRoles("ADMIN"),
  controladorUsuario.eliminar
);

/**
 * POST /api/usuarios/:id/activar
 * Activar usuario (solo ADMIN)
 */
router.post(
  "/:id/activar",
  autenticar,
  autorizarRoles("ADMIN"),
  controladorUsuario.activar
);

module.exports = router;
