/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { setupServiceApp } from '@clinic/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  setupServiceApp(app, {
    serviceName: 'booking-service',
    title: 'Booking Service API',
    description: 'Internal API for clinic appointment booking',
    version: '1.0.0',
    swaggerPath: 'docs',
    globalPrefix: 'api'
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`🚀 Booking Service is running on: http://localhost:${port}`);
  Logger.log(`Booking Swagger docs running on http://localhost:${port}/docs`);

}

bootstrap();
