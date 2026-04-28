# Guía de Finalización — Práctica 2 (Odoo)

Esta guía resume los pasos exactos requeridos por el PDF de la **Práctica 2** para completar la digitalización de **König Urban**.

---

## 1. Configuración Inicial de la Empresa (PASO 5)
*   **Ruta**: Ajustes → Usuarios y Compañías → Compañías → (Mi Compañía)
*   **Tareas**:
    *   Cambiar nombre a `König Urban`.
    *   Subir el **Logo** oficial.
    *   Rellenar datos ficticios: Dirección (Granada), CIF/NIF (ej. B12345678), Email y Teléfono.

---

## 2. Instalación de Módulos (PASO 6)
Instalar los siguientes módulos desde el menú de **Aplicaciones**:
1.  **CRM**: Gestión de oportunidades.
2.  **Ventas**: Presupuestos y pedidos.
3.  **Compras**: Órdenes a proveedores.
4.  **Inventario**: Gestión de stock.
5.  **Facturación**: Contabilidad y finanzas.
6.  **Empleados**: (Opcional pero recomendado para sustituir tu `hr-service`).

---

## 3. Configuración Contable (PASO 7)
*   **Ruta**: Contabilidad → Configuración → Ajustes
*   **Configuración**:
    *   País: `España`.
    *   Plan Contable: `Plan General Contable Español (PGC)`.
    *   Impuesto por defecto: `21% IVA`.
    *   Moneda: `EUR`.
*   **Diarios**: Crear diario de Ventas (VEN2) y Compras (COMP2) según las especificaciones del PDF.

---

## 4. Datos Maestros (PASO 8 y 9)
*   **Contactos**: Crear **5 Clientes** y **5 Proveedores** (Contactos > Nuevo).
*   **Categorías**: Crear **5 Categorías** de productos (Inventario > Configuración > Categorías de productos).
*   **Productos**: Crear **20 Productos** (4 por categoría).
    *   Tipo: `Producto almacenable`.
    *   Configurar: Precio de venta, Coste, Referencia interna e IVA (21%).

---

## 5. Flujos Operativos (PASO 10 y 11)
Debes realizar y documentar con capturas:
*   **4 Flujos de Compra**:
    1.  Solicitud de presupuesto → Confirmar pedido.
    2.  Recepción de mercancía (Validar albarán).
    3.  Crear factura de proveedor.
    4.  Registrar pago.
*   **4 Flujos de Venta**:
    1.  Crear oportunidad en CRM → Nuevo presupuesto.
    2.  Confirmar venta → Validar entrega (Logística).
    3.  Crear factura → Registrar pago del cliente.

---

## 6. Automatización de Inventario (PASO 12) — ¡MUY IMPORTANTE!
Este es el punto con más peso en la nota.
*   **Objetivo**: Que Odoo genere una compra automática cuando el stock sea bajo.
*   **Configuración**:
    1.  En la ficha del producto (ej. un Teclado o Camiseta), ir a la pestaña **Compra** y asignar un **Proveedor**.
    2.  En la pestaña **Inventario**, marcar la ruta **Comprar**.
    3.  Ir a **Reglas de Reabastecimiento**:
        *   Cantidad Mínima: `5`.
        *   Cantidad Máxima: `25`.
*   **Prueba**: Realiza ventas hasta que el stock baje de 5 y verifica que en el módulo de **Compras** aparezca una nueva "Solicitud de Presupuesto" automática.

---

## 7. Informes y Backup (PASO 13 y 14)
*   **Informes**: Obtener gráficos de Ventas y Compras (Ventas > Informes).
*   **Backup**:
    1.  Ir a `http://localhost:8069/web/database/manager`.
    2.  Hacer clic en **Backup**.
    3.  Master Password: `8ivt-kenf-xhzn`.
    4.  Formato: `ZIP (includes filestore)`.
    5.  **IMPORTANTE**: Este archivo `.zip` es un entregable obligatorio.

---

## Entregables Finales
1.  `docker-compose.yml` (Ya lo tienes listo).
2.  `tubasededatos_backup.zip` (El archivo generado en el paso anterior).
3.  **Memoria Técnica**: Un documento con capturas de pantalla de cada paso anterior.
