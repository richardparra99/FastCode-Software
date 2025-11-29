const bcrypt = require("bcrypt");
const { Usuario, AuthToken } = require("../models");
const { generateAuthToken } = require("../utilities/text.utilities");

class ServicioAuth {
  /**
   * Registrar nuevo usuario
   */
  async registrar(datosUsuario) {
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

      // Generar token
      const token = await generateAuthToken(username, {
        id: nuevoUsuario.id,
        full_name: nuevoUsuario.full_name,
        role: nuevoUsuario.role,
      });

      // Guardar token
      await AuthToken.create({
        token,
        idUsuario: nuevoUsuario.id,
      });

      return {
        usuario: {
          id: nuevoUsuario.id,
          username: nuevoUsuario.username,
          full_name: nuevoUsuario.full_name,
          role: nuevoUsuario.role,
          is_active: nuevoUsuario.is_active,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login de usuario
   */
  async login(username, password) {
    try {
      // Buscar usuario
      const usuario = await Usuario.findOne({ where: { username } });

      if (!usuario) {
        throw new Error("Usuario o contraseña incorrectos");
      }

      // Verificar si está activo
      if (!usuario.is_active) {
        throw new Error("Usuario inactivo");
      }

      // Verificar contraseña
      const passwordValido = await bcrypt.compare(
        password,
        usuario.password_hash
      );

      if (!passwordValido) {
        throw new Error("Usuario o contraseña incorrectos");
      }

      // Generar nuevo token
      const token = await generateAuthToken(username, {
        id: usuario.id,
        full_name: usuario.full_name,
        role: usuario.role,
      });

      // Eliminar tokens anteriores del usuario
      await AuthToken.destroy({ where: { idUsuario: usuario.id } });

      // Guardar nuevo token
      await AuthToken.create({
        token,
        idUsuario: usuario.id,
      });

      return {
        usuario: {
          id: usuario.id,
          username: usuario.username,
          full_name: usuario.full_name,
          role: usuario.role,
          is_active: usuario.is_active,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout de usuario
   */
  async logout(token) {
    try {
      await AuthToken.destroy({ where: { token } });
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validar token y obtener usuario
   */
  async validarToken(token) {
    try {
      // Importar jwt aquí para evitar problemas de dependencia circular
      const jwt = require("jsonwebtoken");
      const secret = process.env.JWT_SECRET || "fastcode-secret-key-2025";

      // Verificar y decodificar el JWT
      let decoded;
      try {
        decoded = jwt.verify(token, secret);
      } catch (err) {
        throw new Error("Token inválido o expirado");
      }

      // Verificar si el token existe en la BD (para revocación)
      const authToken = await AuthToken.findOne({
        where: { token },
      });

      if (!authToken) {
        throw new Error("Token revocado o inválido");
      }

      // Obtener usuario actualizado de la BD
      const usuario = await Usuario.findByPk(decoded.id, {
        attributes: ["id", "username", "full_name", "role", "is_active"],
      });

      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      if (!usuario.is_active) {
        throw new Error("Usuario inactivo");
      }

      return usuario;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cambiar contraseña
   */
  async cambiarPassword(idUsuario, passwordActual, passwordNuevo) {
    try {
      const usuario = await Usuario.findByPk(idUsuario);

      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      // Verificar contraseña actual
      const passwordValido = await bcrypt.compare(
        passwordActual,
        usuario.password_hash
      );

      if (!passwordValido) {
        throw new Error("Contraseña actual incorrecta");
      }

      // Hash de la nueva contraseña
      const nuevoPasswordHash = await bcrypt.hash(passwordNuevo, 10);

      // Actualizar contraseña
      await usuario.update({ password_hash: nuevoPasswordHash });

      // Eliminar todos los tokens del usuario (forzar re-login)
      await AuthToken.destroy({ where: { idUsuario: usuario.id } });

      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ServicioAuth();
