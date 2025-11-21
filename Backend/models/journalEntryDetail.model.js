const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const DetalleAsientoContable = sequelize.define(
    "DetalleAsientoContable",
    {
      numeroLinea: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "numero_linea",
        comment: "Número de línea dentro del asiento",
      },
      debe: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
        allowNull: false,
        validate: {
          min: 0,
        },
        comment: "Monto del debe en BOB",
      },
      haber: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
        allowNull: false,
        validate: {
          min: 0,
        },
        comment: "Monto del haber en BOB",
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Descripción adicional del movimiento",
      },
    },
    {
      tableName: "DetalleAsientoContables",
      timestamps: false,
      validate: {
        debeOHaberNoAmbos() {
          if (
            (this.debe > 0 && this.haber > 0) ||
            (this.debe === 0 && this.haber === 0)
          ) {
            throw new Error(
              "Una línea debe tener debe O haber, no ambos o ninguno"
            );
          }
        },
      },
    }
  );

  return DetalleAsientoContable;
};
