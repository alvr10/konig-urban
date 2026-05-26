-- ============================================================
-- 06 · ORDERS SCHEMA — Seed Data
-- Dependencias: 04-customers (clientes), 01-catalog (prendas,
--               identificadores_unicos)
-- ============================================================

-- Pedidos (cliente_id resuelto dinámicamente por email)
INSERT INTO orders.pedidos
  (cliente_id, fecha, estado, total, metodo_pago, stripe_session_id)
SELECT c.id, x.fecha, x.estado, x.total, x.metodo_pago, x.stripe_session_id
FROM (
  VALUES
    ('lucia.martin@konigurban.com',   '2026-01-15 10:15:00+01'::TIMESTAMPTZ, 'pagado',    49.99,  'tarjeta', 'cs_test_001'),
    ('alejandro.ruiz@konigurban.com', '2026-01-16 12:40:00+01'::TIMESTAMPTZ, 'enviado',   89.99,  'tarjeta', 'cs_test_002'),
    ('carmen.navarro@konigurban.com', '2026-01-18 18:05:00+01'::TIMESTAMPTZ, 'entregado', 120.00, 'paypal',  'cs_test_003'),
    ('daniel.santos@konigurban.com',  '2026-02-03 09:20:00+01'::TIMESTAMPTZ, 'pendiente', 59.99,  'tarjeta', 'cs_test_004'),
    ('paula.jimenez@konigurban.com',  '2026-02-10 20:10:00+01'::TIMESTAMPTZ, 'cancelado', 149.99, 'tarjeta', 'cs_test_005')
) AS x(email, fecha, estado, total, metodo_pago, stripe_session_id)
JOIN customers.clientes c ON c.email = x.email
ON CONFLICT (stripe_session_id) DO NOTHING;

-- Líneas de pedido (IDs resueltos dinámicamente — sin UUIDs hardcodeados)
INSERT INTO orders.lineas_pedido
  (pedido_id, prenda_id, uid_prenda_id, cantidad, precio_unitario)
SELECT
  p.id,
  pr.id,
  iu.id,
  x.cantidad,
  x.precio_unitario
FROM (
  VALUES
    ('cs_test_001', 'Camiseta Origins Blanca', 1, 49.99),
    ('cs_test_002', 'Sudadera Origins Negra',  1, 89.99),
    ('cs_test_003', 'Pantalón Limitless',       1, 120.00),
    ('cs_test_004', 'Camiseta Shadows Dark',   1, 59.99),
    ('cs_test_005', 'Sudadera Origins Negra',  1, 149.99)
) AS x(stripe_session_id, nombre_prenda, cantidad, precio_unitario)
JOIN orders.pedidos   p  ON p.stripe_session_id = x.stripe_session_id
JOIN catalog.prendas  pr ON pr.nombre           = x.nombre_prenda
-- Tomar el primer UID disponible de cada prenda que aún esté disponible
LEFT JOIN LATERAL (
  SELECT id
  FROM catalog.identificadores_unicos
  WHERE prenda_id = pr.id
    AND estado    = 'disponible'
  ORDER BY numero_serie ASC
  LIMIT 1
) iu ON TRUE
ON CONFLICT DO NOTHING;

-- Marcar los UIDs asignados como vendidos
UPDATE catalog.identificadores_unicos iu
SET estado = 'vendido'
FROM orders.lineas_pedido lp
WHERE lp.uid_prenda_id = iu.id
  AND iu.estado        = 'disponible';

-- Envíos (IDs de pedido resueltos dinámicamente por stripe_session_id)
INSERT INTO orders.envios
  (pedido_id, operador_logistico, tracking_url, estado_envio,
   fecha_envio, fecha_entrega_estimada, packaging_premium)
SELECT
  p.id,
  x.operador_logistico,
  x.tracking_url,
  x.estado_envio,
  x.fecha_envio,
  x.fecha_entrega_estimada,
  x.packaging_premium
FROM (
  VALUES
    ('cs_test_001', 'Correos Express', 'https://tracking.konigurban.com/ENV001', 'entregado',   '2026-01-16 08:00:00+01'::TIMESTAMPTZ, '2026-01-18'::DATE, TRUE),
    ('cs_test_002', 'SEUR',            'https://tracking.konigurban.com/ENV002', 'en_transito', '2026-01-17 09:30:00+01'::TIMESTAMPTZ, '2026-01-20'::DATE, TRUE),
    ('cs_test_003', 'DHL',             'https://tracking.konigurban.com/ENV003', 'entregado',   '2026-01-19 10:00:00+01'::TIMESTAMPTZ, '2026-01-22'::DATE, TRUE),
    ('cs_test_004', 'Correos Express', 'https://tracking.konigurban.com/ENV004', 'pendiente',   NULL,                                   '2026-02-07'::DATE, TRUE)
    -- cs_test_005 cancelado: no genera envío
) AS x(stripe_session_id, operador_logistico, tracking_url, estado_envio,
        fecha_envio, fecha_entrega_estimada, packaging_premium)
JOIN orders.pedidos p ON p.stripe_session_id = x.stripe_session_id
ON CONFLICT (pedido_id) DO NOTHING;
