import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PatientModule } from '../patient/patient.module';
import { CreatePatientEmergencyContactHandler } from './application/handlers/create-patient-emergency-contact.handler';
import { DeletePatientEmergencyContactHandler } from './application/handlers/delete-patient-emergency-contact.handler';
import { ListPatientEmergencyContactsHandler } from './application/handlers/list-patient-emergency-contacts.handler';
import { SetPrimaryPatientEmergencyContactHandler } from './application/handlers/set-primary-patient-emergency-contact.handler';
import { UpdatePatientEmergencyContactHandler } from './application/handlers/update-patient-emergency-contact.handler';
import { PatientEmergencyContactOrmEntity } from './infrastructure/persistence/patient-emergency-contact.orm-entity';
import { TypeOrmPatientEmergencyContactRepository } from './infrastructure/persistence/typeorm-patient-emergency-contact.repository';
import { PatientEmergencyContactController } from './presentation/patient-emergency-contact.controller';
import { PATIENT_EMERGENCY_CONTACT_REPOSITORY } from './patient-emergency-contact.tokens';

const handlers = [
  CreatePatientEmergencyContactHandler,
  UpdatePatientEmergencyContactHandler,
  DeletePatientEmergencyContactHandler,
  SetPrimaryPatientEmergencyContactHandler,
  ListPatientEmergencyContactsHandler,
];

@Module({
  imports: [
    CqrsModule,
    PatientModule,
    TypeOrmModule.forFeature([PatientEmergencyContactOrmEntity]),
  ],
  controllers: [PatientEmergencyContactController],
  providers: [
    ...handlers,
    {
      provide: PATIENT_EMERGENCY_CONTACT_REPOSITORY,
      useClass: TypeOrmPatientEmergencyContactRepository,
    },
  ],
  exports: [PATIENT_EMERGENCY_CONTACT_REPOSITORY],
})
export class PatientEmergencyContactModule {}
