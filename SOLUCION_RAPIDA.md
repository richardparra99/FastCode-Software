# Solución Rápida a los Errores de Carga

## Problema

Las páginas muestran "Error al cargar..." porque el token de autenticación en localStorage no es válido.

## Solución Rápida

### Opción 1: Desde la Consola del Navegador (F12)

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Hacer login y obtener token válido
fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "admin", password: "admin123" }),
})
  .then((res) => res.json())
  .then((data) => {
    if (data.exito) {
      localStorage.setItem("token", data.datos.token);
      localStorage.setItem("usuario", JSON.stringify(data.datos.usuario));
      console.log("✅ Login exitoso! Token guardado.");
      location.reload();
    }
  });
```

### Opción 2: Cerrar Sesión y Volver a Iniciar

1. Ir a la página de login: `http://localhost:5173/login`
2. Si ya hay sesión, cerrar sesión
3. Ingresar con:
   - **Usuario**: `admin`
   - **Contraseña**: `admin123`
4. Después del login exitoso, todas las páginas funcionarán correctamente

## Datos de Prueba Disponibles

### Usuarios

- **Admin**: username=`admin`, password=`admin123`

### Clientes (6 registros)

- Juan Pérez
- María González
- Pedro López

### Productos (4 registros)

- Pan francés - $1.50
- Pan de maíz - $2.00
- Torta de chocolate - $45.00
- Empanadas de queso - $3.50

### Cuentas Contables (34 registros)

- Plan de cuentas completo con:
  - Activos
  - Pasivos
  - Patrimonio
  - Ingresos
  - Gastos

## Verificación

Después de aplicar la solución, verifica que todo funcione:

1. **Dashboard**: Debe mostrar 6 clientes, 4 productos
2. **Clientes**: Debe listar 6 clientes
3. **Productos**: Debe listar 4 productos
4. **Contabilidad**: Debe mostrar 34 cuentas en el Plan de Cuentas

## Nota Técnica

El error ocurre porque:

1. El token se genera al hacer login
2. El token se guarda en `localStorage`
3. Si accedes directamente sin login, no hay token válido
4. Los endpoints del backend requieren autenticación válida

La solución es asegurarse de que siempre haya un login exitoso antes de acceder a las otras páginas.
