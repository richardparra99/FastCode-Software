const servicioContabilidad = require("../services/contabilidad.service");

class ControladorContabilidad {
  // ==========================================
  // PLAN DE CUENTAS
  // ==========================================

  /**
   * GET /api/contabilidad/plan-cuentas
   * Obtener plan de cuentas
   */
  async obtenerPlanCuentas(req, res) {
    try {
      const filtros = {
        tipo: req.query.tipo,
        esta_activa: req.query.esta_activa,
        nivel: req.query.nivel,
      };

      const cuentas = await servicioContabilidad.obtenerPlanCuentas(filtros);

      res.status(200).json({
        exito: true,
        datos: cuentas,
      });
    } catch (error) {
      console.error("Error al obtener plan de cuentas:", error);
      res.status(500).json({
        exito: false,
        mensaje: "Error al obtener plan de cuentas",
        error: error.message,
      });
    }
  }

  /**
   * POST /api/contabilidad/cuentas
   * Crear cuenta contable
   */
  async crearCuenta(req, res) {
    try {
      const cuenta = await servicioContabilidad.crearCuenta(req.body);

      res.status(201).json({
        exito: true,
        mensaje: "Cuenta creada exitosamente",
        datos: cuenta,
      });
    } catch (error) {
      console.error("Error al crear cuenta:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * PUT /api/contabilidad/cuentas/:id
   * Actualizar cuenta contable
   */
  async actualizarCuenta(req, res) {
    try {
      const cuenta = await servicioContabilidad.actualizarCuenta(
        req.params.id,
        req.body
      );

      res.status(200).json({
        exito: true,
        mensaje: "Cuenta actualizada exitosamente",
        datos: cuenta,
      });
    } catch (error) {
      console.error("Error al actualizar cuenta:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  // ==========================================
  // ASIENTOS CONTABLES
  // ==========================================

  /**
   * POST /api/contabilidad/asientos
   * Crear asiento contable
   */
  async crearAsiento(req, res) {
    try {
      // TODO: Obtener usuario del token JWT
      const idUsuario = req.user?.id || req.body.id_usuario || 1;

      const asiento = await servicioContabilidad.crearAsientoContable(
        req.body,
        idUsuario
      );

      res.status(201).json({
        exito: true,
        mensaje: "Asiento contable creado exitosamente",
        datos: asiento,
      });
    } catch (error) {
      console.error("Error al crear asiento:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * GET /api/contabilidad/asientos/:id
   * Obtener asiento por ID
   */
  async obtenerAsiento(req, res) {
    try {
      const asiento = await servicioContabilidad.obtenerAsientoPorId(
        req.params.id
      );

      if (!asiento) {
        return res.status(404).json({
          exito: false,
          mensaje: "Asiento no encontrado",
        });
      }

      res.status(200).json({
        exito: true,
        datos: asiento,
      });
    } catch (error) {
      console.error("Error al obtener asiento:", error);
      res.status(500).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * POST /api/contabilidad/asientos/:id/aprobar
   * Contabilizar asiento
   */
  async aprobarAsiento(req, res) {
    try {
      const idUsuario = req.user?.id || req.body.id_usuario || 1;

      const asiento = await servicioContabilidad.aprobarAsiento(
        req.params.id,
        idUsuario
      );

      res.status(200).json({
        exito: true,
        mensaje: "Asiento contabilizado exitosamente",
        datos: asiento,
      });
    } catch (error) {
      console.error("Error al contabilizar asiento:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * POST /api/contabilidad/asientos/:id/anular
   * Anular asiento
   */
  async anularAsiento(req, res) {
    try {
      const idUsuario = req.user?.id || req.body.id_usuario || 1;

      const asiento = await servicioContabilidad.anularAsiento(
        req.params.id,
        idUsuario
      );

      res.status(200).json({
        exito: true,
        mensaje: "Asiento anulado exitosamente",
        datos: asiento,
      });
    } catch (error) {
      console.error("Error al anular asiento:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  // ==========================================
  // REPORTES CONTABLES
  // ==========================================

  /**
   * GET /api/contabilidad/libro-diario
   * Libro Diario
   */
  async obtenerLibroDiario(req, res) {
    try {
      const { fecha_inicio, fecha_fin, tipo } = req.query;

      if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({
          exito: false,
          mensaje: "Se requieren fechas de inicio y fin",
        });
      }

      const filtros = { tipo };
      const asientos = await servicioContabilidad.obtenerLibroDiario(
        fecha_inicio,
        fecha_fin,
        filtros
      );

      res.status(200).json({
        exito: true,
        datos: {
          periodo: { fecha_inicio, fecha_fin },
          asientos,
        },
      });
    } catch (error) {
      console.error("Error al obtener libro diario:", error);
      res.status(500).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * GET /api/contabilidad/libro-mayor/:idCuenta
   * Libro Mayor de una cuenta
   */
  async obtenerLibroMayor(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;

      if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({
          exito: false,
          mensaje: "Se requieren fechas de inicio y fin",
        });
      }

      const libroMayor = await servicioContabilidad.obtenerLibroMayor(
        req.params.idCuenta,
        fecha_inicio,
        fecha_fin
      );

      res.status(200).json({
        exito: true,
        datos: libroMayor,
      });
    } catch (error) {
      console.error("Error al obtener libro mayor:", error);
      res.status(500).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * GET /api/contabilidad/libro-mayor-general
   * Libro Mayor de todas las cuentas (formato T)
   */
  async obtenerLibroMayorGeneral(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;

      if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({
          exito: false,
          mensaje: "Se requieren fechas de inicio y fin",
        });
      }

      const libroMayorGeneral = await servicioContabilidad.obtenerLibroMayorGeneral(
        fecha_inicio,
        fecha_fin
      );

      res.status(200).json({
        exito: true,
        datos: libroMayorGeneral,
      });
    } catch (error) {
      console.error("Error al obtener libro mayor general:", error);
      res.status(500).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * GET /api/contabilidad/balance-comprobacion
   * Balance de Comprobación
   */
  async obtenerBalanceComprobacion(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;

      if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({
          exito: false,
          mensaje: "Se requieren fechas de inicio y fin",
        });
      }

      const balance = await servicioContabilidad.obtenerBalanceComprobacion(
        fecha_inicio,
        fecha_fin
      );

      res.status(200).json({
        exito: true,
        datos: balance,
      });
    } catch (error) {
      console.error("Error al obtener balance de comprobación:", error);
      res.status(500).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * GET /api/contabilidad/balance-general
   * Balance General / Estado de Situación Financiera
   */
  async obtenerBalanceGeneral(req, res) {
    try {
      const { fecha } = req.query;

      if (!fecha) {
        return res.status(400).json({
          exito: false,
          mensaje: "Se requiere una fecha",
        });
      }

      const balanceGeneral = await servicioContabilidad.obtenerBalanceGeneral(
        fecha
      );

      res.status(200).json({
        exito: true,
        datos: balanceGeneral,
      });
    } catch (error) {
      console.error("Error al obtener balance general:", error);
      res.status(500).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * GET /api/contabilidad/estado-resultados
   * Estado de Resultados
   */
  async obtenerEstadoResultados(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;

      if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({
          exito: false,
          mensaje: "Se requieren fechas de inicio y fin",
        });
      }

      const estadoResultados =
        await servicioContabilidad.obtenerEstadoResultados(
          fecha_inicio,
          fecha_fin
        );

      res.status(200).json({
        exito: true,
        datos: estadoResultados,
      });
    } catch (error) {
      console.error("Error al obtener estado de resultados:", error);
      res.status(500).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }
}

const controladorInstance = new ControladorContabilidad();

// Exportar métodos con binding correcto
module.exports = {
  obtenerPlanCuentas:
    controladorInstance.obtenerPlanCuentas.bind(controladorInstance),
  crearCuenta: controladorInstance.crearCuenta.bind(controladorInstance),
  actualizarCuenta:
    controladorInstance.actualizarCuenta.bind(controladorInstance),
  crearAsiento: controladorInstance.crearAsiento.bind(controladorInstance),
  obtenerAsiento: controladorInstance.obtenerAsiento.bind(controladorInstance),
  aprobarAsiento: controladorInstance.aprobarAsiento.bind(controladorInstance),
  anularAsiento: controladorInstance.anularAsiento.bind(controladorInstance),
  obtenerLibroDiario:
    controladorInstance.obtenerLibroDiario.bind(controladorInstance),
  obtenerLibroMayor:
    controladorInstance.obtenerLibroMayor.bind(controladorInstance),
  obtenerLibroMayorGeneral:
    controladorInstance.obtenerLibroMayorGeneral.bind(controladorInstance),
  obtenerBalanceComprobacion:
    controladorInstance.obtenerBalanceComprobacion.bind(controladorInstance),
  obtenerBalanceGeneral:
    controladorInstance.obtenerBalanceGeneral.bind(controladorInstance),
  obtenerEstadoResultados:
    controladorInstance.obtenerEstadoResultados.bind(controladorInstance),
};
