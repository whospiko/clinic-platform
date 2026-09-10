import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PatientModule } from '../patient/patient.module';
import { CreatePatientContactHandler } from './application/handlers/create-patient-contact.handler';
import { DeletePatientContactHandler } from './application/handlers/delete-patient-contact.handler';
import { ListPatientContactsHandler } from './application/handlers/list-patient-contacts.handler';
import { SetPrimaryPatientContactHandler } from './application/handlers/set-primary-patient-contact.handler';
import { UpdatePatientContactHandler } from './application/handlers/update-patient-contact.handler';
import { PatientContactOrmEntity } from './infrastructure/persistence/patient-contact.orm-entity';
import { TypeOrmPatientContactRepository } from './infrastructure/persistence/typeorm-patient-contact.repository';
import { PatientContactController } from './presentation/patient-contact.controller';
import { PATIENT_CONTACT_REPOSITORY } from './patient-contact.tokens';

const handlers = [
  CreatePatientContactHandler,
  UpdatePatientContactHandler,
  DeletePatientContactHandler,
  SetPrimaryPatientContactHandler,
  ListPatientContactsHandler,
];

@Module({
  imports: [
    CqrsModule,
    PatientModule,
    TypeOrmModule.forFeature([PatientContactOrmEntity]),
  ],
  controllers: [PatientContactController],
  providers: [
    ...handlers,
    {
      provide: PATIENT_CONTACT_REPOSITORY,
      useClass: TypeOrmPatientContactRepository,
    },
  ],
  exports: [PATIENT_CONTACT_REPOSITORY],
})
export class PatientContactModule {}
