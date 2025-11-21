const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// exports.generateFileName = (extension) => {
//     const crypto = require("crypto");
//     return crypto.randomUUID() + "." + extension;
// }
exports.generateAuthToken = (username, usuarioData) => {
  // Generar JWT en lugar de bcrypt hash
  const payload = {
    username,
    id: usuarioData.id,
    nombreCompleto: usuarioData.full_name,
    rol: usuarioData.role,
  };

  const secret = process.env.JWT_SECRET || "fastcode-secret-key-2025";
  const options = {
    expiresIn: "8h",
  };

  return jwt.sign(payload, secret, options);
};
