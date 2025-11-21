const bcrypt = require("bcrypt");
const { Usuario, Cliente, Producto, Cuenta, sequelize } = require("../models");

async function seedDatos() {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida");

    // Crear usuario admin si no existe
    const adminExiste = await Usuario.findOne({ where: { username: "admin" } });
    if (!adminExiste) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      await Usuario.create({
        username: "admin",
        password_hash: passwordHash,
        full_name: "Administrador",
        role: "ADMIN",
        is_active: true,
      });
      console.log("✓ Usuario admin creado");
    } else {
      console.log("ℹ️ Usuario admin ya existe");
    }

    // Crear algunos clientes
    await Cliente.bulkCreate([
      {
        fullName: "Juan Pérez",
        phone: "7123456789",
        address: "Av. Principal 123",
        isWhatsapp: true,
      },
      {
        fullName: "María González",
        phone: "7987654321",
        address: "Calle Secundaria 456",
        isWhatsapp: true,
      },
      {
        fullName: "Pedro López",
        phone: "71111111",
        address: "Zona Norte #789",
        isWhatsapp: false,
      },
    ]);
    console.log("✓ 3 clientes creados");

    // Crear algunos productos
    await Producto.bulkCreate([
      {
        name: "Pan francés",
        description: "Pan tradicional francés",
        price: 1.5,
        isActive: true,
      },
      {
        name: "Pan de maíz",
        description: "Pan elaborado con maíz",
        price: 2.0,
        isActive: true,
      },
      {
        name: "Torta de chocolate",
        description: "Deliciosa torta con cobertura de chocolate",
        price: 45.0,
        isActive: true,
      },
      {
        name: "Empanadas de queso",
        description: "Empanadas rellenas de queso",
        price: 3.5,
        isActive: true,
      },
    ]);
    console.log("✓ 4 productos creados");

    // Insertar cuentas contables
    const cuentas = [
      // ACTIVOS
      {
        codigo: "1",
        nombre: "ACTIVO",
        tipo: "ACTIVO",
        nivel: 1,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "1.1",
        nombre: "ACTIVO CORRIENTE",
        tipo: "ACTIVO",
        nivel: 2,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "1.1.01",
        nombre: "DISPONIBLE",
        tipo: "ACTIVO",
        nivel: 3,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "1.1.01.001",
        nombre: "Caja General",
        tipo: "ACTIVO",
        nivel: 4,
        estaActiva: true,
        permiteMovimiento: true,
      },
      {
        codigo: "1.1.01.002",
        nombre: "Banco Nacional",
        tipo: "ACTIVO",
        nivel: 4,
        estaActiva: true,
        permiteMovimiento: true,
      },

      // INGRESOS
      {
        codigo: "4",
        nombre: "INGRESOS",
        tipo: "INGRESO",
        nivel: 1,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "4.1",
        nombre: "INGRESOS OPERACIONALES",
        tipo: "INGRESO",
        nivel: 2,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "4.1.01",
        nombre: "Ventas",
        tipo: "INGRESO",
        nivel: 3,
        estaActiva: true,
        permiteMovimiento: true,
      },

      // GASTOS
      {
        codigo: "5",
        nombre: "GASTOS",
        tipo: "GASTO",
        nivel: 1,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "5.1",
        nombre: "GASTOS OPERACIONALES",
        tipo: "GASTO",
        nivel: 2,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "5.1.01",
        nombre: "Sueldos y Salarios",
        tipo: "GASTO",
        nivel: 3,
        estaActiva: true,
        permiteMovimiento: true,
      },
    ];

    for (const cuenta of cuentas) {
      // Si tiene padre, buscar el ID del padre por código
      if (cuenta.nivel > 1) {
        const codigoPadre = cuenta.codigo.split(".").slice(0, -1).join(".");
        const padre = await Cuenta.findOne({ where: { codigo: codigoPadre } });
        if (padre) {
          cuenta.padreId = padre.id;
        }
      }

      await Cuenta.create(cuenta);
    }
    console.log("✓ 11 cuentas contables creadas");

    console.log("\n✅ Datos de prueba creados exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedDatos();
