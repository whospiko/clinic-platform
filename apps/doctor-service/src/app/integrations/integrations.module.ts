import { Module } from '@nestjs/common';
import { DoctorModule } from '../modules/doctor/doctor.module';
import { DoctorSpecialtyModule } from '../modules/doctor-specialty/doctor-specialty.module';
import { DoctorClinicAssignmentModule } from '../modules/doctor-clinic-assignment/doctor-clinic-assignment.module';
import { DoctorIntegrationService } from './doctor-integration.service';
import { InternalDoctorController } from './internal-doctor.controller';
@Module({
  imports: [DoctorModule, DoctorSpecialtyModule, DoctorClinicAssignmentModule],
  controllers: [InternalDoctorController],
  providers: [DoctorIntegrationService],
  exports: [DoctorIntegrationService],
})
export class IntegrationsModule {}
