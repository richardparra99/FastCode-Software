const servicioFactura = require("../services/factura.service");

class ControladorFactura {
  /**
   * POST /api/facturas
   * Crear factura (desde pedido o directa)
   */
  async crearFactura(req, res) {
    try {
      const { pedido_id, ...datosFactura } = req.body;

      // Obtener usuario del token JWT
      const idUsuario = req.usuario?.id || req.body.id_usuario || 1;

      let factura;

      // Si tiene pedido_id, crear desde pedido
      if (pedido_id) {
        factura = await servicioFactura.crearFacturaDesdePedido(
          pedido_id,
          datosFactura,
          idUsuario
        );
      } else {
        // Crear factura directa
        if (!datosFactura.items || datosFactura.items.length === 0) {
          return res.status(400).json({
            exito: false,
            mensaje: "Debe incluir items para la factura",
          });
        }

        factura = await servicioFactura.crearFacturaDirecta(
          datosFactura,
          idUsuario
        );
      }

      res.status(201).json({
        exito: true,
        mensaje: "Factura creada exitosamente",
        datos: factura,
      });
    } catch (error) {
      console.error("Error al crear factura:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * GET /api/facturas/:id
   * Obtener factura por ID
   */
  async obtenerFactura(req, res) {
    try {
      const factura = await servicioFactura.obtenerFacturaPorId(req.params.id);

      if (!factura) {
        return res.status(404).json({
          exito: false,
          mensaje: "Factura no encontrada",
        });
      }

      res.status(200).json({
        exito: true,
        datos: factura,
      });
    } catch (error) {
      console.error("Error al obtener factura:", error);
      res.status(500).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * GET /api/facturas
   * Listar facturas con filtros
   */
  async obtenerTodasFacturas(req, res) {
    try {
      const filtros = {
        estado: req.query.estado,
        cliente_id: req.query.cliente_id,
        metodo_pago: req.query.metodo_pago,
        fecha_inicio: req.query.fecha_inicio,
        fecha_fin: req.query.fecha_fin,
      };

      const facturas = await servicioFactura.obtenerTodasFacturas(filtros);

      res.status(200).json({
        exito: true,
        cantidad: facturas.length,
        datos: facturas,
      });
    } catch (error) {
      console.error("Error al listar facturas:", error);
      res.status(500).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * PATCH /api/facturas/:id/estado
   * Actualizar estado de factura
   */
  async actualizarEstado(req, res) {
    try {
      const { estado } = req.body;

      if (!estado) {
        return res.status(400).json({
          exito: false,
          mensaje: "Se requiere el estado",
        });
      }

      const idUsuario = req.user?.id || req.body.id_usuario || 1;

      const factura = await servicioFactura.actualizarEstadoFactura(
        req.params.id,
        estado,
        idUsuario
      );

      res.status(200).json({
        exito: true,
        mensaje: "Estado actualizado exitosamente",
        datos: factura,
      });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * POST /api/facturas/:id/anular
   * Anular factura
   */
  async anularFactura(req, res) {
    try {
      const idUsuario = req.user?.id || req.body.id_usuario || 1;

      const factura = await servicioFactura.anularFactura(
        req.params.id,
        idUsuario
      );

      res.status(200).json({
        exito: true,
        mensaje: "Factura anulada exitosamente",
        datos: factura,
      });
    } catch (error) {
      console.error("Error al anular factura:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * GET /api/facturas/reportes/ventas
   * Reporte de ventas por periodo
   */
  async obtenerReporteVentas(req, res) {
    try {
      const { fecha_inicio, fecha_fin, agrupar_por } = req.query;

      if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({
          exito: false,
          mensaje: "Se requieren fechas de inicio y fin",
        });
      }

      const reporte = await servicioFactura.obtenerReporteVentas(
        fecha_inicio,
        fecha_fin,
        agrupar_por
      );

      res.status(200).json({
        exito: true,
        datos: {
          periodo: { fecha_inicio, fecha_fin },
          ventas: reporte,
        },
      });
    } catch (error) {
      console.error("Error al generar reporte de ventas:", error);
      res.status(500).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * GET /api/facturas/reportes/por-cliente
   * Reporte de ventas por cliente
   */
  async obtenerVentasPorCliente(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;

      if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({
          exito: false,
          mensaje: "Se requieren fechas de inicio y fin",
        });
      }

      const reporte = await servicioFactura.obtenerVentasPorCliente(
        fecha_inicio,
        fecha_fin
      );

      res.status(200).json({
        exito: true,
        datos: {
          periodo: { fecha_inicio, fecha_fin },
          clientes: reporte,
        },
      });
    } catch (error) {
      console.error("Error al generar reporte por cliente:", error);
      res.status(500).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }
}

module.exports = new ControladorFactura();
