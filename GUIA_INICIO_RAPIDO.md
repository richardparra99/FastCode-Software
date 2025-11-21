# 🚀 GUÍA DE INICIO RÁPIDO - SIGEPAN BACKEND

## 📍 ¿POR DÓNDE EMPEZAR?

Esta guía te mostrará paso a paso cómo usar lo que ya está implementado y qué hacer a continuación.

---

## ✅ LO QUE YA ESTÁ HECHO

### 1. Modelos de Base de Datos (COMPLETO)

Todos los modelos contables están creados y traducidos al español:

- ✅ **Cuenta** (`models/account.model.js`) - Plan de cuentas
- ✅ **AsientoContable** (`models/journalEntry.model.js`) - Cabecera de asientos
- ✅ **DetalleAsientoContable** (`models/journalEntryDetail.model.js`) - Líneas de asientos
- ✅ **Factura** (`models/invoice.model.js`) - Facturas de venta

### 2. Servicios con Lógica de Negocio (PENDIENTE TRADUCCIÓN)

Los servicios están creados pero aún en inglés:

- ⚠️ `services/accounting.service.js` - Funciones contables
- ⚠️ `services/invoice.service.js` - Funciones de facturación

### 3. Controladores (PENDIENTE TRADUCCIÓN)

- ⚠️ `controllers/accounting.controller.js`
- ⚠️ `controllers/invoice.controller.js`

### 4. Rutas de API (PENDIENTE TRADUCCIÓN)

- ⚠️ `routes/accounting.routes.js`
- ⚠️ `routes/invoice.routes.js`

---

## 🎯 PASO 1: PROBAR QUE TODO FUNCIONA

### 1.1 Asegúrate que la Base de Datos está Corriendo

Verifica que PostgreSQL esté ejecutándose en tu computadora:

- Puerto: `5501`
- Base de datos: `software`
- Usuario: `postgres`
- Contraseña: `postgres`

### 1.2 Iniciar el Servidor

```bash
cd Backend
npm start
```

Deberías ver:

```
Conexión a la base de datos establecida exitosamente.
db resync
App listening on port 3000
```

### 1.3 Verificar que las Tablas se Crearon

Abre DBeaver o pgAdmin y verifica que estas tablas existen:

- `Cuentas` (antes Account)
- `AsientoContables` (antes JournalEntry)
- `DetalleAsientoContables` (antes JournalEntryDetail)
- `Facturas` (antes Invoice)

---

## 🎯 PASO 2: CARGAR DATOS INICIALES

### 2.1 Cargar el Plan de Cuentas

Este es el paso MÁS IMPORTANTE. Sin el plan de cuentas, no puedes hacer contabilidad.

```bash
cd Backend
node seeders/planDeCuentas.seed.js
```

Deberías ver:

```
🌱 Iniciando seeder del Plan de Cuentas...
✅ Creada: 1 - ACTIVO
✅ Creada: 1.1 - ACTIVO CORRIENTE
✅ Creada: 1.1.01 - CAJA Y BANCOS
...
✨ Plan de Cuentas cargado exitosamente!
📊 Total de cuentas creadas: 70
```

### 2.2 Verificar el Plan de Cuentas

Abre tu base de datos y consulta:

```sql
SELECT * FROM "Cuentas" ORDER BY codigo;
```

Deberías ver 70+ cuentas organizadas jerárquicamente.

---

## 🎯 PASO 3: PROBAR LA API

### 3.1 Instalar Postman o Thunder Client

- **Postman**: https://www.postman.com/downloads/
- **Thunder Client**: Extensión de VS Code (recomendado)

### 3.2 Primera Prueba: Obtener Plan de Cuentas

```http
GET http://localhost:3000/api/accounting/chart-of-accounts
```

**Respuesta esperada:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "codigo": "1",
      "nombre": "ACTIVO",
      "tipo": "ACTIVO",
      "nivel": 1,
      ...
    }
  ]
}
```

### 3.3 Segunda Prueba: Crear un Asiento Contable

```http
POST http://localhost:3000/api/accounting/journal-entries
Content-Type: application/json

{
  "entry_date": "2025-11-20",
  "glosa": "Mi primer asiento contable de prueba",
  "type": "OPERACION",
  "details": [
    {
      "account_id": 4,
      "debit": 1000,
      "credit": 0,
      "description": "Ingreso a Caja General"
    },
    {
      "account_id": 50,
      "debit": 0,
      "credit": 1000,
      "description": "Venta de pan"
    }
  ]
}
```

**Nota**: Los `account_id` deben existir en tu tabla Cuentas. Usa IDs reales de tu base de datos.

---

## 🎯 PASO 4: ENTENDER LA ESTRUCTURA

### 4.1 ¿Cómo Funciona el Sistema?

```
USUARIO HACE PETICIÓN
        ↓
    RUTAS (routes/)
        ↓
  CONTROLADORES (controllers/)
        ↓
    SERVICIOS (services/)
        ↓
    MODELOS (models/)
        ↓
   BASE DE DATOS
```

### 4.2 Ejemplo Práctico: Crear un Asiento

1. **Ruta** (`routes/accounting.routes.js`):

   ```javascript
   router.post("/journal-entries", accountingController.createJournalEntry);
   ```

2. **Controlador** (`controllers/accounting.controller.js`):

   ```javascript
   async createJournalEntry(req, res) {
     const entry = await accountingService.createJournalEntry(req.body, userId);
     res.status(201).json({ success: true, data: entry });
   }
   ```

3. **Servicio** (`services/accounting.service.js`):

   ```javascript
   async createJournalEntry(entryData, userId) {
     // Validar partida doble
     // Crear en base de datos
     // Retornar resultado
   }
   ```

4. **Modelo** (`models/journalEntry.model.js`):
   ```javascript
   const AsientoContable = sequelize.define("AsientoContable", {
     numero_asiento: DataTypes.STRING,
     fecha_asiento: DataTypes.DATEONLY,
     ...
   });
   ```

---

## 🎯 PASO 5: LO QUE FALTA POR HACER

### PRIORIDAD CRÍTICA 🔴

#### 1. Terminar la Traducción al Español

Los servicios, controladores y rutas aún tienen nombres en inglés. Necesitas:

- [ ] Traducir `services/accounting.service.js`
- [ ] Traducir `services/invoice.service.js`
- [ ] Traducir `controllers/accounting.controller.js`
- [ ] Traducir `controllers/invoice.controller.js`
- [ ] Traducir `routes/accounting.routes.js`
- [ ] Traducir `routes/invoice.routes.js`

**¿Quieres que yo haga esta traducción ahora?** Solo dime y lo hago.

#### 2. Implementar Autenticación JWT

Actualmente NO hay seguridad. Cualquiera puede acceder a todo.

**Necesitas crear**:

```
middlewares/
  ├── autenticacion.middleware.js   # Verificar JWT
  └── roles.middleware.js           # Verificar permisos

services/
  └── autenticacion.service.js      # Login, registro

controllers/
  └── autenticacion.controller.js   # Endpoints de login

routes/
  └── autenticacion.routes.js       # POST /api/auth/login
```

**Archivo .env**:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5501
DB_NAME=software
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=tu_clave_super_secreta_aqui_cambiala
JWT_EXPIRA_EN=24h
```

#### 3. Crear Usuario Administrador Inicial

```javascript
// seeders/usuarioAdmin.seed.js
const bcrypt = require("bcrypt");
const { Usuario } = require("../models");

const password_hash = await bcrypt.hash("admin123", 10);
await Usuario.create({
  username: "admin",
  password_hash,
  full_name: "Administrador",
  role: "ADMIN",
  is_active: true,
});
```

### PRIORIDAD ALTA 🟡

#### 4. Módulo de Inventario

Crear servicios para:

- CRUD de ingredientes
- Registrar compras
- Ver stock bajo
- Calcular costo promedio

#### 5. Módulo de Pedidos

Crear servicios para:

- Crear pedido (con items)
- Cambiar estados
- Vincular con producción

#### 6. Módulo de Producción

**EL MÁS IMPORTANTE**:

- Crear lotes de producción
- Cerrar lote (descuenta ingredientes automáticamente)
- Generar asientos contables de costos

---

## 🎯 PASO 6: FLUJO COMPLETO DEL SISTEMA

### Flujo Ideal de una Venta:

```
1. COMPRA DE INGREDIENTES
   → Se registra en Inventario
   → Se crea asiento contable:
      Debe: Inventario Materia Prima
      Haber: Caja/Banco

2. CREAR PEDIDO
   → Cliente hace pedido de 100 panes
   → Estado: NUEVO

3. PLANIFICAR PRODUCCIÓN
   → Crear lote de 100 panes
   → Estado: PLANIFICADO

4. PRODUCIR
   → Cambiar estado lote a: EN_PROCESO
   → Producir el pan

5. CERRAR LOTE
   → Estado: TERMINADO
   → El sistema automáticamente:
      - Descuenta harina, azúcar, etc. del inventario
      - Crea asiento contable de costo de producción:
         Debe: Costo de Producción
         Haber: Inventario Materia Prima

6. ENTREGAR PEDIDO
   → Cambiar estado pedido a: ENTREGADO
   → Subir foto de firma

7. FACTURAR
   → Generar factura desde el pedido
   → El sistema automáticamente crea asiento:
      Debe: Caja/Banco
      Haber: Ingreso por Ventas

8. VER REPORTES
   → Libro Diario
   → Balance General
   → Estado de Resultados
```

---

## 📚 ARCHIVOS ÚTILES

1. **`ROADMAP_BACKEND.md`** - Plan completo con todos los pasos
2. **`API_USAGE_GUIDE.md`** - Ejemplos de uso de todos los endpoints
3. **`README.md`** - Documentación general del proyecto

---

## 🆘 SI ESTÁS PERDIDO

### Pregunta 1: "¿Qué hago primero?"

**Respuesta**: Sigue los pasos 1, 2 y 3 de esta guía. Asegúrate que todo funciona.

### Pregunta 2: "¿Cómo pruebo si funciona?"

**Respuesta**: Usa Postman/Thunder Client. Prueba el endpoint GET del plan de cuentas.

### Pregunta 3: "¿Qué código debo escribir yo?"

**Respuesta**: Por ahora nada. Solo ejecuta y prueba. Luego decidimos qué implementar.

### Pregunta 4: "¿Todo está en español?"

**Respuesta**: Los modelos SÍ. Los servicios, controladores y rutas NO (aún).

### Pregunta 5: "¿Por qué hay cosas en inglés?"

**Respuesta**: Porque lo implementé primero en inglés. Ahora las estoy traduciendo.

---

## 🎯 TU DECISIÓN AHORA

**Opción A**: "Termina de traducir todo al español primero"

- Te traduzco services, controllers y routes completos

**Opción B**: "Implementa autenticación JWT ahora"

- Creo todo el sistema de login y seguridad

**Opción C**: "Quiero entender mejor cómo funciona"

- Te explico línea por línea un flujo completo

**Opción D**: "Vamos directo a hacer el frontend"

- Dejamos el backend como está y empezamos React

---

## 💡 MI RECOMENDACIÓN

1. ✅ **YA HICIMOS**: Modelos traducidos al español
2. 🔄 **HACER AHORA**: Traducir services, controllers y routes
3. 🔐 **HACER DESPUÉS**: Sistema de autenticación
4. 📦 **HACER DESPUÉS**: Módulos de inventario y pedidos
5. 🎨 **AL FINAL**: Frontend React

---

**¿Qué opción eliges? Dime y continuamos desde ahí.**
