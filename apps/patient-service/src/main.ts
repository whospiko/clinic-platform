import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { setupServiceApp } from '@clinic/common';
import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN', '*'),
    credentials: true,
  });

  setupServiceApp(app, {
    serviceName: 'patient-service',
    title: 'Patient Service API',
    description: 'Internal API for clinic patient records',
    version: '1.0.0',
    swaggerPath: 'docs',
    globalPrefix: 'api',
  });

  const port = Number(config.get<string>('PORT') ?? 3002);
  await app.listen(port, '0.0.0.0');

  console.log(`Patient Service API running on http://localhost:${port}/api`);
  console.log(`Patient Swagger docs running on http://localhost:${port}/docs`);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
