const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

async function ejecutarSQL() {
  const pool = new Pool({
    host: "localhost",
    port: 5505,
    database: "software",
    user: "postgres",
    password: "postgres",
  });

  try {
    const sql = fs.readFileSync(
      path.join(__dirname, "seed-cuentas.sql"),
      "utf8"
    );

    console.log("Ejecutando script SQL...");
    await pool.query(sql);
    console.log("✅ Script ejecutado exitosamente");

    // Verificar resultados
    const result = await pool.query('SELECT COUNT(*) as total FROM "Cuentas"');
    console.log(
      `Total de cuentas en la base de datos: ${result.rows[0].total}`
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error ejecutando SQL:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

ejecutarSQL();
