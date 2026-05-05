import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'warn', 'error'] });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.setGlobalPrefix('api/v1/customers', {
    exclude: ['health', 'metrics'],
  });

  app.enableCors();

  const port = process.env.PORT ?? 3004;
  await app.listen(port);
  console.log(`[customers-service] 🚀  Ready on http://localhost:${port}`);
}
bootstrap();
