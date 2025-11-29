const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unit_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
      tableName: "OrderItems",
      timestamps: false,
    }
  );
  return OrderItem;
};
