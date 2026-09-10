import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PatientController } from './presentation/patient.controller';
import { PatientOrmEntity } from './infrastructure/persistence/patient.orm-entity';
import { TypeOrmPatientRepository } from './infrastructure/persistence/typeorm-patient.repository';
import { PATIENT_READER, PATIENT_REPOSITORY } from './patient.tokens';
import { ChangePatientStatusHandler } from './application/handlers/change-patient-status.handler';
import { CreatePatientHandler } from './application/handlers/create-patient.handler';
import { GetPatientHandler } from './application/handlers/get-patient.handler';
import { ListPatientsHandler } from './application/handlers/list-patients.handler';
import { UpdatePatientHandler } from './application/handlers/update-patient.handler';

const commandHandlers = [
  CreatePatientHandler,
  UpdatePatientHandler,
  ChangePatientStatusHandler,
];
const queryHandlers = [GetPatientHandler, ListPatientsHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([PatientOrmEntity])],
  controllers: [PatientController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    { provide: PATIENT_REPOSITORY, useClass: TypeOrmPatientRepository },
    { provide: PATIENT_READER, useExisting: PATIENT_REPOSITORY },
  ],
  exports: [PATIENT_READER, PATIENT_REPOSITORY],
})
export class PatientModule {}
