-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "catalog";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "customers";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "finance";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "hr";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "marketing";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "orders";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "production";

-- CreateTable
CREATE TABLE "catalog"."categorias" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."colecciones" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(150) NOT NULL,
    "temporada" VARCHAR(50),
    "descripcion" TEXT,
    "fecha_lanzamiento" DATE,
    "estado" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "colecciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."prendas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "coleccion_id" UUID NOT NULL,
    "categoria_id" UUID NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "gramaje_algodon" INTEGER,
    "material" VARCHAR(200),
    "imagen_url" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."drops" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "coleccion_id" UUID NOT NULL,
    "fecha_inicio" TIMESTAMPTZ NOT NULL,
    "fecha_fin" TIMESTAMPTZ NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "descripcion" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."identificadores_unicos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prenda_id" UUID NOT NULL,
    "uid_codigo" VARCHAR(64) NOT NULL,
    "numero_serie" INTEGER NOT NULL,
    "total_serie" INTEGER NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'disponible',
    "fecha_generacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identificadores_unicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production"."proveedores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(200) NOT NULL,
    "tipo" VARCHAR(30) NOT NULL,
    "contacto" VARCHAR(150),
    "email" VARCHAR(255),
    "pais" VARCHAR(100),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production"."ordenes_compra" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "proveedor_id" UUID NOT NULL,
    "fecha" DATE NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'borrador',
    "total" DECIMAL(12,2),
    "notas" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ordenes_compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production"."lineas_orden_compra" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orden_id" UUID NOT NULL,
    "descripcion_material" VARCHAR(300) NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "lineas_orden_compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production"."control_calidad" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prenda_id" UUID NOT NULL,
    "inspector" VARCHAR(150) NOT NULL,
    "fecha_revision" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resultado" VARCHAR(20) NOT NULL,
    "notas" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "control_calidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr"."departamentos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "departamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr"."empleados" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "departamento_id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "cargo" VARCHAR(100),
    "fecha_contratacion" DATE NOT NULL,
    "salario" DECIMAL(10,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empleados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr"."contratos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "empleado_id" UUID NOT NULL,
    "tipo_contrato" VARCHAR(50) NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE,
    "salario_bruto" DECIMAL(10,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr"."nominas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "empleado_id" UUID NOT NULL,
    "periodo" VARCHAR(7) NOT NULL,
    "salario_bruto" DECIMAL(10,2) NOT NULL,
    "deducciones" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "salario_neto" DECIMAL(10,2) NOT NULL,
    "fecha_pago" DATE,
    "pagada" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nominas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing"."campanas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(200) NOT NULL,
    "tipo" VARCHAR(30) NOT NULL,
    "coleccion_id" UUID,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'planificada',
    "descripcion" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campanas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing"."clientes_campana" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campana_id" UUID NOT NULL,
    "cliente_id" UUID NOT NULL,
    "enviado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_envio" TIMESTAMPTZ,

    CONSTRAINT "clientes_campana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance"."facturas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pedido_id" UUID NOT NULL,
    "cliente_id" UUID NOT NULL,
    "numero_factura" VARCHAR(50) NOT NULL,
    "fecha_emision" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'emitida',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance"."margenes_producto" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prenda_id" UUID NOT NULL,
    "coste_produccion" DECIMAL(10,2) NOT NULL,
    "precio_venta" DECIMAL(10,2) NOT NULL,
    "margen_porcentaje" DECIMAL(5,2) NOT NULL,
    "fecha_calculo" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "margenes_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers"."clientes" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(20),
    "direccion" TEXT,
    "tipo_cliente" VARCHAR(20) NOT NULL DEFAULT 'estandar',
    "fecha_registro" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers"."membresias" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cliente_id" UUID NOT NULL,
    "nivel" VARCHAR(20) NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "acceso_anticipado" BOOLEAN NOT NULL DEFAULT false,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "membresias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders"."pedidos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cliente_id" UUID NOT NULL,
    "fecha" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    "total" DECIMAL(10,2) NOT NULL,
    "metodo_pago" VARCHAR(50),
    "stripe_session_id" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders"."lineas_pedido" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pedido_id" UUID NOT NULL,
    "prenda_id" UUID NOT NULL,
    "uid_prenda_id" UUID,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precio_unitario" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "lineas_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders"."envios" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pedido_id" UUID NOT NULL,
    "operador_logistico" VARCHAR(100),
    "tracking_url" TEXT,
    "estado_envio" VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    "fecha_envio" TIMESTAMPTZ,
    "fecha_entrega_estimada" DATE,
    "packaging_premium" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "envios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "catalog"."categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "drops_coleccion_id_key" ON "catalog"."drops"("coleccion_id");

-- CreateIndex
CREATE UNIQUE INDEX "identificadores_unicos_uid_codigo_key" ON "catalog"."identificadores_unicos"("uid_codigo");

-- CreateIndex
CREATE UNIQUE INDEX "departamentos_nombre_key" ON "hr"."departamentos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "empleados_email_key" ON "hr"."empleados"("email");

-- CreateIndex
CREATE UNIQUE INDEX "nominas_empleado_id_periodo_key" ON "hr"."nominas"("empleado_id", "periodo");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_campana_campana_id_cliente_id_key" ON "marketing"."clientes_campana"("campana_id", "cliente_id");

-- CreateIndex
CREATE UNIQUE INDEX "facturas_pedido_id_key" ON "finance"."facturas"("pedido_id");

-- CreateIndex
CREATE UNIQUE INDEX "facturas_numero_factura_key" ON "finance"."facturas"("numero_factura");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "customers"."clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "membresias_cliente_id_key" ON "customers"."membresias"("cliente_id");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_stripe_session_id_key" ON "orders"."pedidos"("stripe_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "envios_pedido_id_key" ON "orders"."envios"("pedido_id");

-- AddForeignKey
ALTER TABLE "catalog"."prendas" ADD CONSTRAINT "prendas_coleccion_id_fkey" FOREIGN KEY ("coleccion_id") REFERENCES "catalog"."colecciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog"."prendas" ADD CONSTRAINT "prendas_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "catalog"."categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog"."drops" ADD CONSTRAINT "drops_coleccion_id_fkey" FOREIGN KEY ("coleccion_id") REFERENCES "catalog"."colecciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog"."identificadores_unicos" ADD CONSTRAINT "identificadores_unicos_prenda_id_fkey" FOREIGN KEY ("prenda_id") REFERENCES "catalog"."prendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production"."ordenes_compra" ADD CONSTRAINT "ordenes_compra_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "production"."proveedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production"."lineas_orden_compra" ADD CONSTRAINT "lineas_orden_compra_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "production"."ordenes_compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr"."empleados" ADD CONSTRAINT "empleados_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "hr"."departamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr"."contratos" ADD CONSTRAINT "contratos_empleado_id_fkey" FOREIGN KEY ("empleado_id") REFERENCES "hr"."empleados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr"."nominas" ADD CONSTRAINT "nominas_empleado_id_fkey" FOREIGN KEY ("empleado_id") REFERENCES "hr"."empleados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing"."clientes_campana" ADD CONSTRAINT "clientes_campana_campana_id_fkey" FOREIGN KEY ("campana_id") REFERENCES "marketing"."campanas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers"."membresias" ADD CONSTRAINT "membresias_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "customers"."clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders"."lineas_pedido" ADD CONSTRAINT "lineas_pedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "orders"."pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders"."envios" ADD CONSTRAINT "envios_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "orders"."pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
