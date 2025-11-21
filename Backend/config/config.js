const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  database: "software",
  username: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5505,
  define: {
    underscored: true, // Convierte automáticamente entre camelCase y snake_case
    freezeTableName: true,
  },
  logging: false, // Desactiva logs SQL en consola
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida exitosamente.");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
};

module.exports = { sequelize, connectDB };
