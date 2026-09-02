import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { DatabaseModule } from './configs/db/database.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { ResourceModule } from './modules/resource/resource.module';
import { HoldModule } from './modules/hold/hold.module';
import { WaitlistModule } from './modules/waitlist/waitlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/booking-service/.env',
    }),
    AppointmentModule,
    ScheduleModule,
    AvailabilityModule,
    ResourceModule,
    HoldModule,
    WaitlistModule,
    DatabaseModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}