import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/booking-service/.env',
    }),
    AppointmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}