-- ============================================================
-- 07 · FINANCE SCHEMA — Seed Data
-- Dependencias: 06-orders (pedidos), 04-customers (clientes),
--               01-catalog (prendas)
-- ============================================================

-- Facturas (pedido_id y cliente_id resueltos dinámicamente)
-- La columna numero_factura se genera como FAC-YYYY-XXXX
INSERT INTO finance.facturas
  (pedido_id, cliente_id, numero_factura, total, estado)
SELECT
  p.id,
  p.cliente_id,
  CONCAT('FAC-2026-', LPAD(ROW_NUMBER() OVER (ORDER BY p.fecha)::TEXT, 4, '0')),
  x.total,
  x.estado
FROM (
  VALUES
    ('cs_test_001', 49.99,  'pagada'),
    ('cs_test_002', 89.99,  'emitida'),
    ('cs_test_003', 120.00, 'pagada'),
    ('cs_test_004', 59.99,  'emitida'),
    ('cs_test_005', 149.99, 'anulada')
) AS x(stripe_session_id, total, estado)
JOIN orders.pedidos p ON p.stripe_session_id = x.stripe_session_id
ON CONFLICT (pedido_id) DO NOTHING;

-- Márgenes de producto (prenda_id resuelto dinámicamente por nombre)
INSERT INTO finance.margenes_producto
  (prenda_id, coste_produccion, precio_venta, margen_porcentaje, fecha_calculo)
SELECT p.id, x.coste_produccion, x.precio_venta, ROUND(((x.precio_venta - x.coste_produccion) / x.precio_venta) * 100, 2), x.fecha_calculo
FROM (
  VALUES
    ('Camiseta Origins Blanca', 18.50, 49.99,  '2026-04-01'::DATE),
    ('Sudadera Origins Negra',  35.00, 89.99,  '2026-04-01'::DATE),
    ('Camiseta Shadows Dark',   22.00, 59.99,  '2026-04-02'::DATE),
    ('Pantalón Limitless',      52.00, 120.00, '2026-04-02'::DATE)
) AS x(nombre_prenda, coste_produccion, precio_venta, fecha_calculo)
JOIN catalog.prendas p ON p.nombre = x.nombre_prenda
ON CONFLICT DO NOTHING;
