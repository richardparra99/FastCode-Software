const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const AsientoContable = sequelize.define(
    "AsientoContable",
    {
      numeroAsiento: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: "numero_asiento",
        comment: "Número correlativo del asiento contable",
      },
      fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: "Fecha del asiento contable",
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Descripción o glosa del asiento contable",
      },
      tipo: {
        type: DataTypes.ENUM(
          "APERTURA",
          "OPERACION",
          "AJUSTE",
          "CIERRE",
          "COMPRA",
          "VENTA",
          "PRODUCCION"
        ),
        defaultValue: "OPERACION",
        comment: "Tipo de asiento contable",
      },
      estado: {
        type: DataTypes.ENUM("BORRADOR", "CONTABILIZADO", "ANULADO"),
        defaultValue: "BORRADOR",
        comment: "Estado del asiento contable",
      },
      totalDebe: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
        field: "total_debe",
        comment: "Total del debe del asiento",
      },
      totalHaber: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
        field: "total_haber",
        comment: "Total del haber del asiento",
      },
      tipoReferencia: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "tipo_referencia",
        comment:
          "Tipo de documento de referencia (Pedido, Factura, LoteProduccion, etc.)",
      },
      idReferencia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "id_referencia",
        comment: "ID del documento de referencia",
      },
      creadoPor: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "creado_por",
        comment: "ID del usuario que creó el asiento",
      },
      aprobadoPor: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "aprobado_por",
        comment: "ID del usuario que aprobó el asiento",
      },
      fechaAprobacion: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "fecha_aprobacion",
        comment: "Fecha y hora de aprobación",
      },
    },
    {
      tableName: "AsientoContables",
      timestamps: false,
    }
  );

  return AsientoContable;
};
