import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorModule } from '../doctor/doctor.module';
import { DoctorClinicAssignmentService } from './application/doctor-clinic-assignment.service';
import { DoctorClinicAssignmentRepository } from './application/ports/doctor-clinic-assignment.repository';
import { DoctorClinicAssignmentOrmEntity } from './infrastructure/persistence/doctor-clinic-assignment.orm-entity';
import { TypeOrmDoctorClinicAssignmentRepository } from './infrastructure/persistence/typeorm-doctor-clinic-assignment.repository';
import { DoctorClinicAssignmentController } from './presentation/doctor-clinic-assignment.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([DoctorClinicAssignmentOrmEntity]),
    DoctorModule,
  ],
  controllers: [DoctorClinicAssignmentController],
  providers: [
    DoctorClinicAssignmentService,
    {
      provide: DoctorClinicAssignmentRepository,
      useClass: TypeOrmDoctorClinicAssignmentRepository,
    },
  ],
  exports: [DoctorClinicAssignmentRepository],
})
export class DoctorClinicAssignmentModule {}
