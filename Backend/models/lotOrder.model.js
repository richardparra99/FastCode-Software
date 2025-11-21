const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const LotOrder = sequelize.define(
    "LotOrder",
    {},
    {
      timestamps: false,
    }
  );
  return LotOrder;
};
