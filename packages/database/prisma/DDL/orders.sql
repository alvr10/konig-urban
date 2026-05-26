-- ============================================================
-- KÖNIG URBAN — DDL: schema orders
-- Microservicio: orders-service
-- ============================================================
-- FK lógicas (no declaradas como REFERENCES):
--   pedidos.cliente_id         → customers.clientes.id
--   lineas_pedido.prenda_id    → catalog.prendas.id
--   lineas_pedido.uid_prenda_id → catalog.identificadores_unicos.id
-- La integridad cross-schema se garantiza mediante eventos
-- RabbitMQ y validación en la capa de aplicación.
-- ============================================================

CREATE SCHEMA IF NOT EXISTS orders;

-- ------------------------------------------------------------
-- Pedidos
-- ------------------------------------------------------------
CREATE TABLE orders.pedidos (
    id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id        UUID          NOT NULL,   -- FK lógica
    fecha             TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    estado            VARCHAR(20)   NOT NULL DEFAULT 'pendiente'
                          CHECK (estado IN ('pendiente','pagado','enviado','entregado','cancelado')),
    total             NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    metodo_pago       VARCHAR(50),
    stripe_session_id VARCHAR(255)  UNIQUE,
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pedidos_cliente_id        ON orders.pedidos (cliente_id);
CREATE INDEX idx_pedidos_estado            ON orders.pedidos (estado);
CREATE UNIQUE INDEX idx_pedidos_stripe     ON orders.pedidos (stripe_session_id)
    WHERE stripe_session_id IS NOT NULL;
CREATE INDEX idx_pedidos_fecha             ON orders.pedidos (fecha);

-- ------------------------------------------------------------
-- Líneas de pedido
-- ------------------------------------------------------------
CREATE TABLE orders.lineas_pedido (
    id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id       UUID          NOT NULL REFERENCES orders.pedidos (id),
    prenda_id       UUID          NOT NULL,   -- FK lógica
    uid_prenda_id   UUID,                     -- FK lógica (puede ser NULL si la prenda no usa UIDs)
    cantidad        INTEGER       NOT NULL DEFAULT 1 CHECK (cantidad > 0),
    precio_unitario NUMERIC(10,2) NOT NULL CHECK (precio_unitario >= 0)
);

CREATE INDEX idx_lineas_pedido_pedido_id ON orders.lineas_pedido (pedido_id);
CREATE INDEX idx_lineas_pedido_prenda_id ON orders.lineas_pedido (prenda_id);

-- ------------------------------------------------------------
-- Envíos
-- ------------------------------------------------------------
CREATE TABLE orders.envios (
    id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id              UUID        NOT NULL UNIQUE REFERENCES orders.pedidos (id),
    operador_logistico     VARCHAR(100),
    tracking_url           TEXT,
    estado_envio           VARCHAR(30) NOT NULL DEFAULT 'pendiente'
                               CHECK (estado_envio IN ('pendiente','en_transito','entregado','incidencia')),
    fecha_envio            TIMESTAMPTZ,
    fecha_entrega_estimada DATE,
    packaging_premium      BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_envios_estado_envio ON orders.envios (estado_envio);
CREATE INDEX idx_envios_fecha_envio  ON orders.envios (fecha_envio);