import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PatientModule } from '../patient/patient.module';
import { CreatePatientAddressHandler } from './application/handlers/create-patient-address.handler';
import { DeletePatientAddressHandler } from './application/handlers/delete-patient-address.handler';
import { ListPatientAddressesHandler } from './application/handlers/list-patient-addresses.handler';
import { SetPrimaryPatientAddressHandler } from './application/handlers/set-primary-patient-address.handler';
import { UpdatePatientAddressHandler } from './application/handlers/update-patient-address.handler';
import { PatientAddressOrmEntity } from './infrastructure/persistence/patient-address.orm-entity';
import { TypeOrmPatientAddressRepository } from './infrastructure/persistence/typeorm-patient-address.repository';
import { PatientAddressController } from './presentation/patient-address.controller';
import { PATIENT_ADDRESS_REPOSITORY } from './patient-address.tokens';

const handlers = [
  CreatePatientAddressHandler,
  UpdatePatientAddressHandler,
  DeletePatientAddressHandler,
  SetPrimaryPatientAddressHandler,
  ListPatientAddressesHandler,
];

@Module({
  imports: [
    CqrsModule,
    PatientModule,
    TypeOrmModule.forFeature([PatientAddressOrmEntity]),
  ],
  controllers: [PatientAddressController],
  providers: [
    ...handlers,
    {
      provide: PATIENT_ADDRESS_REPOSITORY,
      useClass: TypeOrmPatientAddressRepository,
    },
  ],
  exports: [PATIENT_ADDRESS_REPOSITORY],
})
export class PatientAddressModule {}
