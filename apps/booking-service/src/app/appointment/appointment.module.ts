import { Module } from '@nestjs/common';
import { PatientClientModule } from '../patient-client/patient-client.module';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';

@Module({
  imports: [PatientClientModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}