import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { setupServiceApp } from '@clinic/common';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors();

  setupServiceApp(app, {
    serviceName: 'doctor-service',
    title: 'Doctor Service API',
    description: 'Internal API for clinic doctor records',
    version: '1.0.0',
    swaggerPath: 'docs',
    globalPrefix: 'api',
  });

  const port = Number(process.env['PORT'] ?? 3003);
  await app.listen(port, '0.0.0.0');
  Logger.log(`Doctor Service running on http://localhost:${port}/api`);
  Logger.log(`Swagger docs running on http://localhost:${port}/docs`);
}

bootstrap();
