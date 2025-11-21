const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Order = sequelize.define(
    "Order",
    {
      status: {
        type: DataTypes.ENUM(
          "NUEVO",
          "EN_PRODUCCION",
          "LISTO",
          "ENTREGADO",
          "CANCELADO"
        ),
        defaultValue: "NUEVO",
      },
      deliveryDate: {
        type: DataTypes.DATE,
      },
      totalAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      notes: DataTypes.TEXT,
      deliveryProofUrl: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "Orders",
      timestamps: true,
    }
  );
  return Order;
};
``;
