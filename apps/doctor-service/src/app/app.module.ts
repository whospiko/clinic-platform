import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseConfig } from './configs/db/database.config';
import { DoctorModule } from './modules/doctor/doctor.module';
import { SpecialtyModule } from './modules/specialty/specialty.module';
import { DoctorSpecialtyModule } from './modules/doctor-specialty/doctor-specialty.module';
import { DoctorClinicAssignmentModule } from './modules/doctor-clinic-assignment/doctor-clinic-assignment.module';
import { DoctorCredentialModule } from './modules/doctor-credential/doctor-credential.module';
import { IntegrationsModule } from './integrations/integrations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig()),
    DoctorModule,
    SpecialtyModule,
    DoctorSpecialtyModule,
    DoctorClinicAssignmentModule,
    DoctorCredentialModule,
    IntegrationsModule,
  ],
})
export class AppModule {}
