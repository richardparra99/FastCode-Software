const bcrypt = require("bcrypt");
const { Usuario } = require("../models");

class ServicioUsuario {
  /**
   * Obtener todos los usuarios
   */
  async obtenerTodos(filtros = {}) {
    try {
      const where = {};

      if (filtros.role) {
        where.role = filtros.role;
      }

      if (filtros.is_active !== undefined) {
        where.is_active = filtros.is_active;
      }

      const usuarios = await Usuario.findAll({
        where,
        attributes: [
          "id",
          "username",
          "full_name",
          "role",
          "is_active",
          "createdAt",
        ],
        order: [["createdAt", "DESC"]],
      });

      return usuarios;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener usuario por ID
   */
  async obtenerPorId(id) {
    try {
      const usuario = await Usuario.findByPk(id, {
        attributes: [
          "id",
          "username",
          "full_name",
          "role",
          "is_active",
          "createdAt",
          "updatedAt",
        ],
      });

      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      return usuario;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crear usuario
   */
  async crear(datosUsuario) {
    try {
      const { username, password, full_name, role } = datosUsuario;

      // Verificar si el usuario ya existe
      const usuarioExistente = await Usuario.findOne({ where: { username } });
      if (usuarioExistente) {
        throw new Error("El nombre de usuario ya existe");
      }

      // Hash de la contraseña
      const password_hash = await bcrypt.hash(password, 10);

      // Crear usuario
      const nuevoUsuario = await Usuario.create({
        username,
        password_hash,
        full_name,
        role: role || "VENTAS",
        is_active: true,
      });

      return {
        id: nuevoUsuario.id,
        username: nuevoUsuario.username,
        full_name: nuevoUsuario.full_name,
        role: nuevoUsuario.role,
        is_active: nuevoUsuario.is_active,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar usuario
   */
  async actualizar(id, datosActualizacion) {
    try {
      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      const { full_name, role, is_active, password } = datosActualizacion;

      const actualizaciones = {};

      if (full_name !== undefined) actualizaciones.full_name = full_name;
      if (role !== undefined) actualizaciones.role = role;
      if (is_active !== undefined) actualizaciones.is_active = is_active;

      // Si se proporciona nueva contraseña
      if (password) {
        actualizaciones.password_hash = await bcrypt.hash(password, 10);
      }

      await usuario.update(actualizaciones);

      return {
        id: usuario.id,
        username: usuario.username,
        full_name: usuario.full_name,
        role: usuario.role,
        is_active: usuario.is_active,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar usuario (soft delete - marcar como inactivo)
   */
  async eliminar(id) {
    try {
      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      await usuario.update({ is_active: false });

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Activar usuario
   */
  async activar(id) {
    try {
      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      await usuario.update({ is_active: true });

      return {
        id: usuario.id,
        username: usuario.username,
        full_name: usuario.full_name,
        role: usuario.role,
        is_active: usuario.is_active,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ServicioUsuario();
