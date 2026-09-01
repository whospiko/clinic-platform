import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PatientClientModule } from './patient-client/patient-client.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { DatabaseModule } from './configs/db/database.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { ResourceModule } from './modules/resource/resource.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/booking-service/.env',
    }),
    PatientClientModule,
    AppointmentModule,
    ScheduleModule,
    AvailabilityModule,
    ResourceModule,
    DatabaseModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}