import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/patient-service/.env',
    }),
    PatientModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
