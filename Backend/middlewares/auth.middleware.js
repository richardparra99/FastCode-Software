const servicioAuth = require("../services/auth.service");

/**
 * Middleware para validar autenticación
 */
async function autenticar(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        exito: false,
        mensaje: "Token no proporcionado",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Validar token y obtener usuario
    const usuario = await servicioAuth.validarToken(token);

    // Agregar usuario al request
    req.usuario = usuario;
    req.token = token;

    next();
  } catch (error) {
    return res.status(401).json({
      exito: false,
      mensaje: error.message || "Token inválido",
    });
  }
}

/**
 * Middleware para validar roles específicos
 */
function autorizarRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: "No autenticado",
      });
    }

    if (!rolesPermitidos.includes(req.usuario.role)) {
      return res.status(403).json({
        exito: false,
        mensaje: "No tiene permisos para realizar esta acción",
      });
    }

    next();
  };
}

module.exports = {
  autenticar,
  autorizarRoles,
};
