/**
 * SEEDER: USUARIO ADMINISTRADOR INICIAL
 *
 * Crea un usuario administrador por defecto para poder acceder al sistema
 *
 * Credenciales:
 * - Username: admin
 * - Password: admin123
 * - Role: ADMIN
 */

const bcrypt = require("bcrypt");
const { Usuario } = require("../models");

async function seedAdminUser() {
  try {
    console.log("🌱 Creando usuario administrador...");

    // Verificar si ya existe el usuario admin
    const adminExistente = await Usuario.findOne({
      where: { username: "admin" },
    });

    if (adminExistente) {
      console.log("⏭️  Usuario admin ya existe");
      return;
    }

    // Hash de la contraseña
    const password_hash = await bcrypt.hash("admin123", 10);

    // Crear usuario admin
    const admin = await Usuario.create({
      username: "admin",
      password_hash,
      full_name: "Administrador del Sistema",
      role: "ADMIN",
      is_active: true,
    });

    console.log("✅ Usuario administrador creado exitosamente");
    console.log("📋 Credenciales:");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("   Role: ADMIN");
  } catch (error) {
    console.error("❌ Error al crear usuario administrador:", error);
    throw error;
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  (async () => {
    try {
      // Ejecutar el seeder
      await seedAdminUser();

      console.log("\n✅ Seeder completado");
      process.exit(0);
    } catch (error) {
      console.error("\n❌ Error en seeder:", error);
      process.exit(1);
    }
  })();
}

module.exports = seedAdminUser;
