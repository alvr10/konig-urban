-- ============================================================
-- KÖNIG URBAN — DDL: schema production
-- Microservicio: production-service
-- ============================================================
-- FK lógica:
--   control_calidad.prenda_id → catalog.prendas.id
-- Al aprobar un control de calidad, production-service publica
-- el evento 'production.quality.approved' en RabbitMQ y
-- catalog-service marca la prenda como activo = TRUE.
-- ============================================================

CREATE SCHEMA IF NOT EXISTS production;

-- ------------------------------------------------------------
-- Proveedores
-- ------------------------------------------------------------
CREATE TABLE production.proveedores (
    id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre     VARCHAR(200) NOT NULL,
    tipo       VARCHAR(30)  NOT NULL
                   CHECK (tipo IN ('tejidos','fabricacion','packaging')),
    contacto   VARCHAR(150),
    email      VARCHAR(255),
    pais       VARCHAR(100),
    activo     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_proveedores_tipo   ON production.proveedores (tipo);
CREATE INDEX idx_proveedores_activo ON production.proveedores (activo);

-- ------------------------------------------------------------
-- Órdenes de compra
-- ------------------------------------------------------------
CREATE TABLE production.ordenes_compra (
    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    proveedor_id UUID          NOT NULL REFERENCES production.proveedores (id),
    fecha        DATE          NOT NULL,
    estado       VARCHAR(20)   NOT NULL DEFAULT 'borrador'
                     CHECK (estado IN ('borrador','confirmada','recibida','cancelada')),
    total        NUMERIC(12,2) CHECK (total >= 0),
    notas        TEXT,
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ordenes_proveedor ON production.ordenes_compra (proveedor_id);
CREATE INDEX idx_ordenes_estado    ON production.ordenes_compra (estado);
CREATE INDEX idx_ordenes_fecha     ON production.ordenes_compra (fecha);

-- ------------------------------------------------------------
-- Líneas de orden de compra
-- ------------------------------------------------------------
CREATE TABLE production.lineas_orden_compra (
    id                   UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    orden_id             UUID          NOT NULL REFERENCES production.ordenes_compra (id),
    descripcion_material VARCHAR(300)  NOT NULL,
    cantidad             INTEGER       NOT NULL CHECK (cantidad > 0),
    precio_unitario      NUMERIC(10,2) NOT NULL CHECK (precio_unitario >= 0)
);

CREATE INDEX idx_lineas_oc_orden_id ON production.lineas_orden_compra (orden_id);

-- ------------------------------------------------------------
-- Control de calidad
-- ------------------------------------------------------------
CREATE TABLE production.control_calidad (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    prenda_id      UUID        NOT NULL,   -- FK lógica → catalog.prendas.id
    inspector      VARCHAR(150) NOT NULL,
    fecha_revision TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resultado      VARCHAR(20) NOT NULL
                       CHECK (resultado IN ('aprobado','rechazado')),
    notas          TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cc_prenda_id      ON production.control_calidad (prenda_id);
CREATE INDEX idx_cc_resultado       ON production.control_calidad (resultado);
CREATE INDEX idx_cc_fecha_revision ON production.control_calidad (fecha_revision);