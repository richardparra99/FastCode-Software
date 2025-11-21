# 📚 DOCUMENTACIÓN DE LA API - SIGEPAN

## 🔐 Autenticación

Todas las rutas (excepto `/api/auth/register` y `/api/auth/login`) requieren autenticación mediante token Bearer.

**Header requerido:**

Authorization: Bearer <token>

---

## 📝 ENDPOINTS IMPLEMENTADOS

### 🔑 Autenticación (`/api/auth`)

#### 1. Registrar Usuario

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "juanperez",
  "password": "password123",
  "full_name": "Juan Pérez",
  "role": "VENTAS"  // Opcional: ADMIN, VENTAS, PRODUCCION, CONTADOR
}
```

#### 2. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

# Respuesta:
{
  "exito": true,
  "mensaje": "Login exitoso",
  "datos": {
    "usuario": {
      "id": 1,
      "username": "admin",
      "full_name": "Administrador del Sistema",
      "role": "ADMIN",
      "is_active": true
    },
    "token": "..."
  }
}
```

#### 3. Obtener Usuario Actual

```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### 4. Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### 5. Cambiar Contraseña

```http
POST /api/auth/cambiar-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "password_actual": "admin123",
  "password_nuevo": "newpassword123"
}
```

---

### 👥 Usuarios (`/api/usuarios`)

#### 1. Listar Usuarios

```http
GET /api/usuarios
Authorization: Bearer <token>

# Query params opcionales:
?role=ADMIN
?is_active=true
```

#### 2. Obtener Usuario por ID

```http
GET /api/usuarios/:id
Authorization: Bearer <token>
```

#### 3. Crear Usuario (Solo ADMIN)

```http
POST /api/usuarios
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "vendedor1",
  "password": "password123",
  "full_name": "Vendedor Uno",
  "role": "VENTAS"
}
```

#### 4. Actualizar Usuario (Solo ADMIN)

```http
PATCH /api/usuarios/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "Nuevo Nombre",
  "role": "CONTADOR",
  "is_active": true,
  "password": "newpassword"  // Opcional
}
```

#### 5. Eliminar Usuario (Solo ADMIN)

```http
DELETE /api/usuarios/:id
Authorization: Bearer <token>
```

#### 6. Activar Usuario (Solo ADMIN)

```http
POST /api/usuarios/:id/activar
Authorization: Bearer <token>
```

---

### 👤 Clientes (`/api/clientes`)

#### 1. Listar Clientes

```http
GET /api/clientes
Authorization: Bearer <token>

# Query params opcionales:
?busqueda=texto  # Busca en nombre y teléfono
```

#### 2. Buscar por Teléfono

```http
GET /api/clientes/buscar/telefono?phone=591XXXXXX
Authorization: Bearer <token>
```

#### 3. Obtener Cliente por ID

```http
GET /api/clientes/:id
Authorization: Bearer <token>
```

#### 4. Crear Cliente

```http
POST /api/clientes
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "María González",
  "phone": "59178945612",
  "address": "Av. Banzer #123",
  "is_whatsapp": true
}
```

#### 5. Actualizar Cliente

```http
PATCH /api/clientes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "María González López",
  "phone": "59178945612",
  "address": "Nueva dirección",
  "is_whatsapp": false
}
```

#### 6. Eliminar Cliente

```http
DELETE /api/clientes/:id
Authorization: Bearer <token>
```

---

### 🍞 Productos (`/api/productos`)

#### 1. Listar Productos

```http
GET /api/productos
Authorization: Bearer <token>

# Query params opcionales:
?busqueda=pan
?is_active=true
```

#### 2. Obtener Producto por ID

```http
GET /api/productos/:id
Authorization: Bearer <token>

# Retorna el producto con sus ingredientes (receta)
```

#### 3. Crear Producto

```http
POST /api/productos
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Pan de Ajo",
  "description": "Pan francés con mantequilla de ajo",
  "price": 5.50,
  "is_active": true,
  "receta": [
    {
      "ingredient_id": 1,
      "quantity_required": 0.5
    },
    {
      "ingredient_id": 2,
      "quantity_required": 0.1
    }
  ]
}
```

#### 4. Actualizar Producto

```http
PATCH /api/productos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nuevo Nombre",
  "price": 6.00,
  "is_active": false,
  "receta": [...]  // Opcional
}
```

#### 5. Eliminar Producto (Soft Delete)

```http
DELETE /api/productos/:id
Authorization: Bearer <token>
```

#### 6. Activar Producto

```http
POST /api/productos/:id/activar
Authorization: Bearer <token>
```

#### 7. Actualizar Receta

```http
PUT /api/productos/:id/receta
Authorization: Bearer <token>
Content-Type: application/json

{
  "receta": [
    {
      "ingredient_id": 1,
      "quantity_required": 0.6
    }
  ]
}
```

---

### 📊 Contabilidad (`/api/contabilidad`)

Ver documentación completa en `API_USAGE_GUIDE.md`

---

### 💰 Facturas (`/api/facturas`)

Ver documentación completa en `API_USAGE_GUIDE.md`

---

## 🚀 INICIAR SERVIDOR

```bash
cd Backend
npm install
npm start
```

El servidor estará disponible en `http://localhost:3000`

---

## 🌱 SEEDERS

### 1. Crear Plan de Cuentas

```bash
node seeders/planDeCuentas.seed.js
```

### 2. Crear Usuario Administrador

```bash
node seeders/usuarioAdmin.seed.js
```

**Credenciales del Admin:**

- Username: `admin`
- Password: `admin123`

---

## 📋 FLUJO RECOMENDADO PARA FRONTEND

### 1. Login

```javascript
POST / api / auth / login;
// Guardar token en localStorage/sessionStorage
```

### 2. Obtener Usuario Actual

```javascript
GET / api / auth / me;
// Usar para verificar autenticación y roles
```

### 3. CRUD de Clientes

```javascript
GET    /api/clientes
POST   /api/clientes
PATCH  /api/clientes/:id
DELETE /api/clientes/:id
```

### 4. CRUD de Productos

```javascript
GET    /api/productos
POST   /api/productos
PATCH  /api/productos/:id
DELETE /api/productos/:id
```

### 5. Gestión de Usuarios (Solo ADMIN)

```javascript
GET    /api/usuarios
POST   /api/usuarios
PATCH  /api/usuarios/:id
DELETE /api/usuarios/:id
```

---

## 🔒 ROLES Y PERMISOS

- **ADMIN**: Acceso total
- **CONTADOR**: Módulo de contabilidad y facturas
- **VENTAS**: Clientes, productos, pedidos, facturas
- **PRODUCCION**: Inventario, producción, ingredientes

---

## ✅ ENDPOINTS LISTOS PARA FRONTEND

- ✅ Autenticación completa
- ✅ Gestión de usuarios
- ✅ Gestión de clientes
- ✅ Gestión de productos
- ✅ Módulo de contabilidad
- ✅ Módulo de facturas

## ⏳ FALTA IMPLEMENTAR

- ❌ CRUD de Pedidos (Orders)
- ❌ CRUD de Ingredientes
- ❌ Gestión de Inventario
- ❌ Gestión de Producción

Backend completamente funcional:
🔐 Autenticación:

POST /api/auth/login - Iniciar sesión
POST /api/auth/register - Registrar usuario
POST /api/auth/logout - Cerrar sesión
GET /api/auth/perfil - Ver perfil
👥 Usuarios:

GET /api/usuarios - Listar usuarios
GET /api/usuarios/:id - Ver usuario
PATCH /api/usuarios/:id - Actualizar usuario
DELETE /api/usuarios/:id - Eliminar usuario
🧑‍🤝‍🧑 Clientes:

GET /api/clientes - Listar clientes
GET /api/clientes/:id - Ver cliente
POST /api/clientes - Crear cliente
PATCH /api/clientes/:id - Actualizar cliente
DELETE /api/clientes/:id - Eliminar cliente
🍞 Productos:

GET /api/productos - Listar productos
GET /api/productos/:id - Ver producto con receta
POST /api/productos - Crear producto
PATCH /api/productos/:id - Actualizar producto
DELETE /api/productos/:id - Eliminar producto
PUT /api/productos/:id/receta - Actualizar receta
📘 Contabilidad:

Todas las rutas de contabilidad ya implementadas
💰 Facturas:

Todas las rutas de facturas ya implementadas
👤 Usuario Admin creado:

Username: admin
Password: admin123
Role: ADMIN
