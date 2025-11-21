const { Cliente, Producto, Order, sequelize } = require("../models");

/**
 * Obtener estadísticas generales del dashboard
 */
const obtenerEstadisticas = async (req, res) => {
  try {
    // Obtener fecha actual y primer día del mes
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    // Contar clientes totales
    const totalClientes = await Cliente.count();

    // Contar productos activos
    const totalProductos = await Producto.count({
      where: { isActive: true },
    });

    // Contar órdenes del mes actual (ventas)
    const ventasMes = await Order.count({
      where: {
        createdAt: {
          [sequelize.Sequelize.Op.gte]: primerDiaMes,
        },
        status: {
          [sequelize.Sequelize.Op.notIn]: ["CANCELADO"],
        },
      },
    });

    // Sumar ingresos del mes actual
    const resultadoIngresos = await Order.sum("totalAmount", {
      where: {
        createdAt: {
          [sequelize.Sequelize.Op.gte]: primerDiaMes,
        },
        status: {
          [sequelize.Sequelize.Op.notIn]: ["CANCELADO"],
        },
      },
    });

    const ingresosMes = resultadoIngresos || 0;

    return res.status(200).json({
      exito: true,
      datos: {
        clientes: totalClientes,
        productos: totalProductos,
        ventas: ventasMes,
        ingresos: parseFloat(ingresosMes.toFixed(2)),
      },
      mensaje: "Estadísticas obtenidas correctamente",
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return res.status(500).json({
      exito: false,
      mensaje: "Error al obtener estadísticas del dashboard",
      error: error.message,
    });
  }
};

module.exports = {
  obtenerEstadisticas,
};
