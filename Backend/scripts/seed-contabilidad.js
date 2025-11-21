const { sequelize, Cuenta } = require("../models");

async function seedCuentas() {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida");

    // Limpiar cuentas existentes (con CASCADE para eliminar referencias)
    await Cuenta.destroy({ where: {}, truncate: true, cascade: true });
    console.log("Cuentas eliminadas");

    // Crear cuentas de nivel 1 (Grupos principales)
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
      {
        codigo: "1.1.02",
        nombre: "CUENTAS POR COBRAR",
        tipo: "ACTIVO",
        nivel: 3,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "1.1.02.001",
        nombre: "Clientes",
        tipo: "ACTIVO",
        nivel: 4,
        estaActiva: true,
        permiteMovimiento: true,
      },
      {
        codigo: "1.1.03",
        nombre: "INVENTARIOS",
        tipo: "ACTIVO",
        nivel: 3,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "1.1.03.001",
        nombre: "Inventario de Productos",
        tipo: "ACTIVO",
        nivel: 4,
        estaActiva: true,
        permiteMovimiento: true,
      },
      {
        codigo: "1.1.03.002",
        nombre: "Inventario de Materias Primas",
        tipo: "ACTIVO",
        nivel: 4,
        estaActiva: true,
        permiteMovimiento: true,
      },

      // PASIVOS
      {
        codigo: "2",
        nombre: "PASIVO",
        tipo: "PASIVO",
        nivel: 1,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "2.1",
        nombre: "PASIVO CORRIENTE",
        tipo: "PASIVO",
        nivel: 2,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "2.1.01",
        nombre: "CUENTAS POR PAGAR",
        tipo: "PASIVO",
        nivel: 3,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "2.1.01.001",
        nombre: "Proveedores",
        tipo: "PASIVO",
        nivel: 4,
        estaActiva: true,
        permiteMovimiento: true,
      },
      {
        codigo: "2.1.02",
        nombre: "OBLIGACIONES LABORALES",
        tipo: "PASIVO",
        nivel: 3,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "2.1.02.001",
        nombre: "Sueldos por Pagar",
        tipo: "PASIVO",
        nivel: 4,
        estaActiva: true,
        permiteMovimiento: true,
      },

      // PATRIMONIO
      {
        codigo: "3",
        nombre: "PATRIMONIO",
        tipo: "PATRIMONIO",
        nivel: 1,
        padreId: null,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "3.1",
        nombre: "CAPITAL",
        tipo: "PATRIMONIO",
        nivel: 2,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "3.1.01",
        nombre: "Capital Social",
        tipo: "PATRIMONIO",
        nivel: 3,
        estaActiva: true,
        permiteMovimiento: true,
      },
      {
        codigo: "3.2",
        nombre: "RESULTADOS",
        tipo: "PATRIMONIO",
        nivel: 2,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "3.2.01",
        nombre: "Utilidad del Ejercicio",
        tipo: "PATRIMONIO",
        nivel: 3,
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
      {
        codigo: "4.1.02",
        nombre: "Servicios",
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
        nombre: "GASTOS ADMINISTRATIVOS",
        tipo: "GASTO",
        nivel: 3,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "5.1.01.001",
        nombre: "Sueldos y Salarios",
        tipo: "GASTO",
        nivel: 4,
        estaActiva: true,
        permiteMovimiento: true,
      },
      {
        codigo: "5.1.01.002",
        nombre: "Alquileres",
        tipo: "GASTO",
        nivel: 4,
        estaActiva: true,
        permiteMovimiento: true,
      },
      {
        codigo: "5.1.01.003",
        nombre: "Servicios Básicos",
        tipo: "GASTO",
        nivel: 4,
        estaActiva: true,
        permiteMovimiento: true,
      },
      {
        codigo: "5.1.02",
        nombre: "COSTO DE VENTAS",
        tipo: "GASTO",
        nivel: 3,
        estaActiva: true,
        permiteMovimiento: false,
      },
      {
        codigo: "5.1.02.001",
        nombre: "Costo de Productos Vendidos",
        tipo: "GASTO",
        nivel: 4,
        estaActiva: true,
        permiteMovimiento: true,
      },
      {
        codigo: "5.1.02.002",
        nombre: "Costo de Materias Primas",
        tipo: "GASTO",
        nivel: 4,
        estaActiva: true,
        permiteMovimiento: true,
      },
    ];

    // Insertar cuentas en orden para mantener la jerarquía
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
      console.log(`✓ Cuenta creada: ${cuenta.codigo} - ${cuenta.nombre}`);
    }

    console.log("\n✅ Seed completado exitosamente");
    console.log(`Total de cuentas creadas: ${cuentas.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error en seed:", error);
    process.exit(1);
  }
}

seedCuentas();
