const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  
  const Ingrediente = sequelize.define("Ingrediente", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unit: { // kg, litros, unidades
        type: DataTypes.STRING,
        allowNull: false
    },
    current_stock: {
        type: DataTypes.DECIMAL,
        defaultValue: 0
    },
    min_stock_alert: {
        type: DataTypes.DECIMAL,
        defaultValue: 5
    },
    cost_avg: {
        type: DataTypes.DECIMAL,
        defaultValue: 0
    }
  });
  return Ingrediente;
};
    