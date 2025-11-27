/**
 * SEEDER: PLAN DE CUENTAS INICIAL PARA SIGEPAN
 *
 * Plan de cuentas básico para una panadería en Bolivia
 * Basado en principios contables bolivianos
 *
 * Niveles:
 * 1 - Grupo (ACTIVO, PASIVO, etc.)
 * 2 - Subgrupo (ACTIVO CORRIENTE, etc.)
 * 3 - Mayor (CAJA Y BANCOS, etc.)
 * 4 - Auxiliar (Caja General, Banco Mercantil, etc.)
 */

const { Cuenta } = require("../models");

const planDeCuentas = [
  // ==========================================
  // 1. ACTIVO
  // ==========================================
  {
    code: "1",
    name: "ACTIVO",
    type: "ACTIVO",
    level: 1,
    parent_id: null,
    allows_movement: false,
    is_active: true,
  },
  {
    code: "1.1",
    name: "ACTIVO CORRIENTE",
    type: "ACTIVO",
    level: 2,
    parent_code: "1",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "1.1.01",
    name: "CAJA Y BANCOS",
    type: "ACTIVO",
    level: 3,
    parent_code: "1.1",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "1.1.01.001",
    name: "Caja General",
    type: "ACTIVO",
    level: 4,
    parent_code: "1.1.01",
    allows_movement: true,
    is_active: true,
    description: "Dinero en efectivo disponible",
  },
  {
    code: "1.1.01.002",
    name: "Banco Mercantil Santa Cruz",
    type: "ACTIVO",
    level: 4,
    parent_code: "1.1.01",
    allows_movement: true,
    is_active: true,
    description: "Cuenta corriente bancaria",
  },
  {
    code: "1.1.01.003",
    name: "Banco Nacional de Bolivia",
    type: "ACTIVO",
    level: 4,
    parent_code: "1.1.01",
    allows_movement: true,
    is_active: true,
  },
  {
    code: "1.1.02",
    name: "CUENTAS POR COBRAR",
    type: "ACTIVO",
    level: 3,
    parent_code: "1.1",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "1.1.02.001",
    name: "Clientes",
    type: "ACTIVO",
    level: 4,
    parent_code: "1.1.02",
    allows_movement: true,
    is_active: true,
    description: "Ventas a crédito pendientes de cobro",
  },
  {
    code: "1.1.03",
    name: "INVENTARIOS",
    type: "ACTIVO",
    level: 3,
    parent_code: "1.1",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "1.1.03.001",
    name: "Inventario de Materia Prima",
    type: "ACTIVO",
    level: 4,
    parent_code: "1.1.03",
    allows_movement: true,
    is_active: true,
    description: "Harina, azúcar, levadura, etc.",
  },
  {
    code: "1.1.03.002",
    name: "Inventario de Productos Terminados",
    type: "ACTIVO",
    level: 4,
    parent_code: "1.1.03",
    allows_movement: true,
    is_active: true,
    description: "Pan y productos listos para venta",
  },
  {
    code: "1.1.03.003",
    name: "Inventario de Productos en Proceso",
    type: "ACTIVO",
    level: 4,
    parent_code: "1.1.03",
    allows_movement: true,
    is_active: true,
  },
  {
    code: "1.2",
    name: "ACTIVO NO CORRIENTE",
    type: "ACTIVO",
    level: 2,
    parent_code: "1",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "1.2.01",
    name: "PROPIEDAD, PLANTA Y EQUIPO",
    type: "ACTIVO",
    level: 3,
    parent_code: "1.2",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "1.2.01.001",
    name: "Maquinaria y Equipo",
    type: "ACTIVO",
    level: 4,
    parent_code: "1.2.01",
    allows_movement: true,
    is_active: true,
    description: "Hornos, batidoras, amasadoras",
  },
  {
    code: "1.2.01.002",
    name: "Muebles y Enseres",
    type: "ACTIVO",
    level: 4,
    parent_code: "1.2.01",
    allows_movement: true,
    is_active: true,
  },
  {
    code: "1.2.01.003",
    name: "Depreciación Acumulada",
    type: "ACTIVO",
    level: 4,
    parent_code: "1.2.01",
    allows_movement: true,
    is_active: true,
    description: "Depreciación de activos fijos (cuenta de contrapartida)",
  },

  // ==========================================
  // 2. PASIVO
  // ==========================================
  {
    code: "2",
    name: "PASIVO",
    type: "PASIVO",
    level: 1,
    parent_id: null,
    allows_movement: false,
    is_active: true,
  },
  {
    code: "2.1",
    name: "PASIVO CORRIENTE",
    type: "PASIVO",
    level: 2,
    parent_code: "2",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "2.1.01",
    name: "CUENTAS POR PAGAR",
    type: "PASIVO",
    level: 3,
    parent_code: "2.1",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "2.1.01.001",
    name: "Proveedores",
    type: "PASIVO",
    level: 4,
    parent_code: "2.1.01",
    allows_movement: true,
    is_active: true,
    description: "Compras a crédito de materia prima",
  },
  {
    code: "2.1.02",
    name: "IMPUESTOS POR PAGAR",
    type: "PASIVO",
    level: 3,
    parent_code: "2.1",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "2.1.02.001",
    name: "IVA Débito Fiscal",
    type: "PASIVO",
    level: 4,
    parent_code: "2.1.02",
    allows_movement: true,
    is_active: true,
    description: "IVA cobrado en ventas (13%)",
  },
  {
    code: "2.1.02.002",
    name: "IVA Crédito Fiscal",
    type: "PASIVO",
    level: 4,
    parent_code: "2.1.02",
    allows_movement: true,
    is_active: true,
    description: "IVA pagado en compras",
  },
  {
    code: "2.1.03",
    name: "SUELDOS Y SALARIOS POR PAGAR",
    type: "PASIVO",
    level: 3,
    parent_code: "2.1",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "2.1.03.001",
    name: "Sueldos por Pagar",
    type: "PASIVO",
    level: 4,
    parent_code: "2.1.03",
    allows_movement: true,
    is_active: true,
  },

  // ==========================================
  // 3. PATRIMONIO
  // ==========================================
  {
    code: "3",
    name: "PATRIMONIO",
    type: "PATRIMONIO",
    level: 1,
    parent_id: null,
    allows_movement: false,
    is_active: true,
  },
  {
    code: "3.1",
    name: "CAPITAL",
    type: "PATRIMONIO",
    level: 2,
    parent_code: "3",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "3.1.01",
    name: "CAPITAL SOCIAL",
    type: "PATRIMONIO",
    level: 3,
    parent_code: "3.1",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "3.1.01.001",
    name: "Capital Inicial",
    type: "PATRIMONIO",
    level: 4,
    parent_code: "3.1.01",
    allows_movement: true,
    is_active: true,
    description: "Aporte inicial de los socios",
  },
  {
    code: "3.2",
    name: "RESULTADOS",
    type: "PATRIMONIO",
    level: 2,
    parent_code: "3",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "3.2.01",
    name: "RESULTADOS ACUMULADOS",
    type: "PATRIMONIO",
    level: 3,
    parent_code: "3.2",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "3.2.01.001",
    name: "Utilidades Retenidas",
    type: "PATRIMONIO",
    level: 4,
    parent_code: "3.2.01",
    allows_movement: true,
    is_active: true,
  },
  {
    code: "3.2.01.002",
    name: "Utilidad del Ejercicio",
    type: "PATRIMONIO",
    level: 4,
    parent_code: "3.2.01",
    allows_movement: true,
    is_active: true,
  },

  // ==========================================
  // 4. INGRESOS
  // ==========================================
  {
    code: "4",
    name: "INGRESOS",
    type: "INGRESO",
    level: 1,
    parent_id: null,
    allows_movement: false,
    is_active: true,
  },
  {
    code: "4.1",
    name: "INGRESOS OPERACIONALES",
    type: "INGRESO",
    level: 2,
    parent_code: "4",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "4.1.01",
    name: "VENTAS",
    type: "INGRESO",
    level: 3,
    parent_code: "4.1",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "4.1.01.001",
    name: "Venta de Pan",
    type: "INGRESO",
    level: 4,
    parent_code: "4.1.01",
    allows_movement: true,
    is_active: true,
  },
  {
    code: "4.1.01.002",
    name: "Venta de Pasteles",
    type: "INGRESO",
    level: 4,
    parent_code: "4.1.01",
    allows_movement: true,
    is_active: true,
  },
  {
    code: "4.1.01.003",
    name: "Venta de Productos Especiales",
    type: "INGRESO",
    level: 4,
    parent_code: "4.1.01",
    allows_movement: true,
    is_active: true,
  },

  // ==========================================
  // 5. GASTOS
  // ==========================================
  {
    code: "5",
    name: "GASTOS",
    type: "GASTO",
    level: 1,
    parent_id: null,
    allows_movement: false,
    is_active: true,
  },
  {
    code: "5.1",
    name: "COSTO DE VENTAS",
    type: "GASTO",
    level: 2,
    parent_code: "5",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "5.1.01",
    name: "COSTO DE PRODUCCION",
    type: "GASTO",
    level: 3,
    parent_code: "5.1",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "5.1.01.001",
    name: "Costo de Materia Prima",
    type: "GASTO",
    level: 4,
    parent_code: "5.1.01",
    allows_movement: true,
    is_active: true,
    description: "Consumo de ingredientes en producción",
  },
  {
    code: "5.1.01.002",
    name: "Mano de Obra Directa",
    type: "GASTO",
    level: 4,
    parent_code: "5.1.01",
    allows_movement: true,
    is_active: true,
  },
  {
    code: "5.1.01.003",
    name: "Costos Indirectos de Fabricación",
    type: "GASTO",
    level: 4,
    parent_code: "5.1.01",
    allows_movement: true,
    is_active: true,
    description: "Gas, electricidad, mantenimiento",
  },
  {
    code: "5.2",
    name: "GASTOS OPERACIONALES",
    type: "GASTO",
    level: 2,
    parent_code: "5",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "5.2.01",
    name: "GASTOS ADMINISTRATIVOS",
    type: "GASTO",
    level: 3,
    parent_code: "5.2",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "5.2.01.001",
    name: "Sueldos Administrativos",
    type: "GASTO",
    level: 4,
    parent_code: "5.2.01",
    allows_movement: true,
    is_active: true,
  },
  {
    code: "5.2.01.002",
    name: "Alquiler de Local",
    type: "GASTO",
    level: 4,
    parent_code: "5.2.01",
    allows_movement: true,
    is_active: true,
  },
  {
    code: "5.2.01.003",
    name: "Servicios Básicos",
    type: "GASTO",
    level: 4,
    parent_code: "5.2.01",
    allows_movement: true,
    is_active: true,
    description: "Agua, luz, internet, teléfono",
  },
  {
    code: "5.2.01.004",
    name: "Depreciación",
    type: "GASTO",
    level: 4,
    parent_code: "5.2.01",
    allows_movement: true,
    is_active: true,
  },
  {
    code: "5.2.02",
    name: "GASTOS DE VENTAS",
    type: "GASTO",
    level: 3,
    parent_code: "5.2",
    allows_movement: false,
    is_active: true,
  },
  {
    code: "5.2.02.001",
    name: "Publicidad y Marketing",
    type: "GASTO",
    level: 4,
    parent_code: "5.2.02",
    allows_movement: true,
    is_active: true,
  },
  {
    code: "5.2.02.002",
    name: "Comisiones de Vendedores",
    type: "GASTO",
    level: 4,
    parent_code: "5.2.02",
    allows_movement: true,
    is_active: true,
  },
  {
    code: "5.2.02.003",
    name: "Transporte y Distribución",
    type: "GASTO",
    level: 4,
    parent_code: "5.2.02",
    allows_movement: true,
    is_active: true,
  },
];

/**
 * Ejecutar seeder
 */
async function seedPlanDeCuentas() {
  try {
    console.log("🌱 Iniciando seeder del Plan de Cuentas...");

    // Mapeo de códigos a IDs para las relaciones padre-hijo
    const accountMap = {};

    // Insertar cuentas en orden de jerarquía
    for (const cuenta of planDeCuentas) {
      const {
        parent_code,
        code,
        name,
        type,
        level,
        allows_movement,
        is_active,
        description,
      } = cuenta;

      // Transformar campos al formato correcto
      const accountData = {
        codigo: code,
        nombre: name,
        tipo: type,
        nivel: level,
        esta_activa: is_active !== undefined ? is_active : true,
        permite_movimiento:
          allows_movement !== undefined ? allows_movement : false,
        descripcion: description || null,
        padre_id: null, // Se asignará después si tiene parent_code
      };

      // Si tiene código padre, buscar el ID
      if (parent_code) {
        accountData.padre_id = accountMap[parent_code];

        if (!accountData.padre_id) {
          console.error(
            `❌ No se encontró cuenta padre con código: ${parent_code}`
          );
          continue;
        }
      }

      // Verificar si ya existe
      const existing = await Cuenta.findOne({ where: { codigo: code } });

      if (existing) {
        console.log(`⏭️  Cuenta ${code} ya existe, saltando...`);
        accountMap[code] = existing.id;
        continue;
      }

      // Crear cuenta
      const newAccount = await Cuenta.create(accountData);
      accountMap[code] = newAccount.id;

      console.log(`✅ Creada: ${code} - ${name}`);
    }

    console.log("\n✨ Plan de Cuentas cargado exitosamente!");
    console.log(
      `📊 Total de cuentas creadas: ${Object.keys(accountMap).length}`
    );
  } catch (error) {
    console.error("❌ Error al cargar Plan de Cuentas:", error);
    throw error;
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  const { sequelize } = require("../models");

  (async () => {
    try {
      console.log("🔄 Sincronizando modelos con la base de datos...");

      // Sincronizar todos los modelos (crear tablas si no existen)
      await sequelize.sync({ alter: true });
      //await sequelize.sync({ force: true });


      console.log("✅ Modelos sincronizados correctamente\n");

      // Ejecutar el seeder
      await seedPlanDeCuentas();

      console.log("\n✅ Seeder completado");
      process.exit(0);
    } catch (error) {
      console.error("\n❌ Error en seeder:", error);
      process.exit(1);
    }
  })();
}

module.exports = seedPlanDeCuentas;
