const { Client } = require("pg");

async function crearBaseDatos() {
  // Conectar a la base de datos 'postgres' para crear la nueva BD
  const client = new Client({
    host: "localhost",
    port: 5501,
    database: "postgres",
    user: "postgres",
    password: "postgres",
  });

  try {
    await client.connect();
    console.log("Conectado a PostgreSQL");

    // Verificar si la BD existe
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'software'"
    );

    if (result.rows.length === 0) {
      // Crear la base de datos
      await client.query("CREATE DATABASE software");
      console.log("✅ Base de datos 'software' creada exitosamente");
    } else {
      console.log("ℹ️ La base de datos 'software' ya existe");
    }

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

crearBaseDatos();
