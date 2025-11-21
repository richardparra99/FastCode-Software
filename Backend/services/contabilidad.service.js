const {
  Cuenta,
  AsientoContable,
  DetalleAsientoContable,
  Usuario,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

class ServicioContabilidad {
  // ==========================================
  // PLAN DE CUENTAS
  // ==========================================

  /**
   * Obtener todas las cuentas del plan de cuentas
   */
  async obtenerPlanCuentas(filtros = {}) {
    const donde = {};

    if (filtros.tipo) {
      donde.tipo = filtros.tipo;
    }

    if (filtros.estaActiva !== undefined) {
      donde.estaActiva = filtros.estaActiva;
    }

    if (filtros.nivel) {
      donde.nivel = filtros.nivel;
    }

    return await Cuenta.findAll({
      where: donde,
      include: [
        {
          model: Cuenta,
          as: "cuentaPadre",
          attributes: ["id", "codigo", "nombre"],
        },
        {
          model: Cuenta,
          as: "subcuentas",
          attributes: ["id", "codigo", "nombre", "tipo"],
        },
      ],
      order: [["codigo", "ASC"]],
    });
  }

  /**
   * Crear una nueva cuenta contable
   */
  async crearCuenta(datosCuenta) {
    // Validar que el código no exista
    const cuentaExistente = await Cuenta.findOne({
      where: { codigo: datosCuenta.codigo },
    });

    if (cuentaExistente) {
      throw new Error(`La cuenta con código ${datosCuenta.codigo} ya existe`);
    }

    // Validar cuenta padre si existe
    if (datosCuenta.padreId) {
      const cuentaPadre = await Cuenta.findByPk(datosCuenta.padreId);
      if (!cuentaPadre) {
        throw new Error("La cuenta padre no existe");
      }

      // El nivel debe ser mayor que el padre
      if (datosCuenta.nivel <= cuentaPadre.nivel) {
        throw new Error("El nivel de la cuenta debe ser mayor al de su padre");
      }
    }

    return await Cuenta.create(datosCuenta);
  }

  /**
   * Actualizar una cuenta contable
   */
  async actualizarCuenta(id, datosCuenta) {
    const cuenta = await Cuenta.findByPk(id);

    if (!cuenta) {
      throw new Error("Cuenta no encontrada");
    }

    return await cuenta.update(datosCuenta);
  }

  // ==========================================
  // ASIENTOS CONTABLES
  // ==========================================

  /**
   * Generar número de asiento correlativo
   */
  async generarNumeroAsiento() {
    const año = new Date().getFullYear();
    const prefijo = `AST-${año}-`;

    const ultimoAsiento = await AsientoContable.findOne({
      where: {
        numeroAsiento: {
          [Op.like]: `${prefijo}%`,
        },
      },
      order: [["numeroAsiento", "DESC"]],
    });

    let siguienteNumero = 1;
    if (ultimoAsiento) {
      const ultimoNumero = parseInt(ultimoAsiento.numeroAsiento.split("-")[2]);
      siguienteNumero = ultimoNumero + 1;
    }

    return `${prefijo}${String(siguienteNumero).padStart(6, "0")}`;
  }

  /**
   * Crear asiento contable con validación de partida doble
   */
  async crearAsientoContable(datosAsiento, idUsuario) {
    const transaccion = await sequelize.transaction();

    try {
      const { detalles, ...datosCabecera } = datosAsiento;

      // Validar que existan detalles
      if (!detalles || detalles.length < 2) {
        throw new Error("Un asiento debe tener al menos 2 líneas");
      }

      // Calcular totales
      let totalDebe = 0;
      let totalHaber = 0;

      for (const detalle of detalles) {
        totalDebe += parseFloat(detalle.debe || 0);
        totalHaber += parseFloat(detalle.haber || 0);
      }

      // Validar partida doble (debe = haber)
      if (Math.abs(totalDebe - totalHaber) > 0.01) {
        throw new Error(
          `El asiento no está balanceado. Debe: ${totalDebe}, Haber: ${totalHaber}`
        );
      }

      // Generar número de asiento
      const numeroAsiento = await this.generarNumeroAsiento();

      // Crear cabecera
      const asientoContable = await AsientoContable.create(
        {
          ...datosCabecera,
          numeroAsiento: numeroAsiento,
          totalDebe: totalDebe,
          totalHaber: totalHaber,
          creadoPor: idUsuario,
          estado: "BORRADOR",
        },
        { transaction: transaccion }
      );

      // Crear detalles
      for (let i = 0; i < detalles.length; i++) {
        const detalle = detalles[i];

        // Validar que la cuenta existe y permite movimientos
        const cuenta = await Cuenta.findByPk(detalle.cuentaId);
        if (!cuenta) {
          throw new Error(`La cuenta ${detalle.cuentaId} no existe`);
        }

        if (!cuenta.permiteMovimiento) {
          throw new Error(
            `La cuenta ${cuenta.nombre} no permite movimientos directos`
          );
        }

        await DetalleAsientoContable.create(
          {
            asientoContableId: asientoContable.id,
            cuentaId: detalle.cuentaId,
            numeroLinea: i + 1,
            debe: detalle.debe || 0,
            haber: detalle.haber || 0,
            descripcion: detalle.descripcion,
          },
          { transaction: transaccion }
        );
      }

      await transaccion.commit();

      // Retornar con detalles
      return await this.obtenerAsientoPorId(asientoContable.id);
    } catch (error) {
      await transaccion.rollback();
      throw error;
    }
  }

  /**
   * Obtener asiento contable por ID
   */
  async obtenerAsientoPorId(id) {
    return await AsientoContable.findByPk(id, {
      include: [
        {
          model: DetalleAsientoContable,
          as: "detalles",
          include: [
            {
              model: Cuenta,
              as: "cuenta",
              attributes: ["idCuenta", "codigo", "nombre", "tipo"],
            },
          ],
          order: [["numeroLinea", "ASC"]],
        },
        {
          model: Usuario,
          as: "creador",
          attributes: ["id", "username", "full_name"],
        },
        {
          model: Usuario,
          as: "aprobador",
          attributes: ["id", "username", "full_name"],
        },
      ],
    });
  }

  /**
   * Contabilizar (aprobar) un asiento
   */
  async aprobarAsiento(id, idUsuario) {
    const asiento = await AsientoContable.findByPk(id);

    if (!asiento) {
      throw new Error("Asiento no encontrado");
    }

    if (asiento.estado !== "BORRADOR") {
      throw new Error(
        "Solo se pueden contabilizar asientos en estado BORRADOR"
      );
    }

    return await asiento.update({
      estado: "CONTABILIZADO",
      aprobadoPor: idUsuario,
      fechaAprobacion: new Date(),
    });
  }

  /**
   * Anular un asiento
   */
  async anularAsiento(id, idUsuario) {
    const asiento = await AsientoContable.findByPk(id);

    if (!asiento) {
      throw new Error("Asiento no encontrado");
    }

    if (asiento.estado === "ANULADO") {
      throw new Error("El asiento ya está anulado");
    }

    return await asiento.update({
      estado: "ANULADO",
    });
  }

  // ==========================================
  // REPORTES CONTABLES
  // ==========================================

  /**
   * Libro Diario - Todos los asientos en un rango de fechas
   */
  async obtenerLibroDiario(fechaInicio, fechaFin, filtros = {}) {
    const donde = {
      fecha: {
        [Op.between]: [fechaInicio, fechaFin],
      },
      estado: "CONTABILIZADO",
    };

    if (filtros.tipo) {
      donde.tipo = filtros.tipo;
    }

    return await AsientoContable.findAll({
      where: donde,
      include: [
        {
          model: DetalleAsientoContable,
          as: "detalles",
          include: [
            {
              model: Cuenta,
              as: "cuenta",
              attributes: ["id", "codigo", "nombre", "tipo"],
            },
          ],
          order: [["numeroLinea", "ASC"]],
        },
      ],
      order: [
        ["fecha", "ASC"],
        ["numeroAsiento", "ASC"],
      ],
    });
  }

  /**
   * Libro Mayor - Movimientos de una cuenta específica
   */
  async obtenerLibroMayor(idCuenta, fechaInicio, fechaFin) {
    const cuenta = await Cuenta.findByPk(idCuenta);

    if (!cuenta) {
      throw new Error("Cuenta no encontrada");
    }

    const detalles = await DetalleAsientoContable.findAll({
      where: {
        cuentaId: idCuenta,
      },
      include: [
        {
          model: AsientoContable,
          as: "asientoContable",
          where: {
            fecha: {
              [Op.between]: [fechaInicio, fechaFin],
            },
            estado: "CONTABILIZADO",
          },
          attributes: ["id", "numeroAsiento", "fecha", "descripcion", "tipo"],
        },
      ],
      order: [
        [{ model: AsientoContable, as: "asientoContable" }, "fecha", "ASC"],
        [
          { model: AsientoContable, as: "asientoContable" },
          "numeroAsiento",
          "ASC",
        ],
      ],
    });

    // Calcular saldo acumulado
    let saldo = 0;
    const movimientos = detalles.map((detalle) => {
      const debe = parseFloat(detalle.debe);
      const haber = parseFloat(detalle.haber);

      // Naturaleza de la cuenta
      if (["ACTIVO", "GASTO"].includes(cuenta.tipo)) {
        saldo += debe - haber;
      } else {
        saldo += haber - debe;
      }

      return {
        fecha: detalle.asientoContable.fecha,
        numeroAsiento: detalle.asientoContable.numeroAsiento,
        descripcion: detalle.asientoContable.descripcion,
        tipo: detalle.asientoContable.tipo,
        debe: debe,
        haber: haber,
        saldo: saldo,
      };
    });

    return {
      cuenta: {
        id: cuenta.id,
        codigo: cuenta.codigo,
        nombre: cuenta.nombre,
        tipo: cuenta.tipo,
      },
      movimientos,
      saldoFinal: saldo,
    };
  }

  /**
   * Balance de Comprobación - Saldos de todas las cuentas
   */
  async obtenerBalanceComprobacion(fechaInicio, fechaFin) {
    // Obtener todas las cuentas que permiten movimientos
    const cuentas = await Cuenta.findAll({
      where: {
        permiteMovimiento: true,
        estaActiva: true,
      },
      order: [["codigo", "ASC"]],
    });

    const saldos = [];

    for (const cuenta of cuentas) {
      // Obtener todos los movimientos de la cuenta
      const detalles = await DetalleAsientoContable.findAll({
        where: {
          cuentaId: cuenta.id,
        },
        include: [
          {
            model: AsientoContable,
            as: "asientoContable",
            where: {
              fecha: {
                [Op.between]: [fechaInicio, fechaFin],
              },
              estado: "CONTABILIZADO",
            },
            attributes: [],
          },
        ],
      });

      let totalDebe = 0;
      let totalHaber = 0;

      detalles.forEach((detalle) => {
        totalDebe += parseFloat(detalle.debe);
        totalHaber += parseFloat(detalle.haber);
      });

      // Calcular saldo deudor o acreedor
      const diferencia = totalDebe - totalHaber;
      let saldoDeudor = 0;
      let saldoAcreedor = 0;

      if (diferencia > 0) {
        saldoDeudor = diferencia;
      } else if (diferencia < 0) {
        saldoAcreedor = Math.abs(diferencia);
      }

      // Solo incluir cuentas con movimientos
      if (totalDebe > 0 || totalHaber > 0) {
        saldos.push({
          codigoCuenta: cuenta.codigo,
          nombreCuenta: cuenta.nombre,
          tipoCuenta: cuenta.tipo,
          totalDebe: totalDebe,
          totalHaber: totalHaber,
          saldoDeudor: saldoDeudor,
          saldoAcreedor: saldoAcreedor,
        });
      }
    }

    // Calcular totales
    const totales = saldos.reduce(
      (acumulador, item) => ({
        totalDebe: acumulador.totalDebe + item.totalDebe,
        totalHaber: acumulador.totalHaber + item.totalHaber,
        totalSaldoDeudor: acumulador.totalSaldoDeudor + item.saldoDeudor,
        totalSaldoAcreedor: acumulador.totalSaldoAcreedor + item.saldoAcreedor,
      }),
      {
        totalDebe: 0,
        totalHaber: 0,
        totalSaldoDeudor: 0,
        totalSaldoAcreedor: 0,
      }
    );

    return {
      periodo: { fechaInicio, fechaFin },
      saldos,
      totales,
    };
  }

  /**
   * Balance General - Estado de Situación Financiera
   */
  async obtenerBalanceGeneral(fecha) {
    const cuentas = await Cuenta.findAll({
      where: {
        tipo: ["ACTIVO", "PASIVO", "PATRIMONIO"],
        permiteMovimiento: true,
        estaActiva: true,
      },
      order: [
        ["tipo", "ASC"],
        ["codigo", "ASC"],
      ],
    });

    const saldos = {
      ACTIVO: [],
      PASIVO: [],
      PATRIMONIO: [],
    };

    for (const cuenta of cuentas) {
      const detalles = await DetalleAsientoContable.findAll({
        where: {
          cuentaId: cuenta.id,
        },
        include: [
          {
            model: AsientoContable,
            as: "asientoContable",
            where: {
              fecha: {
                [Op.lte]: fecha,
              },
              estado: "CONTABILIZADO",
            },
            attributes: [],
          },
        ],
      });

      let saldo = 0;
      detalles.forEach((detalle) => {
        const debe = parseFloat(detalle.debe);
        const haber = parseFloat(detalle.haber);

        if (cuenta.tipo === "ACTIVO") {
          saldo += debe - haber;
        } else {
          saldo += haber - debe;
        }
      });

      if (saldo !== 0) {
        saldos[cuenta.tipo].push({
          codigo: cuenta.codigo,
          nombre: cuenta.nombre,
          saldo: Math.abs(saldo),
        });
      }
    }

    // Calcular totales
    const totalActivo = saldos.ACTIVO.reduce(
      (suma, item) => suma + item.saldo,
      0
    );
    const totalPasivo = saldos.PASIVO.reduce(
      (suma, item) => suma + item.saldo,
      0
    );
    const totalPatrimonio = saldos.PATRIMONIO.reduce(
      (suma, item) => suma + item.saldo,
      0
    );

    return {
      fecha,
      activos: {
        cuentas: saldos.ACTIVO,
        total: totalActivo,
      },
      pasivos: {
        cuentas: saldos.PASIVO,
        total: totalPasivo,
      },
      patrimonio: {
        cuentas: saldos.PATRIMONIO,
        total: totalPatrimonio,
      },
      totalPasivoPatrimonio: totalPasivo + totalPatrimonio,
      estaBalanceado:
        Math.abs(totalActivo - (totalPasivo + totalPatrimonio)) < 0.01,
    };
  }

  /**
   * Estado de Resultados - Ingresos y Gastos
   */
  async obtenerEstadoResultados(fechaInicio, fechaFin) {
    const cuentas = await Cuenta.findAll({
      where: {
        tipo: ["INGRESO", "GASTO"],
        permiteMovimiento: true,
        estaActiva: true,
      },
      order: [
        ["tipo", "ASC"],
        ["codigo", "ASC"],
      ],
    });

    const saldos = {
      INGRESO: [],
      GASTO: [],
    };

    for (const cuenta of cuentas) {
      const detalles = await DetalleAsientoContable.findAll({
        where: {
          cuentaId: cuenta.id,
        },
        include: [
          {
            model: AsientoContable,
            as: "asientoContable",
            where: {
              fecha: {
                [Op.between]: [fechaInicio, fechaFin],
              },
              estado: "CONTABILIZADO",
            },
            attributes: [],
          },
        ],
      });

      let saldo = 0;
      detalles.forEach((detalle) => {
        const debe = parseFloat(detalle.debe);
        const haber = parseFloat(detalle.haber);
        saldo += haber - debe; // Los ingresos son créditos, gastos son débitos
      });

      if (saldo !== 0) {
        saldos[cuenta.tipo].push({
          codigo: cuenta.codigo,
          nombre: cuenta.nombre,
          monto: Math.abs(saldo),
        });
      }
    }

    const totalIngresos = saldos.INGRESO.reduce(
      (suma, item) => suma + item.monto,
      0
    );
    const totalGastos = saldos.GASTO.reduce(
      (suma, item) => suma + item.monto,
      0
    );
    const utilidadNeta = totalIngresos - totalGastos;

    return {
      periodo: { fechaInicio, fechaFin },
      ingresos: {
        cuentas: saldos.INGRESO,
        total: totalIngresos,
      },
      gastos: {
        cuentas: saldos.GASTO,
        total: totalGastos,
      },
      utilidadNeta: utilidadNeta,
    };
  }
}

module.exports = new ServicioContabilidad();
