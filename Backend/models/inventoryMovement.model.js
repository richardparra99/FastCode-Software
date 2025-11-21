const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const InventoryMovement = sequelize.define(
    "InventoryMovement",
    {
    type: {
      type: DataTypes.ENUM(
        "INGRESO_COMPRA",
        "SALIDA_VENTA",
        "SALIDA_PRODUCCION",
        "AJUSTE",
        "MERMA"
      ),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    cost_at_moment: DataTypes.DECIMAL,
    reference_id: DataTypes.UUID,
    description: DataTypes.STRING,
  });
  return InventoryMovement;
};
