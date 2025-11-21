const authRoutes = require("./auth.routes");
const usuarioRoutes = require("./usuario.routes");
const clienteRoutes = require("./cliente.routes");
const productoRoutes = require("./producto.routes");
const contabilidadRoutes = require("./contabilidad.routes");
const facturaRoutes = require("./factura.routes");
const dashboardRoutes = require("./dashboard.routes");

module.exports = (app) => {
  // Rutas de autenticación (públicas)
  app.use("/api/auth", authRoutes);

  // Rutas de usuarios (protegidas)
  app.use("/api/usuarios", usuarioRoutes);

  // Rutas de clientes (protegidas)
  app.use("/api/clientes", clienteRoutes);

  // Rutas de productos (protegidas)
  app.use("/api/productos", productoRoutes);

  // Rutas de contabilidad (protegidas)
  app.use("/api/contabilidad", contabilidadRoutes);

  // Rutas de facturas (protegidas)
  app.use("/api/facturas", facturaRoutes);

  // Rutas de dashboard (protegidas)
  app.use("/api/dashboard", dashboardRoutes);
};
