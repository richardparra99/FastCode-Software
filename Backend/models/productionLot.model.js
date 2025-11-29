const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const ProductionLot = sequelize.define("ProductionLot", {
    lot_code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    quantity_planned: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity_produced: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    waste_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("PLANIFICADO", "EN_PROCESO", "TERMINADO", "CERRADO"),
      defaultValue: "PLANIFICADO",
    },
    production_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "ProductionLots",
    timestamps: true
  });
  return ProductionLot;
};
