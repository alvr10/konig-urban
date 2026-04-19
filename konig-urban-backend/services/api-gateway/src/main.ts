import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import * as swaggerUi from 'swagger-ui-express';
import { resolve } from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AppModule } from './app.module';
import { PinoLoggerService, HttpLoggerMiddleware, ConsulService } from '@konig/shared';
import { jwtAuthMiddleware } from './middleware/jwt-auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'warn', 'error'] });
  app.enableCors();

  const expressInstance = app.getHttpAdapter().getInstance();

  // Attach the Pino Logger to intercept all incoming requests
  const pinoLogger = app.get(PinoLoggerService);
  const loggerMiddleware = new HttpLoggerMiddleware(pinoLogger);
  expressInstance.use((req: any, res: any, next: any) => loggerMiddleware.use(req, res, next));

  // Attach JWT Auth Middleware
  expressInstance.use(jwtAuthMiddleware);

  const services = [
    'catalog-service',
    'customers-service',
    'orders-service',
    'production-service',
    'hr-service',
    'marketing-service',
    'finance-service',
  ];

  // Serve each service's OpenAPI YAML as a static file
  services.forEach((service) => {
    const yamlPath = resolve(__dirname, '..', '..', service, 'openapi.yaml');
    expressInstance.get(`/docs/yaml/${service}`, (_req: any, res: any) => {
      res.sendFile(yamlPath);
    });
  });

  // Mount Swagger UI with explicit multi-spec urls array
  // SwaggerModule.setup does not support null documents — use swagger-ui-express directly
  const swaggerOptions: swaggerUi.SwaggerUiOptions = {
    swaggerOptions: {
      urls: services.map((service) => ({
        url: `/docs/yaml/${service}`,
        name: service.replace('-service', '').toUpperCase(),
      })),
      urls_primary_name: 'CATALOG',
    },
    explorer: true,
  };

  expressInstance.use('/api/docs', swaggerUi.serve);
  expressInstance.get('/api/docs', swaggerUi.setup(undefined, swaggerOptions));

  // Handle proxying to microservices
  const consulService = app.get(ConsulService);
  const serviceIndices: Map<string, number> = new Map();
  const ROUTE_TO_SERVICE: Record<string, string> = {
    '/api/v1/catalog': 'catalog-service',
    '/api/v1/customers': 'customers-service',
    '/api/v1/finance': 'finance-service',
    '/api/v1/hr': 'hr-service',
    '/api/v1/marketing': 'marketing-service',
    '/api/v1/orders': 'orders-service',
    '/api/v1/production': 'production-service',
  };

  expressInstance.use(async (req: any, res: any, next: any) => {
    const url = req.url;
    if (!url.startsWith('/api/v1/')) return next();

    const entry = Object.entries(ROUTE_TO_SERVICE).find(([prefix]) => url.startsWith(prefix));
    if (!entry) return next();

    const [_, serviceName] = entry;
    const instances = await consulService.resolve(serviceName);
    
    if (!instances || instances.length === 0) {
      return res.status(503).json({ error: `${serviceName} unavailable` });
    }

    const idx = serviceIndices.get(serviceName) || 0;
    serviceIndices.set(serviceName, (idx + 1) % instances.length);
    const instance = instances[idx % instances.length];
    const target = `http://${instance.host}:${instance.port}`;

    console.log(`[Proxy] Forwarding ${url} -> ${target}`);

    createProxyMiddleware({
      target,
      changeOrigin: true,
      on: {
        error: (err, _req, res: any) => {
          console.error(`[Proxy] Error: ${err.message}`);
          res.status(502).json({ error: 'Service unavailable' });
        }
      }
    })(req, res, next);
  });

  const port = process.env.GATEWAY_PORT ?? 3000;
  await app.listen(port);

  console.log(`
      ██ ▄█▀ ▄████▄ ███  ██ ██  ▄████    
      ████   ██  ██ ██ ▀▄██ ██ ██  ▄▄▄   
      ██ ▀█▄ ▀████▀ ██   ██ ██  ▀███▀    
  `);
  console.log(`[api-gateway] 🚀  Listening on http://localhost:${port}`);
  console.log(`[api-gateway] 📄  Swagger UI: http://localhost:${port}/api/docs`);
}
bootstrap();
