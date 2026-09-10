import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorService } from './application/doctor.service';
import { DoctorRepository } from './application/ports/doctor.repository';
import { DoctorOrmEntity } from './infrastructure/persistence/doctor.orm-entity';
import { TypeOrmDoctorRepository } from './infrastructure/persistence/typeorm-doctor.repository';
import { DoctorController } from './presentation/doctor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorOrmEntity])],
  controllers: [DoctorController],
  providers: [
    DoctorService,
    { provide: DoctorRepository, useClass: TypeOrmDoctorRepository },
  ],
  exports: [DoctorService, DoctorRepository],
})
export class DoctorModule {}
