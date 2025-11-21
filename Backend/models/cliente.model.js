const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Cliente = sequelize.define(
    "Cliente",
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isWhatsapp: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "Clientes",
      timestamps: true,
    }
  );
  return Cliente;
};
``;
