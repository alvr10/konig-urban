import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.setGlobalPrefix('api/v1/catalog', {
    exclude: ['health', 'metrics'],
  });


  const port = process.env.PORT || 3004;
  await app.listen(port);
  console.log(`[catalog-service] 🚀 Ready on port ${port}`);
}
bootstrap();
