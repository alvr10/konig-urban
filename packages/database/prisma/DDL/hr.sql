-- ============================================================
-- KÖNIG URBAN — DDL: schema hr
-- Microservicio: hr-service
-- ============================================================

CREATE SCHEMA IF NOT EXISTS hr;

-- ------------------------------------------------------------
-- Departamentos
-- ------------------------------------------------------------
CREATE TABLE hr.departamentos (
    id     UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- ------------------------------------------------------------
-- Empleados
-- ------------------------------------------------------------
CREATE TABLE hr.empleados (
    id                 UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    departamento_id    UUID          NOT NULL REFERENCES hr.departamentos (id),
    nombre             VARCHAR(100)  NOT NULL,
    apellidos          VARCHAR(150)  NOT NULL,
    email              VARCHAR(255)  NOT NULL UNIQUE,
    cargo              VARCHAR(100),
    fecha_contratacion DATE          NOT NULL,
    salario            NUMERIC(10,2) NOT NULL CHECK (salario >= 0),
    activo             BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_empleados_email          ON hr.empleados (email);
CREATE INDEX        idx_empleados_departamento   ON hr.empleados (departamento_id);
CREATE INDEX        idx_empleados_activo         ON hr.empleados (activo);

-- ------------------------------------------------------------
-- Contratos laborales
-- ------------------------------------------------------------
CREATE TABLE hr.contratos (
    id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    empleado_id     UUID          NOT NULL REFERENCES hr.empleados (id),
    tipo_contrato   VARCHAR(50)   NOT NULL
                        CHECK (tipo_contrato IN ('indefinido','temporal','practicas')),
    fecha_inicio    DATE          NOT NULL,
    fecha_fin       DATE,   -- NULL = contrato indefinido vigente
    salario_bruto   NUMERIC(10,2) NOT NULL CHECK (salario_bruto >= 0),
    activo          BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_contratos_fechas CHECK (fecha_fin IS NULL OR fecha_fin > fecha_inicio)
);

CREATE INDEX idx_contratos_empleado  ON hr.contratos (empleado_id);
CREATE INDEX idx_contratos_activo    ON hr.contratos (activo);
CREATE INDEX idx_contratos_fecha_fin ON hr.contratos (fecha_fin);

-- ------------------------------------------------------------
-- Nóminas
-- ------------------------------------------------------------
CREATE TABLE hr.nominas (
    id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    empleado_id    UUID          NOT NULL REFERENCES hr.empleados (id),
    periodo        VARCHAR(7)    NOT NULL,   -- Formato YYYY-MM
    salario_bruto  NUMERIC(10,2) NOT NULL CHECK (salario_bruto >= 0),
    deducciones    NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (deducciones >= 0),
    salario_neto   NUMERIC(10,2) NOT NULL
        GENERATED ALWAYS AS (salario_bruto - deducciones) STORED,
    fecha_pago     DATE,
    pagada         BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_nomina_empleado_periodo UNIQUE (empleado_id, periodo),
    CONSTRAINT chk_nomina_neto CHECK (salario_bruto >= deducciones)
);

CREATE INDEX idx_nominas_empleado ON hr.nominas (empleado_id);
CREATE INDEX idx_nominas_periodo  ON hr.nominas (periodo);
CREATE INDEX idx_nominas_pagada   ON hr.nominas (pagada);