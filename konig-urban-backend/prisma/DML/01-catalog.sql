-- ============================================================
-- 01 · CATALOG SCHEMA — Seed Data
-- Dependencias: ninguna
-- ============================================================

-- Categorías
INSERT INTO catalog.categorias (nombre, descripcion) VALUES
  ('Camisetas',  'Prendas superiores de algodón premium'),
  ('Sudaderas',  'Sudaderas de alta calidad con capucha o sin ella'),
  ('Pantalones', 'Pantalones urbanos de diseño exclusivo'),
  ('Accesorios', 'Complementos de moda urbana')
ON CONFLICT (nombre) DO NOTHING;

-- Colecciones
INSERT INTO catalog.colecciones (nombre, temporada, descripcion, fecha_lanzamiento, estado)
VALUES
  ('DROP 001 - ORIGINS',   'SS25', 'Primera colección fundacional de la marca', '2025-03-15', 'publicada'),
  ('DROP 002 - SHADOWS',   'FW25', 'Colección oscura y minimalista',            '2025-10-01', 'borrador'),
  ('DROP 003 - LIMITLESS', 'SS26', 'Edición limitada experimental',             '2026-04-01', 'publicada')
ON CONFLICT DO NOTHING;

-- Prendas (JOIN por nombre → IDs resueltos dinámicamente)
INSERT INTO catalog.prendas
  (coleccion_id, categoria_id, nombre, descripcion, precio, gramaje_algodon, material, imagen_url)
SELECT
  c.id, cat.id,
  p.nombre, p.descripcion, p.precio, p.gramaje, p.material, p.img
FROM (
  VALUES
    ('DROP 001 - ORIGINS',   'Camisetas',  'Camiseta Origins Blanca', 'Camiseta básica premium',     49.99,  220, '100% algodón orgánico', 'img1.jpg'),
    ('DROP 001 - ORIGINS',   'Sudaderas',  'Sudadera Origins Negra',  'Sudadera oversize',           89.99,  350, 'Algodón + poliéster',   'img2.jpg'),
    ('DROP 002 - SHADOWS',   'Camisetas',  'Camiseta Shadows Dark',   'Diseño minimalista oscuro',   59.99,  240, 'Algodón orgánico',      'img3.jpg'),
    ('DROP 003 - LIMITLESS', 'Pantalones', 'Pantalón Limitless',      'Pantalón técnico urbano',    120.00, NULL, 'Poliéster técnico',     'img4.jpg')
) AS p(col, cat, nombre, descripcion, precio, gramaje, material, img)
JOIN catalog.colecciones c   ON c.nombre   = p.col
JOIN catalog.categorias  cat ON cat.nombre = p.cat
ON CONFLICT DO NOTHING;

-- Drops para colecciones publicadas (IDs resueltos dinámicamente)
INSERT INTO catalog.drops
  (coleccion_id, fecha_inicio, fecha_fin, activo, descripcion)
SELECT
  id,
  fecha_lanzamiento,
  fecha_lanzamiento + INTERVAL '7 days',
  TRUE,
  'Drop exclusivo de lanzamiento'
FROM catalog.colecciones
WHERE estado = 'publicada'
ON CONFLICT (coleccion_id) DO NOTHING;

-- Identificadores únicos (50 por prenda, IDs resueltos dinámicamente)
INSERT INTO catalog.identificadores_unicos
  (prenda_id, uid_codigo, numero_serie, total_serie, estado)
SELECT
  p.id,
  CONCAT('UID-', LPAD(gs::TEXT, 3, '0'), '-', p.id),
  gs,
  50,
  'disponible'
FROM catalog.prendas p
CROSS JOIN generate_series(1, 50) AS gs
ON CONFLICT (uid_codigo) DO NOTHING;
