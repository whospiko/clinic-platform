import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorModule } from '../doctor/doctor.module';
import { DoctorCredentialService } from './application/doctor-credential.service';
import { DoctorCredentialRepository } from './application/ports/doctor-credential.repository';
import { DoctorCredentialOrmEntity } from './infrastructure/persistence/doctor-credential.orm-entity';
import { TypeOrmDoctorCredentialRepository } from './infrastructure/persistence/typeorm-doctor-credential.repository';
import { DoctorCredentialController } from './presentation/doctor-credential.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([DoctorCredentialOrmEntity]),
    DoctorModule,
  ],
  controllers: [DoctorCredentialController],
  providers: [
    DoctorCredentialService,
    {
      provide: DoctorCredentialRepository,
      useClass: TypeOrmDoctorCredentialRepository,
    },
  ],
})
export class DoctorCredentialModule {}
