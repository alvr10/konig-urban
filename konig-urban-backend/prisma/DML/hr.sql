INSERT INTO hr.departamentos (nombre) VALUES
('Direccion'),
('Diseno'),
('Marketing'),
('Logistica'),
('Finanzas'),
('Recursos Humanos');

INSERT INTO hr.empleados
(departamento_id, nombre, apellidos, email, cargo, fecha_contratacion, salario, activo)
SELECT d.id, x.nombre, x.apellidos, x.email, x.cargo, x.fecha_contratacion, x.salario, x.activo
FROM (
    VALUES
    ('Direccion',        'Carlos', 'Mendez Ortega',   'carlos.mendez@konigurban.com',   'CEO',                    '2024-01-10'::DATE, 4200.00, TRUE),
    ('Diseno',           'Lucia',  'Serrano Vidal',   'lucia.serrano@konigurban.com',   'Diseñadora Senior',      '2024-03-15'::DATE, 2600.00, TRUE),
    ('Marketing',        'Javier', 'Ruiz Campos',     'javier.ruiz@konigurban.com',     'Marketing Manager',      '2024-02-01'::DATE, 2400.00, TRUE),
    ('Logistica',        'Marta',  'Lopez Navas',     'marta.lopez@konigurban.com',     'Responsable Logística',  '2024-04-20'::DATE, 2200.00, TRUE),
    ('Finanzas',         'Elena',  'Morales Pardo',   'elena.morales@konigurban.com',   'Analista Financiera',    '2024-05-05'::DATE, 2300.00, TRUE),
    ('Recursos Humanos', 'Pablo',  'Diaz Romero',     'pablo.diaz@konigurban.com',      'HR Specialist',          '2024-06-10'::DATE, 2100.00, TRUE),
    ('Diseno',           'Andrea', 'Gil Herrera',     'andrea.gil@konigurban.com',      'Diseñadora Junior',      '2025-01-12'::DATE, 1800.00, TRUE),
    ('Logistica',        'Sergio', 'Navarro Peña',    'sergio.navarro@konigurban.com',  'Operario Logístico',     '2025-02-18'::DATE, 1600.00, TRUE)
) AS x(departamento, nombre, apellidos, email, cargo, fecha_contratacion, salario, activo)
JOIN hr.departamentos d
    ON d.nombre = x.departamento;

INSERT INTO hr.contratos
(empleado_id, tipo_contrato, fecha_inicio, fecha_fin, salario_bruto, activo)
SELECT e.id, x.tipo_contrato, x.fecha_inicio, x.fecha_fin, x.salario_bruto, x.activo
FROM (
    VALUES
    ('carlos.mendez@konigurban.com',  'indefinido', '2024-01-10'::DATE, NULL,               4200.00, TRUE),
    ('lucia.serrano@konigurban.com',  'indefinido', '2024-03-15'::DATE, NULL,               2600.00, TRUE),
    ('javier.ruiz@konigurban.com',    'indefinido', '2024-02-01'::DATE, NULL,               2400.00, TRUE),
    ('marta.lopez@konigurban.com',    'indefinido', '2024-04-20'::DATE, NULL,               2200.00, TRUE),
    ('elena.morales@konigurban.com',  'indefinido', '2024-05-05'::DATE, NULL,               2300.00, TRUE),
    ('pablo.diaz@konigurban.com',     'indefinido', '2024-06-10'::DATE, NULL,               2100.00, TRUE),
    ('andrea.gil@konigurban.com',     'practicas',  '2025-01-12'::DATE, '2025-12-31'::DATE, 1800.00, TRUE),
    ('sergio.navarro@konigurban.com', 'temporal',   '2025-02-18'::DATE, '2025-10-31'::DATE, 1600.00, TRUE)
) AS x(email, tipo_contrato, fecha_inicio, fecha_fin, salario_bruto, activo)
JOIN hr.empleados e
    ON e.email = x.email;

INSERT INTO hr.nominas
(empleado_id, periodo, salario_bruto, deducciones, fecha_pago, pagada)
SELECT e.id, x.periodo, x.salario_bruto, x.deducciones, x.fecha_pago, x.pagada
FROM (
    VALUES
    ('carlos.mendez@konigurban.com',  '2026-01', 4200.00, 850.00, '2026-01-31'::DATE, TRUE),
    ('lucia.serrano@konigurban.com',  '2026-01', 2600.00, 520.00, '2026-01-31'::DATE, TRUE),
    ('javier.ruiz@konigurban.com',    '2026-01', 2400.00, 480.00, '2026-01-31'::DATE, TRUE),
    ('marta.lopez@konigurban.com',    '2026-01', 2200.00, 430.00, '2026-01-31'::DATE, TRUE),
    ('elena.morales@konigurban.com',  '2026-01', 2300.00, 450.00, '2026-01-31'::DATE, TRUE),
    ('pablo.diaz@konigurban.com',     '2026-01', 2100.00, 400.00, '2026-01-31'::DATE, TRUE),
    ('andrea.gil@konigurban.com',     '2026-01', 1800.00, 250.00, '2026-01-31'::DATE, TRUE),
    ('sergio.navarro@konigurban.com', '2026-01', 1600.00, 220.00, '2026-01-31'::DATE, TRUE),

    ('carlos.mendez@konigurban.com',  '2026-02', 4200.00, 850.00, '2026-02-28'::DATE, TRUE),
    ('lucia.serrano@konigurban.com',  '2026-02', 2600.00, 520.00, '2026-02-28'::DATE, TRUE),
    ('javier.ruiz@konigurban.com',    '2026-02', 2400.00, 480.00, '2026-02-28'::DATE, TRUE),
    ('marta.lopez@konigurban.com',    '2026-02', 2200.00, 430.00, '2026-02-28'::DATE, TRUE),
    ('elena.morales@konigurban.com',  '2026-02', 2300.00, 450.00, '2026-02-28'::DATE, TRUE),
    ('pablo.diaz@konigurban.com',     '2026-02', 2100.00, 400.00, '2026-02-28'::DATE, TRUE),
    ('andrea.gil@konigurban.com',     '2026-02', 1800.00, 250.00, '2026-02-28'::DATE, TRUE),
    ('sergio.navarro@konigurban.com', '2026-02', 1600.00, 220.00, '2026-02-28'::DATE, TRUE)
) AS x(email, periodo, salario_bruto, deducciones, fecha_pago, pagada)
JOIN hr.empleados e
    ON e.email = x.email;