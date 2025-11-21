# 🍞 SIGEPAN - Sistema de Gestión para Panaderías

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13%2B-blue.svg)

Sistema ERP completo para gestión de panaderías que incluye:

- 📦 Gestión de Inventario y Recetas
- 🛒 Pedidos y Ventas
- 🏭 Producción y Trazabilidad
- 💰 Facturación Electrónica
- 📊 Contabilidad Automatizada

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Uso](#-uso)
- [Módulos](#-módulos)
- [Documentación](#-documentación)
- [Contribuir](#-contribuir)

---

## ✨ Características

### Módulo de Inventario

- Control de stock de ingredientes con alertas
- Sistema de recetas con cantidades específicas
- Kardex automático de movimientos
- Cálculo de costo promedio

### Módulo de Pedidos

- Estados: NUEVO → EN_PRODUCCION → LISTO → ENTREGADO
- Firma digital de entrega
- Vinculación con producción
- Trazabilidad completa

### Módulo de Producción

- Planificación de lotes
- Descuento automático de ingredientes
- Control de desperdicio
- Trazabilidad orden-lote

### Módulo de Facturación

- Generación automática desde pedidos
- Dosificación SIN (Bolivia)
- Múltiples métodos de pago
- Reportes de ventas

### Módulo Contable

- Plan de cuentas jerárquico
- Asientos con partida doble validada
- Libro Diario, Mayor, Balance
- Estados Financieros automatizados

---

## 🛠️ Stack Tecnológico

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5
- **Base de Datos**: PostgreSQL 13+
- **ORM**: Sequelize 6
- **Seguridad**: JWT, Bcrypt, Helmet, CORS

### Frontend (Próximamente)

- React + Vite
- TailwindCSS / Material-UI
- Axios + React Query
- React Router

---

## 🚀 Instalación

### Prerrequisitos

- Node.js >= 18.0.0
- PostgreSQL >= 13
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone https://github.com/richardparra99/FastCode-Software.git
cd FastCode-Software
```

### 2. Instalar dependencias del Backend

```bash
cd Backend
npm install
```

### 3. Configurar Base de Datos

Crear una base de datos PostgreSQL:

```sql
CREATE DATABASE software;
```

### 4. Configurar variables de entorno

Crear archivo `.env` en `Backend/`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5501
DB_NAME=software
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

### 5. Sincronizar modelos con la base de datos

```bash
npm start
```

Esto creará todas las tablas automáticamente.

### 6. Cargar Plan de Cuentas Inicial

```bash
node seeders/planDeCuentas.seed.js
```

---

## ⚙️ Configuración

### Archivo `config/config.js`

Ajusta la configuración de la base de datos:

```javascript
const sequelize = new Sequelize("software", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
  port: 5501,
});
```

### Puerto del servidor

Por defecto: `http://localhost:3000`

---

## 🎯 Uso

### Iniciar el servidor

```bash
cd Backend
npm start
```

El servidor estará disponible en `http://localhost:3000`

### Probar la API

Usa Postman, Insomnia o Thunder Client con los endpoints documentados en `API_USAGE_GUIDE.md`

### Ejemplo básico

```bash
# Obtener plan de cuentas
curl http://localhost:3000/api/accounting/chart-of-accounts

# Crear asiento contable
curl -X POST http://localhost:3000/api/accounting/journal-entries \
  -H "Content-Type: application/json" \
  -d '{
    "entry_date": "2025-11-20",
    "glosa": "Compra de harina",
    "type": "COMPRA",
    "details": [...]
  }'
```

---

## 📦 Módulos

### Implementados ✅

- ✅ **Contabilidad**: Plan de cuentas, asientos, reportes
- ✅ **Facturación**: Generación y gestión de facturas
- ✅ **Modelos Base**: Usuarios, Clientes, Productos, Ingredientes

### En Desarrollo 🔨

- 🔨 **Autenticación**: JWT, Login, Registro
- 🔨 **Inventario**: CRUD y movimientos
- 🔨 **Pedidos**: Gestión completa
- 🔨 **Producción**: Lotes y trazabilidad

### Planificados 📋

- 📋 **Reportes**: Dashboards y estadísticas
- 📋 **Notificaciones**: Alertas de stock
- 📋 **Frontend**: Interfaz React completa

---

## 📚 Documentación

- **[ROADMAP_BACKEND.md](./ROADMAP_BACKEND.md)**: Plan completo de desarrollo
- **[API_USAGE_GUIDE.md](./API_USAGE_GUIDE.md)**: Guía de uso de la API con ejemplos
- **Modelos**: Revisar carpeta `Backend/models/`
- **Servicios**: Revisar carpeta `Backend/services/`

### Estructura del Proyecto

```
Backend/
├── config/          # Configuración de DB
├── controllers/     # Controladores HTTP
│   ├── accounting.controller.js ✅
│   └── invoice.controller.js ✅
├── models/          # Modelos Sequelize ✅
├── routes/          # Rutas de la API ✅
├── services/        # Lógica de negocio
│   ├── accounting.service.js ✅
│   └── invoice.service.js ✅
├── middlewares/     # Autenticación, validación
├── validators/      # Esquemas de validación
├── seeders/         # Datos iniciales
│   └── planDeCuentas.seed.js ✅
└── index.js         # Punto de entrada
```

---

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
npm test
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 👥 Equipo

- **José Andrés Cruz** - Backend Developer
- **Richard Parra** - Project Manager

---

## 📝 Licencia

Este proyecto es privado y de uso interno.

---

## 📞 Soporte

Para reportar bugs o solicitar nuevas funcionalidades, abre un issue en GitHub.

---

## 🎯 Próximos Pasos

1. Implementar autenticación JWT
2. Completar módulos de Inventario y Pedidos
3. Implementar lógica de producción
4. Crear automatización contable completa
5. Desarrollar frontend React
6. Deployment en servidor de producción

---

**¡Feliz codificación! 🚀**
