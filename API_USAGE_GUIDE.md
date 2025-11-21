# 📘 GUÍA DE USO - API CONTABLE SIGEPAN

## 🔗 BASE URL

```
http://localhost:3000/api
```

---

## 📊 MÓDULO DE CONTABILIDAD

### 1. Plan de Cuentas

#### Crear Cuenta Contable

```http
POST /api/accounting/accounts
Content-Type: application/json

{
  "code": "1.1.01.001",
  "name": "Caja General",
  "type": "ACTIVO",
  "level": 4,
  "parent_id": 3,
  "allows_movement": true,
  "is_active": true,
  "description": "Cuenta para registro de efectivo en caja"
}
```

#### Obtener Plan de Cuentas

```http
GET /api/accounting/chart-of-accounts
GET /api/accounting/chart-of-accounts?type=ACTIVO
GET /api/accounting/chart-of-accounts?level=4&is_active=true
```

#### Actualizar Cuenta

```http
PUT /api/accounting/accounts/1
Content-Type: application/json

{
  "name": "Caja General Bolivia",
  "description": "Actualizado"
}
```

---

### 2. Asientos Contables

#### Crear Asiento Contable

```http
POST /api/accounting/journal-entries
Content-Type: application/json

{
  "entry_date": "2025-11-20",
  "glosa": "Compra de harina para producción",
  "type": "COMPRA",
  "details": [
    {
      "account_id": 5,
      "debit": 1500.00,
      "credit": 0,
      "description": "Compra de 100kg de harina a Bs. 15/kg"
    },
    {
      "account_id": 1,
      "debit": 0,
      "credit": 1500.00,
      "description": "Pago en efectivo"
    }
  ]
}
```

**Respuesta Exitosa:**

```json
{
  "success": true,
  "message": "Asiento contable creado exitosamente",
  "data": {
    "id": 1,
    "entry_number": "AST-2025-000001",
    "entry_date": "2025-11-20",
    "glosa": "Compra de harina para producción",
    "type": "COMPRA",
    "status": "BORRADOR",
    "total_debit": 1500.00,
    "total_credit": 1500.00,
    "details": [...]
  }
}
```

#### Obtener Asiento por ID

```http
GET /api/accounting/journal-entries/1
```

#### Contabilizar (Aprobar) Asiento

```http
POST /api/accounting/journal-entries/1/approve
Content-Type: application/json

{
  "user_id": 1
}
```

#### Anular Asiento

```http
POST /api/accounting/journal-entries/1/void
```

---

### 3. Reportes Contables

#### Libro Diario

```http
GET /api/accounting/journal?start_date=2025-01-01&end_date=2025-12-31
GET /api/accounting/journal?start_date=2025-11-01&end_date=2025-11-30&type=COMPRA
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "period": {
      "start_date": "2025-01-01",
      "end_date": "2025-12-31"
    },
    "entries": [
      {
        "id": 1,
        "entry_number": "AST-2025-000001",
        "entry_date": "2025-11-20",
        "glosa": "Compra de harina",
        "type": "COMPRA",
        "total_debit": 1500.00,
        "total_credit": 1500.00,
        "details": [...]
      }
    ]
  }
}
```

#### Libro Mayor de una Cuenta

```http
GET /api/accounting/ledger/1?start_date=2025-01-01&end_date=2025-12-31
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "account": {
      "id": 1,
      "code": "1.1.01.001",
      "name": "Caja General",
      "type": "ACTIVO"
    },
    "movements": [
      {
        "date": "2025-11-20",
        "entry_number": "AST-2025-000001",
        "glosa": "Compra de harina",
        "type": "COMPRA",
        "debit": 0,
        "credit": 1500.0,
        "balance": -1500.0
      }
    ],
    "final_balance": -1500.0
  }
}
```

#### Balance de Comprobación

```http
GET /api/accounting/trial-balance?start_date=2025-01-01&end_date=2025-12-31
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2025-01-01",
      "endDate": "2025-12-31"
    },
    "balances": [
      {
        "account_code": "1.1.01.001",
        "account_name": "Caja General",
        "account_type": "ACTIVO",
        "total_debit": 5000.0,
        "total_credit": 3500.0,
        "debit_balance": 1500.0,
        "credit_balance": 0
      },
      {
        "account_code": "5.1.01.001",
        "account_name": "Costo de Ventas",
        "account_type": "GASTO",
        "total_debit": 3000.0,
        "total_credit": 0,
        "debit_balance": 3000.0,
        "credit_balance": 0
      }
    ],
    "totals": {
      "total_debit": 8000.0,
      "total_credit": 3500.0,
      "total_debit_balance": 4500.0,
      "total_credit_balance": 0
    }
  }
}
```

#### Balance General (Estado de Situación Financiera)

```http
GET /api/accounting/balance-sheet?date=2025-12-31
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "date": "2025-12-31",
    "activos": {
      "accounts": [
        {
          "code": "1.1.01.001",
          "name": "Caja General",
          "balance": 15000.0
        },
        {
          "code": "1.1.02.001",
          "name": "Banco Mercantil",
          "balance": 25000.0
        }
      ],
      "total": 40000.0
    },
    "pasivos": {
      "accounts": [
        {
          "code": "2.1.01.001",
          "name": "Proveedores",
          "balance": 10000.0
        }
      ],
      "total": 10000.0
    },
    "patrimonio": {
      "accounts": [
        {
          "code": "3.1.01.001",
          "name": "Capital Social",
          "balance": 30000.0
        }
      ],
      "total": 30000.0
    },
    "total_pasivo_patrimonio": 40000.0,
    "is_balanced": true
  }
}
```

#### Estado de Resultados

```http
GET /api/accounting/income-statement?start_date=2025-01-01&end_date=2025-12-31
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2025-01-01",
      "endDate": "2025-12-31"
    },
    "ingresos": {
      "accounts": [
        {
          "code": "4.1.01.001",
          "name": "Venta de Pan",
          "amount": 50000.0
        }
      ],
      "total": 50000.0
    },
    "gastos": {
      "accounts": [
        {
          "code": "5.1.01.001",
          "name": "Costo de Ventas",
          "amount": 30000.0
        },
        {
          "code": "5.2.01.001",
          "name": "Gastos Administrativos",
          "amount": 5000.0
        }
      ],
      "total": 35000.0
    },
    "utilidad_neta": 15000.0
  }
}
```

---

## 💰 MÓDULO DE FACTURACIÓN

### 1. Crear Factura desde Pedido

```http
POST /api/invoices
Content-Type: application/json

{
  "order_id": 5,
  "nit": "1234567019",
  "business_name": "Panadería San José",
  "tax_amount": 0,
  "discount_amount": 0,
  "payment_method": "EFECTIVO",
  "notes": "Factura por pedido de pan francés",
  "authorization_code": "29040011007",
  "control_code": "8A-DC-53-8F-1E"
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Factura creada exitosamente",
  "data": {
    "id": 1,
    "invoice_number": "FAC-2025-000001",
    "invoice_date": "2025-11-20",
    "order_id": 5,
    "client_id": 2,
    "nit": "1234567019",
    "business_name": "Panadería San José",
    "subtotal": 250.00,
    "tax_amount": 0,
    "discount_amount": 0,
    "total_amount": 250.00,
    "status": "EMITIDA",
    "payment_method": "EFECTIVO",
    "order": {...},
    "client": {...}
  }
}
```

### 2. Listar Facturas

```http
GET /api/invoices
GET /api/invoices?status=EMITIDA
GET /api/invoices?client_id=2
GET /api/invoices?start_date=2025-11-01&end_date=2025-11-30
GET /api/invoices?payment_method=EFECTIVO
```

### 3. Obtener Factura por ID

```http
GET /api/invoices/1
```

### 4. Actualizar Estado de Factura

```http
PATCH /api/invoices/1/status
Content-Type: application/json

{
  "status": "PAGADA"
}
```

### 5. Anular Factura

```http
POST /api/invoices/1/void
```

### 6. Reporte de Ventas

```http
GET /api/invoices/reports/sales?start_date=2025-11-01&end_date=2025-11-30
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "period": {
      "start_date": "2025-11-01",
      "end_date": "2025-11-30"
    },
    "sales": [
      {
        "invoice_date": "2025-11-20",
        "payment_method": "EFECTIVO",
        "total_sales": "5000.00",
        "invoice_count": 15
      },
      {
        "invoice_date": "2025-11-20",
        "payment_method": "TRANSFERENCIA",
        "total_sales": "3000.00",
        "invoice_count": 8
      }
    ]
  }
}
```

### 7. Reporte de Ventas por Cliente

```http
GET /api/invoices/reports/by-client?start_date=2025-11-01&end_date=2025-11-30
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "period": {
      "start_date": "2025-11-01",
      "end_date": "2025-11-30"
    },
    "clients": [
      {
        "client_id": 2,
        "total_sales": "8000.00",
        "invoice_count": 12,
        "client": {
          "id": 2,
          "name": "Panadería San José",
          "nit": "1234567019",
          "phone": "77123456"
        }
      }
    ]
  }
}
```

---

## 🔍 CÓDIGOS DE ERROR

| Código | Descripción                               |
| ------ | ----------------------------------------- |
| 200    | Operación exitosa                         |
| 201    | Recurso creado exitosamente               |
| 400    | Solicitud incorrecta (validación fallida) |
| 401    | No autenticado                            |
| 403    | Sin permisos                              |
| 404    | Recurso no encontrado                     |
| 500    | Error interno del servidor                |

---

## 🧪 EJEMPLOS DE FLUJOS COMPLETOS

### Flujo 1: Compra de Ingredientes

1. **Crear cuenta de inventario** (si no existe)
2. **Registrar movimiento de inventario** (compra)
3. **Crear asiento contable** automático

```http
POST /api/accounting/journal-entries
{
  "entry_date": "2025-11-20",
  "glosa": "Compra de 100kg de harina a Molino El Sol",
  "type": "COMPRA",
  "reference_type": "InventoryMovement",
  "reference_id": 15,
  "details": [
    {
      "account_id": 5,
      "debit": 1500.00,
      "credit": 0,
      "description": "Inventario Materia Prima - Harina"
    },
    {
      "account_id": 1,
      "debit": 0,
      "credit": 1500.00,
      "description": "Pago en efectivo"
    }
  ]
}
```

### Flujo 2: Venta Completa

1. **Crear pedido** → orden_id: 5
2. **Procesar en producción**
3. **Marcar como ENTREGADO**
4. **Generar factura**

```http
POST /api/invoices
{
  "order_id": 5,
  "nit": "1234567019",
  "business_name": "Cliente ABC",
  "payment_method": "EFECTIVO",
  "total_amount": 250.00
}
```

5. **Se genera asiento contable automáticamente**

---

## 📋 VALIDACIONES IMPORTANTES

### Asientos Contables

- ✅ Debe = Haber (partida doble)
- ✅ Mínimo 2 líneas de detalle
- ✅ Solo cuentas que permiten movimientos
- ✅ Montos positivos

### Facturas

- ✅ Pedido debe estar en estado ENTREGADO
- ✅ No facturar dos veces el mismo pedido
- ✅ NIT válido (opcional según normativa)

---

## 🔧 HERRAMIENTAS RECOMENDADAS

- **Postman**: Para probar todos los endpoints
- **Insomnia**: Alternativa a Postman
- **Thunder Client**: Extensión de VS Code
- **DBeaver**: Para visualizar la base de datos PostgreSQL

---

## 📞 SOPORTE

Para más información, revisa:

- `ROADMAP_BACKEND.md` - Plan completo de desarrollo
- Código fuente en `services/`, `controllers/` y `routes/`
