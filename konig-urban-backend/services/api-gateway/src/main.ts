import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join, resolve } from 'path';
import { AppModule } from './app.module';
import { PinoLoggerService, HttpLoggerMiddleware } from '@konig/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'warn', 'error'] });
  app.enableCors();

  // Access the underlying Express instance to register middleware
  const expressInstance = app.getHttpAdapter().getInstance();

  // Attach the Pino Logger to intercept all incoming requests
  const pinoLogger = app.get(PinoLoggerService);
  const loggerMiddleware = new HttpLoggerMiddleware(pinoLogger);
  expressInstance.use((req: any, res: any, next: any) => loggerMiddleware.use(req, res, next));

  // Serve microservices OpenAPI YAML files
  const services = [
    'catalog-service',
    'customers-service',
    'orders-service',
    'production-service',
    'hr-service',
    'marketing-service',
    'finance-service'
  ];

  services.forEach(service => {
    const yamlPath = resolve(__dirname, '..', '..', service, 'openapi.yaml');
    expressInstance.get(`/docs/yaml/${service}`, (req: any, res: any) => {
      res.sendFile(yamlPath);
    });
  });

  // Centralized Swagger UI Configuration
  SwaggerModule.setup('api/docs', app, null, {
    swaggerOptions: {
      urls: services.map(service => ({
        url: `/docs/yaml/${service}`,
        name: service.replace('-service', '').toUpperCase()
      })),
    },
  });

  const port = process.env.GATEWAY_PORT || 3000;
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
