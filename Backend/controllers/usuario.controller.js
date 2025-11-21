const servicioUsuario = require("../services/usuario.service");

class ControladorUsuario {
  /**
   * GET /api/usuarios
   * Listar todos los usuarios
   */
  async obtenerTodos(req, res) {
    try {
      const { role, is_active } = req.query;

      const filtros = {};
      if (role) filtros.role = role;
      if (is_active !== undefined) filtros.is_active = is_active === "true";

      const usuarios = await servicioUsuario.obtenerTodos(filtros);

      res.status(200).json({
        exito: true,
        cantidad: usuarios.length,
        datos: usuarios,
      });
    } catch (error) {
      console.error("Error al listar usuarios:", error);
      res.status(500).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * GET /api/usuarios/:id
   * Obtener usuario por ID
   */
  async obtenerPorId(req, res) {
    try {
      const usuario = await servicioUsuario.obtenerPorId(req.params.id);

      res.status(200).json({
        exito: true,
        datos: usuario,
      });
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(404).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * POST /api/usuarios
   * Crear nuevo usuario (solo ADMIN)
   */
  async crear(req, res) {
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

      const nuevoUsuario = await servicioUsuario.crear({
        username,
        password,
        full_name,
        role,
      });

      res.status(201).json({
        exito: true,
        mensaje: "Usuario creado exitosamente",
        datos: nuevoUsuario,
      });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * PATCH /api/usuarios/:id
   * Actualizar usuario
   */
  async actualizar(req, res) {
    try {
      const { full_name, role, is_active, password } = req.body;

      const usuarioActualizado = await servicioUsuario.actualizar(
        req.params.id,
        {
          full_name,
          role,
          is_active,
          password,
        }
      );

      res.status(200).json({
        exito: true,
        mensaje: "Usuario actualizado exitosamente",
        datos: usuarioActualizado,
      });
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * DELETE /api/usuarios/:id
   * Eliminar usuario (soft delete)
   */
  async eliminar(req, res) {
    try {
      await servicioUsuario.eliminar(req.params.id);

      res.status(200).json({
        exito: true,
        mensaje: "Usuario desactivado exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * POST /api/usuarios/:id/activar
   * Activar usuario
   */
  async activar(req, res) {
    try {
      const usuario = await servicioUsuario.activar(req.params.id);

      res.status(200).json({
        exito: true,
        mensaje: "Usuario activado exitosamente",
        datos: usuario,
      });
    } catch (error) {
      console.error("Error al activar usuario:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }
}

module.exports = new ControladorUsuario();
