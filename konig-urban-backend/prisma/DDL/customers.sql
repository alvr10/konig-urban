-- ============================================================
-- KÖNIG URBAN — DDL: schema customers
-- Microservicio: customers-service
-- ============================================================

CREATE SCHEMA IF NOT EXISTS customers;

-- ------------------------------------------------------------
-- Clientes
-- ------------------------------------------------------------
CREATE TABLE customers.clientes (
    id               UUID         PRIMARY KEY REFERENCES auth.users(id),
    nombre           VARCHAR(100) NOT NULL,
    apellidos        VARCHAR(150) NOT NULL,
    email            VARCHAR(255) NOT NULL UNIQUE,
    telefono         VARCHAR(20),
    direccion        TEXT,
    tipo_cliente     VARCHAR(20)  NOT NULL DEFAULT 'estandar'
                         CHECK (tipo_cliente IN ('estandar','coleccionista','premium')),
    fecha_registro   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    activo           BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE UNIQUE INDEX idx_clientes_email        ON customers.clientes (email);
CREATE INDEX        idx_clientes_tipo_cliente ON customers.clientes (tipo_cliente);

-- ------------------------------------------------------------
-- Membresías
-- ------------------------------------------------------------
CREATE TABLE customers.membresias (
    id                UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id        UUID    NOT NULL UNIQUE REFERENCES customers.clientes (id),
    nivel             VARCHAR(20) NOT NULL
                          CHECK (nivel IN ('basico','white-glove')),
    fecha_inicio      DATE    NOT NULL,
    acceso_anticipado BOOLEAN NOT NULL DEFAULT FALSE,
    activa            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_membresias_nivel             ON customers.membresias (nivel);
CREATE INDEX idx_membresias_acceso_anticipado ON customers.membresias (acceso_anticipado);