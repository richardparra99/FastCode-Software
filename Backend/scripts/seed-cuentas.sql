-- Script para insertar datos de prueba en la tabla Cuentas
-- Primero eliminamos las cuentas existentes
TRUNCATE TABLE "Cuentas" CASCADE;

-- Insertar cuentas
INSERT INTO "Cuentas" (codigo, nombre, tipo, nivel, padre_id, esta_activa, permite_movimiento, "createdAt", "updatedAt") VALUES
-- ACTIVOS
('1', 'ACTIVO', 'ACTIVO', 1, NULL, true, false, NOW(), NOW()),
('1.1', 'ACTIVO CORRIENTE', 'ACTIVO', 2, NULL, true, false, NOW(), NOW()),
('1.1.01', 'DISPONIBLE', 'ACTIVO', 3, NULL, true, false, NOW(), NOW()),
('1.1.01.001', 'Caja General', 'ACTIVO', 4, NULL, true, true, NOW(), NOW()),
('1.1.01.002', 'Banco Nacional', 'ACTIVO', 4, NULL, true, true, NOW(), NOW()),
('1.1.02', 'CUENTAS POR COBRAR', 'ACTIVO', 3, NULL, true, false, NOW(), NOW()),
('1.1.02.001', 'Clientes', 'ACTIVO', 4, NULL, true, true, NOW(), NOW()),
('1.1.03', 'INVENTARIOS', 'ACTIVO', 3, NULL, true, false, NOW(), NOW()),
('1.1.03.001', 'Inventario de Productos', 'ACTIVO', 4, NULL, true, true, NOW(), NOW()),
('1.1.03.002', 'Inventario de Materias Primas', 'ACTIVO', 4, NULL, true, true, NOW(), NOW()),

-- PASIVOS
('2', 'PASIVO', 'PASIVO', 1, NULL, true, false, NOW(), NOW()),
('2.1', 'PASIVO CORRIENTE', 'PASIVO', 2, NULL, true, false, NOW(), NOW()),
('2.1.01', 'CUENTAS POR PAGAR', 'PASIVO', 3, NULL, true, false, NOW(), NOW()),
('2.1.01.001', 'Proveedores', 'PASIVO', 4, NULL, true, true, NOW(), NOW()),
('2.1.02', 'OBLIGACIONES LABORALES', 'PASIVO', 3, NULL, true, false, NOW(), NOW()),
('2.1.02.001', 'Sueldos por Pagar', 'PASIVO', 4, NULL, true, true, NOW(), NOW()),

-- PATRIMONIO
('3', 'PATRIMONIO', 'PATRIMONIO', 1, NULL, true, false, NOW(), NOW()),
('3.1', 'CAPITAL', 'PATRIMONIO', 2, NULL, true, false, NOW(), NOW()),
('3.1.01', 'Capital Social', 'PATRIMONIO', 3, NULL, true, true, NOW(), NOW()),
('3.2', 'RESULTADOS', 'PATRIMONIO', 2, NULL, true, false, NOW(), NOW()),
('3.2.01', 'Utilidad del Ejercicio', 'PATRIMONIO', 3, NULL, true, true, NOW(), NOW()),

-- INGRESOS
('4', 'INGRESOS', 'INGRESO', 1, NULL, true, false, NOW(), NOW()),
('4.1', 'INGRESOS OPERACIONALES', 'INGRESO', 2, NULL, true, false, NOW(), NOW()),
('4.1.01', 'Ventas', 'INGRESO', 3, NULL, true, true, NOW(), NOW()),
('4.1.02', 'Servicios', 'INGRESO', 3, NULL, true, true, NOW(), NOW()),

-- GASTOS
('5', 'GASTOS', 'GASTO', 1, NULL, true, false, NOW(), NOW()),
('5.1', 'GASTOS OPERACIONALES', 'GASTO', 2, NULL, true, false, NOW(), NOW()),
('5.1.01', 'GASTOS ADMINISTRATIVOS', 'GASTO', 3, NULL, true, false, NOW(), NOW()),
('5.1.01.001', 'Sueldos y Salarios', 'GASTO', 4, NULL, true, true, NOW(), NOW()),
('5.1.01.002', 'Alquileres', 'GASTO', 4, NULL, true, true, NOW(), NOW()),
('5.1.01.003', 'Servicios Básicos', 'GASTO', 4, NULL, true, true, NOW(), NOW()),
('5.1.02', 'COSTO DE VENTAS', 'GASTO', 3, NULL, true, false, NOW(), NOW()),
('5.1.02.001', 'Costo de Productos Vendidos', 'GASTO', 4, NULL, true, true, NOW(), NOW()),
('5.1.02.002', 'Costo de Materias Primas', 'GASTO', 4, NULL, true, true, NOW(), NOW());

-- Actualizar las referencias padre
UPDATE "Cuentas" SET padre_id = (SELECT id FROM "Cuentas" WHERE codigo = '1') WHERE codigo LIKE '1.%' AND codigo != '1';
UPDATE "Cuentas" SET padre_id = (SELECT id FROM "Cuentas" WHERE codigo = '1.1') WHERE codigo LIKE '1.1.%' AND codigo != '1.1';
UPDATE "Cuentas" SET padre_id = (SELECT id FROM "Cuentas" WHERE codigo = '1.1.01') WHERE codigo LIKE '1.1.01.%' AND codigo != '1.1.01';
UPDATE "Cuentas" SET padre_id = (SELECT id FROM "Cuentas" WHERE codigo = '1.1.02') WHERE codigo LIKE '1.1.02.%' AND codigo != '1.1.02';
UPDATE "Cuentas" SET padre_id = (SELECT id FROM "Cuentas" WHERE codigo = '1.1.03') WHERE codigo LIKE '1.1.03.%' AND codigo != '1.1.03';

UPDATE "Cuentas" SET padre_id = (SELECT id FROM "Cuentas" WHERE codigo = '2') WHERE codigo LIKE '2.%' AND codigo != '2';
UPDATE "Cuentas" SET padre_id = (SELECT id FROM "Cuentas" WHERE codigo = '2.1') WHERE codigo LIKE '2.1.%' AND codigo != '2.1';
UPDATE "Cuentas" SET padre_id = (SELECT id FROM "Cuentas" WHERE codigo = '2.1.01') WHERE codigo LIKE '2.1.01.%' AND codigo != '2.1.01';
UPDATE "Cuentas" SET padre_id = (SELECT id FROM "Cuentas" WHERE codigo = '2.1.02') WHERE codigo LIKE '2.1.02.%' AND codigo != '2.1.02';

UPDATE "Cuentas" SET padre_id = (SELECT id FROM "Cuentas" WHERE codigo = '3') WHERE codigo LIKE '3.%' AND codigo != '3';
UPDATE "Cuentas" SET padre_id = (SELECT id FROM "Cuentas" WHERE codigo = '3.1') WHERE codigo LIKE '3.1.%' AND codigo != '3.1';
UPDATE "Cuentas" SET padre_id = (SELECT id FROM "Cuentas" WHERE codigo = '3.2') WHERE codigo LIKE '3.2.%' AND codigo != '3.2';

UPDATE "Cuentas" SET padre_id = (SELECT id FROM "Cuentas" WHERE codigo = '4') WHERE codigo LIKE '4.%' AND codigo != '4';
UPDATE "Cuentas" SET padre_id = (SELECT id FROM "Cuentas" WHERE codigo = '4.1') WHERE codigo LIKE '4.1.%' AND codigo != '4.1';

UPDATE "Cuentas" SET padre_id = (SELECT id FROM "Cuentas" WHERE codigo = '5') WHERE codigo LIKE '5.%' AND codigo != '5';
UPDATE "Cuentas" SET padre_id = (SELECT id FROM "Cuentas" WHERE codigo = '5.1') WHERE codigo LIKE '5.1.%' AND codigo != '5.1';
UPDATE "Cuentas" SET padre_id = (SELECT id FROM "Cuentas" WHERE codigo = '5.1.01') WHERE codigo LIKE '5.1.01.%' AND codigo != '5.1.01';
UPDATE "Cuentas" SET padre_id = (SELECT id FROM "Cuentas" WHERE codigo = '5.1.02') WHERE codigo LIKE '5.1.02.%' AND codigo != '5.1.02';

-- Verificar
SELECT COUNT(*) as total_cuentas FROM "Cuentas";
