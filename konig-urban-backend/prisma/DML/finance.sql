INSERT INTO finance.facturas
(pedido_id, cliente_id, total, estado)
SELECT x.pedido_id, c.id, x.total, x.estado
FROM (
    VALUES
    ('11111111-aaaa-aaaa-aaaa-111111111111'::UUID, 'lucia.martin@konigurban.com',   49.99,  'pagada'),
    ('22222222-bbbb-bbbb-bbbb-222222222222'::UUID, 'alejandro.ruiz@konigurban.com', 89.99,  'emitida'),
    ('33333333-cccc-cccc-cccc-333333333333'::UUID, 'carmen.navarro@konigurban.com', 120.00, 'pagada'),
    ('44444444-dddd-dddd-dddd-444444444444'::UUID, 'daniel.santos@konigurban.com',   59.99,  'emitida'),
    ('55555555-eeee-eeee-eeee-555555555555'::UUID, 'paula.jimenez@konigurban.com',   149.99, 'anulada')
) AS x(pedido_id, email, total, estado)
JOIN customers.clientes c
    ON c.email = x.email;

INSERT INTO finance.margenes_producto
(prenda_id, coste_produccion, precio_venta, fecha_calculo)
SELECT p.id, x.coste_produccion, x.precio_venta, x.fecha_calculo
FROM (
    VALUES
    ('Camiseta Origins Blanca', 18.50, 49.99, '2026-04-01'::DATE),
    ('Sudadera Origins Negra', 35.00, 89.99, '2026-04-01'::DATE),
    ('Camiseta Shadows Dark',  22.00, 59.99, '2026-04-02'::DATE),
    ('Pantalón Limitless',     52.00, 120.00, '2026-04-02'::DATE)
) AS x(nombre_prenda, coste_produccion, precio_venta, fecha_calculo)
JOIN catalog.prendas p
    ON p.nombre = x.nombre_prenda;

