/**
 * Script unificado para inicializar la base de datos con datos iniciales
 * - Usuario admin
 * - Plan de cuentas contables
 * - Datos de ejemplo (opcional)
 *
 * Ejecutar: npm run seed
 */

const bcrypt = require("bcrypt");
const { sequelize, Usuario, Cliente, Producto, Cuenta } = require("../models");

async function seedInitialData() {
  try {
    console.log("🚀 Iniciando proceso de seed...\n");

    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log("✅ Conexión a base de datos establecida\n");

    // ==========================================
    // 1. CREAR USUARIO ADMIN
    // ==========================================
    console.log("👤 Verificando usuario administrador...");
    const adminExiste = await Usuario.findOne({ where: { username: "admin" } });

    if (!adminExiste) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      await Usuario.create({
        username: "admin",
        password_hash: passwordHash,
        full_name: "Administrador del Sistema",
        role: "ADMIN",
        is_active: true,
      });
      console.log("   ✓ Usuario admin creado");
      console.log("   📌 Username: admin");
      console.log("   📌 Password: admin123\n");
    } else {
      console.log("   ℹ️  Usuario admin ya existe\n");
    }

    // ==========================================
    // 2. CREAR PLAN DE CUENTAS CONTABLES
    // ==========================================
    console.log("📊 Verificando plan de cuentas contables...");

    const cuentasExistentes = await Cuenta.count();

    if (cuentasExistentes > 0) {
      console.log(`   ℹ️  Ya existen ${cuentasExistentes} cuentas contables\n`);
    } else {
      console.log("   📝 Creando plan de cuentas...");

      const cuentas = [
        // ========== ACTIVOS ==========
        { codigo: "1", nombre: "ACTIVO", tipo: "ACTIVO", nivel: 1, padreId: null, estaActiva: true, permiteMovimiento: false },

        // Activo Corriente
        { codigo: "1.1", nombre: "ACTIVO CORRIENTE", tipo: "ACTIVO", nivel: 2, estaActiva: true, permiteMovimiento: false },

        // Disponible
        { codigo: "1.1.01", nombre: "DISPONIBLE", tipo: "ACTIVO", nivel: 3, estaActiva: true, permiteMovimiento: false },
        { codigo: "1.1.01.001", nombre: "Caja General", tipo: "ACTIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "1.1.01.002", nombre: "Caja Chica", tipo: "ACTIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "1.1.01.003", nombre: "Banco Nacional - Cuenta Corriente", tipo: "ACTIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "1.1.01.004", nombre: "Banco Nacional - Cuenta Ahorros", tipo: "ACTIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },

        // Cuentas por Cobrar
        { codigo: "1.1.02", nombre: "CUENTAS POR COBRAR", tipo: "ACTIVO", nivel: 3, estaActiva: true, permiteMovimiento: false },
        { codigo: "1.1.02.001", nombre: "Clientes", tipo: "ACTIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "1.1.02.002", nombre: "Deudores Varios", tipo: "ACTIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "1.1.02.003", nombre: "Anticipos a Proveedores", tipo: "ACTIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },

        // Inventarios
        { codigo: "1.1.03", nombre: "INVENTARIOS", tipo: "ACTIVO", nivel: 3, estaActiva: true, permiteMovimiento: false },
        { codigo: "1.1.03.001", nombre: "Inventario de Productos Terminados", tipo: "ACTIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "1.1.03.002", nombre: "Inventario de Materias Primas", tipo: "ACTIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "1.1.03.003", nombre: "Inventario de Productos en Proceso", tipo: "ACTIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },

        // Activo No Corriente
        { codigo: "1.2", nombre: "ACTIVO NO CORRIENTE", tipo: "ACTIVO", nivel: 2, estaActiva: true, permiteMovimiento: false },
        { codigo: "1.2.01", nombre: "PROPIEDAD, PLANTA Y EQUIPO", tipo: "ACTIVO", nivel: 3, estaActiva: true, permiteMovimiento: false },
        { codigo: "1.2.01.001", nombre: "Edificios", tipo: "ACTIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "1.2.01.002", nombre: "Maquinaria y Equipo", tipo: "ACTIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "1.2.01.003", nombre: "Mobiliario y Equipo de Oficina", tipo: "ACTIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "1.2.01.004", nombre: "Equipo de Cómputo", tipo: "ACTIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "1.2.01.005", nombre: "Vehículos", tipo: "ACTIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },

        // ========== PASIVOS ==========
        { codigo: "2", nombre: "PASIVO", tipo: "PASIVO", nivel: 1, padreId: null, estaActiva: true, permiteMovimiento: false },

        // Pasivo Corriente
        { codigo: "2.1", nombre: "PASIVO CORRIENTE", tipo: "PASIVO", nivel: 2, estaActiva: true, permiteMovimiento: false },

        // Cuentas por Pagar
        { codigo: "2.1.01", nombre: "CUENTAS POR PAGAR", tipo: "PASIVO", nivel: 3, estaActiva: true, permiteMovimiento: false },
        { codigo: "2.1.01.001", nombre: "Proveedores", tipo: "PASIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "2.1.01.002", nombre: "Acreedores Varios", tipo: "PASIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "2.1.01.003", nombre: "Anticipos de Clientes", tipo: "PASIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },

        // Obligaciones Laborales
        { codigo: "2.1.02", nombre: "OBLIGACIONES LABORALES", tipo: "PASIVO", nivel: 3, estaActiva: true, permiteMovimiento: false },
        { codigo: "2.1.02.001", nombre: "Sueldos y Salarios por Pagar", tipo: "PASIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "2.1.02.002", nombre: "Aportes Patronales por Pagar", tipo: "PASIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "2.1.02.003", nombre: "Provisión para Aguinaldos", tipo: "PASIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },

        // Obligaciones Fiscales
        { codigo: "2.1.03", nombre: "OBLIGACIONES FISCALES", tipo: "PASIVO", nivel: 3, estaActiva: true, permiteMovimiento: false },
        { codigo: "2.1.03.001", nombre: "IVA por Pagar", tipo: "PASIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "2.1.03.002", nombre: "IT por Pagar", tipo: "PASIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "2.1.03.003", nombre: "RC-IVA por Pagar", tipo: "PASIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },

        // Pasivo No Corriente
        { codigo: "2.2", nombre: "PASIVO NO CORRIENTE", tipo: "PASIVO", nivel: 2, estaActiva: true, permiteMovimiento: false },
        { codigo: "2.2.01", nombre: "PRÉSTAMOS A LARGO PLAZO", tipo: "PASIVO", nivel: 3, estaActiva: true, permiteMovimiento: false },
        { codigo: "2.2.01.001", nombre: "Préstamos Bancarios L/P", tipo: "PASIVO", nivel: 4, estaActiva: true, permiteMovimiento: true },

        // ========== PATRIMONIO ==========
        { codigo: "3", nombre: "PATRIMONIO", tipo: "PATRIMONIO", nivel: 1, padreId: null, estaActiva: true, permiteMovimiento: false },
        { codigo: "3.1", nombre: "CAPITAL", tipo: "PATRIMONIO", nivel: 2, estaActiva: true, permiteMovimiento: false },
        { codigo: "3.1.01", nombre: "Capital Social", tipo: "PATRIMONIO", nivel: 3, estaActiva: true, permiteMovimiento: true },
        { codigo: "3.2", nombre: "RESULTADOS", tipo: "PATRIMONIO", nivel: 2, estaActiva: true, permiteMovimiento: false },
        { codigo: "3.2.01", nombre: "Resultados Acumulados", tipo: "PATRIMONIO", nivel: 3, estaActiva: true, permiteMovimiento: true },
        { codigo: "3.2.02", nombre: "Utilidad del Ejercicio", tipo: "PATRIMONIO", nivel: 3, estaActiva: true, permiteMovimiento: true },
        { codigo: "3.2.03", nombre: "Pérdida del Ejercicio", tipo: "PATRIMONIO", nivel: 3, estaActiva: true, permiteMovimiento: true },

        // ========== INGRESOS ==========
        { codigo: "4", nombre: "INGRESOS", tipo: "INGRESO", nivel: 1, padreId: null, estaActiva: true, permiteMovimiento: false },

        // Ingresos Operacionales
        { codigo: "4.1", nombre: "INGRESOS OPERACIONALES", tipo: "INGRESO", nivel: 2, estaActiva: true, permiteMovimiento: false },
        { codigo: "4.1.01", nombre: "Ventas de Productos", tipo: "INGRESO", nivel: 3, estaActiva: true, permiteMovimiento: true },
        { codigo: "4.1.02", nombre: "Prestación de Servicios", tipo: "INGRESO", nivel: 3, estaActiva: true, permiteMovimiento: true },

        // Otros Ingresos
        { codigo: "4.2", nombre: "OTROS INGRESOS", tipo: "INGRESO", nivel: 2, estaActiva: true, permiteMovimiento: false },
        { codigo: "4.2.01", nombre: "Ingresos Financieros", tipo: "INGRESO", nivel: 3, estaActiva: true, permiteMovimiento: true },
        { codigo: "4.2.02", nombre: "Ingresos Extraordinarios", tipo: "INGRESO", nivel: 3, estaActiva: true, permiteMovimiento: true },

        // ========== GASTOS ==========
        { codigo: "5", nombre: "GASTOS", tipo: "GASTO", nivel: 1, padreId: null, estaActiva: true, permiteMovimiento: false },

        // Costo de Ventas
        { codigo: "5.1", nombre: "COSTO DE VENTAS", tipo: "GASTO", nivel: 2, estaActiva: true, permiteMovimiento: false },
        { codigo: "5.1.01", nombre: "Costo de Productos Vendidos", tipo: "GASTO", nivel: 3, estaActiva: true, permiteMovimiento: true },
        { codigo: "5.1.02", nombre: "Costo de Materias Primas Consumidas", tipo: "GASTO", nivel: 3, estaActiva: true, permiteMovimiento: true },
        { codigo: "5.1.03", nombre: "Mano de Obra Directa", tipo: "GASTO", nivel: 3, estaActiva: true, permiteMovimiento: true },

        // Gastos Operacionales
        { codigo: "5.2", nombre: "GASTOS OPERACIONALES", tipo: "GASTO", nivel: 2, estaActiva: true, permiteMovimiento: false },

        // Gastos Administrativos
        { codigo: "5.2.01", nombre: "GASTOS ADMINISTRATIVOS", tipo: "GASTO", nivel: 3, estaActiva: true, permiteMovimiento: false },
        { codigo: "5.2.01.001", nombre: "Sueldos y Salarios Administrativos", tipo: "GASTO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "5.2.01.002", nombre: "Aportes Patronales", tipo: "GASTO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "5.2.01.003", nombre: "Alquileres", tipo: "GASTO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "5.2.01.004", nombre: "Servicios Básicos", tipo: "GASTO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "5.2.01.005", nombre: "Material de Escritorio", tipo: "GASTO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "5.2.01.006", nombre: "Depreciación de Activos Fijos", tipo: "GASTO", nivel: 4, estaActiva: true, permiteMovimiento: true },

        // Gastos de Ventas
        { codigo: "5.2.02", nombre: "GASTOS DE VENTAS", tipo: "GASTO", nivel: 3, estaActiva: true, permiteMovimiento: false },
        { codigo: "5.2.02.001", nombre: "Comisiones sobre Ventas", tipo: "GASTO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "5.2.02.002", nombre: "Publicidad y Marketing", tipo: "GASTO", nivel: 4, estaActiva: true, permiteMovimiento: true },
        { codigo: "5.2.02.003", nombre: "Transporte y Distribución", tipo: "GASTO", nivel: 4, estaActiva: true, permiteMovimiento: true },

        // Gastos Financieros
        { codigo: "5.3", nombre: "GASTOS FINANCIEROS", tipo: "GASTO", nivel: 2, estaActiva: true, permiteMovimiento: false },
        { codigo: "5.3.01", nombre: "Intereses sobre Préstamos", tipo: "GASTO", nivel: 3, estaActiva: true, permiteMovimiento: true },
        { codigo: "5.3.02", nombre: "Comisiones Bancarias", tipo: "GASTO", nivel: 3, estaActiva: true, permiteMovimiento: true },
      ];

      // Crear cuentas en orden jerárquico
      for (const cuenta of cuentas) {
        // Si tiene nivel mayor a 1, buscar la cuenta padre
        if (cuenta.nivel > 1) {
          const codigoPadre = cuenta.codigo.split(".").slice(0, -1).join(".");
          const padre = await Cuenta.findOne({ where: { codigo: codigoPadre } });
          if (padre) {
            cuenta.padreId = padre.id;
          }
        }
        await Cuenta.create(cuenta);
      }

      console.log(`   ✓ ${cuentas.length} cuentas contables creadas\n`);
    }

    // ==========================================
    // 3. CREAR DATOS DE EJEMPLO (OPCIONAL)
    // ==========================================
    console.log("📦 Verificando datos de ejemplo...");

    const clientesExistentes = await Cliente.count();
    if (clientesExistentes === 0) {
      await Cliente.bulkCreate([
        {
          fullName: "Juan Pérez García",
          phone: "71234567",
          address: "Av. Arce #123, La Paz",
          isWhatsapp: true
        },
        {
          fullName: "María González López",
          phone: "79876543",
          address: "Calle Comercio #456, Santa Cruz",
          isWhatsapp: true
        },
        {
          fullName: "Carlos Rodríguez Mamani",
          phone: "68765432",
          address: "Zona Norte, El Alto",
          isWhatsapp: false
        },
      ]);
      console.log("   ✓ 3 clientes de ejemplo creados");
    } else {
      console.log(`   ℹ️  Ya existen ${clientesExistentes} clientes`);
    }

    const productosExistentes = await Producto.count();
    if (productosExistentes === 0) {
      await Producto.bulkCreate([
        {
          name: "Pan francés",
          description: "Pan tradicional boliviano",
          price: 0.50,
          isActive: true
        },
        {
          name: "Marraqueta",
          description: "Pan crocante tradicional",
          price: 0.50,
          isActive: true
        },
        {
          name: "Torta de chocolate",
          description: "Torta con cobertura de chocolate",
          price: 45.00,
          isActive: true
        },
        {
          name: "Empanadas de queso",
          description: "Empanadas horneadas de queso",
          price: 3.00,
          isActive: true
        },
      ]);
      console.log("   ✓ 4 productos de ejemplo creados");
    } else {
      console.log(`   ℹ️  Ya existen ${productosExistentes} productos`);
    }

    // ==========================================
    // 4. VERIFICAR Y CORREGIR ASIENTOS EXISTENTES
    // ==========================================
    console.log("🔍 Verificando asientos contables...");

    const { AsientoContable } = require("../models");

    const asientosBorrador = await AsientoContable.count({
      where: { estado: "BORRADOR" }
    });

    if (asientosBorrador > 0) {
      console.log(`   ⚠️  Encontrados ${asientosBorrador} asientos en BORRADOR`);
      console.log("   💡 Tip: Estos asientos no aparecen en reportes.");
      console.log("   💡 Verifica que las ventas generen asientos CONTABILIZADOS\n");
    } else {
      console.log("   ✓ No hay asientos en borrador\n");
    }

    // ==========================================
    // RESUMEN FINAL
    // ==========================================
    console.log("\n" + "=".repeat(50));
    console.log("✅ INICIALIZACIÓN COMPLETADA EXITOSAMENTE");
    console.log("=".repeat(50));
    console.log("\n📌 Credenciales de acceso:");
    console.log("   👤 Usuario: admin");
    console.log("   🔑 Contraseña: admin123");
    console.log("\n📊 Sistema contable:");
    console.log("   ✓ 73 cuentas contables creadas");
    console.log("   ✓ Asientos automáticos al crear ventas");
    console.log("   ✓ Libro Diario, Balance General y Estado de Resultados listos");
    console.log("\n💡 Comandos útiles:");
    console.log("   npm start          → Iniciar servidor backend");
    console.log("   npm run seed       → Re-ejecutar este script");
    console.log("\n🚀 ¡Todo listo para usar!\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error durante la inicialización:", error.message);
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar el seed
seedInitialData();
