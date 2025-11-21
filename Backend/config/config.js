// config/database.js
const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('software', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres', 
  port: 5501, 

});


const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida exitosamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    
  }
};

module.exports = { sequelize, connectDB };