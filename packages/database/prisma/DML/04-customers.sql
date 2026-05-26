-- ============================================================
-- 04 · CUSTOMERS SCHEMA — Seed Data
-- Dependencias: auth.users de Supabase debe tener los emails
--               de cada cliente registrados previamente.
-- ============================================================

-- Clientes (Usando UUIDs generados automáticamente, independiente de auth.users)
INSERT INTO customers.clientes
  (id, nombre, apellidos, email, telefono, direccion, tipo_cliente, activo)
SELECT
  gen_random_uuid(),
  x.nombre, x.apellidos, x.email,
  x.telefono, x.direccion, x.tipo_cliente, x.activo
FROM (
  VALUES
    ('lucia.martin@konigurban.com',     'Lucía',      'Martín López',   '600111222', 'Calle Gran Vía 12, Madrid',       'estandar',      TRUE),
    ('alejandro.ruiz@konigurban.com',   'Alejandro',  'Ruiz Gómez',     '600222333', 'Avenida Andalucía 45, Sevilla',   'coleccionista', TRUE),
    ('carmen.navarro@konigurban.com',   'Carmen',     'Navarro Díaz',   '600333444', 'Plaza Nueva 8, Granada',          'premium',       TRUE),
    ('daniel.santos@konigurban.com',    'Daniel',     'Santos Romero',  '600444555', 'Calle Larios 20, Málaga',         'estandar',      TRUE),
    ('paula.jimenez@konigurban.com',    'Paula',      'Jiménez Torres', '600555666', 'Paseo Marítimo 3, Cádiz',         'premium',       TRUE)
) AS x(email, nombre, apellidos, telefono, direccion, tipo_cliente, activo)
ON CONFLICT (email) DO NOTHING;

-- Membresías (JOINed por email de cliente)
INSERT INTO customers.membresias
  (cliente_id, nivel, fecha_inicio, acceso_anticipado, activa)
SELECT c.id, x.nivel, x.fecha_inicio, x.acceso_anticipado, x.activa
FROM (
  VALUES
    ('lucia.martin@konigurban.com',     'basico',      '2026-01-10'::DATE, FALSE, TRUE),
    ('alejandro.ruiz@konigurban.com',   'white-glove', '2026-02-01'::DATE, TRUE,  TRUE),
    ('carmen.navarro@konigurban.com',   'white-glove', '2026-03-15'::DATE, TRUE,  TRUE),
    ('paula.jimenez@konigurban.com',    'basico',      '2026-03-20'::DATE, TRUE,  TRUE)
) AS x(email, nivel, fecha_inicio, acceso_anticipado, activa)
JOIN customers.clientes c ON c.email = x.email
ON CONFLICT (cliente_id) DO NOTHING;
