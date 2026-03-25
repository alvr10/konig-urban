-- ============================================================
-- KÖNIG URBAN — DDL: schema marketing
-- Microservicio: marketing-service
-- ============================================================
-- FK lógicas (no declaradas como REFERENCES):
--   campanas.coleccion_id       → catalog.colecciones.id
--   clientes_campana.cliente_id → customers.clientes.id
-- ============================================================

CREATE SCHEMA IF NOT EXISTS marketing;

-- ------------------------------------------------------------
-- Campañas
-- ------------------------------------------------------------
CREATE TABLE marketing.campanas (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre       VARCHAR(200) NOT NULL,
    tipo         VARCHAR(30)  NOT NULL
                     CHECK (tipo IN ('newsletter','influencer','redes','drop')),
    coleccion_id UUID,   -- FK lógica
    fecha_inicio DATE         NOT NULL,
    fecha_fin    DATE,
    estado       VARCHAR(20)  NOT NULL DEFAULT 'planificada'
                     CHECK (estado IN ('planificada','activa','finalizada','cancelada')),
    descripcion  TEXT,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_campanas_fechas CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);

CREATE INDEX idx_campanas_estado      ON marketing.campanas (estado);
CREATE INDEX idx_campanas_tipo        ON marketing.campanas (tipo);
CREATE INDEX idx_campanas_fecha_inicio ON marketing.campanas (fecha_inicio);
CREATE INDEX idx_campanas_coleccion   ON marketing.campanas (coleccion_id)
    WHERE coleccion_id IS NOT NULL;

-- ------------------------------------------------------------
-- Segmentación: clientes por campaña
-- ------------------------------------------------------------
CREATE TABLE marketing.clientes_campana (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    campana_id  UUID        NOT NULL REFERENCES marketing.campanas (id),
    cliente_id  UUID        NOT NULL,   -- FK lógica
    enviado     BOOLEAN     NOT NULL DEFAULT FALSE,
    fecha_envio TIMESTAMPTZ,

    CONSTRAINT uq_cliente_campana UNIQUE (campana_id, cliente_id)
);

CREATE INDEX idx_cc_campana_id ON marketing.clientes_campana (campana_id);
CREATE INDEX idx_cc_enviado    ON marketing.clientes_campana (enviado);