-- ============================================================
-- KÖNIG URBAN — DDL: schema finance
-- Microservicio: finance-service
-- ============================================================
-- FK lógicas (no declaradas como REFERENCES):
--   facturas.pedido_id         → orders.pedidos.id
--   facturas.cliente_id        → customers.clientes.id
--   margenes_producto.prenda_id → catalog.prendas.id
-- ============================================================

CREATE SCHEMA IF NOT EXISTS finance;

-- Secuencia para numeración de facturas (FA-2026-000001)
CREATE SEQUENCE IF NOT EXISTS finance.seq_numero_factura
    START WITH 1
    INCREMENT BY 1
    NO CYCLE;

-- ------------------------------------------------------------
-- Facturas
-- ------------------------------------------------------------
CREATE TABLE finance.facturas (
    id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id        UUID          NOT NULL UNIQUE,   -- FK lógica
    cliente_id       UUID          NOT NULL,          -- FK lógica
    numero_factura   VARCHAR(50)   NOT NULL UNIQUE
                         DEFAULT ('FA-' || to_char(NOW(), 'YYYY') || '-' ||
                                  lpad(nextval('finance.seq_numero_factura')::text, 6, '0')),
    fecha_emision    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    total            NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    estado           VARCHAR(20)   NOT NULL DEFAULT 'emitida'
                         CHECK (estado IN ('emitida','pagada','anulada')),
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_facturas_numero   ON finance.facturas (numero_factura);
CREATE UNIQUE INDEX idx_facturas_pedido   ON finance.facturas (pedido_id);
CREATE INDEX        idx_facturas_cliente  ON finance.facturas (cliente_id);
CREATE INDEX        idx_facturas_estado   ON finance.facturas (estado);
CREATE INDEX        idx_facturas_emision  ON finance.facturas (fecha_emision);

-- ------------------------------------------------------------
-- Márgenes por producto (panel analítico)
-- ------------------------------------------------------------
CREATE TABLE finance.margenes_producto (
    id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    prenda_id         UUID          NOT NULL,   -- FK lógica
    coste_produccion  NUMERIC(10,2) NOT NULL CHECK (coste_produccion >= 0),
    precio_venta      NUMERIC(10,2) NOT NULL CHECK (precio_venta > 0),
    margen_porcentaje NUMERIC(5,2)  NOT NULL
        GENERATED ALWAYS AS (
            ROUND(((precio_venta - coste_produccion) / precio_venta) * 100, 2)
        ) STORED,
    fecha_calculo     DATE          NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX idx_margenes_prenda_id    ON finance.margenes_producto (prenda_id);
CREATE INDEX idx_margenes_fecha_calculo ON finance.margenes_producto (fecha_calculo);