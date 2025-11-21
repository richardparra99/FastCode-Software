const { Cuenta, Cliente, Producto } = require("./models");

async function seedDatabase() {
  try {
    console.log("Insertando datos de prueba...");

    // Insertar plan de cuentas básico
    const cuentas = [
      // ACTIVOS
      {
        codigo: "1",
        nombre: "ACTIVO",
        tipo: "ACTIVO",
        nivel: 1,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "1.1",
        nombre: "ACTIVO CORRIENTE",
        tipo: "ACTIVO",
        nivel: 2,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "1.1.01",
        nombre: "CAJA Y BANCOS",
        tipo: "ACTIVO",
        nivel: 3,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "1.1.01.001",
        nombre: "Caja General",
        tipo: "ACTIVO",
        nivel: 4,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: true,
      },
      {
        codigo: "1.1.01.002",
        nombre: "Banco Nacional",
        tipo: "ACTIVO",
        nivel: 4,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: true,
      },
      {
        codigo: "1.1.02",
        nombre: "CUENTAS POR COBRAR",
        tipo: "ACTIVO",
        nivel: 3,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "1.1.02.001",
        nombre: "Clientes",
        tipo: "ACTIVO",
        nivel: 4,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: true,
      },

      // PASIVOS
      {
        codigo: "2",
        nombre: "PASIVO",
        tipo: "PASIVO",
        nivel: 1,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "2.1",
        nombre: "PASIVO CORRIENTE",
        tipo: "PASIVO",
        nivel: 2,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "2.1.01",
        nombre: "CUENTAS POR PAGAR",
        tipo: "PASIVO",
        nivel: 3,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "2.1.01.001",
        nombre: "Proveedores",
        tipo: "PASIVO",
        nivel: 4,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: true,
      },

      // PATRIMONIO
      {
        codigo: "3",
        nombre: "PATRIMONIO",
        tipo: "PATRIMONIO",
        nivel: 1,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "3.1",
        nombre: "CAPITAL",
        tipo: "PATRIMONIO",
        nivel: 2,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "3.1.01",
        nombre: "Capital Social",
        tipo: "PATRIMONIO",
        nivel: 3,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: true,
      },

      // INGRESOS
      {
        codigo: "4",
        nombre: "INGRESOS",
        tipo: "INGRESO",
        nivel: 1,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "4.1",
        nombre: "INGRESOS OPERACIONALES",
        tipo: "INGRESO",
        nivel: 2,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "4.1.01",
        nombre: "Ventas",
        tipo: "INGRESO",
        nivel: 3,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: true,
      },

      // GASTOS
      {
        codigo: "5",
        nombre: "GASTOS",
        tipo: "GASTO",
        nivel: 1,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "5.1",
        nombre: "GASTOS OPERACIONALES",
        tipo: "GASTO",
        nivel: 2,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "5.1.01",
        nombre: "Costo de Ventas",
        tipo: "GASTO",
        nivel: 3,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: true,
      },
      {
        codigo: "5.1.02",
        nombre: "Gastos Administrativos",
        tipo: "GASTO",
        nivel: 3,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: true,
      },
    ];

    for (const cuenta of cuentas) {
      await Cuenta.findOrCreate({
        where: { codigo: cuenta.codigo },
        defaults: cuenta,
      });
    }

    console.log("✓ Plan de cuentas insertado");

    // Insertar clientes de prueba
    const clientes = [
      {
        fullName: "Juan Pérez",
        phone: "71234567",
        address: "Av. Siempre Viva 123",
        isWhatsapp: true,
      },
      {
        fullName: "María García",
        phone: "72345678",
        address: "Calle Falsa 456",
        isWhatsapp: false,
      },
      {
        fullName: "Carlos López",
        phone: "73456789",
        address: "Av. Principal 789",
        isWhatsapp: true,
      },
    ];

    for (const cliente of clientes) {
      await Cliente.findOrCreate({
        where: { fullName: cliente.fullName },
        defaults: cliente,
      });
    }

    console.log("✓ Clientes de prueba insertados");

    // Insertar productos de prueba
    const productos = [
      {
        name: "Pastel de Chocolate",
        description: "Delicioso pastel de chocolate con cobertura",
        price: 150.0,
        isActive: true,
      },
      {
        name: "Torta de Vainilla",
        description: "Torta suave de vainilla",
        price: 120.0,
        isActive: true,
      },
      {
        name: "Cupcakes Surtidos",
        description: "Caja de 12 cupcakes variados",
        price: 80.0,
        isActive: true,
      },
      {
        name: "Pan Francés",
        description: "Pan francés tradicional",
        price: 2.5,
        isActive: true,
      },
    ];

    for (const producto of productos) {
      await Producto.findOrCreate({
        where: { name: producto.name },
        defaults: producto,
      });
    }

    console.log("✓ Productos de prueba insertados");

    console.log("\n✅ Datos de prueba insertados correctamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al insertar datos de prueba:", error);
    process.exit(1);
  }
}

// Conectar y ejecutar
const { connectDB } = require("./config/config");
connectDB().then(() => {
  seedDatabase();
});
