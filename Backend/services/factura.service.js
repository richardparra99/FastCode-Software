const {
  Factura,
  DetalleFactura,
  Order,
  Cliente,
  Usuario,
  OrderItem,
  Producto,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");
const servicioContabilidad = require("./contabilidad.service");

class ServicioFactura {
  /**
   * Generar número de factura correlativo
   */
  async generarNumeroFactura() {
    const año = new Date().getFullYear();
    const prefijo = `FAC-${año}-`;

    const ultimaFactura = await Factura.findOne({
      where: {
        numero_factura: {
          [Op.like]: `${prefijo}%`,
        },
      },
      order: [["numero_factura", "DESC"]],
    });

    let siguienteNumero = 1;
    if (ultimaFactura) {
      const ultimoNumero = parseInt(ultimaFactura.numero_factura.split("-")[2]);
      siguienteNumero = ultimoNumero + 1;
    }

    return `${prefijo}${String(siguienteNumero).padStart(6, "0")}`;
  }

  /**
   * Crear factura directamente (sin pedido previo)
   */
  async crearFacturaDirecta(datosFactura, idUsuario) {
    let transaccion;
    let factura;
    let cliente = null; // 👈 guardamos el cliente aquí

    try {
      transaccion = await sequelize.transaction();

      // Validar cliente
      if (datosFactura.clienteId) {
        cliente = await Cliente.findByPk(datosFactura.clienteId, {
          transaction: transaccion,
        });
        if (!cliente) {
          throw new Error("Cliente no encontrado");
        }
      }

      // Validar que hay items
      if (!datosFactura.items || datosFactura.items.length === 0) {
        throw new Error("Debe incluir al menos un producto");
      }

      // Validar productos + calcular totales
      let subtotal = 0;
      const itemsCalculados = [];

      for (const item of datosFactura.items) {
        const producto = await Producto.findByPk(item.productoId, {
          transaction: transaccion,
        });
        if (!producto) {
          throw new Error(`Producto con ID ${item.productoId} no encontrado`);
        }

        const precioUnitario = parseFloat(
          item.precioUnitario || producto.price
        );
        const cantidad = parseFloat(item.cantidad);
        const descuentoPorcentaje = parseFloat(item.descuento || 0);

        const subtotalItem = cantidad * precioUnitario;
        const descuentoMonto = (subtotalItem * descuentoPorcentaje) / 100;
        const totalItem = subtotalItem - descuentoMonto;

        subtotal += totalItem;

        itemsCalculados.push({
          productoId: item.productoId,
          descripcion: producto.name,
          cantidad,
          precioUnitario,
          descuento: descuentoPorcentaje,
          subtotal: totalItem,
        });
      }

      // Generar número de factura
      const numeroFactura = await this.generarNumeroFactura();

      // Calcular IVA (13%)
      const montoImpuesto = subtotal * 0.13;
      const montoTotal = subtotal + montoImpuesto;

      const razonSocialFinal =
        datosFactura.razonSocial ||
        cliente?.fullName ||
        cliente?.full_name ||
        "Cliente Final";


      // Crear factura
      factura = await Factura.create(
        {
          numero_factura: numeroFactura,
          fecha_factura: new Date(),
          cliente_id: datosFactura.clienteId || null,
          cliente_nombre: cliente?.fullName || "Cliente Final 2",
          pedido_id: null,
          //nit: datosFactura.nit || "0",
          razon_social: razonSocialFinal,
          subtotal,
          monto_impuesto: montoImpuesto,
          monto_descuento: 0,
          monto_total: montoTotal,
          estado: "EMITIDA",
          metodo_pago: datosFactura.metodoPago || "EFECTIVO",
          notas: datosFactura.notas || null,
          codigo_autorizacion: datosFactura.codigoAutorizacion || null,
          codigo_control: datosFactura.codigoControl || null,
          emitida_por: idUsuario,
        },
        { transaction: transaccion }
      );

      // Crear detalles de factura
      for (const item of itemsCalculados) {
        await DetalleFactura.create(
          {
            facturaId: factura.id,
            ...item,
          },
          { transaction: transaccion }
        );
      }

      await transaccion.commit();
    } catch (error) {
      if (transaccion && !transaccion.finished) {
        await transaccion.rollback();
      }
      throw error;
    }

    // Generar asiento después del commit
    try {
      await this.generarAsientoVenta(factura, idUsuario);
    } catch (e) {
      console.warn(
        "Factura creada pero no se pudo generar asiento:",
        e.message
      );
    }

    return factura;
  }
  /**
   * Crear factura desde un pedido
   */
  async crearFacturaDesdePedido(idPedido, datosFactura, idUsuario) {
    const transaccion = await sequelize.transaction();

    let facturaId;

    try {
      // Validar que el pedido existe y está en estado ENTREGADO
      const pedido = await Order.findByPk(idPedido, {
        include: [
          {
            model: Cliente,
            as: "client",
          },
          {
            model: OrderItem,
            include: [{ model: Producto }],
          },
        ],
        transaction: transaccion,
      });

      if (!pedido) {
        throw new Error("Pedido no encontrado");
      }

      if (pedido.status !== "ENTREGADO") {
        throw new Error("Solo se pueden facturar pedidos entregados");
      }

      // Verificar que no exista factura previa
      const facturaExistente = await Factura.findOne({
        where: { pedido_id: idPedido },
        transaction: transaccion,
      });

      if (facturaExistente) {
        throw new Error("Este pedido ya tiene una factura asociada");
      }

      // Generar número de factura
      const numeroFactura = await this.generarNumeroFactura();

      // Calcular montos
      const subtotal = parseFloat(pedido.total_amount);
      const montoImpuesto = datosFactura.monto_impuesto || 0;
      const montoDescuento = datosFactura.monto_descuento || 0;
      const montoTotal = subtotal + montoImpuesto - montoDescuento;

      // Crear factura
      const factura = await Factura.create(
        {
          numero_factura: numeroFactura,
          fecha_factura: new Date(),
          pedido_id: idPedido,
          cliente_id: pedido.client_id,
          //nit: datosFactura.nit || pedido.client?.nit || "0",
          razon_social:
            datosFactura.razon_social || pedido.client?.fullName || "Sin Nombre",
          subtotal: subtotal,
          monto_impuesto: montoImpuesto,
          monto_descuento: montoDescuento,
          monto_total: montoTotal,
          estado: "EMITIDA",
          metodo_pago: datosFactura.metodo_pago || "EFECTIVO",
          notas: datosFactura.notas,
          codigo_autorizacion: datosFactura.codigo_autorizacion,
          codigo_control: datosFactura.codigo_control,
          emitida_por: idUsuario,
        },
        { transaction: transaccion }
      );

      // Generar asiento contable automático (VENTA)
      await this.generarAsientoVenta(factura, idUsuario, transaccion);

      await transaccion.commit();

      facturaId = factura.id;
    } catch (error) {
      await transaccion.rollback();
      throw error;
    }

    return await this.obtenerFacturaPorId(facturaId);
  }
  /**
   * Generar asiento contable de venta
   */
  async generarAsientoVenta(factura, idUsuario) {
    try {
      // Buscar las cuentas contables por código
      const { Cuenta } = require("../models");

      // Mapeo de métodos de pago a códigos de cuenta
      const codigoCuentaPorMetodoPago = {
        EFECTIVO: "1.1.01.001", // Caja General
        TRANSFERENCIA: "1.1.01.003", // Banco Nacional - Cuenta Corriente
        TARJETA: "1.1.01.003", // Banco Nacional - Cuenta Corriente
        CREDITO: "1.1.02.001", // Clientes (Cuentas por Cobrar)
      };

      const codigoCuenta = codigoCuentaPorMetodoPago[factura.metodo_pago] || "1.1.01.001";

      // Buscar las cuentas
      const cuentaCobro = await Cuenta.findOne({ where: { codigo: codigoCuenta } });
      const cuentaVentas = await Cuenta.findOne({ where: { codigo: "4.1.01" } }); // Ventas de Productos
      const cuentaIVA = await Cuenta.findOne({ where: { codigo: "2.1.03.001" } }); // IVA por Pagar

      if (!cuentaCobro || !cuentaVentas) {
        console.error("No se encontraron las cuentas contables necesarias");
        throw new Error("No se encontraron las cuentas contables necesarias para generar el asiento");
      }

      const datosAsiento = {
        fecha: factura.fecha_factura,
        descripcion: `Venta según factura ${factura.numero_factura} - Cliente: ${factura.razon_social}`,
        tipo: "VENTA",
        tipoReferencia: "Factura",
        idReferencia: factura.id,
        detalles: [],
      };

      // Registro del cobro (DEBE)
      datosAsiento.detalles.push({
        cuentaId: cuentaCobro.id,
        debe: Number(factura.monto_total),
        haber: 0,
        descripcion: `Cobro ${factura.metodo_pago.toLowerCase()}`,
      });

      // Registro de la venta (HABER)
      datosAsiento.detalles.push({
        cuentaId: cuentaVentas.id,
        debe: 0,
        haber: Number(factura.subtotal),
        descripcion: "Ingreso por venta de productos",
      });

      // Registro del IVA por pagar (HABER)
      if (factura.monto_impuesto > 0 && cuentaIVA) {
        datosAsiento.detalles.push({
          cuentaId: cuentaIVA.id,
          debe: 0,
          haber: Number(factura.monto_impuesto),
          descripcion: "IVA sobre ventas",
        });
      }

      // Crear el asiento contable
      const asiento = await servicioContabilidad.crearAsientoContable(
        datosAsiento,
        idUsuario
      );

      // Aprobar automáticamente el asiento
      await servicioContabilidad.aprobarAsiento(asiento.id, idUsuario);

      return asiento;
    } catch (error) {
      console.error("Error al generar asiento de venta:", error);
      throw error;
    }
  }

  /**
   * Obtener factura por ID
   */
  async obtenerFacturaPorId(id) {
    return await Factura.findByPk(id, {
      include: [
        {
          model: DetalleFactura,
          as: "detalles",
          include: [
            {
              model: Producto,
              as: "producto",
              attributes: ["id", "name", "price"],
            },
          ],
        },
        {
          model: Order,
          as: "pedido",
          required: false,
          include: [
            {
              model: OrderItem,
              include: [{ model: Producto }],
            },
          ],
        },
        {
          model: Cliente,
          as: "cliente",
          required: false,
          attributes: ["id", "fullName", "phone", "address"],
        },
        {
          model: Usuario,
          as: "emisor",
          attributes: ["id", "username", "full_name"],
        },
      ],
    });
  }

  /**
   * Listar facturas con filtros
   */
  async obtenerTodasFacturas(filtros = {}) {
    const donde = {};

    if (filtros.estado) {
      donde.estado = filtros.estado;
    }

    if (filtros.cliente_id) {
      donde.cliente_id = filtros.cliente_id;
    }

    if (filtros.metodo_pago) {
      donde.metodo_pago = filtros.metodo_pago;
    }

    if (filtros.fecha_inicio && filtros.fecha_fin) {
      donde.fecha_factura = {
        [Op.between]: [filtros.fecha_inicio, filtros.fecha_fin],
      };
    }

    return await Factura.findAll({
      where: donde,
      include: [
        {
          model: DetalleFactura,
          as: "detalles",
          include: [
            {
              model: Producto,
              as: "producto",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: Order,
          as: "pedido",
          required: false,
          attributes: ["id", "status", "delivery_date"],
        },
        {
          model: Cliente,
          as: "cliente",
          required: false,
          attributes: ["id", "fullName"],
        },
        {
          model: Usuario,
          as: "emisor",
          attributes: ["id", "username", "full_name"],
        },
      ],
      order: [
        ["fecha_factura", "DESC"],
        ["numero_factura", "DESC"],
      ],
    });
  }

  /**
   * Actualizar estado de factura
   */
  async actualizarEstadoFactura(id, estado, idUsuario) {
    const factura = await Factura.findByPk(id);

    if (!factura) {
      throw new Error("Factura no encontrada");
    }

    const estadosValidos = ["EMITIDA", "PAGADA", "ANULADA"];
    if (!estadosValidos.includes(estado)) {
      throw new Error("Estado inválido");
    }

    if (factura.estado === "ANULADA") {
      throw new Error("No se puede modificar una factura anulada");
    }

    return await factura.update({ estado });
  }

  /**
   * Anular factura
   */
  async anularFactura(id, idUsuario) {
    const transaccion = await sequelize.transaction();

    try {
      const factura = await Factura.findByPk(id, { transaction: transaccion });

      if (!factura) {
        throw new Error("Factura no encontrada");
      }

      if (factura.estado === "ANULADA") {
        throw new Error("La factura ya está anulada");
      }

      await factura.update({ estado: "ANULADA" }, { transaction: transaccion });

      // TODO: Generar asiento contable de anulación/reversión

      await transaccion.commit();
      return factura;
    } catch (error) {
      await transaccion.rollback();
      throw error;
    }
  }

  /**
   * Reporte de ventas por periodo
   */
  async obtenerReporteVentas(fechaInicio, fechaFin, agruparPor = "dia") {
    const facturas = await Factura.findAll({
      where: {
        fecha_factura: {
          [Op.between]: [fechaInicio, fechaFin],
        },
        estado: {
          [Op.ne]: "ANULADA",
        },
      },
      attributes: [
        "fecha_factura",
        "metodo_pago",
        [sequelize.fn("SUM", sequelize.col("monto_total")), "total_ventas"],
        [sequelize.fn("COUNT", sequelize.col("id")), "cantidad_facturas"],
      ],
      group: ["fecha_factura", "metodo_pago"],
      order: [["fecha_factura", "ASC"]],
    });

    return facturas;
  }

  /**
   * Reporte de ventas por cliente
   */
  async obtenerVentasPorCliente(fechaInicio, fechaFin) {
    return await Factura.findAll({
      where: {
        fecha_factura: {
          [Op.between]: [fechaInicio, fechaFin],
        },
        estado: {
          [Op.ne]: "ANULADA",
        },
      },
      attributes: [
        "cliente_id",
        [sequelize.fn("SUM", sequelize.col("monto_total")), "total_ventas"],
        [sequelize.fn("COUNT", sequelize.col("id")), "cantidad_facturas"],
      ],
      include: [
        {
          model: Cliente,
          as: "cliente",
          attributes: ["id", "fullName", "phone"],
        },
      ],
      group: ["cliente_id", "cliente.id"],
      order: [[sequelize.fn("SUM", sequelize.col("monto_total")), "DESC"]],
    });
  }
}

module.exports = new ServicioFactura();
