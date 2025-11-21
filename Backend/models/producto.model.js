const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Producto = sequelize.define(
    "Producto", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
  return Producto;
};
``;
