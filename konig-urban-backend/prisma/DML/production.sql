INSERT INTO production.proveedores (id, nombre, tipo, contacto, email, pais)
VALUES
('11111111-1111-1111-1111-111111111111', 'Textiles Premium SL', 'tejidos', 'Carlos Ruiz', 'contacto@textilespremium.com', 'España'),
('22222222-2222-2222-2222-222222222222', 'Factory Moda Portugal', 'fabricacion', 'Ana Costa', 'info@factorymoda.pt', 'Portugal'),
('33333333-3333-3333-3333-333333333333', 'PackLux Italia', 'packaging', 'Marco Bianchi', 'sales@packlux.it', 'Italia');

INSERT INTO production.ordenes_compra (id, proveedor_id, fecha, estado, total, notas)
VALUES
('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', '2026-03-01', 'confirmada', 1500.00, 'Compra tejidos algodón premium'),
('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '22222222-2222-2222-2222-222222222222', '2026-03-05', 'recibida', 3200.00, 'Producción colección primavera'),
('aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '33333333-3333-3333-3333-333333333333', '2026-03-10', 'borrador', 800.00, 'Packaging edición limitada');

INSERT INTO production.lineas_orden_compra (orden_id, descripcion_material, cantidad, precio_unitario)
VALUES
-- Orden 1
('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Algodón orgánico blanco', 100, 10.00),
('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Algodón orgánico negro', 50, 10.00),

-- Orden 2
('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Fabricación camisetas premium', 200, 12.00),
('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Fabricación sudaderas', 100, 20.00),

-- Orden 3
('aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Caja lujo edición limitada', 80, 10.00);

INSERT INTO production.control_calidad (prenda_id, inspector, resultado, notas)
VALUES
('aaaaaaaa-0000-0000-0000-000000000001', 'Laura Gómez', 'aprobado', 'Calidad excelente, sin defectos'),
('aaaaaaaa-0000-0000-0000-000000000002', 'Pedro Martínez', 'rechazado', 'Costuras defectuosas'),
('aaaaaaaa-0000-0000-0000-000000000003', 'Laura Gómez', 'aprobado', 'Cumple estándares premium');
