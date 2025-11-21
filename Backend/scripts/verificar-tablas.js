const { Pool } = require("pg");

async function verificarTablas() {
  const pool = new Pool({
    host: "localhost",
    port: 5501,
    database: "software",
    user: "postgres",
    password: "postgres",
  });

  try {
    // Verificar columnas de AuthTokens
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'AuthTokens'
      ORDER BY ordinal_position;
    `);

    console.log("Columnas de la tabla AuthTokens:");
    result.rows.forEach((row) => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

    // Verificar columnas de Clientes
    const result2 = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Clientes'
      ORDER BY ordinal_position;
    `);

    console.log("\nColumnas de la tabla Clientes:");
    result2.rows.forEach((row) => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

    // Verificar columnas de Productos
    const result3 = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Productos'
      ORDER BY ordinal_position;
    `);

    console.log("\nColumnas de la tabla Productos:");
    result3.rows.forEach((row) => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

verificarTablas();
