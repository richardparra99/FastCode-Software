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
    const transaccion = await sequelize.transaction();

    try {
      // Validar cliente
      if (datosFactura.clienteId) {
        const cliente = await Cliente.findByPk(datosFactura.clienteId, {
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

      // Validar productos
      for (const item of datosFactura.items) {
        const producto = await Producto.findByPk(item.productoId, {
          transaction: transaccion,
        });
        if (!producto) {
          throw new Error(`Producto con ID ${item.productoId} no encontrado`);
        }
      }

      // Generar número de factura
      const numeroFactura = await this.generarNumeroFactura();

      // Calcular totales
      let subtotal = 0;
      const itemsCalculados = [];

      for (const item of datosFactura.items) {
        const producto = await Producto.findByPk(item.productoId);
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

      // Calcular IVA (13%)
      const montoImpuesto = subtotal * 0.13;
      const montoTotal = subtotal + montoImpuesto;

      // Crear factura
      const factura = await Factura.create(
        {
          numero_factura: numeroFactura,
          fecha_factura: new Date(),
          cliente_id: datosFactura.clienteId || null,
          pedido_id: null,
          nit: datosFactura.nit || "0",
          razon_social: datosFactura.razonSocial || "Cliente Final",
          subtotal: subtotal,
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

      return await this.obtenerFacturaPorId(factura.id);
    } catch (error) {
      await transaccion.rollback();
      throw error;
    }
  }

  /**
   * Crear factura desde un pedido
   */
  async crearFacturaDesdePedido(idPedido, datosFactura, idUsuario) {
    const transaccion = await sequelize.transaction();

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
          nit: datosFactura.nit || pedido.client?.nit || "0",
          razon_social:
            datosFactura.razon_social || pedido.client?.name || "Sin Nombre",
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

      return await this.obtenerFacturaPorId(factura.id);
    } catch (error) {
      await transaccion.rollback();
      throw error;
    }
  }

  /**
   * Generar asiento contable de venta
   */
  async generarAsientoVenta(factura, idUsuario, transaccion) {
    // TODO: Aquí deberías configurar las cuentas contables según tu plan de cuentas
    // Este es un ejemplo básico. Ajusta según tus cuentas reales.

    const datosAsiento = {
      fecha_asiento: factura.fecha_factura,
      glosa: `Venta según factura ${factura.numero_factura} - Cliente: ${factura.razon_social}`,
      tipo: "VENTA",
      tipo_referencia: "Factura",
      id_referencia: factura.id,
      detalles: [],
    };

    // Debe: Caja/Banco (dependiendo del método de pago)
    // Esto es un ejemplo, debes usar el ID real de tu cuenta contable
    const mapeoMetodoPago = {
      EFECTIVO: 1, // ID de cuenta Caja
      TRANSFERENCIA: 2, // ID de cuenta Banco
      TARJETA: 3, // ID de cuenta Banco
      CREDITO: 4, // ID de Cuentas por Cobrar
    };

    datosAsiento.detalles.push({
      cuenta_id: mapeoMetodoPago[factura.metodo_pago] || 1,
      debe: parseFloat(factura.monto_total),
      haber: 0,
      descripcion: `Cobro ${factura.metodo_pago.toLowerCase()}`,
    });

    // Haber: Ingreso por Ventas
    // Usar ID real de tu cuenta de ingresos
    datosAsiento.detalles.push({
      cuenta_id: 10, // ID de cuenta "Ingresos por Ventas"
      debe: 0,
      haber: parseFloat(factura.subtotal),
      descripcion: "Ingreso por venta de productos",
    });

    // Si hay impuestos
    if (factura.monto_impuesto > 0) {
      datosAsiento.detalles.push({
        cuenta_id: 11, // ID de cuenta "IVA Débito Fiscal"
        debe: 0,
        haber: parseFloat(factura.monto_impuesto),
        descripcion: "IVA sobre ventas",
      });
    }

    // Si hay descuentos
    if (factura.monto_descuento > 0) {
      datosAsiento.detalles.push({
        cuenta_id: 12, // ID de cuenta "Descuentos Concedidos"
        debe: parseFloat(factura.monto_descuento),
        haber: 0,
        descripcion: "Descuento aplicado",
      });
    }

    // Nota: Este asiento se crearía pero necesitas tener las cuentas configuradas
    // Por ahora solo lo documentamos
    console.log("Asiento contable de venta generado:", datosAsiento);

    // Descomentar cuando tengas las cuentas creadas:
    // return await servicioContabilidad.crearAsientoContable(datosAsiento, idUsuario);
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
              attributes: ["id", "name", "price", "unit"],
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
          attributes: ["id", "name", "nit", "phone", "address"],
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
          attributes: ["id", "name", "nit"],
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
          attributes: ["id", "name", "nit", "phone"],
        },
      ],
      group: ["cliente_id", "cliente.id"],
      order: [[sequelize.fn("SUM", sequelize.col("monto_total")), "DESC"]],
    });
  }
}

module.exports = new ServicioFactura();
