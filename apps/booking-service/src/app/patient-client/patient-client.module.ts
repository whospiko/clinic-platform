import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { PatientClientService } from './patient-client.service';

@Module({
  providers: [
    {
      provide: 'PATIENT_SERVICE_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>(
          'PATIENT_SERVICE_TCP_HOST',
          '127.0.0.1',
        );

        const port = Number(
          configService.get<string>('PATIENT_SERVICE_TCP_PORT', '4002'),
        );

        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host,
            port,
          },
        });
      },
    },
    PatientClientService,
  ],
  exports: [PatientClientService],
})
export class PatientClientModule { }