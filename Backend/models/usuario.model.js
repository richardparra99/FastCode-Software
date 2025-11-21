const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Usuario = sequelize.define(
    "Usuario",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("ADMIN", "VENTAS", "PRODUCCION", "CONTADOR"),
        defaultValue: "VENTAS",
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "Usuarios",
      timestamps: true,
    }
  );
  return Usuario;
};
