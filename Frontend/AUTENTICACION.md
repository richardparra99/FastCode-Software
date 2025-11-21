# Sistema de Autenticación y Protección de Rutas

## ✅ Implementación Completa

El sistema ahora cuenta con **protección completa de rutas** usando múltiples capas de seguridad:

### 1. **ProtectedRoute Component**

- Verifica autenticación antes de renderizar cualquier ruta
- Redirige automáticamente al login si no hay token
- Limpia datos residuales de localStorage

### 2. **AuthGuard Hook**

- Hook personalizado que verifica autenticación en cada cambio de ruta
- Monitorea el estado de autenticación continuamente
- Previene acceso a rutas protegidas sin token válido

### 3. **Axios Interceptors**

- **Request Interceptor**: Agrega automáticamente el token Bearer a todas las peticiones
- **Response Interceptor**: Captura errores 401 (No autorizado) y redirige al login
- Limpia localStorage automáticamente cuando hay error de autenticación

### 4. **Login Auto-redirect**

- Si ya estás autenticado y visitas /login, te redirige automáticamente al dashboard
- Previene acceso innecesario a la página de login

## 🔒 Flujo de Autenticación

### Login Exitoso:

1. Usuario ingresa credenciales en `/login`
2. Backend valida y retorna token + datos de usuario
3. Token se guarda en `localStorage.setItem("token", token)`
4. Usuario se guarda en `localStorage.setItem("usuario", JSON.stringify(usuario))`
5. Redirección automática al dashboard (`/`)

### Acceso a Rutas Protegidas:

1. Usuario intenta acceder a ruta protegida (ej: `/clientes`)
2. `ProtectedRoute` verifica `AuthService.isAuthenticated()`
3. Si hay token válido → Renderiza la página dentro del `Layout`
4. Si NO hay token → Redirige a `/login` y limpia localStorage

### Pérdida de Sesión:

1. Token expira o es inválido
2. Backend responde con error 401
3. Axios interceptor captura el error 401
4. Limpia localStorage automáticamente
5. Redirige al usuario a `/login`
6. Usuario debe iniciar sesión nuevamente

## 📁 Archivos Clave

```
Frontend/
├── src/
│   ├── App.jsx                          # Rutas protegidas + setup de interceptores
│   ├── hooks/
│   │   └── useAuthCheck.jsx            # Hook de verificación de autenticación
│   ├── utils/
│   │   └── axiosInterceptor.js         # Interceptores de Axios para auth
│   ├── services/
│   │   └── AuthService.js              # Servicio de autenticación
│   ├── components/
│   │   └── Layout/
│   │       └── Layout.jsx              # Layout con botón de cerrar sesión
│   └── pages/
│       └── Login/
│           └── Login.jsx               # Página de login con auto-redirect
```

## 🚀 Uso

### Para Usuario:

1. **Primera vez / Sin sesión**:

   - Visitar cualquier URL → Redirige a `/login`
   - Ingresar credenciales: `admin` / `admin123`
   - Automáticamente redirige al dashboard

2. **Con sesión activa**:

   - Todas las rutas funcionan normalmente
   - Token se envía automáticamente en cada petición
   - Si visitas `/login`, te redirige al dashboard

3. **Cerrar sesión**:
   - Click en botón "Cerrar Sesión" en el header
   - Se ejecuta `AuthService.logout()`
   - Limpia localStorage
   - Redirige a `/login`

### Para Desarrollador:

```jsx
// Verificar si está autenticado
const isAuth = AuthService.isAuthenticated(); // true/false

// Obtener usuario actual
const usuario = AuthService.getCurrentUser(); // { username, role, ... }

// Obtener token
const token = AuthService.getToken(); // string o null

// Proteger una nueva ruta
<Route
  path="/nueva-ruta"
  element={
    <ProtectedRoute>
      <NuevoComponente />
    </ProtectedRoute>
  }
/>;
```

## 🔐 Seguridad Implementada

✅ **Protección en Frontend**:

- Rutas protegidas con `ProtectedRoute`
- Verificación continua con `AuthGuard`
- Auto-redirect en pérdida de sesión
- Limpieza automática de datos sensibles

✅ **Protección en Backend**:

- Middleware de autenticación en todas las rutas protegidas
- Validación de token en cada petición
- Respuestas 401 para tokens inválidos

✅ **Headers Automáticos**:

- Axios agrega automáticamente: `Authorization: Bearer <token>`
- No necesitas especificar headers manualmente en cada petición

## ⚠️ Importante

- **Siempre** hacer login antes de acceder a rutas protegidas
- Si ves "Error al cargar...", verifica que tengas un token válido
- El token se guarda en `localStorage` y persiste entre recargas de página
- Cerrar sesión limpia todos los datos de autenticación

## 🧪 Probar el Sistema

1. **Acceso directo sin login**:

   ```
   http://localhost:5173/clientes
   → Redirige a /login automáticamente
   ```

2. **Login y navegación**:

   ```
   1. Ir a /login
   2. Ingresar admin/admin123
   3. Acceder a cualquier ruta protegida
   → Todo funciona correctamente
   ```

3. **Logout y re-acceso**:

   ```
   1. Click en "Cerrar Sesión"
   2. Intentar acceder a /productos
   → Redirige a /login
   ```

4. **Token expirado/inválido**:
   ```
   1. Modificar manualmente el token en localStorage
   2. Hacer cualquier petición
   → Error 401 → Auto-redirect a /login
   ```

---

**Estado**: ✅ Sistema completamente funcional y protegido
