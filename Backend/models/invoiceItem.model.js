const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const DetalleFactura = sequelize.define(
    "DetalleFactura",
    {
      facturaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID de la factura",
      },
      productoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID del producto",
      },
      descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "Descripción del producto/servicio",
      },
      cantidad: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "Cantidad vendida",
      },
      precioUnitario: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: "Precio unitario del producto",
      },
      descuento: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        comment: "Porcentaje de descuento aplicado",
      },
      subtotal: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: "Subtotal del item (cantidad * precio - descuento)",
      },
    },
    {
      tableName: "DetallesFactura",
      timestamps: false,
    }
  );

  return DetalleFactura;
};
