# 🎯 ROADMAP PARA COMPLETAR BACKEND SIGEPAN

## ✅ YA COMPLETADO

### Módulo Contable

- ✅ Modelos: Account, JournalEntry, JournalEntryDetail, Invoice
- ✅ Servicios: accounting.service.js, invoice.service.js
- ✅ Controladores: accounting.controller.js, invoice.controller.js
- ✅ Rutas: accounting.routes.js, invoice.routes.js
- ✅ Rol CONTADOR agregado al modelo Usuario

---

## 📋 PASOS SIGUIENTES PARA BACKEND COMPLETO

### 1. 🔐 AUTENTICACIÓN Y SEGURIDAD (CRÍTICO)

#### 1.1 Instalar dependencias faltantes

```bash
npm install jsonwebtoken helmet express-validator
```

#### 1.2 Crear Middlewares de Seguridad

- **authMiddleware.js**: Validar JWT en cada petición protegida
- **roleMiddleware.js**: Validar roles (ADMIN, VENTAS, PRODUCCION, CONTADOR)
- **validation.middleware.js**: Validar esquemas con Joi o express-validator

#### 1.3 Implementar Sistema de Autenticación

- **auth.service.js**: Login, registro, refresh token
- **auth.controller.js**: Endpoints de autenticación
- **auth.routes.js**: POST /api/auth/login, /register, /logout

#### 1.4 Configurar Variables de Entorno

Crear archivo `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5501
DB_NAME=software
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=tu_clave_secreta_super_segura_aqui
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

#### 1.5 Proteger Rutas

Aplicar middlewares a las rutas:

```javascript
router.post(
  "/accounts",
  authMiddleware,
  roleMiddleware(["ADMIN", "CONTADOR"]),
  accountingController.createAccount
);
```

---

### 2. 📦 MÓDULO DE INVENTARIO Y RECETAS

#### 2.1 Servicios Faltantes

- **ingredient.service.js**:

  - CRUD de ingredientes
  - Registrar movimientos de inventario (compras, ajustes)
  - Alertas de stock bajo
  - Cálculo de costo promedio

- **product.service.js**:
  - CRUD de productos
  - Gestión de recetas (ingredientes + cantidades)
  - Cálculo de costo de producción

#### 2.2 Controladores

- **ingredient.controller.js**
- **product.controller.js**

#### 2.3 Rutas

- **ingredient.routes.js**
- **product.routes.js**

---

### 3. 🛒 MÓDULO DE PEDIDOS Y VENTAS

#### 3.1 Servicios

- **order.service.js**:

  - Crear pedido (transaccional: Order + OrderItems)
  - Cambiar estados del pedido
  - Subir firma de entrega
  - Vincular con producción

- **client.service.js**:
  - CRUD de clientes

#### 3.2 Controladores y Rutas

- **order.controller.js** + **order.routes.js**
- **client.controller.js** + **client.routes.js**

---

### 4. 🏭 MÓDULO DE PRODUCCIÓN (CORE DEL NEGOCIO)

#### 4.1 Servicio Crítico

- **production.service.js**:
  - Crear lote de producción planificado
  - **Cerrar lote** (CRÍTICO):
    - Calcular producción real
    - Descontar ingredientes del inventario según receta
    - Crear movimientos de inventario (SALIDA_PRODUCCION)
    - Generar asiento contable de costo de producción
  - Vincular lotes con pedidos (trazabilidad)

#### 4.2 Controlador y Rutas

- **production.controller.js**
- **production.routes.js**

---

### 5. 🔄 INTEGRACIÓN CONTABLE AUTOMÁTICA

#### 5.1 Triggers/Hooks de Sequelize

Implementar hooks en los modelos para generar asientos automáticos:

**En order.model.js**:

```javascript
Order.addHook("afterUpdate", async (order, options) => {
  if (order.changed("status") && order.status === "ENTREGADO") {
    // Generar asiento de costo de venta
  }
});
```

#### 5.2 Servicios de Automatización

- **accounting.automation.service.js**:
  - `generatePurchaseEntry()`: Al comprar ingredientes
  - `generateSalesEntry()`: Al completar venta (ya parcialmente implementado)
  - `generateProductionCostEntry()`: Al cerrar lote de producción
  - `generatePayrollEntry()`: Si hay nómina

---

### 6. 🗄️ MIGRACIONES Y SEEDERS

#### 6.1 Configurar Sequelize CLI

```bash
npm install --save-dev sequelize-cli
npx sequelize-cli init
```

#### 6.2 Crear Migraciones

Generar migraciones para todas las tablas:

```bash
npx sequelize-cli migration:generate --name create-accounts
npx sequelize-cli migration:generate --name create-journal-entries
# ... etc
```

#### 6.3 Crear Seeders

- **Plan de Cuentas Inicial** (IMPRESCINDIBLE para Bolivia):

```javascript
// seeders/001-plan-de-cuentas.js
{
  code: "1",
  name: "ACTIVO",
  type: "ACTIVO",
  level: 1,
  allows_movement: false
},
{
  code: "1.1",
  name: "ACTIVO CORRIENTE",
  type: "ACTIVO",
  level: 2,
  parent_id: 1,
  allows_movement: false
},
{
  code: "1.1.01",
  name: "CAJA Y BANCOS",
  type: "ACTIVO",
  level: 3,
  parent_id: 2,
  allows_movement: false
},
{
  code: "1.1.01.001",
  name: "Caja General",
  type: "ACTIVO",
  level: 4,
  parent_id: 3,
  allows_movement: true
}
// ... continuar con todas las cuentas
```

- **Usuario Admin por defecto**
- **Datos de prueba** (clientes, productos, ingredientes)

---

### 7. 📊 VALIDACIONES Y ESQUEMAS

#### 7.1 Crear Validadores con Joi

- **validators/account.validator.js**
- **validators/journalEntry.validator.js**
- **validators/invoice.validator.js**
- **validators/order.validator.js**
- **validators/product.validator.js**
- **validators/ingredient.validator.js**

---

### 8. 🧪 TESTING (OPCIONAL PERO RECOMENDADO)

#### 8.1 Configurar Jest

```bash
npm install --save-dev jest supertest
```

#### 8.2 Tests Críticos

- Partida doble en asientos contables
- Cálculo de costos de recetas
- Descuento de inventario en producción
- Flujo completo: Pedido → Producción → Entrega → Factura → Contabilidad

---

### 9. 📝 DOCUMENTACIÓN API

#### 9.1 Swagger/OpenAPI

```bash
npm install swagger-jsdoc swagger-ui-express
```

Documentar todos los endpoints con ejemplos.

---

### 10. 🚀 OPTIMIZACIONES Y MEJORAS

#### 10.1 Índices de Base de Datos

Agregar índices en:

- `Account.code`
- `JournalEntry.entry_number`
- `Invoice.invoice_number`
- `Order.client_id`, `Order.status`
- `JournalEntryDetail.account_id`

#### 10.2 Paginación

Implementar paginación en listados grandes.

#### 10.3 Logging

```bash
npm install winston
```

#### 10.4 Rate Limiting

```bash
npm install express-rate-limit
```

---

## 🎯 PRIORIDAD DE IMPLEMENTACIÓN

### **PRIORIDAD ALTA** (Para tener MVP funcional)

1. ✅ Modelos contables (YA HECHO)
2. 🔐 Autenticación y Middlewares de seguridad
3. 📦 Servicios de Inventario y Productos
4. 🛒 Servicios de Pedidos
5. 🏭 Servicio de Producción (con cierre de lote)
6. 🗄️ Seeders del plan de cuentas

### **PRIORIDAD MEDIA**

7. 🔄 Automatización contable completa
8. 📊 Validadores
9. 🗄️ Migraciones

### **PRIORIDAD BAJA** (Mejoras)

10. 🧪 Testing
11. 📝 Documentación Swagger
12. 🚀 Optimizaciones

---

## 📁 ESTRUCTURA FINAL DEL PROYECTO

```
Backend/
├── config/
│   ├── config.js
│   └── database.js (mejorado con .env)
├── controllers/
│   ├── accounting.controller.js ✅
│   ├── invoice.controller.js ✅
│   ├── auth.controller.js
│   ├── ingredient.controller.js
│   ├── product.controller.js
│   ├── order.controller.js
│   ├── client.controller.js
│   └── production.controller.js
├── middlewares/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── validation.middleware.js
├── models/
│   └── [Todos los modelos] ✅
├── routes/
│   ├── index.js ✅
│   ├── accounting.routes.js ✅
│   ├── invoice.routes.js ✅
│   ├── auth.routes.js
│   ├── ingredient.routes.js
│   ├── product.routes.js
│   ├── order.routes.js
│   ├── client.routes.js
│   └── production.routes.js
├── services/
│   ├── accounting.service.js ✅
│   ├── invoice.service.js ✅
│   ├── auth.service.js
│   ├── ingredient.service.js
│   ├── product.service.js
│   ├── order.service.js
│   ├── client.service.js
│   ├── production.service.js
│   └── accounting.automation.service.js
├── validators/
│   └── [Esquemas de validación]
├── migrations/
│   └── [Archivos de migración]
├── seeders/
│   └── [Datos iniciales]
├── tests/
│   └── [Tests unitarios e integración]
├── .env
├── .gitignore
├── index.js
└── package.json
```

---

## 🎨 SIGUIENTE PASO: FRONTEND

Una vez completado el backend (al menos prioridad ALTA), el frontend React deberá incluir:

### Módulos Frontend

1. **Dashboard**: KPIs, gráficas, alertas
2. **Inventario**: Gestión de ingredientes y productos
3. **Pedidos**: CRUD y seguimiento de estados
4. **Producción**: Planificación y cierre de lotes
5. **Facturación**: Emisión de facturas desde pedidos
6. **Contabilidad**:
   - Plan de cuentas
   - Registro de asientos
   - Libro Diario, Mayor, Balance de Comprobación
   - Estados Financieros
7. **Reportes**: Ventas, producción, inventario
8. **Administración**: Usuarios, roles, configuración

### Tecnologías Recomendadas Frontend

- **React** (ya instalado) + **Vite**
- **React Router** para navegación
- **Axios** para consumo de API
- **Zustand** o **Redux Toolkit** para estado global
- **TailwindCSS** o **Material-UI** para UI
- **React Hook Form** + **Yup** para formularios
- **Recharts** o **Chart.js** para gráficas
- **React Query** para cache de API

---

## ✨ CONCLUSIÓN

Has completado exitosamente el **módulo contable completo** del backend.

**Próximos pasos inmediatos:**

1. Implementar autenticación JWT
2. Crear servicios de inventario, pedidos y producción
3. Poblar base de datos con plan de cuentas inicial
4. Probar flujo completo con Postman/Insomnia
5. Iniciar desarrollo del frontend React

¿Necesitas ayuda con alguno de estos puntos específicos?
