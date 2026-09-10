import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorModule } from '../doctor/doctor.module';
import { SpecialtyModule } from '../specialty/specialty.module';
import { DoctorSpecialtyService } from './application/doctor-specialty.service';
import { DoctorSpecialtyRepository } from './application/ports/doctor-specialty.repository';
import { DoctorSpecialtyOrmEntity } from './infrastructure/persistence/doctor-specialty.orm-entity';
import { TypeOrmDoctorSpecialtyRepository } from './infrastructure/persistence/typeorm-doctor-specialty.repository';
import { DoctorSpecialtyController } from './presentation/doctor-specialty.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([DoctorSpecialtyOrmEntity]),
    DoctorModule,
    SpecialtyModule,
  ],
  controllers: [DoctorSpecialtyController],
  providers: [
    DoctorSpecialtyService,
    {
      provide: DoctorSpecialtyRepository,
      useClass: TypeOrmDoctorSpecialtyRepository,
    },
  ],
  exports: [DoctorSpecialtyRepository],
})
export class DoctorSpecialtyModule {}
