-- ============================================================
-- 02 · PRODUCTION SCHEMA — Seed Data
-- Dependencias: ninguna (proveedores son entidades raíz)
-- Nota: control_calidad referencia prenda_id de catalog.prendas
--       por FK lógica — se resuelve dinámicamente por nombre.
-- ============================================================

-- Proveedores
INSERT INTO production.proveedores (nombre, tipo, contacto, email, pais, activo)
VALUES
  ('Textiles Premium SL',    'tejidos',     'Carlos Ruiz',  'contacto@textilespremium.com', 'España',   TRUE),
  ('Factory Moda Portugal',  'fabricacion', 'Ana Costa',    'info@factorymoda.pt',          'Portugal', TRUE),
  ('PackLux Italia',         'packaging',   'Marco Bianchi','sales@packlux.it',             'Italia',   TRUE)
ON CONFLICT DO NOTHING;

-- Órdenes de compra (IDs de proveedores resueltos dinámicamente)
INSERT INTO production.ordenes_compra (proveedor_id, fecha, estado, total, notas)
SELECT pv.id, x.fecha, x.estado, x.total, x.notas
FROM (
  VALUES
    ('contacto@textilespremium.com', '2026-03-01'::DATE, 'confirmada',  1500.00, 'Compra tejidos algodón premium'),
    ('info@factorymoda.pt',          '2026-03-05'::DATE, 'recibida',    3200.00, 'Producción colección primavera'),
    ('sales@packlux.it',             '2026-03-10'::DATE, 'borrador',     800.00, 'Packaging edición limitada')
) AS x(email_proveedor, fecha, estado, total, notas)
JOIN production.proveedores pv ON pv.email = x.email_proveedor
ON CONFLICT DO NOTHING;

-- Líneas de orden de compra (IDs de órdenes resueltos dinámicamente por proveedor + fecha)
INSERT INTO production.lineas_orden_compra (orden_id, descripcion_material, cantidad, precio_unitario)
SELECT oc.id, x.descripcion, x.cantidad, x.precio_unitario
FROM (
  VALUES
    ('contacto@textilespremium.com', '2026-03-01'::DATE, 'Algodón orgánico blanco',       100, 10.00),
    ('contacto@textilespremium.com', '2026-03-01'::DATE, 'Algodón orgánico negro',          50, 10.00),
    ('info@factorymoda.pt',          '2026-03-05'::DATE, 'Fabricación camisetas premium',  200, 12.00),
    ('info@factorymoda.pt',          '2026-03-05'::DATE, 'Fabricación sudaderas',          100, 20.00),
    ('sales@packlux.it',             '2026-03-10'::DATE, 'Caja lujo edición limitada',      80, 10.00)
) AS x(email_proveedor, fecha_orden, descripcion, cantidad, precio_unitario)
JOIN production.proveedores   pv ON pv.email  = x.email_proveedor
JOIN production.ordenes_compra oc ON oc.proveedor_id = pv.id AND oc.fecha = x.fecha_orden
ON CONFLICT DO NOTHING;

-- Control de calidad (prenda_id resuelto dinámicamente por nombre)
INSERT INTO production.control_calidad (prenda_id, inspector, resultado, notas)
SELECT p.id, x.inspector, x.resultado, x.notas
FROM (
  VALUES
    ('Camiseta Origins Blanca', 'Laura Gómez',     'aprobado',  'Calidad excelente, sin defectos'),
    ('Sudadera Origins Negra',  'Pedro Martínez',  'rechazado', 'Costuras defectuosas en el cuello'),
    ('Camiseta Shadows Dark',   'Laura Gómez',     'aprobado',  'Cumple estándares premium'),
    ('Pantalón Limitless',      'Pedro Martínez',  'aprobado',  'Material técnico validado')
) AS x(nombre_prenda, inspector, resultado, notas)
JOIN catalog.prendas p ON p.nombre = x.nombre_prenda
ON CONFLICT DO NOTHING;
