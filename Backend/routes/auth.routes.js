const express = require("express");
const router = express.Router();
const controladorAuth = require("../controllers/auth.controller");
const { autenticar } = require("../middlewares/auth.middleware");

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
router.post("/register", controladorAuth.registrar);

/**
 * POST /api/auth/login
 * Login de usuario
 */
router.post("/login", controladorAuth.login);

/**
 * POST /api/auth/logout
 * Logout de usuario (requiere autenticación)
 */
router.post("/logout", autenticar, controladorAuth.logout);

/**
 * GET /api/auth/me
 * Obtener información del usuario autenticado
 */
router.get("/me", autenticar, controladorAuth.obtenerUsuarioActual);

/**
 * POST /api/auth/cambiar-password
 * Cambiar contraseña del usuario autenticado
 */
router.post("/cambiar-password", autenticar, controladorAuth.cambiarPassword);

module.exports = router;
