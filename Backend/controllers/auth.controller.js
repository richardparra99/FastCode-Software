const servicioAuth = require("../services/auth.service");

class ControladorAuth {
  /**
   * POST /api/auth/register
   * Registrar nuevo usuario
   */
  async registrar(req, res) {
    try {
      const { username, password, full_name, role } = req.body;

      // Validaciones básicas
      if (!username || !password || !full_name) {
        return res.status(400).json({
          exito: false,
          mensaje: "Faltan datos requeridos (username, password, full_name)",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          exito: false,
          mensaje: "La contraseña debe tener al menos 6 caracteres",
        });
      }

      const resultado = await servicioAuth.registrar({
        username,
        password,
        full_name,
        role,
      });

      res.status(201).json({
        exito: true,
        mensaje: "Usuario registrado exitosamente",
        datos: resultado,
      });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * POST /api/auth/login
   * Login de usuario
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Validaciones básicas
      if (!username || !password) {
        return res.status(400).json({
          exito: false,
          mensaje: "Username y password son requeridos",
        });
      }

      const resultado = await servicioAuth.login(username, password);

      res.status(200).json({
        exito: true,
        mensaje: "Login exitoso",
        datos: resultado,
      });
    } catch (error) {
      console.error("Error al hacer login:", error);
      res.status(401).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * POST /api/auth/logout
   * Logout de usuario
   */
  async logout(req, res) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return res.status(400).json({
          exito: false,
          mensaje: "Token no proporcionado",
        });
      }

      await servicioAuth.logout(token);

      res.status(200).json({
        exito: true,
        mensaje: "Logout exitoso",
      });
    } catch (error) {
      console.error("Error al hacer logout:", error);
      res.status(500).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * GET /api/auth/me
   * Obtener información del usuario autenticado
   */
  async obtenerUsuarioActual(req, res) {
    try {
      res.status(200).json({
        exito: true,
        datos: req.usuario,
      });
    } catch (error) {
      console.error("Error al obtener usuario actual:", error);
      res.status(500).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * POST /api/auth/cambiar-password
   * Cambiar contraseña
   */
  async cambiarPassword(req, res) {
    try {
      const { password_actual, password_nuevo } = req.body;
      const idUsuario = req.usuario.id;

      // Validaciones básicas
      if (!password_actual || !password_nuevo) {
        return res.status(400).json({
          exito: false,
          mensaje: "Se requieren password_actual y password_nuevo",
        });
      }

      if (password_nuevo.length < 6) {
        return res.status(400).json({
          exito: false,
          mensaje: "La nueva contraseña debe tener al menos 6 caracteres",
        });
      }

      await servicioAuth.cambiarPassword(
        idUsuario,
        password_actual,
        password_nuevo
      );

      res.status(200).json({
        exito: true,
        mensaje:
          "Contraseña cambiada exitosamente. Debe iniciar sesión nuevamente.",
      });
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }
}

module.exports = new ControladorAuth();
