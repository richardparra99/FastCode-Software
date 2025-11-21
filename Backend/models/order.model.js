const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Order = sequelize.define("Order", {
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
    delivery_date: DataTypes.DATE,
    total_amount: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
    },
    notes: DataTypes.TEXT,
    delivery_proof_url: DataTypes.TEXT,
  });
  return Order;
};
``;
