const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const LotOrder = sequelize.define(
    "LotOrder",
    {},
    {
      tableName: "LotOrders",
      timestamps: false,
    }
  );
  return LotOrder;
};
