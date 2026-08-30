import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PatientClientModule } from './patient-client/patient-client.module';
import { AppointmentModule } from './modules/appointment/appointment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/booking-service/.env',
    }),
    PatientClientModule,
    AppointmentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}