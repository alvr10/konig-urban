INSERT INTO marketing.campanas
(nombre, tipo, coleccion_id, fecha_inicio, fecha_fin, estado, descripcion)
SELECT x.nombre, x.tipo, c.id, x.fecha_inicio, x.fecha_fin, x.estado, x.descripcion
FROM (
    VALUES
    ('Newsletter ORIGINS lanzamiento', 'newsletter', 'DROP 001 - ORIGINS', '2026-01-10'::DATE, '2026-01-20'::DATE, 'finalizada', 'Campaña de email marketing para presentar la colección ORIGINS'),
    ('Campaña Instagram SHADOWS', 'redes', 'DROP 002 - SHADOWS', '2026-02-01'::DATE, '2026-02-15'::DATE, 'activa', 'Promoción en redes sociales con contenido visual de SHADOWS'),
    ('Influencers LIMITLESS', 'influencer', 'DROP 003 - LIMITLESS', '2026-03-01'::DATE, '2026-03-31'::DATE, 'planificada', 'Colaboración con creadores de contenido de moda urbana'),
    ('Drop exclusivo ORIGINS', 'drop', 'DROP 001 - ORIGINS', '2026-01-15'::DATE, '2026-01-18'::DATE, 'finalizada', 'Campaña asociada al lanzamiento limitado del primer drop')
) AS x(nombre, tipo, nombre_coleccion, fecha_inicio, fecha_fin, estado, descripcion)
JOIN catalog.colecciones c
    ON c.nombre = x.nombre_coleccion;

INSERT INTO marketing.campanas
(nombre, tipo, coleccion_id, fecha_inicio, fecha_fin, estado, descripcion)
VALUES
('Newsletter bienvenida premium', 'newsletter', NULL, '2026-04-01'::DATE, '2026-04-30'::DATE, 'activa', 'Campaña de bienvenida y fidelización para clientes premium');

INSERT INTO marketing.clientes_campana
(campana_id, cliente_id, enviado, fecha_envio)
SELECT ca.id, cl.id, x.enviado, x.fecha_envio
FROM (
    VALUES
    ('Newsletter ORIGINS lanzamiento', 'lucia.martin@konigurban.com', TRUE,  '2026-01-10 09:00:00+01'::TIMESTAMPTZ),
    ('Newsletter ORIGINS lanzamiento', 'alejandro.ruiz@konigurban.com', TRUE, '2026-01-10 09:02:00+01'::TIMESTAMPTZ),
    ('Newsletter ORIGINS lanzamiento', 'carmen.navarro@konigurban.com', TRUE, '2026-01-10 09:05:00+01'::TIMESTAMPTZ),

    ('Campaña Instagram SHADOWS', 'daniel.santos@konigurban.com', FALSE, NULL),
    ('Campaña Instagram SHADOWS', 'paula.jimenez@konigurban.com', FALSE, NULL),

    ('Influencers LIMITLESS', 'alejandro.ruiz@konigurban.com', FALSE, NULL),
    ('Influencers LIMITLESS', 'carmen.navarro@konigurban.com', FALSE, NULL),

    ('Drop exclusivo ORIGINS', 'lucia.martin@konigurban.com', TRUE, '2026-01-15 08:30:00+01'::TIMESTAMPTZ),
    ('Drop exclusivo ORIGINS', 'paula.jimenez@konigurban.com', TRUE, '2026-01-15 08:35:00+01'::TIMESTAMPTZ),

    ('Newsletter bienvenida premium', 'carmen.navarro@konigurban.com', TRUE, '2026-04-01 10:00:00+01'::TIMESTAMPTZ),
    ('Newsletter bienvenida premium', 'paula.jimenez@konigurban.com', TRUE, '2026-04-01 10:03:00+01'::TIMESTAMPTZ)
) AS x(nombre_campana, email_cliente, enviado, fecha_envio)
JOIN marketing.campanas ca
    ON ca.nombre = x.nombre_campana
JOIN customers.clientes cl
    ON cl.email = x.email_cliente;

