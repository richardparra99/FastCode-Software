const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  
  const Cliente = sequelize.define("Cliente", {
    full_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true 
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_whatsapp: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
  });
  return Cliente;
};
    ``