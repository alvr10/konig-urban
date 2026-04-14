import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import * as swaggerUi from 'swagger-ui-express';
import { resolve } from 'path';
import { AppModule } from './app.module';
import { PinoLoggerService, HttpLoggerMiddleware } from '@konig/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'warn', 'error'] });
  app.enableCors();

  const expressInstance = app.getHttpAdapter().getInstance();

  // Attach the Pino Logger to intercept all incoming requests
  const pinoLogger = app.get(PinoLoggerService);
  const loggerMiddleware = new HttpLoggerMiddleware(pinoLogger);
  expressInstance.use((req: any, res: any, next: any) => loggerMiddleware.use(req, res, next));

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
