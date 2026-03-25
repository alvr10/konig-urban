-- ============================================================
-- KÖNIG URBAN — DDL: schema catalog
-- Microservicio: catalog-service
-- ============================================================

CREATE SCHEMA IF NOT EXISTS catalog;

-- ------------------------------------------------------------
-- Categorías de producto
-- ------------------------------------------------------------
CREATE TABLE catalog.categorias (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre      VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- ------------------------------------------------------------
-- Colecciones (ediciones limitadas)
-- ------------------------------------------------------------
CREATE TABLE catalog.colecciones (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre              VARCHAR(150) NOT NULL,
    temporada           VARCHAR(50),
    descripcion         TEXT,
    fecha_lanzamiento   DATE,
    estado              VARCHAR(20)  NOT NULL
                            CHECK (estado IN ('borrador','publicada','agotada')),
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_colecciones_estado           ON catalog.colecciones (estado);
CREATE INDEX idx_colecciones_fecha_lanzamiento ON catalog.colecciones (fecha_lanzamiento);

-- ------------------------------------------------------------
-- Prendas
-- ------------------------------------------------------------
CREATE TABLE catalog.prendas (
    id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    coleccion_id    UUID          NOT NULL REFERENCES catalog.colecciones (id),
    categoria_id    UUID          NOT NULL REFERENCES catalog.categorias  (id),
    nombre          VARCHAR(150)  NOT NULL,
    descripcion     TEXT,
    precio          NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
    gramaje_algodon INTEGER       CHECK (gramaje_algodon > 0),  -- GSM
    material        VARCHAR(200),
    imagen_url      TEXT,
    activo          BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_prendas_coleccion ON catalog.prendas (coleccion_id);
CREATE INDEX idx_prendas_categoria ON catalog.prendas (categoria_id);
CREATE INDEX idx_prendas_activo    ON catalog.prendas (activo);

-- ------------------------------------------------------------
-- Drops (eventos de lanzamiento exclusivos)
-- ------------------------------------------------------------
CREATE TABLE catalog.drops (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    coleccion_id  UUID        NOT NULL UNIQUE REFERENCES catalog.colecciones (id),
    fecha_inicio  TIMESTAMPTZ NOT NULL,
    fecha_fin     TIMESTAMPTZ NOT NULL,
    activo        BOOLEAN     NOT NULL DEFAULT FALSE,
    descripcion   TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_drops_fechas CHECK (fecha_fin > fecha_inicio)
);

CREATE INDEX idx_drops_activo      ON catalog.drops (activo);
CREATE INDEX idx_drops_fecha_inicio ON catalog.drops (fecha_inicio);

-- ------------------------------------------------------------
-- Identificadores únicos por prenda física
-- ------------------------------------------------------------
CREATE TABLE catalog.identificadores_unicos (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    prenda_id        UUID        NOT NULL REFERENCES catalog.prendas (id),
    uid_codigo       VARCHAR(64) NOT NULL UNIQUE,
    numero_serie     INTEGER     NOT NULL CHECK (numero_serie > 0),
    total_serie      INTEGER     NOT NULL CHECK (total_serie > 0),
    estado           VARCHAR(20) NOT NULL DEFAULT 'disponible'
                         CHECK (estado IN ('disponible','reservado','vendido')),
    fecha_generacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_uid_serie CHECK (numero_serie <= total_serie)
);

CREATE UNIQUE INDEX idx_uid_codigo     ON catalog.identificadores_unicos (uid_codigo);
CREATE INDEX        idx_uid_prenda_id  ON catalog.identificadores_unicos (prenda_id);
CREATE INDEX        idx_uid_estado     ON catalog.identificadores_unicos (estado);