const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Cuenta = sequelize.define(
    "Cuenta",
    {
      codigo: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        comment: "Código contable (ej: 1.1.01.001)",
      },
      nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "Nombre de la cuenta (ej: Caja General)",
      },
      tipo: {
        type: DataTypes.ENUM(
          "ACTIVO",
          "PASIVO",
          "PATRIMONIO",
          "INGRESO",
          "GASTO"
        ),
        allowNull: false,
        comment: "Tipo de cuenta según naturaleza contable",
      },
      nivel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: "Nivel jerárquico (1=Grupo, 2=Subgrupo, 3=Mayor, 4=Auxiliar)",
      },
      padreId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "ID de la cuenta padre para jerarquía",
      },
      estaActiva: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: "Indica si la cuenta está activa",
      },
      permiteMovimiento: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: "Si permite movimientos directos (false para cuentas padre)",
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Descripción adicional de la cuenta",
      },
    },
    {
      tableName: "Cuentas",
      timestamps: false, // La tabla no tiene created_at/updated_at
    }
  );

  return Cuenta;
};
