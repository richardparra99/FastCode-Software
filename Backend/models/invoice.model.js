const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Factura = sequelize.define(
    "Factura",
    {
      numero_factura: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: "Número de factura correlativo",
      },
      fecha_factura: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: "Fecha de emisión de la factura",
      },
      cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "ID del cliente (opcional para ventas rápidas)",
      },
      pedido_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "ID del pedido asociado (opcional)",
      },
      nit: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: "NIT del cliente",
      },
      razon_social: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "Razón social o nombre del cliente",
      },
      subtotal: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "Subtotal antes de impuestos",
      },
      monto_impuesto: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
        comment: "Monto de impuestos (si aplica)",
      },
      monto_descuento: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
        comment: "Monto de descuentos aplicados",
      },
      monto_total: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: "Monto total de la factura en BOB",
      },
      estado: {
        type: DataTypes.ENUM("EMITIDA", "PAGADA", "ANULADA"),
        defaultValue: "EMITIDA",
        comment: "Estado de la factura",
      },
      metodo_pago: {
        type: DataTypes.ENUM("EFECTIVO", "TRANSFERENCIA", "TARJETA", "CREDITO"),
        defaultValue: "EFECTIVO",
        comment: "Método de pago utilizado",
      },
      notas: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Notas adicionales de la factura",
      },
      codigo_autorizacion: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "Código de autorización de dosificación SIN (Bolivia)",
      },
      codigo_control: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "Código de control fiscal",
      },
      emitida_por: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Usuario que emitió la factura",
      },
    },
    {
      tableName: "Facturas",
      timestamps: true,
    }
  );

  return Factura;
};
