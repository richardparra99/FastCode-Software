const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Cuenta = sequelize.define(
    "Cuenta",
    {
      codigo: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: {
          name: 'unique_codigo',
          msg: 'El código de cuenta debe ser único'
        }
      },
      nombre: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      tipo: {
        type: DataTypes.ENUM(
          "ACTIVO",
          "PASIVO",
          "PATRIMONIO",
          "INGRESO",
          "GASTO"
        ),
        allowNull: false
      },
      nivel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      padreId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      estaActiva: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      permiteMovimiento: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
    },
    {
      tableName: "Cuentas",
      timestamps: false, // La tabla no tiene created_at/updated_at
    }
  );

  return Cuenta;
};
