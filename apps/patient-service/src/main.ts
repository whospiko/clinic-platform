import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { setupServiceApp } from '@clinic/common'
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  setupServiceApp(app, {
    serviceName: 'patient-service',
    title: 'Patient Service API',
    description: 'Internal API for managing clinic patient data',
    version: '1.0.0',
    swaggerPath: 'docs',
    globalPrefix: 'api'
  });

  const httpPort = Number(process.env.PORT || 3002);
  const tcpHost = process.env.TCP_HOST || '127.0.0.1';
  const tcpPort = Number(process.env.TCP_PORT || 4002);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: tcpHost,
      port: tcpPort,
    },
  });

  await app.startAllMicroservices();
  await app.listen(httpPort);

  Logger.log(`Patient HTTP running on http://localhost:${httpPort}`);
  Logger.log(`Patient Swagger running on http://localhost:${httpPort}/docs`);
  Logger.log(`Patient TCP microservice running on ${tcpHost}:${tcpPort}`);

}

bootstrap();
