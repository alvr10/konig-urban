# ADR 001: Arquitectura Base del Ecosistema de Microservicios König Urban

**Fecha:** Abril 2026  
**Estado:** Aceptado  
**Autores:** Equipo de Arquitectura König

## Contexto
König Urban es una tienda online de ropa urbana (puffer jackets) que funciona mediante drops exclusivos y limitados (unidades de catálogo escaneables y únicas). Adicionalmente, el sistema da soporte a diversas áreas del negocio tipo ERP (Finanzas, Recursos Humanos, Marketing, Producción) para tareas administrativas y de análisis. 

Para soportar la alta demanda durante los *drops* y separar las áreas de dominio de la empresa de manera efectiva, se ha optado por implementar un sistema distribuido escalable que promueva el bajo acoplamiento y evite la deuda técnica.

## Decisión Técnica

Se ha diseñado e implementado una arquitectura orientada a microservicios con las siguientes características técnicas clave:

### 1. Framework y Lenguaje
- **Stack:** Node.js con TypeScript (Modo Estricto).
- **Framework Principal:** **NestJS**. Proporciona una base sólida con inyección de dependencias modular que se adapta orgánicamente a la Arquitectura Hexagonal.

### 2. Estilo Arquitectónico (DDD y CQRS Simplificado)
- **Arquitectura Hexagonal Pragmática:** Cada microservicio sigue una estructura de capas (`application/`, `infrastructure/`, `presentation/`). Se ha omitido deliberadamente la capa `domain/` como directorio separado para servicios relacionales.
- **CQRS (Command Query Responsibility Segregation):** Se usa la librería `@nestjs/cqrs` para separar estrictamente las operaciones de modificación de estado (Commands) de las de lectura (Queries).
- **Simplificación del Dominio (Vertical Slicing):** En lugar de abstraer las entidades de dominio totalmente y crear pesados Mappers, se ha decidido que **Prisma** provea los tipos y entidades base autogenerados. Esto reduce masivamente el código "boilerplate" (rutinario) y acelera la entrega manteniendo solidez.

### 3. Base de Datos y Persistencia
- **Tecnología:** PostgreSQL gestionado a través de **Supabase**.
- **Acceso a Datos:** **Prisma ORM** (versión 7.x). 
- **Esquema:** Existe un único repositorio o archivo `schema.prisma` que divide de forma lógica el negocio en esquemas de PostgreSQL (`catalog`, `customers`, `finance`, `hr`, `marketing`, `orders`, `production`).

### 4. Comunicación entre Servicios y Gateway
- **Síncrona:** API REST y un **API Gateway** centralizado que agrega las rutas e integra la especificación OpenAPI 3.0 para documentar la entrada a todas las redes de endpoints.
- **Asíncrona (Eventos):** Integración con brókers de mensajería (librerías `amqplib` instaladas) para lanzar y consumir Domain Events entre servicios.

### 5. Observabilidad Integral
Gestión operativa apoyada en el paquete interno compartido `@konig/shared` que conecta con el stack de telemetría:
- Trazas centralizadas (OpenTelemetry / Tempo).
- Logs estruturados y métricas (Grafana Mimir & Loki).
- Health checks obligatorios con la ruta `/health` en todos los contenedores.

## Consecuencias

### Positivas
- **Alta mantenibilidad:** El aislamiento por microservicios elimina el riesgo de un despliegue masivo (monolítico) fallido en momentos críticos como un *drop*.
- **Desarrollo Ágil y Limpio:** La fusión de Tipos de Prisma con CQRS elimina gran parte de la sobrecarga académica de DDD tradicional sin comprometer la seguridad e inmutabilidad del dominio.
- **Trazabilidad Absoluta:** Con el stack de observabilidad, seguir un error desde la API Gateway hasta una sentencia SQL de Prisma tarda segundos.

### Negativas / Riesgos Asumidos
- **Acoplamiento Menor con Prisma:** La capa de aplicación asume la existencia de los tipos Prisma. Si se cambia de ORM en el futuro drásticamente, habría que refactorizar los *Handlers* de CQRS. Dado el ecosistema moderno y fuerte, esto se considera un riesgo aceptable frente al beneficio de velocidad.
- **Complejidad Distribuida:** Administrar muchos repositorios/servicios requiere automatización robusta en Docker y CI/CD para que el equipo no caiga en el tedio operativo.
